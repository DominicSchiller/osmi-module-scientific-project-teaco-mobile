import { Component } from '@angular/core';
import { Time } from '@angular/common';

/**
 * Generated class for the AddNewMeetingCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'add-new-meeting-card',
  templateUrl: 'add-new-meeting-card.html'
})
export class AddNewMeetingCardComponent {

  text: string;
  /* titel: string;
  comments: string;
  location:string;
  date: Date;
  startTime: Time;
  endTime: Time; */

  constructor() {
    console.log('Hello AddNewMeetingCardComponent Component');
    this.text = 'Hello World';
  }

}
