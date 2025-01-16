"use client";
import { useEffect, useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import { app, VAPID_KEY } from "../../firebase/config";
const useFcmToken = (isInAppOn) => {
  const [token, setToken] = useState("");
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState("");

  useEffect(() => {

    const retrieveToken = async () => {
      try {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
          if(!isInAppOn){
            return
          }
          const messaging = getMessaging(app);
          ///change request notif... place
          
          // Retrieve the notification permission status
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            return;
          }
          setNotificationPermissionStatus(permission);
          const currentToken = await getToken(messaging, {
            vapidKey: VAPID_KEY,
          });
          if (currentToken) {
            setToken(currentToken);
          }
        }
      } catch (error) {
        console.log("An error occurred while retrieving token:", error);
      }
    };
    retrieveToken();
    console.log(token)
  }, []);


  return { fcmToken: token, notificationPermissionStatus };
};

export default useFcmToken;
