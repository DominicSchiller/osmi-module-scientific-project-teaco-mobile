import {Injectable} from '@angular/core';

import {Platform} from "ionic-angular";
import {FirebaseMessagingProvider} from "./messaging/firebase-messaging.interface";
import {FirebaseMessagingWebProvider} from "./messaging/firebase-messaging-web";

/**
 * Provider which is responsible to handle all firebase features and communications.
 */
@Injectable()
export class FirebaseProvider {

  /**
   * Instance of firebase messaging provider which
   * is responsible to handle push notifications
   */
  private fcm: FirebaseMessagingProvider;

  /**
   * Constructor
   * @param platform The platform where the app is currently running
   */
  constructor(private platform: Platform) {
    // progressive web app
    if(!this.platform.is('cordova')) {
      this.fcm = new FirebaseMessagingWebProvider();
    } else {
      this.fcm = new FirebaseMessagingWebProvider();
    }

    this.fcm.ready()
      .then(() => {
        this.fcm.listen();
      }, (error) => {
        console.error(error);
      })
  }

  /**
   * Get firebase device token.
   * @return Promise which will be called after firebase device token has been received.
   */
  private getToken(): Promise<string> {
    return this.fcm.getToken();
  }
}
