"use client";

import Link from "next/link";
import BookmarkSvg from "../../public/icons/bookmark.svg";
import HomeSvg from "../../public/icons/home.svg";
import GroupSvg from "../../public/icons/group.svg";
import QrSvg from "../../public/icons/qr.svg";
import FeedSvg from "../../public/icons/feed.svg";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export const Header = () => {
  const currentPath = usePathname();
  const router = useRouter();
  return (
    <header
      className={clsx(
        "flex w-screen justify-center pt-1.5 pb-5 px-4 [&_*]:mx-auto items-center bottom-0 bg-white fixed"
      )}
    >
      <Link
        className={clsx(currentPath === "/" && "[&_path]:fill-main-blue")}
        href={"/"}
      >
        <HomeSvg />
      </Link>
      <button
        className={clsx(currentPath === "/feed" && "[&_path]:fill-main-blue")}
        onClick={() => router.push("/feed")}
      >
        <FeedSvg />
      </button>
      <Link
        className="rounded-full bg-gradient-to-br from-main-blue to-[#38B7FF] p-3"
        href={"/galleon"}
      >
        <QrSvg />
      </Link>
      <Link href={"/wishlist"}>
        <BookmarkSvg
          className={clsx(
            "w-[22px] h-6",
            currentPath === "/wishlist"
              ? "[&_path]:stroke-main-blue"
              : "[&_path]:stroke-[#848282]"
          )}
        />
      </Link>
      <button
        className={clsx(
          currentPath === "/applications" && "[&_path]:fill-main-blue"
        )}
        onClick={() => router.push("/applications")}
      >
        <GroupSvg />
      </button>
    </header>
  );
};
