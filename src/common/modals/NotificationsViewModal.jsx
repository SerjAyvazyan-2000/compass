import BackSvg from "../../../public/icons/back.svg";
import SettingsSvg from "../../../public/icons/settings.svg";
import { useState } from "react";
import { SwitchToggle } from "../SwitchToggle";
import NoNotifications from "../../../public/icons/no-notifications.svg";
import clsx from "clsx";
import { db } from "../../../firebase/config";
import { ref, update } from "firebase/database";

import {
  groupNotificationsByDate,
  NotificationsCards,
} from "../NotificationsCards";
import { doc, updateDoc } from "firebase/firestore";

export function NotificationsViewModal({
  isEmailOn,
  setIsEmailOn,
  isInAppOn,
  setIsInAppOn,
  profile,
  isUpdateOn,
  setIsUpdateOn,
  handleCloseNotifications,
  isOpenNotificationModal,
}) {
  const [isOpenSettings, setIsOpenSettings] = useState(false);

  function handleSendEmail() {
    try {
      const userDocRef = doc(db, "users", profile.uid);
      const updates = {
        "notificationSettings.sendEmail": !isEmailOn,
      };

      updateDoc(userDocRef, updates);
      setIsEmailOn(!isEmailOn);
    } catch (error) {
      console.error(
        "Error updating email notification setting:",
        error.message
      );
    }
  }
  function handleSendPush() {
    try {
      const userDocRef = doc(db, "users", profile.uid);
      const updates = {
        "notificationSettings.sendPush": !isInAppOn,
      };
      updateDoc(userDocRef, updates);
      setIsInAppOn(!isInAppOn);
    } catch (error) {
      console.log(error.message);
    }
  }
  function handleSendUpdate() {
    try {
      const userDocRef = doc(db, "users" + profile.uid);
      const updates = {
        "notificationSettings.sendUpdate": !isUpdateOn,
      };
      updateDoc(userDocRef, updates);
      setIsUpdateOn(!isUpdateOn);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <div
        className={clsx(
          "fixed bg-white z-20 px-4 top-0 safe-top pb-2.5 h-screen w-screen duration-700 transition-all",
          isOpenSettings ? " translate-x-0" : "translate-x-[2000px]"
        )}
      >
        <div className="flex items-center w-full py-5 mt-2.5">
          <button onClick={() => setIsOpenSettings(false)}>
            <BackSvg />
          </button>
          <h4 className="font-medium mx-auto">Notifications setting</h4>
        </div>
        <div className="flex flex-col gap-2.5 py-2.5">
          <span className="text-sm text-main-blue flex justify-between w-full bg-main-blue/10 rounded-[20px] p-4 text-center">
            Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
            tempor incidunt ut labore et dolore magna aliqua
          </span>
          <div className="flex justify-between py-5 w-full border-b gap-2.5 border-[#D9D9D9]/50">
            <span className="flex flex-col gap-2.5">
              <h5 className="font-semibold text-sm">Email notification</h5>
              <p className="opacity-40 text-xs w-[267px]">
                Lorem ipsum dolor sit amet, consectetur adipisci elit, sed
              </p>
            </span>
            <div className="flex items-center">
              <SwitchToggle isOn={isEmailOn} setIsOn={handleSendEmail} />
            </div>
          </div>{" "}
          <div className="flex justify-between py-5 w-full border-b gap-2.5 border-[#D9D9D9]/50">
            <span className="flex flex-col gap-2.5">
              <h5 className="font-semibold text-sm">In app notification</h5>
              <p className="opacity-40 text-xs w-[267px]">
                Lorem ipsum dolor sit amet, consectetur adipisci elit, sed
              </p>
            </span>
            <div className="flex items-center">
              <SwitchToggle isOn={isInAppOn} setIsOn={handleSendPush} />
            </div>
          </div>{" "}
          <div className="flex justify-between py-5 w-full border-b gap-2.5 border-[#D9D9D9]/50">
            <span className="flex flex-col gap-2.5">
              <h5 className="font-semibold text-sm">Update application</h5>
              <p className="opacity-40 text-xs w-[267px]">
                Lorem ipsum dolor sit amet, consectetur adipisci elit, sed
              </p>
            </span>
            <div className="flex items-center">
              <SwitchToggle isOn={isUpdateOn} setIsOn={handleSendUpdate} />
            </div>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          "w-screen h-screen fixed z-10 top-0 safe-top pb-10 bg-white transition-all px-4 duration-700 overflow-y-auto",
          isOpenNotificationModal ? "translate-x-0" : "translate-x-[2000px]"
        )}
      >
        <div className="flex items-center justify-between w-full py-5 mt-2.5">
          <button onClick={handleCloseNotifications}>
            <BackSvg />
          </button>
          <h4 className="font-medium">Notifications</h4>
          <button disabled={!profile} onClick={() => setIsOpenSettings(true)}>
            <SettingsSvg />
          </button>
        </div>
        <>
          {profile.notifications ? (
            <NotificationsCards
              groupedNotifications={groupNotificationsByDate(
                profile.notifications
              )}
            />
          ) : (
            <div className="flex items-center flex-col gap-2.5 mx-auto mt-10">
              <NoNotifications />
              <h3 className="font-semibold text-xl">No notifications yet</h3>
              <p className="text-sm opacity-40 text-center">
                Your notification will appear here once you've received them.
              </p>
            </div>
          )}
        </>
      </div>
    </>
  );
}
