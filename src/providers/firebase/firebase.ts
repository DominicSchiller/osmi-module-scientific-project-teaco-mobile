import {Injectable} from '@angular/core';

import {Platform} from "ionic-angular";
import {FirebaseMessagingProvider} from "./messaging/firebase-messaging.interface";
import {FirebaseMessagingWebProvider} from "./messaging/firebase-messaging-web";
import {Firebase} from "@ionic-native/firebase";
import {FirebaseMessagingNativeProvider} from "./messaging/firebase-messaging-native";

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
   * @param firebaseNative Instance of native firebase plugin
   */
  constructor(private platform: Platform, firebaseNative: Firebase) {
    // progressive web app
    this.fcm = !this.platform.is('cordova') ?
        new FirebaseMessagingWebProvider() : new FirebaseMessagingNativeProvider(platform, firebaseNative);

    this.fcm.ready()
      .then(() => {
        this.fcm.listen();
      }, (error) => {
        console.error(error);
      });
  }

  /**
   * Get the current FCM push token.
   * @return p Promise returning the push token
   */
  getPushToken(): Promise<string> {
    return this.fcm.getToken();
  }
}
