"use client";

import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const ProfileContext = createContext(null);
export const changeUserActiveStatus = ({ isActive, profile }) => {
  if (profile) {
    try {
      const userRef = doc(db, "users/" + profile.uid);
      const updates = {};
      updates["lastActiveAt"] = Date.now();
      updates["isActive"] = isActive;
      updateDoc(userRef, updates);
    } catch (error) {
      console.error("Error updating user activity:", error);
    }
  }
};

export function Providers({ children }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!profile) return;
      if (document.hidden) {
        changeUserActiveStatus({ isActive: false, profile });
      } else {
        changeUserActiveStatus({ isActive: true, profile });
      }
    };

    // Add event listener for visibility change
    if (typeof document.hidden !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    // Cleanup event listener when the component unmounts
    return () => {
      if (typeof document.hidden !== "undefined") {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      }
    };
  }, [profile, changeUserActiveStatus]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users/" + currentUser.uid);
        const userGet = await getDoc(userDocRef);
        const updates = { isActive: true, lastActiveAt: Date.now() };
        await updateDoc(userDocRef, updates);
        if (userGet.exists()) {
          const user = userGet.data();
        
          const wishlist = user.wishlist && Object.values(user.wishlist) || [];
          setProfile({
            name: currentUser.displayName,
            avatar: currentUser.photoURL,
            email: currentUser.email,
            uid: currentUser.uid,
            notificationSettings: user.notificationSettings,
            notifications: user.notifications,
            ...updates,
            wishlist
          });
          console.log("User signed in:", currentUser);
        }
      } else {
        setProfile(null);
        console.log("No user signed in");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}
