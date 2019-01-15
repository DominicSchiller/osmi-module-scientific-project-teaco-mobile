import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Suggestion} from "../../models/suggestion";

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

}
