import {Component, forwardRef, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {UserSessionProvider} from "../../../providers/user-session/user-session";
import {TeaCoApiProvider} from "../../../providers/teaco-api/teaco-api-provider";
import {User} from "../../../models/user";
import {ParticipantsManagerDelegate} from "../../../components/participants/participants-manager/participants-manager-delegate";
import {Meeting} from "../../../models/meeting";
import {LoadingIndicatorComponent} from "../../../components/general/loading-indicator/loading-indicator";
import {FeedbackAlertComponent} from "../../../components/general/feedback-alert/feedback-alert";
import {ParticipantsManager} from "../../../components/participants/participants-manager/participants-manager";

/**
 * Page Controller for selecting and adding participants
 * to a meeting.
 */
@IonicPage()
@Component({
  selector: 'page-add-participant',
  templateUrl: 'add-participant.html',
})
export class AddParticipantPage implements ParticipantsManagerDelegate {
  /**
   * The page's navigation bar UI element
   */
  @ViewChild(Navbar) navBar: Navbar;
  /**
   * loading indicator UI component
   */
  @ViewChild(forwardRef(() => LoadingIndicatorComponent)) loadingIndicator: LoadingIndicatorComponent;
  /**
   * feedback alert UI component for displaying succeeded or failed REST api calls
   */
  @ViewChild(forwardRef(() => FeedbackAlertComponent)) feedbackAlert: FeedbackAlertComponent;

  @ViewChild(ParticipantsManager) participantsManager: ParticipantsManager;
  /**
   * The associated meeting
   */
  private meeting: Meeting;

  private participants: User[];

  /**
   * Status whether this page has been entered as modal dialog or not
   */
  private readonly isModalDialog: boolean = false;


  /**
   * Constructor
   * @param navCtrl The app's navigation controller
   * @param navParams The handed navigation params
   * @param userSession The app's user session service
   * @param apiService The TeaCo API Service to communicate with the TeaCo server
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private userSession: UserSessionProvider,
              private apiService: TeaCoApiProvider) {
    this.meeting = this.navParams.get('meeting');
    // check if page is launched as modal dialog
    if(this.navCtrl.getActive() !== undefined) {
      this.isModalDialog = this.navCtrl.getActive().component.name !== 'CreateNewMeetingPage';
    } else {
      this.isModalDialog = true;
    }
  }

  ionViewDidLoad() {
    this.navBar.hideBackButton = this.isModalDialog;
    this.navBar.backButtonClick = (e:UIEvent)=>{
      // todo something
      this.goBack();
    };

    // init user list
    if(this.meeting && this.meeting.id > -1 && this.meeting.participants.length == 0) {
      this.loadingIndicator.show();
      this.userSession.getActiveUser().then(activeUser => {
        this.apiService.getAllParticipants(activeUser.key, this.meeting.id)
            .subscribe(participants => {
              this.participants = participants;
              setTimeout(() => {
                this.loadingIndicator.hide();
              }, 400);
            });
      });
    }
  }

  /**
   * Navigate back to the previous screen
   */
  private goBack() {
    this.navCtrl.pop(
        {animate:true,animation:'transition', direction:'back'}).then();
  }

  /**
   * Close modal dialog.
   */
  private closeModal() {
    this.navCtrl.pop().then();
  }

  /**
   * Finish adding participants.
   */
  private finish() {
    this.loadingIndicator.show();
    this.userSession.getActiveUser().then(activeUser => {
      this.apiService.addParticipants(activeUser.key, this.meeting.id, this.participants)
          .subscribe(() => {
            setTimeout(() => {
              this.loadingIndicator.hide();
              this.feedbackAlert.presentWith(
                  "Teilnehmer hinzugefügt",
                  "Der Teilnehmer wurde erfolgreich zur Abstimmung hinzugefügt.",
                  "teaco-user")
                  .then(() => {
                    this.goBack();
                  });
            }, 400);
          });
    });
  }

  onParticipantsInvited(participants: User[]) {
    setTimeout(() => {
      this.loadingIndicator.hide();
    });
    this.meeting.numberOfParticipants += participants.length;
  }

  onParticipantsUninvited(participants: User[]) {
    setTimeout(() => {
      this.loadingIndicator.hide();
    });
    this.meeting.numberOfParticipants -= participants.length;
  }

  onSendParticipantsUpdate() {
    this.loadingIndicator.show();
  }
}
