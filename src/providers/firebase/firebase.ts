import {Injectable} from '@angular/core';

import {Platform} from "ionic-angular";
import {FirebaseMessagingProvider} from "./messaging/firebase-messaging.interface";
import {FirebaseMessagingWebProvider} from "./messaging/firebase-messaging-web";
import {Firebase} from "@ionic-native/firebase";
import {FirebaseMessagingNativeProvider} from "./messaging/firebase-messaging-native";
import {TeaCoApiProvider} from "../teaco-api/teaco-api-provider";
import {UserSessionProvider} from "../user-session/user-session";

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
   * @param apiService The TeaCo API Service to communicate with the TeaCo server
   * @param userSession The app's user session service
   */
  constructor(
      private platform: Platform,
      firebaseNative: Firebase,
      private apiService: TeaCoApiProvider,
      private userSession: UserSessionProvider) {
    // progressive web app
    this.fcm = !this.platform.is('cordova') ?
        new FirebaseMessagingWebProvider() : new FirebaseMessagingNativeProvider(platform, firebaseNative);
  }

  /**
   * Start the firebase service.
   */
  public start() {
    this.fcm.ready()
        .then(() => {
          this.fcm.getToken()
              .then((token) => {
                console.log("Received FCM token: ", token);
                this.updateTeaCoPushToken(token);
                this.fcm.listen();
              }, error => {
                console.log("Error occurred while starting the FCM Messaging service", error);
              });
        }, (error) => {
          console.error("Error occurred while initializing FCM: ", error);
        });
  }

  /**
   * Update the FCM push token on the TeaCo server.
   * @param token The push token which to update
   */
  public updateTeaCoPushToken(token: string) {
    this.userSession.getActiveUser().then(activeUser => {
      if(activeUser) {
        this.apiService.updatePushToken(activeUser.key, token).subscribe(() => {
          console.log("Successfully updated push token");
        }, error => {
          console.error("Could not update the CM push token on TeaCo");
        });
      }
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
