import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { HttpClientModule } from "@angular/common/http";
import { Deeplinks } from "@ionic-native/deeplinks";

import { MyApp } from './app.component';
import { ComponentsModule } from "../components/components.module";
import { NoUserFoundPage } from '../pages/user/no-user-found/no-user-found';
import {RegisterUserPage} from "../pages/user/register-user/register-user";
import { TeaCoApiProvider } from '../providers/teaco-api/teaco-api-provider';
import { MeetingsOverviewPage } from '../pages/meetings/meetings-overview/meetings-overview';
import { ClosedMeetingsOverviewPage } from '../pages/meetings/meetings-overview/closed-meetings-overview/closed-meetings-overview';
import { AddNewMeetingPage } from '../pages/meetings/add-new-meeting/add-new-meeting';
import { UserSessionProvider } from '../providers/user-session/user-session';
import { OpenMeetingsOverviewPage } from "../pages/meetings/meetings-overview/open-meetings-overview/open-meetings-overview";

@NgModule({
  declarations: [
    MyApp,
    NoUserFoundPage,
    RegisterUserPage,
    MeetingsOverviewPage,
    OpenMeetingsOverviewPage,
    ClosedMeetingsOverviewPage,
    AddNewMeetingPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NoUserFoundPage,
    RegisterUserPage,
    MeetingsOverviewPage,
    OpenMeetingsOverviewPage,
    ClosedMeetingsOverviewPage,
    AddNewMeetingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Deeplinks,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TeaCoApiProvider,
    UserSessionProvider
  ]
})
export class AppModule {}
