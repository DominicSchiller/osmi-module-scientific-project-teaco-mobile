import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OpenMeetingsOverviewPage } from '../meetings-overview/open-meetings-overview/open-meetings-overview';

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

  private title: string;
  private date: string;
  private startTime: string;
  private endTime: string;
  private comment: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToMeetingsOverview(){
    this.navCtrl.setRoot(OpenMeetingsOverviewPage).then();
  }

  private onTitleEntered(title: string) {
    this.title = title;
    console.log("Title entered: ", this.title);
  }

  private onDateEntered(date: string) {
    this.date = date;
    console.log("Date entered: ", this.date);
  }

  private onStartTimeEntered(time: string) {
    this.startTime = time;
    console.log("Start time entered: ", this.startTime);
  }

  private onEndTimeEntered(time: string) {
    this.endTime = time;
    console.log("End time entered: ", this.endTime);
  }

  private onCommentEntered(comment: string) {
    this.comment = comment;
    console.log("Comment entered: ", this.comment);
  }
}
