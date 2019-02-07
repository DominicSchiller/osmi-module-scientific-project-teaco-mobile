import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Suggestion} from "../../models/suggestion";
import {DateTimeHelper} from "../../utils/date-time-helper";

/**
 * Custom UI component for horizontally displaying a list of date suggestions.
 */
@Component({
  selector: 'suggestions-list-card',
  templateUrl: 'suggestions-list-card.html'
})
export class SuggestionsListCardComponent {

  /**
   * List of suggestions which to display
   */
  @Input('suggestions') suggestions: Suggestion[];

  /**
   * Event emitter which will be called on each click of the 'add suggestion' button
   */
  @Output('onAddClicked') onAddClicked: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Default Constructor.
   */
  constructor() {
    this.suggestions = [];
  }

  /**
   * Emit the associated 'onAddClicked' event emitter.
   */
  emitOnAddClicked() {
    this.onAddClicked.emit([]);
  }

  /**
   * Get date string from date object.
   * @param date The date object which to parse
   */
  private parseDate(date: Date): string {
    return DateTimeHelper.getDateString(date);
  }

  /**
   * Get time string from time date object.
   * @param time The time date object which to parse
   */
  private parseTime(time: Date): string {
    return DateTimeHelper.getTimeString(time);
  }

}
