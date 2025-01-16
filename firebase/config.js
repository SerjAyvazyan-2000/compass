import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

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
export const VAPID_KEY =
  "BH1GR7BbiqJT3pn4y3OYB7_PRlnPGbri_Z_z_I6pB2hw2HyTS1DnKePfu-MswpShAmDma4lxbUWB41b4rNbVGWQ";
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

const auth = getAuth(app);

const requestNotificationPermission = async () => {
  try {
    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
      });
      console.log("FCM Token:", token);
    }
  } catch (error) {
    console.error("Error getting notification permission:", error);
  }
};

export { app, db, auth, storage, requestNotificationPermission };
