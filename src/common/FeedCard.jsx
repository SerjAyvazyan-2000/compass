import ShareSvg from "../../public/icons/share.svg";
import BookmarkSvg from "../../public/icons/bookmark.svg";
import ProfileSvg from "../../public/icons/profile.svg";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { format } from "timeago.js";

export default function FeedCard({
  userData,
  title,
  text,
  image,
  tags,
  createdAt,
}) {
  return (
    <section className="border-[#D2D2D2]/50 rounded-[20px] border p-4 flex flex-col mx-auto mt-2.5 gap-1.5 mobile-md:w-full w-[343px] max-h-[100%] h-max">
      <div className="flex w-full justify-between">
        <div className="flex gap-2.5">
          <div>
            {userData && userData.avatar ? (
              <Image
                width={40}
                height={40}
                loading="lazy"
                src={userData.avatar}
                alt={userData.name}
                className="object-cover rounded-full w-10 h-10"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                <ProfileSvg className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="flex justify-center flex-col">
            <h5>{userData && userData.name ? userData.name : "Anonymous"}</h5>

            {userData ? (
              <h6 className="text-xs opacity-40">
                {userData.isActive
                  ? "Online"
                  : userData.lastActiveAt &&
                    formatDistanceToNow(new Date(userData.lastActiveAt), {
                      addSuffix: true,
                    })}
              </h6>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="flex gap-5 items-center">
          <BookmarkSvg className="w-[22px] h-6 [&_path]:stroke-[#848282]" />
        </div>
      </div>
      {title && <h4 className="font-semibold text-sm">{title}</h4>}
      {text && <p className="text-sm break-words">{text}</p>}
      <img
        loading="lazy"
        width={100}
        height={100}
        src={image}
        alt={title}
        className="w-full mx-auto h-[313px] object-cover rounded-[20px]"
      />
      <span className="flex gap-1 flex-wrap">
        {tags &&
          tags.length !== 0 &&
          tags.map((tag) => (
            <p key={tag} className="text-sm text-main-blue break-words">
              #{tag}
            </p>
          ))}
      </span>
      <span className="flex mt-1 items-center justify-between">
        <p className="text-sm opacity-40">{createdAt && format(createdAt)}</p>
        <button>
          <ShareSvg className="w-[15px] h-[19px]" />
        </button>
      </span>
    </section>
  );
}
