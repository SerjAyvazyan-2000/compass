"use client";

import clsx from "clsx";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const VideoPlayer = ({url}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openIcons, setOpenIcons] = useState(true);
  const [isOpenVideoCover, setIsOpenVideoCover] = useState(true);

  // Toggle play/pause state and video playback
  const handlePlayPause = (e) => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsOpenVideoCover(false);
      setOpenIcons(false);
      setIsPlaying(true);
    } else if (!openIcons && isPlaying) {
      setOpenIcons(true);
    } else if (isPlaying && openIcons && e.target.id === "close-bg-icons") {
      setOpenIcons(false);
    } else if (openIcons) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (openIcons && isPlaying) {
        setOpenIcons(false);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isPlaying, openIcons]);

  return (
    <div
      style={{
        width: "342px",
        height: "342px",
        position: "relative",
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <video controls autoPlay loop muted style={{ width: '100%' }}>
        {/* Fallback video sources */}
        <source src={url} type="video/mp4" />
        <source src={url.replace('.mp4', '.webm')} type="video/webm" />
        <p>Your browser does not support the video tag.</p>
      </video>

      <Image
        src="/images/placeImage.jpeg"
        alt="place-image"
        width={342}
        height={342}
        className={clsx(
          "transition-all duration-500 absolute top-0 left-0",
          isOpenVideoCover ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        id="close-bg-icons"
        onClick={handlePlayPause}
        className={clsx(
          "transition-all duration-500 w-full h-full flex items-center justify-center absolute top-0",
          openIcons ? "bg-black/65 opacity-100" : "bg-transparent opacity-0"
        )}
      >
        {isPlaying ? (
          <svg
            width="56"
            height="60"
            viewBox="0 0 56 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="12" y="10" width="8" height="40" fill="white" />
            <rect x="36" y="10" width="8" height="40" fill="white" />
          </svg>
        ) : (
          // Play Icon

          <svg
            width="56"
            height="60"
            viewBox="0 0 56 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50.9432 22.2795C52.3441 23.0245 53.5159 24.1366 54.333 25.4966C55.1502 26.8566 55.5818 28.4133 55.5818 30C55.5818 31.5866 55.1502 33.1433 54.333 34.5033C53.5159 35.8634 52.3441 36.9754 50.9432 37.7204L13.5749 58.0408C7.55783 61.3162 0.166992 57.0579 0.166992 50.3233V9.67954C0.166992 2.94204 7.55783 -1.31337 13.5749 1.95621L50.9432 22.2795Z"
              fill="white"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
