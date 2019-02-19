import {Component, ViewChild} from '@angular/core';
import {Events, IonicPage, NavParams, Tabs} from 'ionic-angular';
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
   * The tab view UI component
   */
  @ViewChild('tabView') tabRef: Tabs;
  /**
   * The first tab's page controller
   */
  tab1Root = 'ClosedMeetingsOverviewPage';
  /**
   * The seconds tab's page controller
   */
  tab2Root = 'OpenMeetingsOverviewPage';

  private defaultIndex: number = 1;

  /**
   * Constructor
   * @param events The app's global events system
   */
  constructor(private navParams: NavParams, private events: Events) {
    if(this.navParams.get('meetingId') > -1) {
      this.defaultIndex = 0;
    }

    this.events.subscribe('switchToTab', (tabIndex: number) => {
      this.tabRef.select(tabIndex).then();
    });
  }
}