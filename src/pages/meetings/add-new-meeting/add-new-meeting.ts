import {Component, EventEmitter} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OpenMeetingsOverviewPage } from '../meetings-overview/open-meetings-overview/open-meetings-overview';
import {Meeting} from "../../../models/meeting";
import {User} from "../../../models/user";
import {UserSessionProvider} from "../../../providers/user-session/user-session";
import {AddParticipantPage} from "../add-participant/add-participant";
import {AddNewSuggestionPage} from "../add-new-suggestion/add-new-suggestion";

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

  closeModal(){
    this.navCtrl.pop().then();
  }

  goToAddParticipantPage() {
    this.navCtrl.push(AddParticipantPage,
        {},
        {animate:true,animation:'transition',duration:500,direction:'forward'}).then();
  }

  goToAddSuggestionPage() {
    this.navCtrl.push(AddNewSuggestionPage,
        {},
        {animate:true,animation:'transition',duration:500,direction:'forward'}).then();
  }

  private onTitleEntered(event: EventEmitter<any>) {
    this.title = event[0];
    console.log("Title entered: ", this.title);
  }

  private onLocationEntered(event: EventEmitter<any>) {
    this.location = event[0];
    console.log("Location entered: ", this.location);
  }

  private onCommentEntered(event: EventEmitter<any>) {
    this.comment = event[0];
    console.log("Comment entered: ", this.comment);
  }
}
