"use client";

import PlusSvg from "../../../public/icons/plus.svg";
import { useEffect, useState } from "react";
import { AddPostModal } from "@/common/modals/AddPostModal";
import { get, ref } from "firebase/database";
import FeedCard from "@/common/FeedCard";
import { db } from "../../../firebase/config";
import { Spinner } from "@/common/Spinner";
import { getLastFeedsPagination } from "@/utils/fetch-paginations";
import { useDebounce } from "react-use";
import { doc, getDoc } from "firebase/firestore";

export default function Feed() {
  const [isOpenAddPost, setIsOpenAddPost] = useState(false);

  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  // const [searchFeedVal, setSearchFeedVal] = useState('');
  // const [debouncedValue, setDebouncedValue] = useState('');

  // const [, cancel] = useDebounce(
  //   () => {

  //     setDebouncedValue(val);
  //   },
  //   2000,
  //   [val]
  // );

  useEffect(() => {
    async function getFeeds() {
      try {
        const { feedsArray } = await getLastFeedsPagination();
        if (feedsArray.length !== 0) {
          const getFeedUsers = await Promise.all(
            feedsArray.map(async (feed) => {
              if (!feed.userId) {
                return feed;
              }
              const userDocRef = doc(db, "users/" + feed.userId);
              
              const userSnapshot = await getDoc(userDocRef);

              if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                return {
                  ...feed,
                  userData: {
                    name: userData.name,
                    avatar: userData.avatar,
                    isActive: userData.isActive,
                    lastActiveAt: userData.lastActiveAt,
                  },
                };
              }
            })
          );
          setFeeds(getFeedUsers);
        }
      } catch (error) {
        console.error("Error fetching the last 15 feeds:", error);
      } finally {
        setLoading(false);
      }
    }
    getFeeds();
  }, []);

  const handleScroll = async (e) => {
   
    if (e.target.scrollHeight - Math.round(e.target.scrollTop) === e.target.clientHeight) {
      try {
        const { feedsArray } = await getLastFeedsPagination(
          feeds[feeds.length - 1]
        );
        if (feedsArray.length !== 0) {
          const getFeedUsers = await Promise.all(
            feedsArray.map(async (feed) => {
              if (!feed.userId) {
                return feed;
              }
              const usersGet = doc(db, "users/" + `${feed.userId}`);
              const userSnapshot = await getDoc(usersGet);

              if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                return {
                  ...feed,
                  userData: {
                    name: userData.name,
                    avatar: userData.avatar,
                    isActive: userData.isActive,
                    lastActiveAt: userData.lastActiveAt,
                  },
                };
              }
            })
          );
          setFeeds((prev) => [...prev, ...getFeedUsers]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <div
        onScroll={handleScroll}
        className="flex flex-col px-4 overflow-y-auto w-full h-screen safe-top"
      >
        <div className="flex items-start w-full py-2.5 mt-2.5">
          <h1 className="font-semibold text-3xl text-wrap text-dark-blue">
            Feed
          </h1>
        </div>
        <input
          className="w-full border-2 border-[#D2D2D2] rounded-[20px] mt-2.5 py-[18px] px-4 outline-none"
          placeholder="Search Feed"
        />
        <div className="flex flex-col w-full pb-20">
          {loading ? (
            <Spinner className="mx-auto mt-12" />
          ) : feeds.length !== 0 ? (
            feeds.map((feed, idx) => (
              <FeedCard
                key={idx}
                userData={feed.userData}
                image={feed.imageUrl}
                tags={feed.tags}
                title={feed.title}
                text={feed.text}
                createdAt={feed.createdAt}
              />
            ))
          ) : (
            <h2 className="text-[#848282] text-2xl mx-auto mt-12">No Feeds</h2>
          )}
        </div>
        <button
          onClick={() => setIsOpenAddPost(true)}
          aria-label="Add Post"
          className="fixed bottom-24 w-14 h-14 flex items-center justify-center rounded-full text-white right-6 bg-main-blue"
        >
          <PlusSvg />
        </button>
      </div>
      <AddPostModal
        setFeeds={setFeeds}
        isOpenAddPost={isOpenAddPost}
        setIsOpenAddPost={setIsOpenAddPost}
      />
    </>
  );
}
