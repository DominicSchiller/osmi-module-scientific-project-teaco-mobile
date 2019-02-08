import {Component, ViewChild} from '@angular/core';
import {
  AlertController,
  IonicPage,
  ItemSliding,
  Navbar,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import {Meeting} from "../../../models/meeting";
import {TeaCoApiProvider} from "../../../providers/teaco-api/teaco-api-provider";
import {UserSessionProvider} from "../../../providers/user-session/user-session";
import {DateTimeHelper} from "../../../utils/date-time-helper";
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
   * The meeting to display all detailed information and suggestions for
   */
  protected meeting: Observable<Meeting>;
  /**
   * The selected meeting's unique TeaCo id
   */
  protected meetingId: number;

  private delegate: EditMeetingEventDelegate;

  /**
   * Constructor
   * @param navCtrl
   * @param navParams
   * @param apiService
   * @param userSession
   * @param alertCtrl
   * @param toastCtrl
   */
  constructor(
      private navCtrl: NavController,
      private navParams: NavParams,
      private apiService: TeaCoApiProvider,
      private userSession: UserSessionProvider,
      private alertCtrl: AlertController,
      private toastCtrl: ToastController) {
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
   * Navigate to the "MeetingsOverviewPage" page.
   */
  private goToMeetingsOverview(){
    this.navCtrl.setRoot('MeetingsOverviewPage').then();
  }

    /**
   * Showing the available Options for choosing one of them.
   */
  private chooseFinalSuggestion() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Finaler Termin');
    alert.setSubTitle('wählen Sie einen finalen Termin aus');

    this.meeting.subscribe(meeting => {
      meeting.suggestions.forEach(suggestion => {
        alert.addInput({
          type: 'radio',
          label: this.getDate(suggestion.date) + ' von ' + this.getStartTime(suggestion.startTime) + ' - ' + this.getEndTime(suggestion.endTime),
          value: this.getDate(suggestion.date) + ' von ' + this.getStartTime(suggestion.startTime) + ' - ' + this.getEndTime(suggestion.endTime),
          checked: false
        });
      });
      alert.addButton({
        text: 'okay',
        handler: (data: string) => {
          if (data == null) {
            this.toastMessage();
          } else {
            setTimeout(() => {
              this.goToMeetingsOverview();
            }, 500);
          }
        }
      });
      alert.present();
    });
  }

  /**
   Shows a Message to the User if he did not choose a final Suggestion from the Options
   **/
  toastMessage() {
    let warning = this.toastCtrl.create({
      message: 'Sie haben kein Termin ausgewählt. Bitte wählen Sie ein Termin aus!',
      closeButtonText: 'Schließen',	
      showCloseButton: true,
      duration: 3000,
      position: 'middle'
    });
    warning.present();
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
          console.log("returned something");
        });
      });
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

  /**
   * Get the Date Formated.
   * @param date get the specific date from array
   */
  private getDate(date: Date): string {
    return DateTimeHelper.getDateString(date);
  }

  /**
   * Get the STart Time Formated.
   * @param startTime  get the strt time date from array
   */
  private getStartTime(startTime: Date): string {
    return DateTimeHelper.getTimeString(startTime);
  }

  /**
   * Get the End Date Formated.
   * @param endTime get the end Time from array
   */
  private getEndTime(endTime: Date): string {
    return DateTimeHelper.getTimeString(endTime);
  }

  onSuggestionCreated(suggestion: Suggestion) {
    console.log("Retrieved suggestion", suggestion);
    this.meeting.subscribe(meeting => {
      meeting.suggestions.push(suggestion);
      this.meeting = new Observable(observer => {observer.next(meeting)});
    });
  }
}
