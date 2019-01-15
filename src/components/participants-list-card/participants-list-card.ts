import {Component, Input} from '@angular/core';
import {User} from "../../models/user";

/**
 * Custom UI component for horizontally displaying a list of meeting participants.
 */
@Component({
  selector: 'participants-list-card',
  templateUrl: 'participants-list-card.html'
})
export class ParticipantsListCardComponent {

  /**
   * List of participants which to display.
   */
  @Input('participants') participants: User[];

  /**
   * Default Constructor.
   */
  constructor() {
    this.participants = [];
  }

}
