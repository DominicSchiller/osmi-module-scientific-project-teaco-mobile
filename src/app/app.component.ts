import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import {Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Deeplinks } from "@ionic-native/deeplinks";

import {UserSessionProvider} from "../providers/user-session/user-session";
import { ENV } from "@app/env";

import {MeetingsOverviewPage} from "../pages/meetings/meetings-overview/meetings-overview";
import {FirebaseProvider} from "../providers/firebase/firebase";
import {RegisterUserPage} from "../pages/user/register-user/register-user";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: string;
  isAppOpenedByDeepLink = false;
  @ViewChild(Nav) nav:Nav;

  constructor(
      platform: Platform,
      statusBar: StatusBar,
      splashScreen: SplashScreen,
      private deepLinks: Deeplinks,
      private readonly userSession: UserSessionProvider,
      private fcmProvider: FirebaseProvider,
      public location: Location) {

    platform.ready().then(() => {
      console.warn("Running in " + ENV.mode);

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      splashScreen.hide();

      // Handle deep links
      this.deepLinks.routeWithNavController(this.nav, {
        '/:userKey': 'RegisterUserPage'
      }, {
        root: true
      }).subscribe( (match) => {
        this.isAppOpenedByDeepLink = true;
      }, (noMatch) => {
      });

      // timeout is required to have a basic delay for setting the root page and performing a deep link first instead
      if(this.location.path(true) === "") {
        setTimeout( () => {
          userSession.ready().then(activeUser => {
            if(!this.isAppOpenedByDeepLink) {
              this.rootPage = activeUser ? 'MeetingsOverviewPage' : 'NoUserFoundPage';
            }
          });
        }, 50);
      }
    });
  }
}

