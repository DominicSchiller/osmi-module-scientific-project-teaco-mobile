import {Component, EventEmitter, Input, Output} from '@angular/core';

type InputCardCallbackFunction = (arg1: any) => void;

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

  private minuteValuesDuration: string = "0, 30";

  private minDate: string;

  /**
   * A date input's minimum date (here: fom now to somewhere in the future)
   */
  private maxDate: string;

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
    this.maxDate = now.toISOString();
    now.setHours(2, 0, 0, 1);
    this.minDate = now.toISOString();
  }

  public setMaxDate(dateString: string) {
    let timeParts = dateString.split(':');
    let now = new Date();
    now.setHours(Number(timeParts[0]) + 1, Number(timeParts[1]), 0, 1);
    this.maxDate = now.toISOString();
  }

  /**
   * Notify parent controller by calling the given callback function.
   */
  private notify() {
    this.onChange.emit([this.value]);
  }
}
