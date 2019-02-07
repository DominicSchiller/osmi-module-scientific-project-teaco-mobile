import {Component, EventEmitter} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Meeting} from "../../../models/meeting";
import {User} from "../../../models/user";
import {UserSessionProvider} from "../../../providers/user-session/user-session";
import {TeaCoApiProvider} from "../../../providers/teaco-api/teaco-api-provider";
import {EditMeetingEventDelegate} from "./edit-meeting-event-delegate";
import {Suggestion} from "../../../models/suggestion";
import {TeaCoSyncMode} from "../../../models/teaco-sync-mode";

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
export class AddNewMeetingPage implements EditMeetingEventDelegate {

  private meeting: Meeting;
  private location: string;
  private comment: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userSession: UserSessionProvider,
    private apiService: TeaCoApiProvider) {
    this.meeting = new Meeting();
    console.warn(this.meeting);
  }

  ngOnInit() {
  }

  closeModal(){
    this.navCtrl.pop().then();
  }

  goToAddParticipantPage() {
    this.navCtrl.push('AddParticipantPage',
        {
          "delegate": this
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
    console.log("Title entered: ", this.meeting.title);
  }

  private onLocationEntered(event: EventEmitter<any>) {
    this.meeting.location = event[0];
    console.log("Location entered: ", this.meeting.location);
  }

  private onCommentEntered(event: EventEmitter<any>) {
    this.comment = event[0];
    console.log("Comment entered: ", this.comment);
  }

  private createMeeting() {
    this.userSession.getActiveUser().then(activeUser => {
      this.apiService.createMeeting(activeUser.key, this.meeting)
          .subscribe(meeting => {
              this.closeModal();
          });
    });
  }

  onParticipantsAdded(participants: User[]) {
    this.meeting.participants = participants;
  }

  onSuggestionCreated(suggestion: Suggestion) {
    console.log("Retrieved suggestion", suggestion);
    this.meeting.suggestions.push(suggestion);
    console.warn(this.meeting);
  }
}
