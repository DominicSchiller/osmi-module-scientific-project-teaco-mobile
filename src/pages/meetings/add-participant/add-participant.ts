import {Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams, TextInput} from 'ionic-angular';
import {UserSessionProvider} from "../../../providers/user-session/user-session";
import {TeaCoApiProvider} from "../../../providers/teaco-api/teaco-api-provider";
import {User} from "../../../models/user";

/**
 * Page Controller for selecting and adding participants
 * to a meeting.
 */
@IonicPage()
@Component({
  selector: 'page-add-participant',
  templateUrl: 'add-participant.html',
})
export class AddParticipantPage {
  /**
   * The page's navigation bar UI element
   */
  @ViewChild(Navbar) navBar: Navbar;
  /**
   * The current entered search term
   */
  protected searchTerm: string;
  /**
   * Status whether the currently entered search term
   * represents a qualified email address or not.
   */
  private isSearchTermQualifiedEmail: boolean = false;
  /**
   * timeout task's ID which will trigger a
   * fetch-request for getting suitable users from TeaCo.
   */
  private waitTimeoutID: number;
  /**
   * List of found users based on the entered search term
   */
  private foundUsers: User[];
  /**
   * Status if any user from the found users
   * is selected or not.
   */
  private isUserSelected: boolean = false;
  /**
   * List of queued users which will be potentially added as participants
   * to the corresponding meeting.
   */
  private queuedParticipants: User[];

  /**
   * Constructor
   * @param navCtrl The app's navigation controller
   * @param navParams The handed navigation params which should contain the user's key
   * @param userSession The app's user session service
   * @param apiService The TeaCo API Service to communicate with the TeaCo server
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private userSession: UserSessionProvider,
              private apiService: TeaCoApiProvider) {
    this.searchTerm = "";
    this.waitTimeoutID = -1;
    this.foundUsers = [];
    this.queuedParticipants = [];
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
      // todo something
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

  /**
   * Callback which handles each search inputs'
   * keypress event.
   */
  private onSearchWordTyped() {
    if(this.waitTimeoutID > -1) {
      clearTimeout(this.waitTimeoutID);
    }
    if(this.searchTerm.length >= 3) {
      this.waitTimeoutID = setTimeout(() => {
        this.performSearch();
      }, 800);
    } else {
      this.foundUsers = [];
    }

    // check if qualified email address
    let atIndex = this.searchTerm.indexOf('@'); // index of @ sign
    let dotIndex = this.searchTerm.lastIndexOf('.');
    let domain = this.searchTerm.substring(atIndex+1, dotIndex);
    let countryCode = this.searchTerm.substr(dotIndex+1);
    this.isSearchTermQualifiedEmail =
        atIndex > 0 &&
        dotIndex > 0 &&
        atIndex < dotIndex &&
        domain.length >=3 &&
        countryCode.length >= 2;
  }

  /**
   * Performs a users lookup on TeaCo.
   */
  private performSearch() {
    this.userSession.getActiveUser().then(activeUser => {
      this.apiService.getUserByEmail(activeUser.key, this.searchTerm)
          .subscribe(users => {
            // init selected property
            users.forEach(user => {
              (<any>user).selected = false;
            });
            this.queuedParticipants.forEach(queuedParticipant => {
              users.forEach(user => {
                if(queuedParticipant.id == user.id) {
                  (<any>user).selected = true;
                }
              });
            });
            this.foundUsers = users;
          }, error => {
            console.log("No users found for search term...");
          });
    });
  }

  /**
   * Verifies if any user from the search results got
   * selected by the user or not.
   */
  private verifySelectedUsers(index: number) {
    (<any>this.foundUsers[index]).selected = !(<any>this.foundUsers[index]).selected;
    this.isUserSelected = this.foundUsers.length > 0 &&
        this.getSelectedUsers().length > 0;
  }

  /**
   * Get all selected user's from the search results.
   */
  private getSelectedUsers(): User[] {
    let checkedResults: User[] = [];
    this.foundUsers.forEach(result => {
      if((<any>result).selected) {
        checkedResults.push(result);
      }
    });
    return checkedResults;
  }

  /**
   * Action callback which removes a certain
   * users from the participants queue.
   * @param index The user's index within the queue
   */
  private onRemoveParticipantFromQueue(index: number) {
    this.queuedParticipants.splice(index, 1);
  }

  /**
   * Add selected users from the search results to the
   * participants queue. If there's no user selected but
   * the email-address is qualified, a new Users with the
   * entered email-address will be added.
   */
  private onAddParticipantsToQueue() {
    let checkedResults = this.getSelectedUsers();
    if(checkedResults.length > 0) {
      checkedResults.forEach(checkedResult => {
        let isContained = false;
        this.queuedParticipants.forEach(queuedUser => {
          if(checkedResult.id == queuedUser.id) {
            isContained = true;
            return;
          }
        });
        if(!isContained) {
          this.queuedParticipants.push(checkedResult);
        }
      });
      this.foundUsers = [];
      this.isUserSelected = false;
    } else {
      // take the search term and create a user from it
      let user = new User();
      user.email = this.searchTerm;
      this.queuedParticipants.push(user);
    }
    this.searchTerm = "";
  }
}
