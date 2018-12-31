import {Component} from '@angular/core';
import {OpenMeetingCardComponent} from "../open-meeting-card/open-meeting-card";
import {DateTimeHelper} from "../../utils/date-time-helper";
import {Suggestion} from "../../models/suggestion";

/**
 * Custom UI component for displaying closed meeting cards.
 */
@Component({
  selector: 'closed-meeting-card',
  templateUrl: 'closed-meeting-card.html'
})
export class ClosedMeetingCardComponent extends OpenMeetingCardComponent {

  /**
   * Default Constructor
   */
  constructor() {
    super();
  }

  /**
   * Update the meeting card's passed time description
   */
  public updatePassedTimeDescription() {
    this.passedTimeDescription = DateTimeHelper.getPassedTimeDescription(this.meeting.updatedAt);
  }

  /**
   * Get the suggestion's year.
   * @return the suggestion's year
   */
  private getYear(suggestion: Suggestion): string {
    return suggestion.date.getFullYear().toString().substr(2, 2);
  }

  /**
   * Get the suggestion's month.
   * @return the suggestion's month
   */
  private getMonth(suggestion: Suggestion): string {
    return DateTimeHelper.getMonthName(suggestion.date).substr(0, 3);
  }

  /**
   * Get the suggestion's day.
   * @return the suggestion's day
   */
  private getDay(suggestion: Suggestion): number {
    return suggestion.date.getDay() - 1;
  }

  /**
   * Get the suggestion's weekday.
   * @return the suggestion's weekday
   */
  private getWeekday(suggestion: Suggestion): string {
    return DateTimeHelper.getWeekday(suggestion.date)
  }

  /**
   * Get the suggestion's full time span from start to end time.
   * @return The suggestion's full time span
   */
  private getTime(suggestion: Suggestion): string {
    return DateTimeHelper.getTimeString(suggestion.startTime) +
        ' - ' +
        DateTimeHelper.getTimeString(suggestion.endTime);
  }
}
