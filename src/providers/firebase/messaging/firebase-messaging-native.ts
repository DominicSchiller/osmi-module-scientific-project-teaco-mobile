import {FirebaseMessagingProvider} from "./firebase-messaging.interface";
import {Injectable} from "@angular/core";
import {Firebase} from "@ionic-native/firebase";
import {Platform} from "ionic-angular";
import {tap} from 'rxjs/operators'

/**
 * Firebase messaging provider for native apps.
 */
@Injectable()
export class FirebaseMessagingNativeProvider implements FirebaseMessagingProvider {

    /**
     * Promise which will be called back when the fcm provider
     * has been completely initialized and ready configured.
     */
    private readonly _loadingPromise: Promise<void>;

    /**
     * Default Constructor
     * @param platform The platform where the app is currently running
     * @param firebaseNative Instance of native firebase plugin
     */
    constructor(private platform: Platform, private firebaseNative: Firebase) {
        // TODO: Check for internet connection!!!

        this._loadingPromise = new Promise((resolve) => {
            this.platform.ready().then(() => {
                resolve();
            })
        });
    }

    async getToken(): Promise<string> {
        let token;
        if (this.platform.is('android')) {
            token = await this.firebaseNative.getToken();
        }
        if(this.platform.is('ios')) {
            await this.firebaseNative.grantPermission();
            token = await this.firebaseNative.getToken();
        }
        return token;
    }

    listen(): void {
        this.firebaseNative.onNotificationOpen().pipe(
            tap(message => {
                console.warn("Notification message received: ", message);
                //TODO: implement message handling and routing here ...
            })
        )
    }

    ready(): Promise<void> {
        return this._loadingPromise;
    }
}