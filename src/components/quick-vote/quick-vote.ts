import {Component, Input, ViewChild} from '@angular/core';
import {Vote} from "../../models/vote";
import {FabButton} from "ionic-angular";
import {VoteDecision} from "../../models/vote-decision";

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
  constructor() {}

  ngOnInit() {
    console.log(this.vote);
    switch(this.vote.decision) {
      case VoteDecision.yes:
        this.voteYes();
        break;
      case VoteDecision.maybe:
        this.voteMaybe();
        break;
      case VoteDecision.no:
        this.voteNo();
        break;
    }
  }

  /**
   * Vote as 'yes'
   */
  public voteYes() {
    QuickVoteComponent.activateVoteButton(this.yesVoteButton);
    QuickVoteComponent.deactivateVoteButton(this.maybeVoteButton);
    QuickVoteComponent.deactivateVoteButton(this.noVoteButton);
  }

  /**
   * Vote as 'maybe'.
   */
  public voteMaybe() {
    QuickVoteComponent.activateVoteButton(this.maybeVoteButton);
    QuickVoteComponent.deactivateVoteButton(this.yesVoteButton);
    QuickVoteComponent.deactivateVoteButton(this.noVoteButton);
  }

  /**
   * Vote as 'no'
   */
  public voteNo() {
    QuickVoteComponent.activateVoteButton(this.noVoteButton);
    QuickVoteComponent.deactivateVoteButton(this.yesVoteButton);
    QuickVoteComponent.deactivateVoteButton(this.maybeVoteButton);
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

}
