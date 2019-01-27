import {Component, EventEmitter, ViewChild} from '@angular/core';
import {NavController, NavParams, AlertController, Navbar, IonicPage} from 'ionic-angular';
import {TeaCoApiProvider} from '../../../providers/teaco-api/teaco-api-provider';
import { UserSessionProvider } from "../../../providers/user-session/user-session";
import { Meeting } from '../../../models/meeting';
import {Suggestion} from '../../../models/suggestion';

/**
 * Generated class for the AddNewSuggestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage({
  defaultHistory: ['MeetingsOverviewPage']
})
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
  private meeting: Meeting;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public apiService:TeaCoApiProvider, private userSession: UserSessionProvider) {
    if(this.navCtrl.getActive() !== undefined) {
      this.isModalDialog = this.navCtrl.getActive().component.name !== 'AddNewMeetingPage';
    } else {
      this.isModalDialog = true;
    }
    this.meeting = this.navParams.data;
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
    this.navCtrl.setRoot('MeetingsOverviewPage').then();
    this.showAlertInfo();
  }

  public onDateEntered(event: EventEmitter<any>) {
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


  /**
   * Show Alert of Success created new Suggestion. 
   * Navigate to the Meetings Page.
   */
  private showAlertInfo() {
    const alert = this.alertCtrl.create({
      title: 'Terminvorschlag wurde angelegt!',
      message: 'Dein Termin am ' + this.date + ' um ' + this.startTime + ' - ' + this.endTime + ' wurde eingetragen',
      buttons: [
        {
          text: 'Okay!',
        }
      ]
    });
    alert.present();
  }


  /**
   * Add new Suggestion with new Date, Start Time and Endtime 
   * Navigate to the Suggestions Page for the specific Meeting 
   */
  postSuggestion(){
    this.apiService.postNewSuggestion(this.userSession.activeUser.key, this.meeting.id, this.date, this.startTime, this.endTime)
    .subscribe((data) =>{ 
      return data
    })
    if(this.date!= null && this.startTime!= null && this.endTime != null){
      //call the Success Alert Function (to navigate to Meetings Page)
      this.goToMeetingsOverview();
    }
  }
}
