import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Navbar, AlertController, ToastController } from 'ionic-angular';
import { Meeting } from "../../../models/meeting";
import { TeaCoApiProvider } from "../../../providers/teaco-api/teaco-api-provider";
import { UserSessionProvider } from "../../../providers/user-session/user-session";
import { AddNewSuggestionPage } from '../add-new-suggestion/add-new-suggestion';
import { MeetingsOverviewPage } from '../meetings-overview/meetings-overview';
import { DateTimeHelper } from "../../../utils/date-time-helper";

/**
 * Page Controller for meeting details.
 */
@Component({
  selector: 'page-meeting-detail',
  templateUrl: 'meeting-detail.html',
})
export class MeetingDetailPage {

  /**
   * The page's navigation bar UI element
   */
  @ViewChild(Navbar) navBar: Navbar;
  /**
   * The meeting to display all detailed information and suggestions for
   */
  protected meeting: Meeting;

  constructor(private navCtrl: NavController, private navParams: NavParams, private apiService: TeaCoApiProvider, userSession: UserSessionProvider,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController) {
    this.meeting = this.navParams.data;

    // load participants and suggestions
    this.apiService.getMeeting(userSession.activeUser.key, this.meeting.id).subscribe(meeting => {
      this.meeting.participants = meeting.participants;
      this.meeting.suggestions = meeting.suggestions;
    })
  }

  ionViewDidLoad() {
    let headerElement: HTMLElement = document.querySelector('#meeting-details-page-header');
    headerElement.classList.add('no-bg-image');

    this.navBar.backButtonClick = (e:UIEvent)=>{
      // todo something
      this.goBack();
    }
  }

  /**
   * Navigate back to the previous screen
   */
  goBack() {
    let headerElement: HTMLElement = document.querySelector('#meeting-details-page-header');
    headerElement.classList.add('no-bg-image');
    this.navCtrl.pop(
        {animate:true,animation:'transition', direction:'back'}).then();
  }


   /**
   * Navigate to the "Add New Suggestion" page.
   */
  private goToNewSuggestionPage(){
    this.navCtrl.push(AddNewSuggestionPage).then();
  }

  /**
   * Navigate to the "MeetingsOverviewPage" page.
   */
  private goToMeetingsOverview(){
    this.navCtrl.setRoot(MeetingsOverviewPage).then();
  }

    /**
   * Showing the available Options for choosing one of them.
   */
  private showCheckBoxFinalTermin() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Finaler Termin');
    alert.setSubTitle('wählen Sie einen finalen Termin aus');

    for (let i = 0; i < this.meeting.suggestions.length; i++) {
      console.log(this.meeting.suggestions[i].date);
      alert.addInput({
        type: 'radio',
        label: this.getDate(i) + ' von ' + this.getStartTime(i) + ' - ' + this.getEndTime(i),
        value: this.getDate(i) + ' von ' + this.getStartTime(i) + ' - ' + this.getEndTime(i),
        checked: false
      });
    }

    alert.addButton({
      text: 'okay',
      handler: (data: string) => {
        if (data == null) {
          this.toastMessage();
        } else {
          console.log(data); //for testing purpose
          setTimeout(() => {
            this.goToMeetingsOverview();
          }, 500);
        }
      }
    });
    alert.present();
  }

  /**
   Shows a Message to the User if he did not choose a final Suggestion from the Options
   **/
  toastMessage() {
    let warning = this.toastCtrl.create({
      message: 'Sie haben kein Termin ausgewählt. Bitte wählen Sie ein Termin aus!',
      closeButtonText: 'Schließen',	
      showCloseButton: true,
      duration: 3000,
      position: 'middle'
    });
    warning.present();
  }

  /**
   * Get the Date Formated.
   * @param date get the specific date from array
   */
  private getDate(date: any) {
    return DateTimeHelper.getDateString(this.meeting.suggestions[date].date);
  }

  /**
   * Get the STart Time Formated.
   * @param startTime  get the strt time date from array
   */
  private getStartTime(startTime: any) {
    return DateTimeHelper.getTimeString(this.meeting.suggestions[startTime].startTime);
  }

  /**
   * Get the End Date Formated.
   * @param endTime get the end Time from array
   */
  private getEndTime(endTime: any) {
    return DateTimeHelper.getTimeString(this.meeting.suggestions[endTime].endTime);
  }
}
