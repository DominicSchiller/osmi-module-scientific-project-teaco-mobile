import {Component, Input, SimpleChange, SimpleChanges, ViewChild} from '@angular/core';
import {Vote} from "../../models/vote";
import {Events, FabButton} from "ionic-angular";
import {VoteDecision} from "../../models/vote-decision";
import {UserSessionProvider} from "../../providers/user-session/user-session";
import {TeaCoApiProvider} from "../../providers/teaco-api/teaco-api-provider";
import {SuggestionCardComponent} from "../suggestion-card/suggestion-card";
import {Observable} from "rxjs";

/**
 * Custom UI component for handling quick vote options.
 */
@Component({
  selector: 'quick-vote',
  templateUrl: 'quick-vote.html'
})
export class QuickVoteComponent {

  /**
   * The associated vote item.
   */
  @Input('user-vote') vote: Vote;
  /**
   * The associated vote item.
   */
  @Input('root') suggestionCard: SuggestionCardComponent;
  /**
   * The 'yes' vote UI button
   */
  @ViewChild('yesVoteButton') yesVoteButton: FabButton;
  /**
   * The 'no' vote UI button
   */
  @ViewChild('noVoteButton') noVoteButton: FabButton;
  /**
   * The 'maybe' vote UI button
   */
  @ViewChild('maybeVoteButton') maybeVoteButton: FabButton;

  /**
   * Default Constructor
   */
  constructor(private userSession: UserSessionProvider, private apiService: TeaCoApiProvider, private events: Events) {}

  ngOnInit() {
    if(this.vote !== undefined) {
      switch(this.vote.decision) {
        case VoteDecision.yes:
          this.voteYes(null);
          break;
        case VoteDecision.maybe:
          this.voteMaybe(null);
          break;
        case VoteDecision.no:
          this.voteNo(null);
          break;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const updatedVote: SimpleChange = changes.vote;
    if(!updatedVote.isFirstChange()) {
      this.vote = updatedVote.currentValue;
      this.ngOnInit();
    }
  }

  /**
   * Vote as 'yes'
   */
  public voteYes(event) {
    // don't let the click event fired further on parent component
    if(event) {
      event.stopPropagation();
    }
    QuickVoteComponent.activateVoteButton(this.yesVoteButton);
    QuickVoteComponent.deactivateVoteButton(this.maybeVoteButton);
    QuickVoteComponent.deactivateVoteButton(this.noVoteButton);
    this.updateDecision(VoteDecision.yes);
  }

  /**
   * Vote as 'maybe'.
   */
  public voteMaybe(event) {
    // don't let the click event fired further on parent component
    if(event) {
      event.stopPropagation();
    }
    QuickVoteComponent.activateVoteButton(this.maybeVoteButton);
    QuickVoteComponent.deactivateVoteButton(this.yesVoteButton);
    QuickVoteComponent.deactivateVoteButton(this.noVoteButton);
    this.updateDecision(VoteDecision.maybe);
  }

  /**
   * Vote as 'no'
   */
  public voteNo(event) {
    // don't let the click event fired further on parent component
    if(event) {
      event.stopPropagation();
    }
    QuickVoteComponent.activateVoteButton(this.noVoteButton);
    QuickVoteComponent.deactivateVoteButton(this.yesVoteButton);
    QuickVoteComponent.deactivateVoteButton(this.maybeVoteButton);
    this.updateDecision(VoteDecision.no);
  }

  /**
   * Activate a given vote button.
   * @param voteButton The vote button which to activate
   */
  private static activateVoteButton(voteButton: FabButton) {
    let nativeElement: HTMLElement = voteButton.getElementRef().nativeElement;
    nativeElement.classList.add('selected');
  }

  /**
   * Deactivate a given vote button.
   * @param voteButton The vote button which to deactivate
   */
  private static deactivateVoteButton(voteButton: FabButton) {
    let nativeElement: HTMLElement = voteButton.getElementRef().nativeElement;
    nativeElement.classList.remove('selected');
  }

  /**
   * Send update request to TeaCo server.
   */
  private updateDecision(newDecision: VoteDecision) {
    if(this.vote.decision !== newDecision) {
      let oldDecision = this.vote.decision;
      this.vote.decision = newDecision;
      this.suggestionCard.updateProgress();
      this.userSession.getActiveUser().then(activeUser => {
        this.apiService.updateVote(
            activeUser.key,
            this.vote
        ).subscribe(() => {
          console.log('successfully updated vote on TeaCo');
          this.events.publish('voted');
        }, error => {
          console.error(error.toString());
          this.vote.decision = oldDecision;
          this.ngOnInit();
          this.suggestionCard.updateProgress();
        });
      });
    }
  }

}
