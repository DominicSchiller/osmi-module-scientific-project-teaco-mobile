import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import {HttpClientModule} from "@angular/common/http";
import {Deeplinks } from "@ionic-native/deeplinks";

import {FirebaseModule} from "../providers/firebase/firebase.module";

import { MyApp } from './app.component';
import { ComponentsModule } from "../components/components.module";
import { TeaCoApiProvider } from '../providers/teaco-api/teaco-api-provider';
import { UserSessionProvider } from '../providers/user-session/user-session';
import { FirebaseProvider } from '../providers/firebase/firebase';
import {Firebase} from "@ionic-native/firebase";

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ComponentsModule,
    FirebaseModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Deeplinks,
    Firebase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TeaCoApiProvider,
    UserSessionProvider,
    FirebaseProvider
  ]
})
export class AppModule {}
