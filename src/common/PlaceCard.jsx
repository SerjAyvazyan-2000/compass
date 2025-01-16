"use client";

import StarSvg from "../../public/icons/star.svg";
import BookmarkSvg from "../../public/icons/bookmark.svg";
import LocationSvg from "../../public/icons/location.svg";
import ShareSvg from "../../public/icons/share.svg";
import clsx from "clsx";
import {useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {ProfileContext} from "@/layouts/Providers";
import {
    deleteField,
    doc,
    updateDoc,
} from "firebase/firestore";
import {db} from "../../firebase/config";

export function PlaceCard({
                              width,
                              shadowDiv,
                              ratingDiv,
                              shareButton,
                              bookMarkSize,
                              locationStyles,
                              height,
                              id,
                              isInWishlistProp,
                              place,
                          }) {

    const [isInWishlist, setIsInWishlist] = useState(isInWishlistProp);
    const {profile} = useContext(ProfileContext);
    const router = useRouter();

    async function addOrDeleteFromWishlist() {
        if (!profile) {
            router.push("/auth");
            return;
        }
        setIsInWishlist(!isInWishlist);
        const userRef = doc(db, "users", profile.uid);

        if (!isInWishlist) {
            // Add to wishlist
            await updateDoc(userRef, {
                [`wishlist.${id}`]: id,
            });
        } else {
            // Remove from wishlist
            await updateDoc(userRef, {
                [`wishlist.${id}`]: deleteField(),
            });
        }
    }

    useEffect(() => {
        setIsInWishlist(isInWishlistProp);
    }, [isInWishlistProp]);

    return (
        <>
            <div
                style={{
                    width: width ? `${width}px` : "100%",
                    height: `${height}px`,
                }}
                className={clsx("relative cursor-pointer flex")}
            >
                {shadowDiv && (
                    <div
                        className={clsx(
                            "absolute rounded-[20px] bg-[#03184E] blur-md",
                            shadowDiv
                        )}
                    ></div>
                )}

                <button
                    onClick={() => router.push(`/place-card/${id}`)}
                    className="absolute w-full h-full"
                >
                    <img
                        loading="lazy"
                        src={place?.feeds && place?.feeds !== undefined ? place.feeds[0].image : null}
                        width={100}
                        height={100}
                        alt={`View of ${place?.name}`}
                        className="object-cover w-full h-full object-center  rounded-[20px]"
                    />
                </button>
                <div
                    className={clsx(
                        "absolute top-3 left-3 flex items-center justify-center bg-[#323231]/80 rounded-full",
                        ratingDiv
                    )}
                >
                    <StarSvg className={clsx()}/>
                    <h4 className={clsx("text-[#CAC8C8]")}>{place?.rating}</h4>
                </div>
                <span className="top-3 right-3 absolute flex items-center gap-2.5">
          {shareButton && (
              <button>
                  <ShareSvg
                      className={clsx("[&_path]:stroke-black", shareButton)}
                  />
              </button>
          )}

                    <button
                        onClick={() => addOrDeleteFromWishlist()}
                        aria-label={
                            isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                        }
                    >
            <BookmarkSvg
                className={clsx(
                    "transition-all duration-300",

                    isInWishlist
                        ? "[&_path]:fill-[#FF2D55] [&_path]:stroke-[#FF2D55]"
                        : "[&_path]:stroke-black",
                    bookMarkSize
                )}
            />
          </button>
        </span>
                <div className="absolute bottom-3 px-3 flex w-full justify-center">
                    <div
                        className={clsx(
                            "bg-[#323131]/80 w-full flex items-center",
                            locationStyles
                        )}
                    >
                        <div>
                            <LocationSvg className="w-[11px] h-[13px]"/>
                        </div>
                        <h2 className={clsx("font-medium break-words text-white")}>
                            {place?.name}
                        </h2>
                    </div>
                </div>
            </div>
        </>
    );
}

export function PlaceCardInWishlist({isInWishlistProp, place}) {
    return (
        <PlaceCard
            height={168}
            shadowDiv="w-2/3 h-[120px] top-[52px] left-[15%]"
            ratingDiv="p-1 [&_svg]:w-3 [&_svg]:h-3 [&_h4]:text-[10px]"
            bookMarkSize="w-4 h-[18px]"
            shareButton="h-5 w-5"
            locationStyles="py-2 px-1 rounded-md gap-1.5 [&_h2]:text-xs"
            isInWishlistProp={isInWishlistProp}
            id={place.id}
            place={place}
        />
    );
}

export function PlaceCardBigSize({place, isInWishlistProp}) {
    return (
        <PlaceCard
            isInWishlistProp={isInWishlistProp}
            id={place?.id}
            height={270}
            width={270}
            shadowDiv="w-[209px] h-[242px] top-[36px] left-7"
            ratingDiv="p-1 [&_svg]:w-3 [&_svg]:h-3 [&_h4]:text-[10px]"
            bookMarkSize="w-[22px] h-6"
            locationStyles="p-2.5 gap-2.5 rounded-[10px] [&_h2]:text-base"
            place={place}
        />
    );
}

export function PlaceCardSmallSize({place, isInWishlistProp}) {
    return (
        <PlaceCard
            isInWishlistProp={isInWishlistProp}
            id={place?.id}
            height={166}
            width={166}
            shadowDiv="w-[113px] h-[120px] top-[52px] left-7"
            ratingDiv="p-1 [&_svg]:w-3 [&_svg]:h-3 [&_h4]:text-[10px]"
            bookMarkSize="w-4 h-[18px]"
            shareButton="h-5 w-5"
            locationStyles="py-2 px-1 rounded-md gap-1.5 [&_h2]:text-xs"
            place={place}
        />
    );
}

export function PlaceCardRecommendedView({place, isInWishlistProp}) {
    return (
        <PlaceCard
            isInWishlistProp={isInWishlistProp}
            id={place.id}
            height={166}
            ratingDiv="p-1 [&_svg]:w-4 [&_svg]:h-4 [&_h4]:text-base"
            bookMarkSize="w-[22px] h-6"
            locationStyles="p-2.5 gap-2.5 rounded-[10px] [&_h2]:text-base"
            place={place}
        />
    );
}
