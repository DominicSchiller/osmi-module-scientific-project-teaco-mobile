import {Component, forwardRef, ViewChild} from '@angular/core';
import {AlertController, IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {Suggestion} from "../../models/suggestion";
import {Meeting} from "../../models/meeting";
import {VoteDecision} from "../../models/vote-decision";
import {DateTimeHelper} from "../../utils/date-time-helper";
import {MeetingUtils} from "../../utils/meeting-utils";
import {LoadingIndicatorComponent} from "../../components/loading-indicator/loading-indicator";
import {FeedbackAlertComponent} from "../../components/feedback-alert/feedback-alert";
import {UserSessionProvider} from "../../providers/user-session/user-session";
import {TeaCoApiProvider} from "../../providers/teaco-api/teaco-api-provider";

/**
 * Page Controller for suggestion details.
 */
@IonicPage({
  segment: 'open-meetings/:meetingId/:suggestionId',
  defaultHistory: ['MeetingDetailPage']
})
@Component({
  selector: 'page-suggestion-details',
  templateUrl: 'suggestion-details.html',
})
export class SuggestionDetailsPage {

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

  private meeting: Meeting;
  private meetingId: number;
  private suggestionId: number;
  private suggestion: Suggestion;
  private suggestionIndex: number;
  private activeUserId: number;
  private voteDecisions: Map<number, string>;

  /**
   * Constructor
   * @param navCtrl The app's navigation controller
   * @param navParams The handed navigation params
   * @param alertCtrl The page's alert controller to create alert and confirmation dialogs
   * @param userSession The app's user session service
   * @param apiService The TeaCo API Service to communicate with the TeaCo server
   */
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private alertCtrl: AlertController,
      private userSession: UserSessionProvider,
      private apiService: TeaCoApiProvider) {
    this.meetingId = this.navParams.get('meetingId');
    this.suggestionId = this.navParams.get('suggestionId');
    this.meeting = this.navParams.get('meeting');
    this.suggestion = this.navParams.get('suggestion');
    this.suggestionIndex = this.navParams.get('suggestionIndex');
    this.activeUserId = this.navParams.get('activeUserId');
    this.voteDecisions = new Map<number, string>();

    this.meeting.participants.forEach(participant => {
      this.suggestion.votes.forEach(vote => {
        if (vote.voterId == participant.id) {
          switch(vote.decision) {
            case VoteDecision.yes:
              this.voteDecisions[participant.id] = 'teaco-voted-yes';
              break;
            case VoteDecision.no:
              this.voteDecisions[participant.id] = 'teaco-voted-no';
              break;
            case VoteDecision.maybe:
              this.voteDecisions[participant.id] = 'teaco-voted-maybe';
              break;
            default:
              this.voteDecisions[participant.id] = 'teaco-voted-dont-know';
              break;
          }
          return;
        }
      });
    });
  }

  ionViewDidLoad() {
    if(!this.navCtrl.canGoBack()){
      this.navCtrl.insert(0, 'MeetingsOverviewPage').then( () => {
        this.navBar._elementRef.nativeElement.children[1].classList.add('show-back-button');
      });
    }
    this.navBar.backButtonClick = (e:UIEvent)=>{
      // todo something
      this.goBack();
    };
  }

  /**
   * Navigate back to the previous screen
   */
  goBack() {
    let headerElement: HTMLElement = document.querySelector('#suggestion-details-page-header');
    headerElement.classList.add('no-bg-image');
    this.navCtrl
        .pop({animate: true,
          animation: 'transition',
          direction: 'back'})
        .then();
  }

  /**
   * Get the suggestion's date as text.
   * @return the suggestion's date
   */
  private getDate(): string {
    return DateTimeHelper.getDateString(this.suggestion.date);
  }

  /**
   * Get the suggestion's time span as text.
   * @return the suggestion's time span
   */
  private getTimeSpan(): string {
    return DateTimeHelper.getTimeString(this.suggestion.startTime) +
      " - " +
    DateTimeHelper.getTimeString(this.suggestion.endTime);
  }

  /**
   * Delete the current suggestion.
   */
  private deleteSuggestion() {
    const alert = this.alertCtrl.create({
      "title": "Teriminvorschlag wirklich löschen?",
      "message": "<br />Du bist dabei diesen Terminvorschlag entgültig zu löschen? Willst du ihn wirklich löschen?",
      buttons: [
        {
          "text": "Ja, Terminvorschlag löschen",
          handler: () => {
            this.loadingIndicator.show();
            this.userSession.getActiveUser().then(activeUser => {
              this.apiService.deleteSuggestion(
                  activeUser.key,
                  this.meeting.id,
                  this.suggestionId
              ).subscribe(() => {
                this.hideLoadingIndicator();
                setTimeout(() => {
                  this.feedbackAlert.presentWith(
                      "Terminvorschlag gelöscht.",
                      "Der Terminvorschlag wurde erfolgreich für alle Teilnehmer entfernt.",
                      "md-trash")
                      .then(() => {
                        this.goBack();
                      });
                });
                this.meeting.suggestions.splice(this.suggestionIndex, 1);
                this.meeting.numberOfSuggestions -= 1;
                console.log("suggestion has been successfully deleted");
                MeetingUtils.recalculateMeetingStatus(this.meeting);
              }, (error) => {
                console.error(error);
                this.hideLoadingIndicator();
              });
            });
            alert.dismiss(true);
            return false;
          }
        },
        {
          "text": "Abbruch",
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Mark or unmark the current suggestion as final.
   */
  private pickSuggestion() {
    this.userSession.getActiveUser().then(activeUser => {
      this.apiService.updateSuggestion(activeUser.key, this.suggestion).subscribe(() => {
        this.feedbackAlert.presentWith(
            !this.suggestion.isPicked ? "Als final markiert" : "Markierung aufgehoben",
            !this.suggestion.isPicked ? "Der Termin wurde erfolgreich als final markiert." : "Die Markierung als entgültiger Terminvorschlag wurde aufgehoben",
            !this.suggestion.isPicked ? "teaco-picked-suggestion" : "teaco-unpicked-suggestion"
            ).then();
        setTimeout(() => {
          this.suggestion.isPicked = !this.suggestion.isPicked; // set the opposite picked status
        }, 200);
      });
    });
  }

  /**
   * Hide the current visible loading indicator.
   */
  private hideLoadingIndicator() {
    setTimeout( () => {
      this.loadingIndicator.hide();
    }, 400);
  }

}
