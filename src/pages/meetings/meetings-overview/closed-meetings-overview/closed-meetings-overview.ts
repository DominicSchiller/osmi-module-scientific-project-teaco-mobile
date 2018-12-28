import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

/**
 * Page Controller for listing all closed meetings.
 */
@Component({
  selector: 'page-closed-meetings-overview',
  templateUrl: 'closed-meetings-overview.html',
})
export class ClosedMeetingsOverviewPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

}
