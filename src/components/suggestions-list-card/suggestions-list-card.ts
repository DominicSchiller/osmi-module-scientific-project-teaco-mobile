import {Component, Input} from '@angular/core';
import {Suggestion} from "../../models/suggestion";

/**
 * Generated class for the SuggestionsListCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'suggestions-list-card',
  templateUrl: 'suggestions-list-card.html'
})
export class SuggestionsListCardComponent {

  @Input('suggestions') suggestions: Suggestion[];

  constructor() {
    this.suggestions = [];
  }

}
