import {Component, ElementRef, forwardRef, NgZone, Renderer2, ViewChild} from '@angular/core';
import {
  AlertController,
  Events,
  IonicPage,
  ItemSliding,
  Navbar,
  NavController,
  NavParams,
  Refresher,
  Slides
} from 'ionic-angular';
import {Meeting} from "../../../models/meeting";
import {TeaCoApiProvider} from "../../../providers/teaco-api/teaco-api-provider";
import {UserSessionProvider} from "../../../providers/user-session/user-session";
import {Suggestion} from "../../../models/suggestion";
import {Observable} from "rxjs";
import {CreateSuggestionEventDelegate} from "../../suggestions/create-new-suggestion/create-suggestion-event-delegate";
import {EditMeetingEventDelegate} from "../meetings-overview/open-meetings-overview/edit-meeting-event-delegate";
import {MeetingUtils, SortOrder} from "../../../utils/meeting-utils";
import {LoadingIndicatorComponent} from "../../../components/general/loading-indicator/loading-indicator";
import {FeedbackAlertComponent} from "../../../components/general/feedback-alert/feedback-alert";
import {InputCardComponent} from "../../../components/general/input-card/input-card";
import {VoteDecision} from "../../../models/vote-decision";
import {DateTimeHelper} from "../../../utils/date-time-helper";
import {ParticipantsManagerDelegate} from "../../../components/participants/participants-manager/participants-manager-delegate";
import {User} from "../../../models/user";

/**
 * Page Controller for meeting details.
 */
@IonicPage({
  segment: 'open-meetings/:meetingId',
  defaultHistory: ['MeetingsOverviewPage']
})
@Component({
  selector: 'page-meeting-detail',
  templateUrl: 'meeting-detail.html',
})
export class MeetingDetailPage implements CreateSuggestionEventDelegate, ParticipantsManagerDelegate {

  /**
   * loading indicator UI component
   */
  @ViewChild(forwardRef(() => LoadingIndicatorComponent)) loadingIndicator: LoadingIndicatorComponent;

  /**
   * feedback alert UI component for displaying succeeded or failed REST api calls
   */
  @ViewChild(forwardRef(() => FeedbackAlertComponent)) feedbackAlert: FeedbackAlertComponent;
  /**
   * The page's navigation bar UI element
   */
  @ViewChild(Navbar) navBar: Navbar;

  @ViewChild('meetingDetailsSlider') meetingDetailsSlider: Slides;
  /**
   * The pages 'finish the meeting planning' action sheet UI element
   */
  @ViewChild('finishPlanningActionSheet') finishActionSheet: Slides;
  /**
   * The pages 'finish the meeting planning' action sheet UI element
   */
  @ViewChild('locationInput') locationInput: InputCardComponent;
  /**
   * The pages overlay UI element for i.e. indicating stuff in progress
   */
  @ViewChild('actionOverlay') actionOverlay: ElementRef;
  /**
   * The pages overlay UI element for i.e. indicating stuff in progress
   */
  @ViewChild('tabSlider') tabSlider: ElementRef;

  /**
   * Currently active refresher UI component
   */
  protected listRefresher: Refresher;

  private activeUserId: number;

  private voteDecisions: Map<number, Object>;

  /**
   * The selected meeting's unique TeaCo id
   */
  protected meetingId: number;

  /**
   * The meeting to display all detailed information and suggestions for
   */
  protected meeting: Observable<Meeting>;

  /**
   * List of picked suggestion which will be offered
   * when entering the finish process
   */
  private pickedSuggestions: Suggestion[];

  /**
   * The entered comment from the finish planning process
   */
  private comment: string;

  /**
   * The entered comment from the finish planning process
   */
  private location: string;

  /**
   * The count of currently picked suggestions
   */
  private pickedSuggestionsCount = 0;

  /**
   * The associated edit meeting delegate which will be called
   * on certain meeting edits
   */
  private delegate: EditMeetingEventDelegate;

  /**
   * Constructor
   * @param navCtrl The app's navigation controller
   * @param navParams The handed navigation params
   * @param apiService The TeaCo API Service to communicate with the TeaCo server
   * @param userSession The app's user session service
   * @param renderer The Angular UI renderer for changing HTML elements
   * @param alertCtrl The page's alert controller to create alert and confirmation dialogs
   * @param zone The current template zone this controller refers to
   * @param events The app's global events system
   */
  constructor(
      private navCtrl: NavController,
      private navParams: NavParams,
      private apiService: TeaCoApiProvider,
      private userSession: UserSessionProvider,
      private renderer: Renderer2,
      private alertCtrl: AlertController,
      private zone: NgZone,
      private events: Events) {
    this.userSession.getActiveUser().then(activeUser => {
      this.activeUserId = activeUser.id;
    });
    this.voteDecisions = new Map<number, Object>();
    this.pickedSuggestions = [];
    this.comment = "";
    this.location = "";
    this.meetingId = Number(this.navParams.get('meetingId'));
    let meeting:Meeting = this.navParams.get('meeting');
    this.delegate = this.navParams.get('delegate');
    if(meeting !== undefined) {
      this.meeting = Observable.of(meeting)
    }

    this.events.subscribe('voted', () => {
      this.determineVoteDecisions();
    });
  }

  private determineVoteDecisions() {
    this.meeting.subscribe(meeting => {
      meeting.participants.forEach(participant => {
        let suggestionVote = {};
        meeting.suggestions.forEach(suggestion => {
          suggestion.votes.forEach(vote => {
            if (vote.voterId == participant.id) {
              switch(vote.decision) {
                case VoteDecision.yes:
                  suggestionVote[suggestion.id] = 'teaco-voted-yes';
                  break;
                case VoteDecision.no:
                  suggestionVote[suggestion.id] =  'teaco-voted-no';
                  break;
                case VoteDecision.maybe:
                  suggestionVote[suggestion.id] = 'teaco-voted-maybe';
                  break;
                default:
                  suggestionVote[suggestion.id] =  'teaco-voted-dont-know';
                  break;
              }
              return;
            }
          });
        });
        this.voteDecisions[participant.id] = suggestionVote;
      });
    });
  }

  ngOnInit() {
    this.loadMeetingDetails();
  }

  ionViewDidLoad() {
    let headerElement: HTMLElement = document.querySelector('#meeting-details-page-header');

    if(!this.navCtrl.canGoBack()){
      this.navCtrl.insert(0, 'MeetingsOverviewPage').then( () => {
        this.navBar._elementRef.nativeElement.children[1].classList.add('show-back-button');
      });
    }

    headerElement.classList.add('no-bg-image');
    this.navBar.backButtonClick = (e:UIEvent)=>{
      // todo something
      this.goBack();
    };
  }

  ionViewWillEnter() {
    this.showMeetingDetailsSlide(0);
  }

  private showMeetingDetailsSlide(index: number) {
    this.meetingDetailsSlider.lockSwipes(false);
    this.meetingDetailsSlider.slideTo(index);
    this.meetingDetailsSlider.lockSwipes(true);

    switch(index) {
      case 0:
        this.renderer.removeClass(this.tabSlider.nativeElement, 'right');
        this.renderer.removeClass(this.tabSlider.nativeElement, 'middle');
        break;
      case 1:
        this.renderer.removeClass(this.tabSlider.nativeElement, 'right');
        this.renderer.addClass(this.tabSlider.nativeElement, 'middle');
        break;
      case 2:
        this.renderer.removeClass(this.tabSlider.nativeElement, 'middle');
        this.renderer.addClass(this.tabSlider.nativeElement, 'right');
        break;
    }
  }

  /**
   * Load meeting details.
   */
  private loadMeetingDetails(): Promise<void> {
    return new Promise((onFinished) => {
      if(!this.listRefresher) {
        this.loadingIndicator.show();
      }
      this.userSession.getActiveUser().then(activeUser => {
        this.apiService.getMeeting(activeUser.key, this.meetingId).subscribe(meeting => {
          this.zone.run(() => {
            meeting.numberOfParticipants = meeting.participants.length;
            meeting.numberOfSuggestions = meeting.suggestions.length;
            MeetingUtils.sortSuggestions(meeting, SortOrder.descending);
            MeetingUtils.recalculateMeetingStatus(meeting);
            if(this.delegate) {
              this.delegate.onMeetingProgressChanged(meeting.id, meeting.progress);
              this.delegate.onParticipantsUpdated(meeting.id, meeting.numberOfParticipants);
            }
            this.meeting = Observable.of(meeting);
            this.determineVoteDecisions();
            if(this.listRefresher) {
              this.listRefresher.complete();
              this.listRefresher = null;
            } else {
              this.hideLoadingIndicator();
            }
            this.refreshPickedSuggestionsList();
            onFinished();
          });
        });
      });
    });
  }

  /**
   * Triggered if refreshing the meetings list as been requested.
   * @param refresher The active refresher UI component
   */
  protected onRefreshMeeting(refresher: Refresher) {
    this.listRefresher = refresher;
    this.loadMeetingDetails();
  }

  /**
   * Navigate back to the previous screen
   */
  goBack() {
    let headerElement: HTMLElement = document.querySelector('#meeting-details-page-header');
    headerElement.classList.add('no-bg-image');
    this.navCtrl
        .pop({animate: true,
              animation: 'transition',
              direction: 'back'})
        .then();
  }


  /**
   * Navigate to the "Add New Suggestion" page.
   */
  private goToNewSuggestionPage(){
    this.meeting.subscribe(meeting => {
      this.navCtrl.push(
          'CreateNewSuggestionPage',
          {
            'meeting': meeting ,
            'delegate': this,
          }
      ).then();
    });
  }

  private showSuggestionDetails(suggestion: Suggestion, index: number) {
    this.meeting.subscribe(meeting => {
      this.userSession.getActiveUser().then(activeUser => {
        this.navCtrl.push(
            'SuggestionDetailsPage',
            {
              activeUserId: activeUser.id,
              meeting: meeting,
              meetingId: this.meetingId,
              suggestionId: suggestion.id,
              suggestion: suggestion,
              suggestionIndex: index
            },
            {animate:true,animation:'transition',duration:500,direction:'forward'}
        ).then();
      })
    });
  }

  /**
   * Open the finish planning action sheet providing options
   * for finalizing the meeting planning.
   */
  private openFinishPlanningActionSheet() {
   this.meeting.subscribe(meeting => {
     this.locationInput.value = meeting.location;
     this.refreshPickedSuggestionsList();
     this.renderer.addClass(this.actionOverlay.nativeElement, 'active');
     this.renderer.addClass(this.finishActionSheet.getElementRef().nativeElement, 'active');
   });
  }

  /**
   * Close the finish planning action sheet.
   */
  private closeFinishPlanningActionSheet() {
    this.renderer.removeClass(this.finishActionSheet.getElementRef().nativeElement, 'active');
    this.renderer.removeClass(this.actionOverlay.nativeElement, 'active');
    setTimeout(() => {
      this.finishActionSheet.slidePrev();
    }, 200);
  }

  /**
   * Callback function when a picked suggestion got
   * unchecked or re-checked from the displayed list in the finish planning action sheet.
   * @param suggestion The unpicked suggestion
   */
  private onPickStatusChange(suggestion: Suggestion) {
    suggestion.isPicked = false;
    this.userSession.getActiveUser().then(activeUser => {
      this.apiService.updateSuggestion(activeUser.key, suggestion).subscribe(() => {
      });
    });
    this.refreshPickedSuggestionsList(true);
  }

  /**
   * Refresh the list of picked suggestions by
   * re-determining all picked suggestions.
   */
  private refreshPickedSuggestionsList(isCountOnly = false) {
    this.meeting.subscribe(meeting => {
      let pickedSuggestions: Suggestion[] = [];
      meeting.suggestions.forEach(suggestion => {
        if(suggestion.isPicked) {
          pickedSuggestions.push(suggestion);
        }
        this.pickedSuggestionsCount = pickedSuggestions.length;
        if(!isCountOnly) {
          this.pickedSuggestions = pickedSuggestions;
        }
      });
    });
  }

  private onLocationEntered(event) {
    this.location = event[0];
  }

  private onCommentEntered(event) {
    this.comment = event[0];
  }

  /**
   * Finish the meeting planning.
   */
  private finishPlanning() {
    this.closeFinishPlanningActionSheet();
    setTimeout( () => {
      this.loadingIndicator.show();
    }, 100);
    this.userSession.getActiveUser().then(activeUser => {
      this.apiService.finishMeeting(
          activeUser.key,
          this.meetingId,
          this.pickedSuggestions,
          this.location,
          this.comment)
          .subscribe(() => {
            this.hideLoadingIndicator();
            setTimeout(() => {
              this.feedbackAlert.presentWith(
                  "Termin(e) versandt",
                  "Planung erfolgreich abgeschlossen. Alle Teilnehmer wurden über die finalen Termine informiert.",
                  "teaco-closed-meetings")
                  .then(() => {
                    this.events.publish('switchToTab', 0);
                    this.goBack();
                  });
              }, 300);
          });
    });
  }

  /**
   * Mark a specific suggestion as picked
   * @param suggestion The suggestion which to mark as picked
   * @param index The suggestion's list index
   * @param slidingItem The sliding item from the UI
   */
  private pickSuggestion(suggestion: Suggestion, index: number, slidingItem: ItemSliding) {
    this.meeting.subscribe(meeting => {
      suggestion.isPicked = !suggestion.isPicked; // set the opposite picked status
      if(slidingItem) {
        slidingItem.close();
      }
      meeting.suggestions[index] = suggestion;
      this.meeting = new Observable(observer => {observer.next(meeting)});
      this.userSession.getActiveUser().then(activeUser => {
        this.apiService.updateSuggestion(activeUser.key, suggestion).subscribe(() => {
          this.feedbackAlert.presentWith(
              suggestion.isPicked ? "Als final markiert" : "Markierung aufgehoben",
              suggestion.isPicked ? "Der Termin wurde erfolgreich als final markiert." : "Die Markierung als entgültiger Terminvorschlag wurde aufgehoben",
              suggestion.isPicked ? "teaco-picked-suggestion" : "teaco-unpicked-suggestion"
          ).then();
        });
      });
      this.refreshPickedSuggestionsList();
    });
  }

  /**
   * Delete a specific suggestion.
   * @param suggestion The suggestion which to delete
   * @param index The suggestion's list index
   * @param slidingItem The sliding item from the UI
   */
  private deleteSuggestion(suggestion: Suggestion, index: number, slidingItem: ItemSliding) {
    slidingItem.close();
    const alert = this.alertCtrl.create({
      "title": "Teriminvorschlag wirklich löschen?",
      "message": "<br />Du bist dabei diesen Terminvorschlag entgültig zu löschen? Willst du ihn wirklich löschen?",
      buttons: [
        {
          "text": "Ja, Terminvorschlag löschen",
          handler: () => {
            this.loadingIndicator.show();
            this.meeting.subscribe(meeting => {
              this.userSession.getActiveUser().then(activeUser => {
                this.apiService.deleteSuggestion(
                    activeUser.key,
                    meeting.id,
                    suggestion.id
                ).subscribe(() => {
                  this.hideLoadingIndicator();
                  meeting.suggestions.splice(index, 1);
                  meeting.numberOfSuggestions -= 1;
                  console.log("suggestion has been successfully deleted");
                  MeetingUtils.recalculateMeetingStatus(meeting);
                  this.meeting = new Observable(observer => {observer.next(meeting)});
                  this.determineVoteDecisions();
                  if(this.delegate) {
                    this.delegate.onSuggestionDeleted(this.meetingId, suggestion.id);
                    this.delegate.onMeetingProgressChanged(meeting.id, meeting.progress);
                  }
                  this.feedbackAlert.presentWith(
                      "Terminvorschlag gelöscht.",
                      "Der Terminvorschlag wurde erfolgreich für alle Teilnehmer entfernt.",
                      "md-trash").then();
                }, (error) => {
                  console.error(error);
                  this.hideLoadingIndicator();
                });
              });
            });
            alert.dismiss(true);
            return false;
          }
        },
        {
          "text": "Abbruch",
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  onSuggestionCreated(suggestion: Suggestion) {
    this.meeting.subscribe(meeting => {
      meeting.suggestions.push(suggestion);
      meeting.numberOfSuggestions += 1;
      this.meeting = new Observable(observer => {observer.next(meeting)});
      MeetingUtils.recalculateMeetingStatus(meeting);
      this.determineVoteDecisions();
      if(this.delegate) {
        this.delegate.onSuggestionCreated(suggestion);
        this.delegate.onMeetingProgressChanged(meeting.id, meeting.progress);
      }
    });
  }

  onParticipantsInvited(participants: User[]) {
    this.loadMeetingDetails().then(() => {
      setTimeout(() => {
        this.feedbackAlert.presentWith(
            "Teilnehmer eingeladen",
            "Alle Teilnehmer wurden erfolgreich zur Abstimmung eingeladen.",
            "teaco-user"
        );
      }, 300);
    });
  }

  onParticipantsUninvited(participants: User[]) {
    this.loadMeetingDetails().then(() => {
      setTimeout(() => {
        this.feedbackAlert.presentWith(
            "Teilnehmer ausgeladen",
            "Alle Teilnehmer wurden erfolgreich ausgeladen.",
            "teaco-user"
        );
      }, 300);
    });
  }

  onSendParticipantsUpdate() {
    this.loadingIndicator.show();
  }

  /**
   * Hide the current visible loading indicator.
   */
  private hideLoadingIndicator() {
    setTimeout( () => {
      this.loadingIndicator.hide();
    }, 400);
  }

  /**
   * Get the suggestion's year.
   * @return the suggestion's year
   */
  private getYear(suggestion: Suggestion): string {
    return suggestion.date.getFullYear().toString().substr(2, 2);
  }

  /**
   * Get the suggestion's month.
   * @return the suggestion's month
   */
  private getMonth(suggestion: Suggestion): string {
    return DateTimeHelper.getMonthName(suggestion.date).substr(0, 3);
  }

  /**
   * Get the suggestion's full time span from start to end time.
   * @return The suggestion's full time span
   */
  private getTime(date: Date): string {
    return DateTimeHelper.getTimeString(date);
  }
}