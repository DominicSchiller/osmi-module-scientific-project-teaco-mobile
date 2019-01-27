/**
 * Firebase messaging provider responsible to handle push notifications
 * from Firebase Cloud Messaging.
 */
export interface FirebaseMessagingProvider {
    /**
     * Get the ready promise which will be called back
     * when the FCM provider has been ready initialized and configured.
     */
    ready(): Promise<void>;
    /**
     * Start listening for push notifications.
     */
    listen(): void;
    /**
     * Get the current FCM device token.
     * @return the current FCM token
     */
    getToken(): Promise<string>;
}