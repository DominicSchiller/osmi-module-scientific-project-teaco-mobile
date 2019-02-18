import {Component, EventEmitter, forwardRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Meeting} from "../../../models/meeting";
import {UserSessionProvider} from "../../../providers/user-session/user-session";
import {TeaCoApiProvider} from "../../../providers/teaco-api/teaco-api-provider";
import {Suggestion} from "../../../models/suggestion";
import {CreateSuggestionEventDelegate} from "../../suggestions/create-new-suggestion/create-suggestion-event-delegate";
import {CreateMeetingEventDelegate} from "./create-meeting-event-delegate";
import {LoadingIndicatorComponent} from "../../../components/general/loading-indicator/loading-indicator";

/**
 * Generated class for the CreateNewMeetingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-create-new-meeting',
  templateUrl: 'create-new-meeting.html',
})
export class CreateNewMeetingPage {

  /**
   * loading indicator UI component
   */
  @ViewChild(forwardRef(() => LoadingIndicatorComponent)) loadingIndicator: LoadingIndicatorComponent;


  private delegate: CreateMeetingEventDelegate;

  private meeting: Meeting;
  private location: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userSession: UserSessionProvider,
    private apiService: TeaCoApiProvider) {
    this.meeting = new Meeting();
    this.delegate = navParams.get('delegate');
  }

  ngOnInit() {
  }

  closeModal(){
    this.navCtrl.pop().then();
  }

  private onTitleEntered(event: EventEmitter<any>) {
    this.meeting.title = event[0];
  }

  private onLocationEntered(event: EventEmitter<any>) {
    this.meeting.location = event[0];
  }

  private createMeeting() {
    this.loadingIndicator.show();
    this.userSession.getActiveUser().then(activeUser => {
      this.apiService.createMeeting(activeUser.key, this.meeting)
          .subscribe(meeting => {
            setTimeout( () => {
              this.loadingIndicator.hide();
              if(this.delegate !== undefined) {
                this.delegate.onMeetingCreated(meeting);
              }
              this.navCtrl.pop().then(() => {
                if(this.delegate) {
                  this.delegate.onShowMeetingDetail(meeting);
                }
              });
            }, 400);
          });
    });
  }
}
