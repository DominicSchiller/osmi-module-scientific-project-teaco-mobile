import {Component, EventEmitter, ViewChild} from '@angular/core';
import {NavController, NavParams, AlertController, Navbar} from 'ionic-angular';
import { MeetingsOverviewPage } from '../meetings-overview/meetings-overview';
import { OpenMeetingsOverviewPage } from '../meetings-overview/open-meetings-overview/open-meetings-overview';
import {AddNewMeetingPage} from "../add-new-meeting/add-new-meeting";

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

  /**
   * The page's navigation bar UI element
   */
  @ViewChild(Navbar) navBar: Navbar;

  private isModalDialog: boolean = false;

  private date: string;
  private startTime: string;
  private endTime: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.isModalDialog = this.navCtrl.getActive().component.name !== 'AddNewMeetingPage';
    console.warn(this.isModalDialog);
  }

  ionViewDidLoad() {
    this.navBar.hideBackButton = this.isModalDialog;
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.goBack();
    }
  }

  /**
   * Navigate back to the previous screen
   */
  goBack() {
    this.navCtrl.pop(
        {animate:true,animation:'transition', direction:'back'}).then();
  }

  closeModal() {
    this.navCtrl.pop().then();
  }

  private goToMeetingsOverview() {
    this.navCtrl.setRoot(MeetingsOverviewPage).then();
    this.showAlertInfo();
  }

  private onDateEntered(event: EventEmitter<any>) {
    this.date = event[0];
    console.log("Date entered: ", this.date);
    return this.date
  }

  private onStartTimeEntered(event: EventEmitter<any>) {
    this.startTime = event[0];
    console.log("Start time entered: ", this.startTime);
  }

  private onEndTimeEntered(event: EventEmitter<any>) {
    this.endTime = event[0];
    console.log("End time entered: ", this.endTime);
  }

  private showAlertInfo() {
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
