import {Component, Input} from '@angular/core';
import {User} from "../../../models/user";
import {ParticipantsManagerDelegate} from "./participants-manager-delegate";
import {UserSessionProvider} from "../../../providers/user-session/user-session";
import {TeaCoApiProvider} from "../../../providers/teaco-api/teaco-api-provider";

/**
 * Custom component dedicated to manage participants associated to
 * a meeting. It includes a search field as well as a list showing all
 * already invited participants and offers capabilities for adding or removing
 * those.
 */
@Component({
  selector: 'participants-manager',
  templateUrl: 'participants-manager.html'
})
export class ParticipantsManager {
  /**
   * The associated delegate to call in case of added participants
   */
  @Input('delegate') delegate: ParticipantsManagerDelegate;

  /**
   * Status whether the app is searching for existing participants or not.
   */
  private isSearching: boolean;
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
  @Input('participants') participants: User[];

  private queuedParticipantsToInvite: User[];

  private queuedParticipantsToRemove: User[];

  constructor(private userSession: UserSessionProvider, private apiService: TeaCoApiProvider) {
    this.isSearching = false;
    this.searchTerm = "";
    this.waitTimeoutID = -1;
    this.foundUsers = [];
    this.participants = [];
    this.queuedParticipantsToInvite = [];
    this.queuedParticipantsToRemove = [];
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
    this.isSearching = true;
    this.userSession.getActiveUser().then(activeUser => {
      this.apiService.getUserByEmail(activeUser.key, this.searchTerm)
          .subscribe(users => {
            // init selected property
            users.forEach(user => {
              (<any>user).selected = false;
            });
            this.participants.forEach(queuedParticipant => {
              users.forEach(user => {
                if(queuedParticipant.id == user.id) {
                  (<any>user).selected = true;
                }
              });
            });
            this.foundUsers = users;
            setTimeout(() => {
              this.isSearching = false;
            }, 200);
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
  private onRemoveSelected(index: number) {
    let participant = this.participants[index];

    for(let i=0; i<this.queuedParticipantsToRemove.length; i++) {
      if(this.queuedParticipantsToRemove[i].id === participant.id) {
        this.queuedParticipantsToRemove.splice(i, 1);
        return;
      }
    }

    // this.participants.splice(index, 1);
    let ignore = false;
    for(let i=0; i<this.queuedParticipantsToInvite.length; i++) {
      if(this.queuedParticipantsToInvite[i].id === participant.id) {
        ignore = true;
        this.queuedParticipantsToInvite.splice(i, 1);
        this.participants.splice(index, 1);
        break;
      }
    }
    if(!ignore) {
      this.queuedParticipantsToRemove.push(participant);
    }
  }

  private isContainedInRemoveQueue(participant: User): boolean {
    for(let i=0; i<this.queuedParticipantsToRemove.length; i++) {
      if(this.queuedParticipantsToRemove[i].id === participant.id) {
       return true;
      }
    }
    return false;
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
        this.participants.forEach(queuedUser => {
          if(checkedResult.id == queuedUser.id) {
            isContained = true;
            return;
          }
        });
        if(!isContained) {
          this.participants.push(checkedResult);
          this.queuedParticipantsToInvite.push(checkedResult);
        }
      });
      this.foundUsers = [];
      this.isUserSelected = false;
    } else {
      // take the search term and create a user from it
      let participant = new User();
      participant.email = this.searchTerm;
      this.participants.push(participant);
      this.queuedParticipantsToInvite.push(participant);
    }
    this.searchTerm = "";
  }
}
