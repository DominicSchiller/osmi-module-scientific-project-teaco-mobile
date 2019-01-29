/**
 * Check out https://googlechromelabs.github.io/sw-toolbox/ for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */
'use strict';

importScripts('./build/sw-toolbox.js');

self.toolbox.options.cache = {
  name: 'ionic-cache'
};

// pre-cache our key assets
self.toolbox.precache(
  [
    './build/main.js',
    './build/vendor.js',
    './build/main.css',
    './build/polyfills.js',
    'index.html',
    'manifest.json'
  ]
);

// dynamically cache any other local assets
self.toolbox.router.any('/*', self.toolbox.fastest);

// for any other requests go to the network, cache,
// and then only use that cached resource if your register-user goes offline
self.toolbox.router.default = self.toolbox.networkFirst;

/**
 * Service Worker - Firebase SETUP
 */

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp( {
    messagingSenderId: "422344910128"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(message) {
    console.log('[firebase-messaging-sw.js] Received background message ', message);
    // Customize notification here
    const notificationTitle = message.data.title;
    //
    const notificationOptions = {
        body: message.data.body,
        icon: "/assets/imgs/logo.png",
        data: message.data.data,
        actions: [
            {action: 'like', title: '👍 Öffnen'},
            {action: 'reply', title: '⤻ Verwerfen'}]
    };
    //
    // console.log(self.registration);

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});


self.addEventListener('notificationclick', function(event) {
    console.log("something clicked", event);
    let data = JSON.parse(event.notification.data);
    let url = "/#/meetings-overview/open/open-meetings/" + data.meetingId;
    self.clients.openWindow(url);

}, false);
