import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import { ClosedMeetingsOverviewPage } from './closed-meetings-overview/closed-meetings-overview';
import {OpenMeetingsOverviewPage} from "./open-meetings-overview/open-meetings-overview";


/**
 * Generated class for the MeetingsOverviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-meetings-overview',
  templateUrl: 'meetings-overview.html',
})
export class MeetingsOverviewPage {

  tab1Root = ClosedMeetingsOverviewPage;
  tab2Root = OpenMeetingsOverviewPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MeetingsOverviewPage');
  }

}
