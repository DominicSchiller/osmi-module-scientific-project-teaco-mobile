import {Component, ViewChild} from '@angular/core';
import { NavController, NavParams, Navbar } from 'ionic-angular';
import {Meeting} from "../../../models/meeting";
import {TeaCoApiProvider} from "../../../providers/teaco-api/teaco-api-provider";
import {UserSessionProvider} from "../../../providers/user-session/user-session";

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
   * The root view's tab bar
   */
  private tabBarElement: HTMLElement;
  /**
   * The meeting to display all detailed information and suggestions for
   */
  protected meeting: Meeting;

  constructor(private navCtrl: NavController, private navParams: NavParams, private apiService: TeaCoApiProvider, userSession: UserSessionProvider) {
    this.meeting = this.navParams.data;

    // hide tab bar
    this.tabBarElement = document.querySelector('.tabbar');

    // load participants and suggestions
    this.apiService.getMeeting(userSession.activeUser.key, this.meeting.id).subscribe(meeting => {
      this.meeting.participants = meeting.participants;
      this.meeting.suggestions = meeting.suggestions;
    })
  }

  ionViewDidLoad() {
    let ionContent: HTMLElement = document.querySelector('#meeting-details-content');
    let headerElement: HTMLElement = document.querySelector('#meeting-details-page-header');
    headerElement.classList.add('no-bg-image');

    ionContent.style.height = 'calc(100% + 60px)';

    setTimeout(() => {
      this.tabBarElement.style.display = 'none';
    }, 150);

    setTimeout(() => {
      headerElement.classList.remove('no-bg-image');
    }, 200);

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

    setTimeout(() => {
      this.tabBarElement.style.display = 'flex';

    }, 175);
    this.navCtrl.pop(
        {animate:true,animation:'transition', direction:'back'}).then();
  }

}
