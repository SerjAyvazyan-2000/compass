importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCkvB6bt-XiLjNGBoO51mGsduWkk2MpCC8",
    authDomain: "bali-app-351ba.firebaseapp.com",
    databaseURL:
      "https://bali-app-351ba-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bali-app-351ba",
    storageBucket: "bali-app-351ba.firebasestorage.app",
    messagingSenderId: "469171272709",
    appId: "1:469171272709:web:8abf6dc04e0fc27216b06c",
    measurementId: "G-0V5TPP5421",
  };


firebase.initializeApp(firebaseConfig);

// Инициализация Firebase Messaging
const messaging = firebase.messaging();

// Обработка фоновых уведомлений
messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };
  //same in foreground

  self.registration.showNotification(notificationTitle, notificationOptions);
});
