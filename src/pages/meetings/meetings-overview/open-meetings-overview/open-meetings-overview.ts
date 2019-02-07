import {Component, ViewChildren} from '@angular/core';
import {IonicPage, ItemSliding, NavController, NavParams} from 'ionic-angular';
import {TeaCoApiProvider} from "../../../../providers/teaco-api/teaco-api-provider";
import {Meeting} from "../../../../models/meeting";
import {UserSessionProvider} from "../../../../providers/user-session/user-session";
import {OpenMeetingCardComponent} from "../../../../components/open-meeting-card/open-meeting-card";
import {MeetingType} from "../../../../models/MeetingType";
import {TeaCoSyncMode} from "../../../../models/teaco-sync-mode";
import {CreateMeetingEventDelegate} from "../../add-new-meeting/create-meeting-event-delegate";

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
export class OpenMeetingsOverviewPage implements CreateMeetingEventDelegate {

  /**
   * List of open meeting cards UI components
   */
  @ViewChildren(OpenMeetingCardComponent) openMeetingsCards: OpenMeetingCardComponent[];

  /**
   * List of fetched meetings
   */
  protected meetings: Meeting[];
  protected meeting: Meeting;
  /**
   * Constructor
   * @param navCtrl The page's navigation controller
   * @param userSession The app's user session service
   * @param apiService The app's TeaCo API service
   * @param navParams The handed navigation params
   */
  constructor(
      protected navCtrl: NavController,
      protected userSession: UserSessionProvider,
      protected apiService: TeaCoApiProvider,
      protected navParams: NavParams) {
    this.meetings = [];
    this.meeting = this.navParams.data;
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
        {meeting: meeting, meetingId: meeting.id},
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
    this.navCtrl.push(
        'AddNewMeetingPage',
        {
          'delegate': this
        }
    ).then();
  }

  /**
   * Navigate to the "Add New Suggestion" page.
   * @param slidingItem The sliding item from the UI
   */
  private goToNewSuggestionPage(slidingItem: ItemSliding){
    slidingItem.close();
    this.navCtrl.push(
        'AddNewSuggestionPage',
        {
          'syncMode': TeaCoSyncMode.syncData
        }
    ).then();
  }

  /**
   * Navigate to the "Add Participants" page.
   * @param slidingItem The sliding item from the UI
   */
  private goToAddParticipantsPage(slidingItem: ItemSliding){
    slidingItem.close();
    this.navCtrl.push(
        'AddParticipantPage'
    ).then();
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
}
