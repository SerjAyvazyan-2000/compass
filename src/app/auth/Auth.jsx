"use client";

import Image from "next/image";
import AuthImage from "../../../public/images/auth-image.png";
import AppleSvg from "../../../public/icons/apple.svg";
import GoogleSvg from "../../../public/icons/google.svg";
import BackSvg from "../../../public/icons/back.svg";
import { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import { db, auth } from "../../../firebase/config";
import { useRouter } from "next/navigation";
import { ProfileContext } from "@/layouts/Providers";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";

const actionCodeSettings = {
  handleCodeInApp: true,
};

export default function Auth() {
  const [isOpenCreateProfile, setIsOpenCreateProfile] = useState(false);
  const [emailInputValue, setEmailInputValue] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const { profile, setProfile } = useContext(ProfileContext);
  const router = useRouter();

  const handleSignInApple = async () => {
    setEmailInputValue("");
    try {
      // Create the OAuth provider instance for Apple
      const appleProvider = new OAuthProvider("apple.com");
      appleProvider.addScope("email");
      appleProvider.addScope("name");

      // Sign in using the popup method
      const userCredential = await signInWithPopup(auth, appleProvider);

      const user = userCredential.user;
      console.log("User signed in with Apple: ", user);

      // Proceed with user data
      // If the user is new, you can handle user registration here
      if (userCredential.additionalUserInfo.isNewUser) {
        console.log("New user signed in via Apple!");
        // Additional registration logic, if necessary
      } else {
        console.log("Returning user signed in via Apple");
      }
    } catch (error) {
      console.error("Error signing in with Apple: ", error);
    }
  };

  const handleLogInGoogle = async () => {
    setEmailInputValue("");
    setAuthMessage("");

    const provider = new GoogleAuthProvider();
    try {
      setAuthMessage("Please wait account getting...");
      const result = await signInWithPopup(auth, provider);

      if (result) {
        const user = result.user;
        const userDocRef = doc(db, "users", user.uid); // Correct way to reference a document
        const userProfile = {
          name: user.displayName,
          avatar: user.photoURL,
          email: user.email,
          uid: user.uid,
          refreshToken: user.refreshToken,
          notificationSettings: {
            sendEmail: true,
            sendPush: true,
            sendUpdate: true,
          },
          isActive: true,
        };

        // Fetch user data and set profile
        getDoc(userDocRef).then((docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data()); // Set profile from Firestore if exists
          } else {
            // If document doesn't exist, set the new document
            setDoc(userDocRef, userProfile)
              .then(() => {
                setProfile(userProfile); // Set the profile once the document is created
              })
              .catch((error) => {
                console.error("Error setting document: ", error);
              });
          }

          // Ensure this happens after profile is set
          setAuthMessage("");
          router.push("/");
        });
      }
    } catch (error) {
      setAuthMessage("Something Went Wrong");
    }
  };

  const handleSignInProfile = () => {
    sendSignInLinkToEmail(auth, emailInputValue, {
      url: window.location.href,
      ...actionCodeSettings,
    })
      .then(() => {
        document.cookie = `emailForSignIn=${emailInputValue}; path=/; expires=${new Date(
          new Date().getTime() + 86400000
        ).toUTCString()}; Secure; SameSite=Lax;`;

        setAuthMessage("Link sended ,Please check your email");
      })
      .catch((err) => {
        setAuthMessage("Something went wrong");
      });
  };

  const createOrGetProfile = async (user) => {
    const userDocRef = doc(db, "users", user.uid);
    const userProfile = {
      name: user.displayName,
      avatar: user.photoURL,
      email: user.email,
      uid: user.uid,
      refreshToken: user.refreshToken,
      notificationSettings: {
        sendEmail: true,
        sendPush: true,
        sendUpdate: true,
      },
      isActive: true,
      lastActiveAt: Date.now(),
    };

    try {
      setAuthMessage("Please wait account getting...");
      getDoc(userDocRef).then(async (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          setProfile(userProfile);
          await setDoc(userDocRef, userProfile);
        }
        setIsOpenCheckEmail("");
        router.push("/");
      });
    } catch (error) {}
  };

  useEffect(() => {
    const handleSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const cookies = document.cookie.split("; ");
        const emailCookie = cookies.find((cookie) =>
          cookie.startsWith("emailForSignIn=")
        );
        const email = emailCookie ? emailCookie.split("=")[1] : null;

        if (!email) {
          setAuthMessage("Please register by Google or Safari");
          return;
        }

        try {
          const result = await signInWithEmailLink(
            auth,
            email,
            window.location.href
          );

          await createOrGetProfile(result.user);
        } catch (error) {
          setAuthMessage('Something Went Wrong')
        }
      }
    };

    handleSignIn();
  }, []);

  return (
    <div
      className={clsx(
        "fixed h-screen w-screen bg-white z-10 flex flex-col items-center top-0 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      )}
    >
      <Image
        src={AuthImage}
        width={0}
        height={0}
        priority
        alt="Welcome Back"
        className={clsx(
          "desktop-big:w-[500px] desktop-big:h-[700px] mobile:w-screen mobile:h-auto",
          isOpenCreateProfile ? "hidden" : "block"
        )}
      />
      <div
        className={clsx(
          "w-screen flex-col items-center absolute z-20 gap-5 px-4 pb-4 h-max top-[355px] pt-16 auth-login",
          isOpenCreateProfile ? "hidden" : "flex"
        )}
      >
        <span className="flex items-center flex-col mt-auto">
          <h1 className="font-semibold text-3xl text-center">Welcome back!</h1>
          <h3 className="text-xl text-center text-[#848282]">
            Login to continue.
          </h3>
        </span>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-2.5 w-full"
        >
          <label htmlFor="log-email" className="font-semibold">
            Email
          </label>
          <input
            value={emailInputValue}
            onChange={(e) => setEmailInputValue(e.target.value)}
            id="log-email"
            className="border-[#D2D2D2] border rounded-[20px] p-4 outline-none text-[#848282]"
            placeholder="Enter your email address"
          />
          {authMessage.length !== 0 && (
            <span className="opacity-70 text-xl">{authMessage}</span>
          )}
        </form>
        <button
          onClick={() => handleSignInProfile()}
          disabled={!emailInputValue.length}
          className={clsx(
            "rounded-[20px] p-4 text-center font-medium w-full",
            emailInputValue
              ? "bg-main-blue text-white"
              : "bg-[#D2D2D2]/30 text-[#848282]"
          )}
        >
          Login
        </button>
        <div className="flex flex-col gap-2.5 w-full">
          <div className="flex justify-between gap-2.5 h-[21px] items-center">
            <div className="bg-[#D2D2D2] h-[1px] w-[30%]"></div>
            <span className="text-[#D2D2D2] text-sm">Or Login with</span>
            <div className="bg-[#D2D2D2] h-[1px] w-[30%]"></div>
          </div>
          <button
            onClick={handleSignInApple}
            className="border border-[#D2D2D2] py-4 text-dark-blue font-medium text-sm flex items-center justify-center gap-2.5 rounded-[20px]"
          >
            <AppleSvg /> Log in to Apple
          </button>
          <button
            onClick={() => handleLogInGoogle()}
            className="border border-[#D2D2D2] py-4 text-dark-blue font-medium text-sm flex items-center justify-center gap-2.5 rounded-[20px]"
          >
            <GoogleSvg /> Log in to Google
          </button>
        </div>
        <button
          onClick={() => (
            setIsOpenCreateProfile(true),
            setEmailInputValue(""),
            authMessage.length && setAuthMessage("")
          )}
          className="font-medium text-dark-blue"
        >
          Don’t have an account?{" "}
          <span className="font-semibold text-main-blue">Create</span>
        </button>
      </div>
      <div
        className={clsx(
          "h-full w-screen fixed  transition-all flex flex-col duration-700 bg-white z-30 pb-5 safe-top overflow-hidden px-2",
          isOpenCreateProfile ? "left-0" : "left-[2000px]"
        )}
      >
        <button
          className="p-2 mt-5"
          onClick={() => (
            setIsOpenCreateProfile(false),
            setEmailInputValue(""),
            authMessage.length && setAuthMessage("")
          )}
        >
          <BackSvg />
        </button>
        <div className="p-2 flex flex-col w-full items-center mt-4 gap-2.5">
          <h2 className="font-semibold text-xl">Create an account</h2>
          <h4 className="text-sm opacity-40 text-center">
            Fill your information below or register with your social account.
          </h4>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col justify-start gap-2.5 w-full"
          >
            <label
              htmlFor="create-email"
              className="text-sm font-semibold flex"
            >
              Email<p className="text-red-600">*</p>
            </label>
            <input
              value={emailInputValue}
              onChange={(e) => setEmailInputValue(e.target.value)}
              id="create-email"
              className="border border-[#D2D2D2] rounded-[20px] p-4 w-full outline-none text-[#848282]"
              placeholder="Enter your email address"
            />
          </form>
          <div className="flex flex-col gap-2.5 w-full">
            {authMessage.length !== 0 && (
              <span className="opacity-70 text-xl">{authMessage}</span>
            )}
            <div className="flex justify-between gap-2.5 h-[21px] items-center">
              <div className="bg-[#D2D2D2] h-[1px] w-[30%]"></div>
              <span className="text-[#D2D2D2] text-sm">Or Login with</span>
              <div className="bg-[#D2D2D2] h-[1px] w-[30%]"></div>
            </div>
            <button className="border border-[#D2D2D2] py-4 text-dark-blue font-medium text-sm flex items-center justify-center gap-2.5 rounded-[20px]">
              <AppleSvg /> Log in to Apple
            </button>
            <button
              onClick={() => handleLogInGoogle()}
              className="border border-[#D2D2D2] py-4 text-dark-blue font-medium text-sm flex items-center justify-center gap-2.5 rounded-[20px]"
            >
              <GoogleSvg /> Log in to Google
            </button>
          </div>
        </div>
        <div className="mt-auto p-2">
          <button
            disabled={!emailInputValue.length}
            onClick={() => handleSignInProfile()}
            className={clsx(
              "p-4 rounded-[20px] mt-auto w-full font-medium transition-all duration-300",
              emailInputValue
                ? "bg-main-blue text-white"
                : "bg-[#D2D2D2]/30 text-[#848282]"
            )}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
