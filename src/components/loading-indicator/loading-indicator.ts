import { Component } from '@angular/core';

/**
 * Custom UI component indicating a loading process.
 */
@Component({
  selector: 'loading-indicator',
  templateUrl: 'loading-indicator.html'
})
export class LoadingIndicatorComponent {

  /**
   * Status indicating whether the loading indicator is active or not.
   */
  isActive: boolean;

  /**
   * Constructor.
   */
  constructor() {
    this.isActive = false;
  }

  /**
   * Show the loading indicator on screen.
   */
  public show() {
    this.isActive = true;
  }

  /**
   * Hide the loading indicator on screen.
   */
  public hide() {
    this.isActive = false;
  }

}
