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
        //TODO: check for internat connection !!!
        this.messaging = firebase.messaging();
        this._loadingPromise = this.setupServiceWorker();
    }

    ready(): Promise<void> {
        return this._loadingPromise;
    }

    async getToken(): Promise<string> {
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
        return new Promise((resolve, onError) => {
            navigator.serviceWorker.register('service-worker.js')
                .then((registration) => {
                    // apply current service worker
                    this.messaging.useServiceWorker(registration);
                    // request permission
                    this.messaging.requestPermission()
                        .then(() => {
                            resolve();
                        });
                }, error => {
                    console.error("Failed to register FCM service worker", error);
                });
        });
    }
}