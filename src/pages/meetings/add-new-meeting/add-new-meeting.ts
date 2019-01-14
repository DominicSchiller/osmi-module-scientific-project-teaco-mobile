import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OpenMeetingsOverviewPage } from '../meetings-overview/open-meetings-overview/open-meetings-overview';
import {Meeting} from "../../../models/meeting";
import {User} from "../../../models/user";
import {UserSessionProvider} from "../../../providers/user-session/user-session";

/**
 * Generated class for the AddNewMeetingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-new-meeting',
  templateUrl: 'add-new-meeting.html',
})
export class AddNewMeetingPage {

  private participants: User[];

  private title: string;
  private location: string;
  private comment: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, userSession: UserSessionProvider) {
    this.participants = [];
    this.participants.push(userSession.activeUser);
    for (let i=0; i<14; i++) {
      this.participants.push(userSession.activeUser);
    }
  }

  goToMeetingsOverview(){
    this.navCtrl.setRoot(OpenMeetingsOverviewPage).then();
  }

  private onTitleEntered(title: string) {
    this.title = title;
    console.log("Title entered: ", this.title);
  }

  private onLocationEntered(location: string) {
    this.location = location;
  }

  private onCommentEntered(comment: string) {
    this.comment = comment;
    console.log("Comment entered: ", this.comment);
  }
}
