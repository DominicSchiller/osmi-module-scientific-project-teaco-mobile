import {Component, EventEmitter} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Meeting} from "../../../models/meeting";
import {User} from "../../../models/user";
import {UserSessionProvider} from "../../../providers/user-session/user-session";
import {TeaCoApiProvider} from "../../../providers/teaco-api/teaco-api-provider";
import {Suggestion} from "../../../models/suggestion";
import {TeaCoSyncMode} from "../../../models/teaco-sync-mode";
import {CreateSuggestionEventDelegate} from "../add-new-suggestion/create-suggestion-event-delegate";
import {AddParticipantsEventDelegate} from "../add-participant/add-participants-event-delegate";
import {CreateMeetingEventDelegate} from "./create-meeting-event-delegate";

/**
 * Generated class for the AddNewMeetingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-new-meeting',
  templateUrl: 'add-new-meeting.html',
})
export class AddNewMeetingPage implements CreateSuggestionEventDelegate, AddParticipantsEventDelegate {

  private delegate: CreateMeetingEventDelegate;

  private meeting: Meeting;
  private location: string;
  private comment: string;

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

  goToAddParticipantPage() {
    this.navCtrl.push('AddParticipantPage',
        {
          'meeting': this.meeting,
          'delegate': this
        },
        {animate:true,animation:'transition',duration:500,direction:'forward'}).then();
  }

  goToAddSuggestionPage() {
    this.navCtrl.push('AddNewSuggestionPage',
        {
          'syncMode': TeaCoSyncMode.noDataSync,
          'delegate': this
        },
        {animate:true,animation:'transition',duration:500,direction:'forward'}).then();
  }

  private onTitleEntered(event: EventEmitter<any>) {
    this.meeting.title = event[0];
  }

  private onLocationEntered(event: EventEmitter<any>) {
    this.meeting.location = event[0];
  }

  private onCommentEntered(event: EventEmitter<any>) {
    this.comment = event[0];
  }

  private createMeeting() {
    this.userSession.getActiveUser().then(activeUser => {
      this.apiService.createMeeting(activeUser.key, this.meeting)
          .subscribe(meeting => {
            if(this.delegate !== undefined) {
              this.delegate.onMeetingCreated(meeting);
            }
            this.closeModal();
          });
    });
  }

  onParticipantsAdded(meetingId:number, participants: User[]) {
    this.meeting.participants = participants;
  }

  onSuggestionCreated(suggestion: Suggestion) {
    console.log("Retrieved suggestion", suggestion);
    this.meeting.suggestions.push(suggestion);
    console.warn(this.meeting);
  }
}
