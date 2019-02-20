import {Component, forwardRef, NgZone, ViewChild, ViewChildren} from '@angular/core';
import {
  AlertController, Events,
  IonicPage,
  ItemSliding,
  ModalController,
  NavController,
  NavParams,
  Refresher
} from 'ionic-angular';
import {TeaCoApiProvider} from "../../../../providers/teaco-api/teaco-api-provider";
import {Meeting} from "../../../../models/meeting";
import {UserSessionProvider} from "../../../../providers/user-session/user-session";
import {OpenMeetingCardComponent} from "../../../../components/meetings/open-meeting-card/open-meeting-card";
import {MeetingType} from "../../../../models/MeetingType";
import {TeaCoSyncMode} from "../../../../models/teaco-sync-mode";
import {Suggestion} from "../../../../models/suggestion";
import {EditMeetingEventDelegate} from "./edit-meeting-event-delegate";
import {User} from "../../../../models/user";
import {MeetingProgress} from "../../../../models/meeting-progress";
import {LoadingIndicatorComponent} from "../../../../components/general/loading-indicator/loading-indicator";
import {FeedbackAlertComponent} from "../../../../components/general/feedback-alert/feedback-alert";

/**
 * Page Controller for listing all open meetings.
 */
@IonicPage({
  name: 'OpenMeetingsOverviewPage',
  segment: 'open-meetings'
})
@Component({
  selector: 'page-open-meetings-overview',
  templateUrl: 'open-meetings-overview.html'
})
export class OpenMeetingsOverviewPage implements EditMeetingEventDelegate {

  /**
   * loading indicator UI component
   */
  @ViewChild(forwardRef(() => LoadingIndicatorComponent)) loadingIndicator: LoadingIndicatorComponent;
  /**
   * feedback alert UI component for displaying succeeded or failed REST api calls
   */
  @ViewChild(forwardRef(() => FeedbackAlertComponent)) feedbackAlert: FeedbackAlertComponent;
  /**
   * Currently active refresher UI component
   */
  protected listRefresher: Refresher;

  /**
   * List of open meeting cards UI components
   */
  @ViewChildren(OpenMeetingCardComponent) openMeetingsCards: OpenMeetingCardComponent[];

  /**
   * List of fetched meetings
   */
  protected meetings: Meeting[];

  protected canShowPlaceholder: boolean;

  /**
   * Constructor
   * @param navCtrl The page's navigation controller
   * @param navParams The handed navigation params
   * @param modalCtrl The Ionic's default modal controller
   * @param userSession The app's user session service
   * @param apiService The app's TeaCo API service
   * @param alertCtrl The page's alert controller to create alert and confirmation dialogs
   * @param zone The current template zone this controller refers to
   * @param events The app's global events system
   */
  constructor(
      protected navCtrl: NavController,
      protected navParams: NavParams,
      private modalCtrl: ModalController,
      protected userSession: UserSessionProvider,
      protected apiService: TeaCoApiProvider,
      private alertCtrl: AlertController,
      private zone: NgZone,
      protected events: Events) {
    this.meetings = [];
    this.canShowPlaceholder = false;

    this.events.subscribe('switchToTab', (tabIndex: number) => {
      if(tabIndex == 1) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.loadMeetings(MeetingType.open);
  }

  /**
   * Load all meetings from the TeaCo server
   * @param meetingType The type of meetings which to load
   */
  protected loadMeetings(meetingType: MeetingType) {
    if(!this.listRefresher) {
      this.loadingIndicator.show();
    }
    this.userSession.getActiveUser().then(activeUser => {
      this.apiService.getAllMeetings(activeUser.key, meetingType).subscribe(meetings => {
        this.zone.run(() => {
          this.meetings = meetings;
          this.canShowPlaceholder = true;
          if(meetings.length > 0) {
            this.startMeetingCardsUpdateInterval();
          }
          if(this.listRefresher) {
            this.listRefresher.complete();
            this.listRefresher = null;
          } else {
            this.hideLoadingIndicator();
          }
        });
      }, error => {
        this.loadingIndicator.hide();
        alert('Beim Laden von Meetings kam es zu einem unerwarteten Fehler. Bitte stell sicher, dass du Internetzugang hast.');
      });
    });
  }

  /**
   * Triggered if refreshing the meetings list as been requested.
   * @param refresher The active refresher UI component
   */
  protected onRefreshMeetings(refresher: Refresher) {
    this.listRefresher = refresher;
    this.loadMeetings(MeetingType.open);
  }

  /**
   * Start repeating interval for updating each card's date label
   */
  protected startMeetingCardsUpdateInterval() {
    setInterval(() => {
      this.openMeetingsCards.forEach( (card) => {
        card.updatePassedTimeDescription();
      });
    }, 1000*60)
  }

  /**
   * Navigate to the "create new meeting" page.
   */
  private goToNewMeetingPage(){
    this.modalCtrl.create(
        'CreateNewMeetingPage',
        {
          'delegate': this
        }
    ).present().then();
  }

  /**
   * Navigate to the "Add New Suggestion" page.
   * @param meeting The meeting instance to add further suggestions to
   * @param slidingItem The sliding item from the UI
   */
  private goToNewSuggestionPage(meeting: Meeting, slidingItem: ItemSliding){
    slidingItem.close();
    this.modalCtrl.create(
        'CreateNewSuggestionPage',
        {
          'meeting': meeting,
          'delegate': this,
          'syncMode': TeaCoSyncMode.syncData
        }
    ).present().then()
  }

  /**
   * Navigate to the "Add Participants" page.
   * @param meeting The meeting instance to add further participants to
   * @param slidingItem The sliding item from the UI
   */
  private goToAddParticipantsPage(meeting: Meeting, slidingItem: ItemSliding){
    slidingItem.close();
    this.modalCtrl.create(
        'AddParticipantPage',
        {
          'delegate': this,
          'meeting': meeting,
          'syncMode': TeaCoSyncMode.syncData
        }
    ).present().then();
  }

  /**
   * Delete a specific meeting.
   * @param meeting The selected meeting which to delete
   * @param index The selected meeting's index within the meetings list
   * @param slidingItem The sliding item from the UI
   */
  protected deleteMeeting(meeting: Meeting, index: number, slidingItem: ItemSliding) {
    slidingItem.close();
    const alert = this.alertCtrl.create({
      "title": "Meeting wirklich löschen?",
      "message": "<br />Du bist dabei das Meeting<br /><br /><b>» " + meeting.title + " «</b><br /><br />entgültig zu löschen? Willst du dieses Meeting wirklich löschen?",
      buttons: [
        {
          "text": "Ja, Meeting löschen",
          handler: () => {
            this.loadingIndicator.show();
            this.userSession.getActiveUser().then(activeUser => {
              this.apiService.deleteMeeting(activeUser.key, meeting.id).subscribe(() => {
                setTimeout(() => {
                  this.hideLoadingIndicator();
                  setTimeout(() => {
                    this.meetings.splice(index, 1);
                    this.feedbackAlert.presentWith(
                        "Meeting gelöscht",
                        "Das Meeting wurde erfolgreich gelöscht.",
                        "md-trash"
                    )
                  }, 400);
                }, 400);
              }, error => {
                console.error("Could not delete meeting: ", error);
                this.hideLoadingIndicator();
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

  /**
   * Hide the currently visible loading indicator.
   */
  private hideLoadingIndicator() {
    setTimeout( () => {
      this.loadingIndicator.hide();
    }, 400);
  }

  onShowMeetingDetail(meeting: Meeting) {
    this.navCtrl.push(
        'MeetingDetailPage',
        {
          meeting: meeting,
          'delegate': this,
          meetingId: meeting.id
        },
        {animate:true,animation:'transition',duration:500,direction:'forward'}
    ).then();
  }

  onMeetingCreated(meeting: Meeting) {
    this.meetings.push(meeting);
  }

  onSuggestionCreated(suggestion: Suggestion) {
    this.meetings.forEach(meeting => {
      if(suggestion.meetingId == meeting.id) {
        meeting.suggestions.push(suggestion);
        meeting.numberOfSuggestions += 1;
        return;
      }
    })
  }

  onSuggestionDeleted(meetingId: number, suggestion: number) {
    this.meetings.forEach(meeting => {
      if(meeting.id == meetingId) {
        meeting.numberOfSuggestions -= 1;
        return;
      }
    });
  }

  onParticipantsUpdated(meetingId: number, numberOfParticipants: number) {
    this.meetings.forEach(meeting => {
      if(meeting.id == meetingId) {
        meeting.numberOfParticipants = numberOfParticipants;
        return;
      }
    });
  }

  onMeetingProgressChanged(meetingId: number, progress: MeetingProgress) {
    this.meetings.forEach(meeting => {
      if(meeting.id == meetingId) {
        meeting.progress = progress;
        return;
      }
    });
  }

  onMeetingFinalized(meetingId: number) {
    for(let i=0; i<this.meetings.length; i++) {
      if(this.meetings[i].id == meetingId) {
        this.meetings.splice(i, 1);
        break;
      }
    }
  }
}
