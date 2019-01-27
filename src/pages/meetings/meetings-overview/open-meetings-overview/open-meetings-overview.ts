import {Component, ViewChildren} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {TeaCoApiProvider} from "../../../../providers/teaco-api/teaco-api-provider";
import {AddNewMeetingPage} from '../../add-new-meeting/add-new-meeting';
import {Meeting} from "../../../../models/meeting";
import {UserSessionProvider} from "../../../../providers/user-session/user-session";
import {OpenMeetingCardComponent} from "../../../../components/open-meeting-card/open-meeting-card";
import {MeetingType} from "../../../../models/MeetingType";
import {MeetingDetailPage} from "../../meeting-detail/meeting-detail";
import { AddNewSuggestionPage } from '../../add-new-suggestion/add-new-suggestion';

/**
 * Page Controller for listing all open meetings.
 */
@Component({
  selector: 'page-open-meetings-overview',
  templateUrl: 'open-meetings-overview.html'
})
export class OpenMeetingsOverviewPage {

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
    this.apiService.getAllMeetings(this.userSession.activeUser.key, meetingType).subscribe(meetings => {
      this.meetings = meetings;
      //this.meeting.id = meetings[0].id;
      if(meetings.length > 0) {
        this.startMeetingCardsUpdateInterval();
      }
    });
  }

  private showMeetingDetail(meeting: Meeting) {
    this.navCtrl.push(
        MeetingDetailPage,
        meeting,
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
    this.navCtrl.push(AddNewMeetingPage).then();
  }

  /**
   * Navigate to the "Add New Suggestion" page.
   */
  private goToNewSuggestionPage(){
    this.navCtrl.push(AddNewSuggestionPage).then();
  }

  /**
   *Remove Meeting
   */
  removeMeeting(){
    /* this.apiService.deleteMeeting(this.userSession.activeUser.key, this.meetings[1].id).subscribe(meeting =>{
      this.meeting.id = meeting.id;
    }); */
    
    console.log(this.meetings);
    console.log(this.meeting);
    
  
    //console.log('Meeting hs to be removed');
    
  }
  
}
