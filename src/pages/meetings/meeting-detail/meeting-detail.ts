import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, ItemSliding, Navbar, NavController, NavParams, Slides} from 'ionic-angular';
import {Meeting} from "../../../models/meeting";
import {TeaCoApiProvider} from "../../../providers/teaco-api/teaco-api-provider";
import {UserSessionProvider} from "../../../providers/user-session/user-session";
import {Suggestion} from "../../../models/suggestion";
import {Observable} from "rxjs";
import {CreateSuggestionEventDelegate} from "../add-new-suggestion/create-suggestion-event-delegate";
import {EditMeetingEventDelegate} from "../meetings-overview/open-meetings-overview/edit-meeting-event-delegate";
import {MeetingUtils} from "../../../utils/meeting-utils";

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
   */
  constructor(
      private navCtrl: NavController,
      private navParams: NavParams,
      private apiService: TeaCoApiProvider,
      private userSession: UserSessionProvider,
      private renderer: Renderer2) {
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
    this.userSession.getActiveUser().then(activeUser => {
      this.apiService.getMeeting(activeUser.key, this.meetingId).subscribe(meeting => {
        meeting.numberOfParticipants = meeting.participants.length;
        meeting.numberOfSuggestions = meeting.suggestions.length;
        this.meeting = Observable.of(meeting);
        this.refreshPickedSuggestionsList();
      });
    });
  }

  ionViewDidLoad() {
    let headerElement: HTMLElement = document.querySelector('#meeting-details-page-header');
    headerElement.classList.add('no-bg-image');

    this.navBar.backButtonClick = (e:UIEvent)=>{
      // todo something
      this.goBack();
    };

    console.warn(this.finishActionSheet);
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
    this.userSession.getActiveUser().then(activeUser => {
      this.apiService.finishMeeting(
          activeUser.key,
          this.meetingId,
          this.pickedSuggestions,
          this.location,
          this.comment)
          .subscribe(() => {
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
   */
  private deleteSuggestion(suggestion: Suggestion) {
    this.meeting.subscribe(meeting => {
      this.userSession.getActiveUser().then(activeUser => {
        this.apiService.deleteSuggestion(
            activeUser.key,
            meeting.id,
            suggestion.id
        ).subscribe(() => {
          // search suggestion in array and delete it from there using it's index
          let deleteIndex = -1;
          for(let index = 0; index < meeting.suggestions.length; index++) {
            if(meeting.suggestions[index].id == suggestion.id) {
              deleteIndex = index;
              break;
            }
          }
          if(deleteIndex > -1) {
            let suggestion = meeting.suggestions[deleteIndex];
            meeting.suggestions.splice(deleteIndex, 1);
            meeting.numberOfSuggestions -= 1;
            this.delegate.onSuggestionDeleted(this.meetingId, suggestion.id);
            console.log("suggestion has been successfully deleted");
          }
          MeetingUtils.recalculateMeetingStatus(meeting);
          this.delegate.onMeetingProgressChanged(meeting.id, meeting.progress);
          this.meeting = new Observable(observer => {observer.next(meeting)})
        }, (error) => {
          console.error(error);
        });
      });
    });
  }

  onSuggestionCreated(suggestion: Suggestion) {
    console.log("Retrieved suggestion", suggestion);
    this.meeting.subscribe(meeting => {
      meeting.suggestions.push(suggestion);
      this.meeting = new Observable(observer => {observer.next(meeting)});
    });
  }
}