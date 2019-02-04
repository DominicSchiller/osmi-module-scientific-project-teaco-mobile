import {Component, EventEmitter} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Meeting} from "../../../models/meeting";
import {User} from "../../../models/user";
import {UserSessionProvider} from "../../../providers/user-session/user-session";
import {TeaCoApiProvider} from "../../../providers/teaco-api/teaco-api-provider";

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
export class AddNewMeetingPage {

  private meeting: Meeting;
  private location: string;
  private comment: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userSession: UserSessionProvider,
    private apiService: TeaCoApiProvider) {
    this.meeting = new Meeting();
  }

  ngOnInit() {
  }

  closeModal(){
    this.navCtrl.pop().then();
  }

  goToAddParticipantPage() {
    this.navCtrl.push('AddParticipantPage',
        {},
        {animate:true,animation:'transition',duration:500,direction:'forward'}).then();
  }

  goToAddSuggestionPage() {
    this.navCtrl.push('AddNewSuggestionPage',
        {},
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
}
