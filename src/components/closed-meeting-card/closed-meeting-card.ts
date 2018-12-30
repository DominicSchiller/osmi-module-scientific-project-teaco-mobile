import {Component, Input} from '@angular/core';
import {Meeting} from "../../models/meeting";
import {OpenMeetingCardComponent} from "../open-meeting-card/open-meeting-card";
import {DateTimeHelper} from "../../utils/date-time-helper";

/**
 * Custom UI component for displaying closed meeting cards.
 */
@Component({
  selector: 'closed-meeting-card',
  templateUrl: 'closed-meeting-card.html'
})
export class ClosedMeetingCardComponent extends OpenMeetingCardComponent {

  // TODO: PLACEHOLDER ARRAY <-- Replace with real dates later on
  private dates = [6, 15, 23, 25, 26, 31];

  constructor() {
    super();
  }

  /**
   * Update the meeting card's passed time description
   */
  public updatePassedTimeDescription() {
    this.passedTimeDescription = DateTimeHelper.getPassedTimeDescription(this.meeting.updatedAt);
  }
}
