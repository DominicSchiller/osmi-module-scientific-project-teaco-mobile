import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Deeplinks } from "@ionic-native/deeplinks";

import { HomePage } from '../pages/home/home';
import { RegisterUserPage } from "../pages/register-user/register-user";
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  @ViewChild(Nav) nav:Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private deepLinks: Deeplinks) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // Handle deep links
      this.deepLinks.routeWithNavController(this.nav, {
        '/:userKey': RegisterUserPage
      }, {
        root: true
      }).subscribe( (match) => {
        //alert("Match: " + JSON.stringify(match));
      }, (noMatch) => {
        //alert("No Match: " + JSON.stringify(noMatch));
      });
    });
  }
}

