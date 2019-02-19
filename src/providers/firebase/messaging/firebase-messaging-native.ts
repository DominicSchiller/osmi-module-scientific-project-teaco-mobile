import {FirebaseMessagingProvider} from "./firebase-messaging.interface";
import {Injectable} from "@angular/core";
import {Firebase} from "@ionic-native/firebase";
import {Events, Platform} from "ionic-angular";
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
    constructor(private platform: Platform, private firebaseNative: Firebase,
                private events: Events) {
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
                if(message.tap) {
                    let data = JSON.parse(message["gcm.notification.data"]);
                    let page = '';
                    switch(data.messageCode) {
                        // meeting invitation notification received
                        case 1:
                            page = 'MeetingDetailPage';
                            break;
                        // finalized meeting notification received
                        case 2:
                            page = 'MeetingsOverviewPage';
                            break;
                    }
                    this.events.publish('routeToPage', {
                        'page': page,
                        'data': data
                    });
                }
            })
        ).subscribe();
    }

    ready(): Promise<void> {
        return this._loadingPromise;
    }
}