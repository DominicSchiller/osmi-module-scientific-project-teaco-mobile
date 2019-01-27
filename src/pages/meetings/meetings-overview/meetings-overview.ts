import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {ClosedMeetingsOverviewPage} from './closed-meetings-overview/closed-meetings-overview';
import {OpenMeetingsOverviewPage} from "./open-meetings-overview/open-meetings-overview";

/**
 * Page Controller for the meetings tab menu.
 */
@IonicPage({
  segment: 'meetings-overview',
  defaultHistory: []
})
@Component({
  selector: 'page-meetings-overview',
  templateUrl: 'meetings-overview.html',
})
export class MeetingsOverviewPage {

  /**
   * The first tab's page controller
   */
  tab1Root = 'ClosedMeetingsOverviewPage';
  /**
   * The seconds tab's page controller
   */
  tab2Root = 'OpenMeetingsOverviewPage';

  constructor() {
  }
}