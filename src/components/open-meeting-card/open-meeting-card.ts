import {Component, Input} from '@angular/core';
import {Meeting} from "../../models/meeting";
import {DateTimeHelper} from "../../utils/date-time-helper";

/**
 * Custom UI component for displaying open meeting cards.
 */
@Component({
  selector: 'open-meeting-card',
  templateUrl: 'open-meeting-card.html'
})
export class OpenMeetingCardComponent {

  /**
   * The associated meeting model
   */
  @Input('meeting') private meeting: Meeting;

  /**
   * The parsed passed time description
   */
  private passedTimeDescription: string;

  /**
   * Default constructor
   */
  constructor() {}

  ngOnInit() {
    this.updatePassedTimeDescription();
  }

  /**
   * Update the meeting card's passed time description
   */
  public updatePassedTimeDescription() {
    this.passedTimeDescription = DateTimeHelper.getPassedTimeDescription(this.meeting.created_at);
  }

}
