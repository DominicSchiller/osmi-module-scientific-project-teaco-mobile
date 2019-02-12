import {Component, ElementRef, forwardRef, NgZone, Renderer2, ViewChild} from '@angular/core';
import {
  AlertController,
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
import {CreateSuggestionEventDelegate} from "../add-new-suggestion/create-suggestion-event-delegate";
import {EditMeetingEventDelegate} from "../meetings-overview/open-meetings-overview/edit-meeting-event-delegate";
import {MeetingUtils} from "../../../utils/meeting-utils";
import {LoadingIndicatorComponent} from "../../../components/loading-indicator/loading-indicator";

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
export class MeetingDetailPage implements CreateSuggestionEventDelegate {

  /**
   * loading indicator UI component
   */
  @ViewChild(forwardRef(() => LoadingIndicatorComponent)) loadingIndicator: LoadingIndicatorComponent;

  /**
   * The page's navigation bar UI element
   */
  @ViewChild(Navbar) navBar: Navbar;
  /**
   * The pages 'finish the meeting planning' action sheet UI element
   */
  @ViewChild('finishPlanningActionSheet') finishActionSheet: Slides;
  /**
   * The pages overlay UI element for i.e. indicating stuff in progress
   */
  @ViewChild('actionOverlay') actionOverlay: ElementRef;

  /**
   * Currently active refresher UI component
   */
  protected listRefresher: Refresher;

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
   */
  constructor(
      private navCtrl: NavController,
      private navParams: NavParams,
      private apiService: TeaCoApiProvider,
      private userSession: UserSessionProvider,
      private renderer: Renderer2,
      private alertCtrl: AlertController,
      private zone: NgZone) {
    this.pickedSuggestions = [];
    this.comment = "";
    this.location = "";
    this.meetingId = Number(this.navParams.get('meetingId'));
    let meeting = this.navParams.get('meeting');
    this.delegate = this.navParams.get('delegate');
    if(meeting !== undefined) {
      this.meeting = Observable.of(meeting)
    }
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

  /**
   * Load meeting details.
   */
  private loadMeetingDetails() {
    if(!this.listRefresher) {
      this.loadingIndicator.show();
    }
    this.userSession.getActiveUser().then(activeUser => {
      this.apiService.getMeeting(activeUser.key, this.meetingId).subscribe(meeting => {
       this.zone.run(() => {
         meeting.numberOfParticipants = meeting.participants.length;
         meeting.numberOfSuggestions = meeting.suggestions.length;
         this.meeting = Observable.of(meeting);
         if(this.listRefresher) {
           this.listRefresher.complete();
           this.listRefresher = null;
         } else {
           this.hideLoadingIndicator();
         }
         this.refreshPickedSuggestionsList();
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
          'AddNewSuggestionPage',
          {
            'meeting': meeting ,
            'delegate': this,
          }
      ).then();
    });
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
   * Open the finish planning action sheet providing options
   * for finalizing the meeting planning.
   */
  private openFinishPlanningActionSheet() {
    this.refreshPickedSuggestionsList();
    this.renderer.addClass(this.actionOverlay.nativeElement, 'active');
    this.renderer.addClass(this.finishActionSheet.getElementRef().nativeElement, 'active');
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
            console.log("Successfully finished meeting planning");
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
      slidingItem.close();
      meeting.suggestions[index] = suggestion;
      this.meeting = new Observable(observer => {observer.next(meeting)});
      this.userSession.getActiveUser().then(activeUser => {
        this.apiService.updateSuggestion(activeUser.key, suggestion).subscribe(() => {
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
                  this.delegate.onSuggestionDeleted(this.meetingId, suggestion.id);
                  console.log("suggestion has been successfully deleted");
                  MeetingUtils.recalculateMeetingStatus(meeting);
                  this.delegate.onMeetingProgressChanged(meeting.id, meeting.progress);
                  this.meeting = new Observable(observer => {observer.next(meeting)})
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
    console.log("Retrieved suggestion", suggestion);
    this.meeting.subscribe(meeting => {
      meeting.suggestions.push(suggestion);
      this.meeting = new Observable(observer => {observer.next(meeting)});
    });
  }
}