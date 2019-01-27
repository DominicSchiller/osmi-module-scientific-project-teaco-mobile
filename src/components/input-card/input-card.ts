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
  private minuteValues: string = "0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55";

  /**
   * A date input's minimum date (here: fom now to somewhere in the future)
   */
  private minDate: string;

  /**
   * The current input's value
   */
  value: string;
  /**
   * Default Constructor
   */
  constructor() {
    this.minDate = new Date().toISOString();
  }

  /**
   * Notify parent controller by calling the given callback function.
   */
  private notify() {
    this.onChange.emit([this.value]);
  }
}
