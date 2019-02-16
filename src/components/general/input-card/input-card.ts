import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Custom UI component displaying a card which consists of an input field and an icon.
 */
@Component({
  selector: 'input-card',
  templateUrl: 'input-card.html'
})
export class InputCardComponent {

  /**
   * The input's placeholder string
   */
  @Input('placeholder') placeholder: string;

  /**
   * The input card's left icon
   */
  @Input('icon') iconName: string;

  /**
   * The input's data type
   */
  @Input('type') inputType: string;
  
  /**
   * The callback function to call whenever a model change will occur
   */
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * A time input's minute selection interval
   */
  private minuteValuesFull: string = "0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55";

  /**
   * A time or duration inputs minute interval
   */
  private minuteValuesDuration: string = "0, 30";

  /**
   * A date input's minimum time
   */
  private minTime: string;

  /**
   * A date input's maximum time
   */
  private maxTime: string;

  /**
   * The current input's value
   */
  public value: string;

  /**
   * Default Constructor
   */
  constructor() {
    this.value = "";
    let now = new Date();
    now.setHours(1, 0, 0, 1);
    this.maxTime = now.toISOString();
    now.setHours(2, 0, 0, 1);
    this.minTime = now.toISOString();
  }

  /**
   * Set the maximum time of a time or duration input.
   * @param timeString The time string which to apply
   */
  public setMaxTime(timeString: string) {
    let timeParts = timeString.split(':');
    let now = new Date();
    now.setHours(Number(timeParts[0]) + 1, Number(timeParts[1]), 0, 1);
    this.maxTime = now.toISOString();
  }

  /**
   * Set the minimum date of a time or duration input.
   * @param timeString The time string which to apply
   */
  public setMinTime(timeString: string) {
    let timeParts = timeString.split(':');
    let now = new Date();
    now.setHours(Number(timeParts[0]) + 1, Number(timeParts[1]), 0, 1);
    this.maxTime = now.toISOString();
  }

  /**
   * Notify parent controller by calling the given callback function.
   */
  private notify() {
    this.onChange.emit([this.value]);
  }
}
