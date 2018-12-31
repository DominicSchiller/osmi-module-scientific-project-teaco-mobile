import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import {OpenMeetingsOverviewPage} from "../open-meetings-overview/open-meetings-overview";
import {UserSessionProvider} from "../../../../providers/user-session/user-session";
import {TeaCoApiProvider} from "../../../../providers/teaco-api/teaco-api-provider";
import {MeetingType} from "../../../../models/MeetingType";
import {DateTimeHelper} from "../../../../utils/date-time-helper";

/**
 * Page Controller for listing all closed meetings.
 */
@Component({
  selector: 'page-closed-meetings-overview',
  templateUrl: 'closed-meetings-overview.html',
})
export class ClosedMeetingsOverviewPage extends OpenMeetingsOverviewPage {

  /**
   * Constructor
   * @param navCtrl The page's navigation controller
   * @param userSession The app's user session service
   * @param apiService The app's TeaCo API service
   */
  constructor(navCtrl: NavController,
              userSession: UserSessionProvider,
              apiService: TeaCoApiProvider) {
    super(navCtrl, userSession, apiService);
  }

  ngOnInit() {
    super.loadMeetings(MeetingType.closed);
  }
}
