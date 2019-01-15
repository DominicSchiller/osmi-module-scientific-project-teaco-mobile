import {Component, EventEmitter, Input, Output} from '@angular/core';
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
   * List of participants which to display
   */
  @Input('participants') participants: User[];

  /**
   * Event emitter which will be called on each click of the 'add participant' button
   */
  @Output('onAddClicked') onAddClicked: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Default Constructor.
   */
  constructor() {
    this.participants = [];
  }

  /**
   * Emit the associated 'onAddClicked' event emitter.
   */
  emitOnAddClicked() {
    this.onAddClicked.emit([]);
  }

}
