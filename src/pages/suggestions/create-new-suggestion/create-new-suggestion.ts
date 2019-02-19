import {Component, EventEmitter, forwardRef, ViewChild} from '@angular/core';
import {AlertController, IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {TeaCoApiProvider} from '../../../providers/teaco-api/teaco-api-provider';
import {UserSessionProvider} from "../../../providers/user-session/user-session";
import {Meeting} from '../../../models/meeting';
import {InputCardComponent} from "../../../components/general/input-card/input-card";
import {DateTimeHelper} from "../../../utils/date-time-helper";
import {TeaCoSyncMode} from "../../../models/teaco-sync-mode";
import {Suggestion} from "../../../models/suggestion";
import {CreateSuggestionEventDelegate} from "./create-suggestion-event-delegate";
import {LoadingIndicatorComponent} from "../../../components/general/loading-indicator/loading-indicator";

/**
 * Generated class for the CreateNewSuggestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage({
  defaultHistory: ['MeetingsOverviewPage']
})
@Component({
  selector: 'page-create-new-suggestion',
  templateUrl: 'create-new-suggestion.html',
})
export class CreateNewSuggestionPage {

  /**
   * loading indicator UI component
   */
  @ViewChild(forwardRef(() => LoadingIndicatorComponent)) loadingIndicator: LoadingIndicatorComponent;

  /**
   * The page's navigation bar UI element
   */
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild('datePicker') datePicker: InputCardComponent;
  @ViewChild('durationPicker') durationPicker: InputCardComponent;
  @ViewChild('startTimePicker') startTimePicker: InputCardComponent;
  @ViewChild('endingTimePicker') endingTimePicker: InputCardComponent;

  private delegate: CreateSuggestionEventDelegate;

  private readonly isModalDialog: boolean = false;
  private isInputWrong: boolean = true;
  private meeting: Meeting;
  private syncMode: TeaCoSyncMode;

  constructor(
      private navCtrl: NavController,
      private navParams: NavParams,
      private alertCtrl: AlertController,
      private apiService:TeaCoApiProvider,
      private userSession: UserSessionProvider) {
    if(this.navCtrl.getActive() !== undefined) {
      this.isModalDialog = this.navCtrl.getActive().component.name !== 'CreateNewMeetingPage';
    } else {
      this.isModalDialog = true;
    }
    this.meeting = this.navParams.get('meeting');
    let syncMode = this.navParams.get('syncMode');
    this.syncMode =  syncMode !== undefined ? syncMode : TeaCoSyncMode.syncData;
    this.delegate = this.navParams.get('delegate');
  }

  ionViewDidLoad() {
    this.navBar.hideBackButton = this.isModalDialog;
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.goBack();
    };
  }

  /**
   * Navigate back to the previous screen.
   */
  goBack() {
    this.navCtrl.pop(
        {animate:true,animation:'transition', direction:'back'}).then();
  }

  /**
   * Close modal dialog.
   */
  closeModal() {
    this.navCtrl.pop().then();
  }

  public onDateEntered() {
    this.validateCanCreateSuggestionState();
  }

  private onStartTimeEntered(event: EventEmitter<any>) {
    let startTime = event[0];
    this.durationPicker.setMaxTime(
        DateTimeHelper.subtractTimeStrings(
            "24:00",
            startTime
        )
    );
    this.durationPicker.setMinTime("0:00");
    if(this.endingTimePicker.value.length > 0) {
      this.durationPicker.value = DateTimeHelper.subtractTimeStrings(
          this.endingTimePicker.value,
          startTime
      );
    } else if(this.durationPicker.value.length > 0) {
      this.endingTimePicker.value = DateTimeHelper.addTimeStrings(
          startTime,
          this.durationPicker.value
      );
    }
    this.validateCanCreateSuggestionState();
  }

  private onEndTimeEntered(event: EventEmitter<any>) {
    let endingTime = event[0];
    if(this.startTimePicker.value.length > 0) {
      this.durationPicker.value = DateTimeHelper.subtractTimeStrings(
          endingTime,
          this.startTimePicker.value
      );
    } else if(this.durationPicker.value.length > 0) {
      this.startTimePicker.value = DateTimeHelper.subtractTimeStrings(
          endingTime,
          this.durationPicker.value
      );
    }
    this.validateCanCreateSuggestionState();
  }

  private onDurationEntered(event: EventEmitter<any>) {
    let duration = event[0];
    if(this.startTimePicker.value.length > 0) {
      this.endingTimePicker.value = DateTimeHelper.addTimeStrings(
          this.startTimePicker.value,
          this.durationPicker.value
      );
    } else if(this.endingTimePicker.value.length > 0) {
      this.startTimePicker.value = DateTimeHelper.subtractTimeStrings(
          this.endingTimePicker.value,
          duration
      );
    }
    this.validateCanCreateSuggestionState();
  }

  /**
   * Check whether the 'create suggestion' button can be enabled or not.
   */
  private validateCanCreateSuggestionState() {
    this.isInputWrong =
        this.datePicker.value.length == 0 ||
        this.startTimePicker.value.length == 0 ||
        this.endingTimePicker.value.length == 0 ||
        (
            DateTimeHelper.getHours(this.startTimePicker.value) >
            DateTimeHelper.getHours(this.endingTimePicker.value)
        )
  }

  /**
   * Add new Suggestion with new Date, Start Time and ending time
   * Navigate to the Suggestions Page for the specific Meeting 
   */
  createSuggestion(){
    switch(this.syncMode) {
      case TeaCoSyncMode.syncData:
        this.loadingIndicator.show();
        this.userSession.getActiveUser().then(activeUser => {
          this.apiService.createSuggestion(
              activeUser.key,
              this.meeting.id,
              this.datePicker.value,
              this.startTimePicker.value,
              this.endingTimePicker.value)
              .subscribe(suggestion => {
                // TODO show success alert
                // TODO return created suggestion to previous screen
                setTimeout( () => {
                  this.loadingIndicator.hide();
                  setTimeout(() => {
                    this.triggerDelegateAndClose(suggestion);
                  }, 400);
                }, 400);
              }, error => {
                this.loadingIndicator.hide();
                alert('Es kam bei der Datenübermittlung zu einem unerwarteten Fehler. Bitte stell sicher, dass du Internetzugang hast.');
              });
        });
        break;
      case TeaCoSyncMode.noDataSync:
        this.userSession.getActiveUser().then(activeUser => {
          let suggestion = new Suggestion();
          suggestion.creatorId = activeUser.id;
          suggestion.date = DateTimeHelper.getDate(this.datePicker.value, "0:0");
          suggestion.startTime = DateTimeHelper.getDate(this.datePicker.value, this.startTimePicker.value);
          suggestion.endTime = DateTimeHelper.getDate(this.datePicker.value, this.endingTimePicker.value);
          this.triggerDelegateAndClose(suggestion);
        });
        break;
    }
  }

  private triggerDelegateAndClose(suggestion: Suggestion) {
    if(this.delegate !== undefined) {
      this.delegate.onSuggestionCreated(suggestion);
    }
    if(this.isModalDialog) {
      this.closeModal();
    } else {
      this.goBack();
    }
  }
}
