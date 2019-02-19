import {Component} from '@angular/core';
import {OpenMeetingCardComponent} from "../open-meeting-card/open-meeting-card";
import {DateTimeHelper} from "../../../utils/date-time-helper";
import {Suggestion} from "../../../models/suggestion";
import {Calendar} from "@ionic-native/calendar";
import {Platform} from "ionic-angular";
import {MeetingUtils, SortOrder} from "../../../utils/meeting-utils";

/**
 * Custom UI component for displaying closed meeting cards.
 */
@Component({
  selector: 'closed-meeting-card',
  templateUrl: 'closed-meeting-card.html'
})
export class ClosedMeetingCardComponent extends OpenMeetingCardComponent {

  /**
   * Constructor
   */
  constructor(private platform: Platform, private calendar: Calendar) {
    super();
  }

  ngOnInit() {
    MeetingUtils.sortSuggestions(this.meeting, SortOrder.ascending);
    super.ngOnInit();
  }

  addSuggestionToCalendar(suggestion: Suggestion) {
    console.warn("Start ", DateTimeHelper.mergeDateAndTime(suggestion.date, suggestion.startTime));
    console.warn("Ende ", DateTimeHelper.mergeDateAndTime(suggestion.date, suggestion.endTime));
    if(this.platform.is('cordova')) {
      this.calendar.createEventInteractively(
          this.meeting.title,
          this.meeting.location,
          "",
          DateTimeHelper.mergeDateAndTime(suggestion.date, suggestion.startTime),
          DateTimeHelper.mergeDateAndTime(suggestion.date, suggestion.endTime)
      ).then(data => {
        this.calendar.openCalendar(suggestion.date).then(data2 => {
          console.log(data2);
        });
      });
    } else {
      console.error("Can't open calendar on web browser");
    }
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
    return suggestion.date.getDate();
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
