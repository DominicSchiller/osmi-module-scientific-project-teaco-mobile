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
  @Input('meeting') protected meeting: Meeting;

  /**
   * The parsed passed time description
   */
  protected passedTimeDescription: string;

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
    this.passedTimeDescription = DateTimeHelper.getPassedTimeDescription(this.meeting.createdAt);
  }

}
