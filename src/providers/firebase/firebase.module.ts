import {NgModule} from '@angular/core';
import { FirebaseProvider} from "./firebase";
import {AngularFireModule, FirebaseApp} from "@angular/fire";
import {FirebaseMessagingWebProvider} from "./messaging/firebase-messaging-web";
import {Firebase} from "@ionic-native/firebase";

import { ENV } from "@app/env";

@NgModule({
    declarations: [
    ],
    imports: [
        AngularFireModule.initializeApp(ENV.firebase),
    ],
    providers: [
        Firebase,
        FirebaseProvider,
        FirebaseMessagingWebProvider
    ]
})
export class FirebaseModule {
    constructor(firebaseWebApp: FirebaseApp) {}
}