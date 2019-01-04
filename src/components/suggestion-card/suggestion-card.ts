import {Component, Input} from '@angular/core';
import {Suggestion} from "../../models/suggestion";
import {VoteDecision} from "../../models/vote-decision";
import {SuggestionProgress} from "../../models/suggestion-progress";
import {DateTimeHelper} from "../../utils/date-time-helper";
import {UserSessionProvider} from "../../providers/user-session/user-session";
import {Vote} from "../../models/vote";

/**
 * Generated class for the SuggestionCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'suggestion-card',
  templateUrl: 'suggestion-card.html'
})
export class SuggestionCardComponent {

  /**
   * The associated meeting model
   */
  @Input('suggestion') protected suggestion: Suggestion;

  private progress: SuggestionProgress;
  private userVote: Vote;

  /**
   * Default Constructor
   */
  constructor(private userSession: UserSessionProvider) {
    this.progress = new SuggestionProgress();
  }

  ngOnInit() {
    this.updateProgress();
    this.userVote = this.determineUserVote();
  }

  public updateProgress() {
    let yesVotes = 0;
    let noVotes = 0;
    let maybeVotes = 0;
    let dontKnowVotes = 0;
    let votesSum = 0;

    this.suggestion.votes.forEach(vote => {
      switch(vote.decision) {
        case VoteDecision.yes:
          yesVotes += 1;
          break;
        case VoteDecision.no:
          noVotes += 1;
          break;
        case VoteDecision.maybe:
          maybeVotes += 1;
          break;
        default:
          dontKnowVotes += 1;
          break;
      }
      votesSum += 1;
    });
    this.progress.yes = yesVotes/votesSum;
    this.progress.no = noVotes/votesSum;
    this.progress.maybe = maybeVotes/votesSum;
    this.progress.dontKnow = dontKnowVotes/votesSum;
  }

  private getDate() {
    return DateTimeHelper.getDateString(this.suggestion.date);
  }

  private getTime() {
    return DateTimeHelper.getTimeString(this.suggestion.startTime) + " - " +
        DateTimeHelper.getTimeString(this.suggestion.endTime);
  }

  private determineUserVote() {
    let userVote = undefined;
    let user = this.userSession.activeUser;
    this.suggestion.votes.forEach(vote => {
      if(vote.voterId === user.id) {
        userVote = vote;
        return;
      }
    });
    return userVote;
  }

}
