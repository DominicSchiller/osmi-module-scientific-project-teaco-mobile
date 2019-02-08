import {Component, ViewChildren} from '@angular/core';
import {IonicPage, ItemSliding, ModalController, NavController, NavParams} from 'ionic-angular';
import {TeaCoApiProvider} from "../../../../providers/teaco-api/teaco-api-provider";
import {Meeting} from "../../../../models/meeting";
import {UserSessionProvider} from "../../../../providers/user-session/user-session";
import {OpenMeetingCardComponent} from "../../../../components/open-meeting-card/open-meeting-card";
import {MeetingType} from "../../../../models/MeetingType";
import {TeaCoSyncMode} from "../../../../models/teaco-sync-mode";
import {Suggestion} from "../../../../models/suggestion";
import {EditMeetingEventDelegate} from "./edit-meeting-event-delegate";
import {User} from "../../../../models/user";
import {MeetingProgress} from "../../../../models/meeting-progress";

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
   * List of open meeting cards UI components
   */
  @ViewChildren(OpenMeetingCardComponent) openMeetingsCards: OpenMeetingCardComponent[];

  /**
   * List of fetched meetings
   */
  protected meetings: Meeting[];

  /**
   * Constructor
   * @param navCtrl The page's navigation controller
   * @param navParams The handed navigation params
   * @param modalCtrl The Ionic's default modal controller
   * @param userSession The app's user session service
   * @param apiService The app's TeaCo API service
   */
  constructor(
      protected navCtrl: NavController,
      protected navParams: NavParams,
      private modalCtrl: ModalController,
      protected userSession: UserSessionProvider,
      protected apiService: TeaCoApiProvider) {
    this.meetings = [];
  }

  ngOnInit() {
    this.loadMeetings(MeetingType.open);
  }

  /**
   * Load all meetings from the TeaCo server
   */
  protected loadMeetings(meetingType: MeetingType) {
    this.userSession.getActiveUser().then(activeUser => {
      this.apiService.getAllMeetings(activeUser.key, meetingType).subscribe(meetings => {
        this.meetings = meetings;
        //this.meeting.id = meetings[0].id;
        if(meetings.length > 0) {
          this.startMeetingCardsUpdateInterval();
        }
      });
    });
  }

  private showMeetingDetail(meeting: Meeting) {
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
        'AddNewMeetingPage',
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
        'AddNewSuggestionPage',
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
   */
  private deleteMeeting(meeting: Meeting, index: number) {
    this.userSession.getActiveUser().then(activeUser => {
      this.apiService.deleteMeeting(activeUser.key, meeting.id).subscribe(() => {
        this.meetings.splice(index, 1);
      }, error => {
        console.error("Could not delete meeting: ", error);
      });
    });
  }

  onMeetingCreated(meeting: Meeting) {
    console.warn("Retrieved new meeting: ", meeting);
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
      }
    });
  }

  onParticipantsAdded(meetingId: number, participants: User[]) {
    this.meetings.forEach(meeting => {
      if(meeting.id == meetingId) {
        meeting.numberOfParticipants += participants.length;
        return;
      }
    });
  }

  onMeetingProgressChanged(meetingId: number, progress: MeetingProgress) {
    console.log("trieved updated progress", progress);
    this.meetings.forEach(meeting => {
      if(meeting.id == meetingId) {
        meeting.progress = progress;
        return;
      }
    });
  }
}
