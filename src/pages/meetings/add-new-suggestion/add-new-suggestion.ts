import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { MeetingsOverviewPage } from '../meetings-overview/meetings-overview';
import { OpenMeetingsOverviewPage } from '../meetings-overview/open-meetings-overview/open-meetings-overview';

/**
 * Generated class for the AddNewSuggestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-add-new-suggestion',
  templateUrl: 'add-new-suggestion.html',
})
export class AddNewSuggestionPage {

  private title: string;
  private date: string;
  private startTime: string;
  private endTime: string;
  private comment: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  goToMeetingsOverview() {
    this.navCtrl.setRoot(MeetingsOverviewPage).then();
    this.showAlertInfo();
  }

  private onTitleEntered(title: string) {
    this.title = title;
    console.log("Title entered: ", this.title);
  }

  private onDateEntered(date: string) {
    this.date = date;
    console.log("Date entered: ", this.date);
    return this.date
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewSuggestionPage');
  }


  showAlertInfo() {
    const alert = this.alertCtrl.create({
      title: 'Terminvorschlag wurde angelegt!',
      message: 'Dein Termin am xxxx eingetragen',
      buttons: [
        {
          text: 'Okay!',
          handler: data => {
            this.navCtrl.setRoot(OpenMeetingsOverviewPage).then();
          }
        }
      ]
    });
    alert.present();
  }
}
