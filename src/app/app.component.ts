import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import {Platform, Nav, Events} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Deeplinks } from "@ionic-native/deeplinks";

import {UserSessionProvider} from "../providers/user-session/user-session";
import { ENV } from "@app/env";

import {MeetingsOverviewPage} from "../pages/meetings/meetings-overview/meetings-overview";
import {LoginPage} from "../pages/user/login/login";
import {FirebaseProvider} from "../providers/firebase/firebase";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  /**
   * The app's root page at launch
   */
  rootPage: string;
  /**
   * Status whether the app got launched via external deep link or not
   */
  isAppLaunchedByDeepLink = false;
  /**
   * Status whether the app got launched via push notification or not
   */
  isAppLaunchedByPushNotification = false;
  /**
   * The app's global navigation component
   */
  @ViewChild(Nav) nav:Nav;

  /**
   * Constructor
   * @param platform
   * @param statusBar
   * @param splashScreen
   * @param deepLinks
   * @param userSession
   * @param firebaseService
   * @param location
   * @param events The app's global events system
   */
  constructor(
      platform: Platform,
      statusBar: StatusBar,
      splashScreen: SplashScreen,
      private deepLinks: Deeplinks,
      private readonly userSession: UserSessionProvider,
      private readonly firebaseService: FirebaseProvider,
      public location: Location,
      private events: Events) {

    platform.ready().then(() => {
      console.warn("Running in " + ENV.mode);

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      splashScreen.hide();

      // Handle deep links
      this.deepLinks.routeWithNavController(this.nav, {
        '/:userKey': 'LoginPage',
        '/:userKey/meetings/:meetingId': 'MeetingDetailPage'
      }, {
        root: true
      }).subscribe( (match) => {
        this.isAppLaunchedByDeepLink = true;
      }, (noMatch) => {
      });

      this.events.subscribe('routeToPage', (navData) => {
        this.isAppLaunchedByPushNotification = true;
        this.nav.setRoot(navData.page, navData.data);
      });

      // starting the Firebase Service
      this.firebaseService.start();

      // timeout is required to have a basic delay for setting the root page and performing a deep link first instead
      if(this.location.path(true) === "") {
        setTimeout( () => {
          this.userSession.ready().then(activeUser => {
            if(!this.isAppLaunchedByDeepLink && !this.isAppLaunchedByPushNotification) {
              this.rootPage = activeUser ? 'MeetingsOverviewPage' : 'WelcomePage';
            }
          });
        }, 50);
      }
    });
  }
}

