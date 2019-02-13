import {Component} from '@angular/core';

/**
 * Custom alert component for displaying status result information.
 */
@Component({
  selector: 'feedback-alert',
  templateUrl: 'feedback-alert.html'
})
export class FeedbackAlertComponent {

  /**
   * The alert's title
   */
  public title: string;
  /**
   * The alert's message text
   */
  public message: string;
  /**
   * The name of the icon which to display
   */
  public iconName: string;
  /**
   * Status whether the FeedbackAlert is Visible or not
   */
  private isVisible: boolean;

  /**
   * The duration in milliseconds until the alert will disappear
   */
  private duration: number;

  /**
   * Default Constructor
   */
  constructor() {
    this.title = "";
    this.message = "";
    this.iconName = "";
    this.isVisible = false;
  }

  /**
   * Present the alert to the screen.
   */
  public present() {
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 3000);
  }

  /**
   * Present the alert to the screen.
   * @param title The title which to display
   * @param message The message which to display
   * @param iconName The icon name which to display
   */
  public presentWith(title: string, message: string = "", iconName: string = "") {
    this.title = title;
    this.message = message;
    this.iconName = iconName;
    this.present();
  }

  /**
   * Set the show duration.
   * @param duration The duration in milliseconds until the alert will disappear
   */
  public setDuration(duration: number) {
    this.duration = duration;
  }

}
