import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {OpenMeetingsOverviewPage} from "../open-meetings-overview/open-meetings-overview";
import {UserSessionProvider} from "../../../../providers/user-session/user-session";
import {TeaCoApiProvider} from "../../../../providers/teaco-api/teaco-api-provider";
import {MeetingType} from "../../../../models/MeetingType";

/**
 * Page Controller for listing all closed meetings.
 */
@IonicPage({
  segment: 'closed-meetings'
})
@Component({
  selector: 'page-closed-meetings-overview',
  templateUrl: 'closed-meetings-overview.html',
})
export class ClosedMeetingsOverviewPage extends OpenMeetingsOverviewPage {

  /**
   * Constructor
   * @param navCtrl The page's navigation controller
   * @param navParams The handed navigation params
   * @param userSession The app's user session service
   * @param apiService The app's TeaCo API service
   */
  constructor(navCtrl: NavController,
              navParams: NavParams,
              userSession: UserSessionProvider,
              apiService: TeaCoApiProvider,
              alertCtrl: AlertController) {
    super(navCtrl, navParams, undefined, userSession, apiService, alertCtrl);
  }

  ngOnInit() {
    super.loadMeetings(MeetingType.closed);
  }
}
