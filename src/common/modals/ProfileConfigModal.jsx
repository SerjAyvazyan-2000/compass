"use client";

import { UploadFile } from "../UploadFile";
import BackSvg from "../../../public/icons/back.svg";
import SpinnerSvg from "../../../public/icons/spinner.svg";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import clsx from "clsx";
import { auth, db, storage } from "../../../firebase/config";
import { updateProfile } from "firebase/auth";
import { doc,updateDoc } from "firebase/firestore";


export function ProfileConfigModal({
  setProfile,
  profile,
  isOpenProfileConfig,
  setIsOpenProfileConfig,
  setNameInputValue,
  nameInputValue,
  profileAvatarPreviewFile,
  setProfileAvatarPreviewFile,
}) {
  const [profileAvatarConfig, setProfileAvatarConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filePutDatabase, setFilePutDatabase] = useState(null);

  async function handleChangeProfileConfig() {
    setLoading(true);
    if (filePutDatabase) {
      try {
        const storageRef = ref(storage, `avatars/${profile.uid}`);
        const snapshot = await uploadBytes(storageRef, filePutDatabase);
        const getImageUrl = await getDownloadURL(snapshot.ref);
         await updateProfile(auth.currentUser, {
          displayName: nameInputValue,
          photoURL: getImageUrl,
        });
        const updates = {}
        updates['name'] = nameInputValue
        updates['avatar'] = getImageUrl
        const userDocRef = doc(db,'users/'+`${profile.uid}`)
        updateDoc(userDocRef,updates)
        setProfile({ ...profile, avatar: getImageUrl, name: nameInputValue });
        setProfileAvatarConfig(null)
      } catch (error) {
      } finally {
        setLoading(false);
        setIsOpenProfileConfig(false);
      }
    }
  }
  return (
    <>
      {profile && (
        <div
          className={clsx(
            "flex flex-col items-center gap-2.5 fixed z-20 top-0 transition-all overflow-x-hidden duration-700 safe-top w-screen pb-6 overflow-y-auto bg-white px-4 h-screen",
            isOpenProfileConfig ? "translate-x-0" : "translate-x-[2000px]"
          )}
        >
          <div className="flex items-center w-full py-4 mt-2.5">
            <button
              className="pl-1 py-1"
              onClick={() => (
                setIsOpenProfileConfig(false),
                setProfileAvatarPreviewFile(profile.avatar),
                setNameInputValue(profile.name),
                setProfileAvatarConfig(null)
              )}
            >
              <BackSvg />
            </button>
            <h4 className="font-medium mx-auto py-1">Profile</h4>
          </div>
          <UploadFile
            filePutDatabase={filePutDatabase}
            setFilePutDatabase={setFilePutDatabase}
            setPreviewFile={setProfileAvatarPreviewFile}
            previewFile={profileAvatarPreviewFile}
            showUploadedImage={true}
            fileConfig={profileAvatarConfig}
            setFileConfig={setProfileAvatarConfig}
          />
          <form className="flex flex-col gap-2.5 w-full -mt-2 ">
            <label htmlFor="profile-name" className="text-sm font-semibold">
              Name
            </label>
            <input
              id="profile-name"
              value={nameInputValue}
              placeholder={
                profile
                  ? profile.name
                    ? profile.name
                    : "e.g. Maria"
                  : "e.g. Maria"
              }
              onChange={(e) => setNameInputValue(e.target.value)}
              className="rounded-[20px] border p-4 border-[#D2D2D2] w-full text-[#848282] outline-none"
            />
            <span className="text-sm font-semibold">Email</span>
            <span className="rounded-[20px] border p-4 bg-[#D2D2D2]/50 w-full outline-none text-[#848282]">
              {profile
                ? profile.email
                  ? profile.email
                  : "e.g. test@gmail.com"
                : "e.g. test@gmail.com"}
            </span>
          </form>

          <button
            disabled={loading}
            onClick={handleChangeProfileConfig}
            className={clsx(
              "rounded-[20px] mt-auto p-4 text-white font-medium transition-all duration-300",
              loading ? "bg-[#D2D2D2]/50 w-max" : "bg-main-blue w-full"
            )}
          >
            {loading ? (
              <SpinnerSvg className="fill-[#848282] mx-auto animate-spin" />
            ) : (
              "Save"
            )}
          </button>
        </div>
      )}
    </>
  );
}
