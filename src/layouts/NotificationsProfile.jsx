"use client";

import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import NotificationsSvg from "../../public/icons/notifications.svg";
import { NotificationsViewModal } from "@/common/modals/NotificationsViewModal";
import { ProfileViewModal } from "@/common/modals/ProfileViewModal";
import { ProfileContext } from "./Providers";
import { useRouter } from "next/navigation";
import ProfileSvg from "../../public/icons/profile.svg";
import useFcmToken from "@/hooks/useFcmToken";
import { getMessaging, onMessage } from "firebase/messaging";
import { app, db } from "../../firebase/config";
import { useLocalStorage } from "react-use";
import { doc, setDoc, updateDoc } from "firebase/firestore";

export default function NotificationsProfile() {
  const [isOpenNotificationModal, setIsOpenNotificationModal] = useState(false);
  const [isOpenProfileModal, setIsOpenProfileModal] = useState(false);
  const [bodyElement, setBodyElement] = useState(null);
  const { profile, setProfile } = useContext(ProfileContext);
  const [notViewedNotificationsId, setNotViewedNotificationsId] =
    useLocalStorage("notifications-id", []);

  const [isEmailOn, setIsEmailOn] = useLocalStorage("isEmailOn", true);
  const [isInAppOn, setIsInAppOn] = useLocalStorage("isInAppOn", true);
  const [isUpdateOn, setIsUpdateOn] = useLocalStorage("isUpdateOn", true);
  const router = useRouter();

  const { fcmToken, notificationPermissionStatus } = useFcmToken(isInAppOn);

  // useEffect(()=>{
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker.register('/sw.js')
  //       .then((registration) => {
  //         console.log('Service Worker registered:', registration);
  //       })
  //       .catch((error) => {
  //         console.error('Service Worker registration failed:', error);
  //       });
  //   }

  // },[])

  useEffect(() => {
    if (!profile || !fcmToken) return;
    console.log(fcmToken);
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging(app);
      const unsubscribe = onMessage(messaging, async (payload) => {
        try {
          console.log("Foreground push notification received:", payload);

          const notificationData = {
            messageId: payload.messageId,
            title: payload.notification.title,
            body: payload.notification.body,
            sendedAt: Date.now(),
          };

          // Firestore references

          const userRef = doc(db, "users", profile.uid);

          
          await updateDoc(userRef, {
            [`notifications.${payload.messageId}`]: notificationData, 
            fcmToken: fcmToken, 
          });
          // Update local state
          setNotViewedNotificationsId((prev) => [...prev, payload.messageId]);
          setProfile((prevProfile) => ({
            ...prevProfile,
            notifications: {
              ...prevProfile.notifications,
              [payload.messageId]: notificationData,
            },
          }));
        } catch (error) {
          console.log(error);
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [profile, fcmToken]);
  useEffect(() => {
    if (typeof window !== undefined && typeof document !== undefined) {
      setBodyElement(document.body);
    }
  }, []);

  return (
    <>
      <div className="flex w-[90px] items-center justify-center">
        <button
          disabled={!profile}
          onClick={() => (
            setIsOpenNotificationModal(true), setNotViewedNotificationsId([])
          )}
          className="relative cursor-pointer pt-0.5 h-max"
        >
          <NotificationsSvg />
          {notViewedNotificationsId.length !== 0 && (
            <span className="font-poppins text-[8px] leading-tight font-medium bg-main-blue text-white rounded-[5px] w-5 flex items-center p-[3px] justify-center absolute top-0 right-0 -mt-1 -mr-2">
              {notViewedNotificationsId.length}
            </span>
          )}
        </button>
        <button
          onClick={() =>
            profile ? setIsOpenProfileModal(true) : router.push("/auth")
          }
          className="w-max h-max ml-auto"
        >
          {profile && profile.avatar ? (
            <img
              width={40}
              height={40}
              alt={profile.name}
              src={profile.avatar}
              className="rounded-full w-10 h-10 object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-[#F5F5F5] flex items-center justify-center">
              <ProfileSvg className="w-5 h-5" />
            </div>
          )}
        </button>
      </div>
      {bodyElement &&
        profile &&
        createPortal(
          <NotificationsViewModal
            isEmailOn={isEmailOn}
            isUpdateOn={isUpdateOn}
            isInAppOn={isInAppOn}
            setIsEmailOn={setIsEmailOn}
            setIsUpdateOn={setIsUpdateOn}
            setIsInAppOn={setIsInAppOn}
            profile={profile}
            isOpenNotificationModal={isOpenNotificationModal}
            handleCloseNotifications={() => setIsOpenNotificationModal(false)}
          />,
          bodyElement
        )}
      {bodyElement &&
        createPortal(
          <ProfileViewModal
            profile={profile}
            setProfile={setProfile}
            isOpenProfileModal={isOpenProfileModal}
            handleCloseProfile={() => setIsOpenProfileModal(false)}
          />,
          bodyElement
        )}
    </>
  );
}
