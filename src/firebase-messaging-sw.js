// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyCqzlY7N_ATJCEpxsLHOy6Ic1_xUY7o5gU",
  authDomain: "taskspur-40cf0.firebaseapp.com",
  databaseURL: "https://taskspur-40cf0.firebaseio.com",
  projectId: "taskspur-40cf0",
  storageBucket: "taskspur-40cf0.appspot.com",
  messagingSenderId: "821206276866",
  appId: "1:821206276866:web:aaa01113a8da592c5a401b",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging); //<--this
messaging.onMessage = messaging.onMessage.bind(messaging); //<-- and this `

// messaging.onMessage(function (payload) {
//   console.log("[firebase-messaging-sw.js] Received onMessage", payload);
//   // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     data: payload.notification.data,
//   };

//   return self.registration.showNotification(
//     notificationTitle,
//     notificationOptions
//   );
// });

// messaging.setBackgroundMessageHandler(function (payload) {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
//   // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     data: payload.notification.data,
//   };

//   return self.registration.showNotification(
//     notificationTitle,
//     notificationOptions
//   );
// });
