import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { HttpClientModule } from "@angular/common/http";
import { Deeplinks } from "@ionic-native/deeplinks";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegisterUserPage } from "../pages/register-user/register-user";
import { TeaCoApiProvider } from '../providers/teaco-api-provider/teaco-api-provider';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RegisterUserPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegisterUserPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Deeplinks,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TeaCoApiProvider
  ]
})
export class AppModule {}
