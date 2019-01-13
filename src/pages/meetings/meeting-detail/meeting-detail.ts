import {Component, ViewChild} from '@angular/core';
import { NavController, NavParams, Navbar } from 'ionic-angular';
import {Meeting} from "../../../models/meeting";
import {TeaCoApiProvider} from "../../../providers/teaco-api/teaco-api-provider";
import {UserSessionProvider} from "../../../providers/user-session/user-session";
import { AddNewSuggestionPage } from '../add-new-suggestion/add-new-suggestion';
import { MeetingsOverviewPage } from '../meetings-overview/meetings-overview';

/**
 * Page Controller for meeting details.
 */
@Component({
  selector: 'page-meeting-detail',
  templateUrl: 'meeting-detail.html',
})
export class MeetingDetailPage {

  /**
   * The page's navigation bar UI element
   */
  @ViewChild(Navbar) navBar: Navbar;
  /**
   * The meeting to display all detailed information and suggestions for
   */
  protected meeting: Meeting;

  constructor(private navCtrl: NavController, private navParams: NavParams, private apiService: TeaCoApiProvider, userSession: UserSessionProvider) {
    this.meeting = this.navParams.data;

    // load participants and suggestions
    this.apiService.getMeeting(userSession.activeUser.key, this.meeting.id).subscribe(meeting => {
      this.meeting.participants = meeting.participants;
      this.meeting.suggestions = meeting.suggestions;
    })
  }

  ionViewDidLoad() {
    let headerElement: HTMLElement = document.querySelector('#meeting-details-page-header');
    headerElement.classList.add('no-bg-image');

    this.navBar.backButtonClick = (e:UIEvent)=>{
      // todo something
      this.goBack();
    }
  }

  /**
   * Navigate back to the previous screen
   */
  goBack() {
    let headerElement: HTMLElement = document.querySelector('#meeting-details-page-header');
    headerElement.classList.add('no-bg-image');
    this.navCtrl.pop(
        {animate:true,animation:'transition', direction:'back'}).then();
  }


   /**
   * Navigate to the "Add New Suggestion" page.
   */
  private goToNewSuggestionPage(){
    this.navCtrl.push(AddNewSuggestionPage).then();
  }

  /**
   * Navigate to the "MeetingsOverviewPage" page.
   */
  private goToMeetingsOverview(){
    this.navCtrl.setRoot(MeetingsOverviewPage).then();
  }

}
