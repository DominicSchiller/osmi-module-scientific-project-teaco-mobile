import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the ClosedMeetingsOverviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-closed-meetings-overview',
  templateUrl: 'closed-meetings-overview.html',
})
export class ClosedMeetingsOverviewPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClosedMeetingsOverviewPage');
  }

}
