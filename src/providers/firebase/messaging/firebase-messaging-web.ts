import {FirebaseMessagingProvider} from "./firebase-messaging.interface";
import 'firebase/messaging';
import {Injectable} from "@angular/core";
import firebase from 'firebase/app'

/**
 * Firebase messaging provider for web browser.
 */
@Injectable()
export class FirebaseMessagingWebProvider implements FirebaseMessagingProvider {

    /**
     * Promise which will be called back when the fcm provider
     * has been completely initialized and ready configured.
     */
    private readonly _loadingPromise: Promise<void>;

    /**
     * The firebase messaging component
     */
    private messaging: firebase.messaging.Messaging;

    /**
     * Default Constructor
     */
    constructor() {
        this.messaging = firebase.messaging();
        this._loadingPromise = this.setupServiceWorker();
    }

    ready(): Promise<void> {
        return this._loadingPromise;
    }

    getToken(): Promise<string> {
        return this.messaging.getToken();
    }

    listen() {
        this.messaging.onMessage((payload) => {
            console.log('Received message:', payload);
        });
    }

    /**
     * Setup the browser's service worker in order
     * to be able to receive push notifications.
     */
    private setupServiceWorker(): Promise<void> {
        return new Promise((resolve, error) => {
            navigator.serviceWorker.register('service-worker.js')
                .then((registration) => {
                    console.log("And now the registration", registration);
                    // apply current service worker
                    this.messaging.useServiceWorker(registration);
                    // request permission
                    this.messaging.requestPermission()
                        .then(() => {
                            this.getToken()
                                .then((token) => {
                                    console.log("Received FCM token: ", token);
                                    resolve();
                                });
                        });
                }, error => {
                    error(error);
                });
        });
    }
}