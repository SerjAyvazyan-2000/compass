import clsx from "clsx";
import CameraSvg from "../../public/icons/camera.svg";
import TrashSvg from "../../public/icons/trash.svg";
import BackSvg from "../../public/icons/back.svg";
import { useState } from "react";
import Image from "next/image";

export function UploadFile({
  fileConfig,
  setFileConfig,
  showUploadedImage,
  setPreviewFile,
  previewFile,
  setFilePutDatabase,
}) {
  const [isOpenViewFile, setIsOpenViewFile] = useState(false);

  const handleAddPostFile = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile.size <= 25 * 1024 * 1024) {
      setFileConfig({
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
      });

      if (uploadedFile.type.startsWith("image/")) {
        setFilePutDatabase(uploadedFile);
        setPreviewFile(URL.createObjectURL(uploadedFile));
      }
    }
  };

  return (
    <>
      <div
        className={clsx(
          "border border-[#D2D2D2] w-full h-max mb-2.5 rounded-md",
          fileConfig ? "border-solid" : "border-dashed"
        )}
      >
        {!fileConfig && !previewFile ? (
          <label
            htmlFor="file-post"
            className="flex p-4 items-center cursor-pointer flex-col gap-3"
          >
            <span className="p-2 rounded-full bg-[#F5F5F5] flex items-center justify-center">
              <CameraSvg className="w-6 h-6" />
            </span>
            <span className="font-medium text-main-blue text-sm">
              Click to Upload
            </span>
            <span className="text-xs text-[#353535]">
              (Max. File size: 25 MB)
            </span>
            <input
              accept="image/*"
              id="file-post"
              className="hidden"
              onChange={handleAddPostFile}
              type="file"
            />
          </label>
        ) : (
          <div className="p-4 w-full flex items-start gap-3">
            {showUploadedImage && previewFile ? (
              <img
                fetchPriority="high"
                src={previewFile}
                alt={
                  fileConfig
                    ? fileConfig.name.length
                      ? fileConfig.name
                      : "profile avatar"
                    : "profile-avatar"
                }
                className="rounded-full object-cover w-[60px] h-[60px]"
              />
            ) : (
              <span className="w-max">
                <CameraSvg className="w-5 h-5" />
              </span>
            )}
            <div
              onClick={() => setIsOpenViewFile(true)}
              className="flex items-start cursor-pointer flex-col"
            >
              <p className="font-medium text-sm break-words">
                {" "}
                {fileConfig
                  ? fileConfig.name.length < 20
                    ? fileConfig.name
                    : fileConfig.name.split("_").slice(0, 3).join(" ")
                  : ""}
              </p>
              <span className="text-[#848282] text-xs leading-5">
                {fileConfig &&
                  fileConfig.size &&
                  (fileConfig.size / 1024).toFixed(2) + " KB"}
              </span>
              <span className="text-main-blue font-semibold text-sm leading-5 my-auto">
                Click to view
              </span>
            </div>
            <button
              className="ml-auto"
              onClick={() => (setPreviewFile(null), setFileConfig(null))}
            >
              <TrashSvg />
            </button>
          </div>
        )}
      </div>
      <div
        id="file-view"
        onClick={(e) => e.target.id === "file-view" && setIsOpenViewFile(false)}
        className={clsx(
          "absolute z-20 transition-all duration-700 top-0 bg-black/65 items-center justify-center flex",
          isOpenViewFile && previewFile
            ? "opacity-100 w-screen h-screen rounded-none"
            : "opacity-0 w-0 h-max"
        )}
      >
        <button
          onClick={() => setIsOpenViewFile(false)}
          className={clsx(
            isOpenViewFile ? "absolute top-[53px] left-2 p-3" : "hidden"
          )}
        >
          <BackSvg />
        </button>
        {previewFile && (
          <img
            src={previewFile}
            fetchPriority="high"
            className="w-full desktop:w-[500px] max-h-full"
            alt={
              fileConfig
                ? fileConfig.name.length
                  ? fileConfig.name
                  : "profile avatar"
                : "profile-avatar"
            }
          />
        )}
      </div>
    </>
  );
}
