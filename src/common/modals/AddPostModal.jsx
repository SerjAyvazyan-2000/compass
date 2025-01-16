import clsx from "clsx";
import { useContext, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import SpinnerSvg from "../../../public/icons/spinner.svg";
import CloseXSvg from "../../../public/icons/close.svg";
import { UploadFile } from "../UploadFile";
import { ProfileContext } from "@/layouts/Providers";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../firebase/config";
import { addDoc, collection } from "firebase/firestore";

export function AddPostModal({ isOpenAddPost, setIsOpenAddPost, setFeeds }) {
  const [tagInput, setTagInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [tagsValue, setTagsValue] = useState([]);
  const [isOpenTagsView, setIsOpenTagsView] = useState(true);
  const [addPostFileConfig, setAddPostFileConfig] = useState(null);
  const [addPostPreviewFile, setAddPostPreviewFile] = useState(null);
  const [filePutDatabase, setFilePutDatabase] = useState(null);
  const [loading, setLoading] = useState(false);
  const { profile, setProfile } = useContext(ProfileContext);
  const swipeAddPostRef = useRef(null);

  async function handleAddFeedPost() {
    setLoading(true);
    if (!filePutDatabase) {
      setLoading(false);
      return;
    }
    try {
      const storageRef = ref(storage, `feeds/${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, filePutDatabase);
      const getImageUrl = await getDownloadURL(snapshot.ref);

      const feedsRef = collection(db, "feeds");

      const newFeed = {
        imageUrl: getImageUrl,
        tags: tagsValue,
        title: titleInput,
        text: textInput,
        createdAt: Date.now(),
      };
      if (profile) {
        const newFeedWithUser = {
          ...newFeed,
          userId: profile.uid,
        };
        await addDoc(feedsRef, newFeedWithUser);
        setFeeds((prev) => [
          { ...newFeedWithUser, userData: profile },
          ...prev,
        ]);
      } else {
        await addDoc(feedsRef, newFeed);
        setFeeds((prev) => [newFeed, ...prev]);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
      setIsOpenAddPost(false);
      setAddPostPreviewFile(null);
      setAddPostFileConfig(null);
      setTagsValue([]);
      setTextInput("");
      setTitleInput("");
    }
  }

  const handleSetTagsKeyDown = (e) => {
    if (tagInput.length && !tagsValue.includes(tagInput)) {
      if (e.key === "Enter") {
        const tag = tagInput.split(" ").join("");
        setTagsValue([tag, ...tagsValue]);
        setTagInput("");
        setIsOpenTagsView(true);
      }
    }
  };

  const swipeable = useSwipeable({
    onSwiping: (eventData) => {
      if (eventData.dir === "Down" && swipeAddPostRef.current) {
        const newTranslateY = Math.max(eventData.absY, 0);

        swipeAddPostRef.current.style.transform = `translateY(${newTranslateY}px)`;
      }
    },
    onSwiped: (eventData) => {
      if (swipeAddPostRef.current) {
        if (eventData.absY > 80 && eventData.dir === "Down") {
          setIsOpenAddPost(false);
        }

        swipeAddPostRef.current.style.transform = `translateY(0px)`;
      }
    },
  });

  return (
    <>
      <div
        className={clsx(
          "h-screen z-10 transition-colors fixed top-0 duration-1000",
          isOpenAddPost ? "bg-black/65 w-screen" : "bg-transparent w-0"
        )}
      ></div>
      <div
        id="add-post"
        onClick={(e) => e.target.id === "add-post" && setIsOpenAddPost(false)}
        ref={swipeAddPostRef}
        className={clsx(
          "transition-all duration-1000 fixed flex z-20 top-0 w-full h-screen"
        )}
        style={{
          transform: `translateY(${!isOpenAddPost ? 4000 : 0}px)`,
        }}
      >
        <div className="rounded-t-[20px] bg-white w-screen mt-auto desktop:h-[90%] h-max pt-2.5 px-2.5 pb-7">
          <div className="flex items-center flex-col w-full h-full">
            <div
              {...swipeable}
              onDoubleClick={() => setIsOpenAddPost(false)}
              className="flex items-center flex-col w-full gap-2.5 cursor-pointer"
            >
              <span className="min-h-1 w-20 bg-[#D9D9D9]" />
              <h6 className="text-dark-blue font-medium">Add post</h6>
            </div>
            <div className="flex items-center flex-col w-full gap-2.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] h-full">
              <input
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="Enter the title"
                className="border p-4 border-[#D2D2D2] rounded-[20px] w-full outline-none"
              />
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter the text"
                className="border p-4 border-[#D2D2D2] rounded-[20px] w-full max-h-[265px] desktop:min-h-[100px] min-h-[150px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] outline-none"
              ></textarea>
              {tagsValue.length && isOpenTagsView ? (
                <div
                  id="tag-view"
                  onClick={(e) => {
                    e.target.id === "tag-view" && setIsOpenTagsView(false);
                  }}
                  className="border border-[#D2D2D2] rounded-[20px] w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 py-2.5 flex items-center overflow-x-auto gap-2.5"
                >
                  {tagsValue.map((tag) => {
                    return (
                      <span
                        className="bg-main-blue/10 pl-3 text-sm py-2 rounded-[20px] flex gap-2.5 items-center"
                        key={tag}
                      >
                        <button
                          onClick={() => (
                            setTagInput(tag),
                            setIsOpenTagsView(false),
                            setTagsValue(
                              tagsValue.filter((tagValue) => tagValue !== tag)
                            )
                          )}
                          className="text-[14px] leading-[16px]"
                        >
                          #{tag}
                        </button>
                        <button
                          onClick={() =>
                            setTagsValue(
                              tagsValue.filter((tagValue) => tagValue !== tag)
                            )
                          }
                          className="pr-2"
                        >
                          <CloseXSvg />
                        </button>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <input
                  value={tagInput}
                  onBlur={() => setIsOpenTagsView(true)}
                  onKeyDown={handleSetTagsKeyDown}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="border border-[#D2D2D2] rounded-[20px] w-full p-4 outline-none"
                  placeholder="Enter the tags"
                />
              )}
              <UploadFile
                fileConfig={addPostFileConfig}
                setFileConfig={setAddPostFileConfig}
                previewFile={addPostPreviewFile}
                setPreviewFile={setAddPostPreviewFile}
                filePutDatabase={filePutDatabase}
                setFilePutDatabase={setFilePutDatabase}
              />
            </div>
            <button
              disabled={loading}
              onClick={handleAddFeedPost}
              className={clsx(
                "rounded-[20px] font-roboto p-4 mx-auto font-medium leading-[18px] transition-all duration-300 text-white h-14",
                loading ? "bg-[#D2D2D2]/50 w-max" : "bg-main-blue w-full"
              )}
            >
              {loading ? (
                <SpinnerSvg className="fill-[#848282] mx-auto animate-spin" />
              ) : (
                <>{addPostFileConfig && "Add "}Post</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
