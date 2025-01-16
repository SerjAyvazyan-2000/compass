"use client";
import React, { useContext} from "react";
import { PlaceCardSmallSize } from "./PlaceCard";
import { ProfileContext } from "@/layouts/Providers";
import Link from "next/link";

export function RecommendedPlaces({ recommendedPlaces }) {
    const {profile} = useContext(ProfileContext);

    return <>
    <div className={'flex mb-2.5 justify-between'}>
        <h2 className="text-dark-blue font-medium">
            Recommended Places
        </h2>
        <Link
            href="/recommended"
            className="ml-auto text-main-blue underline text-sm font-semibold leading-none"
        >
            See All
        </Link>
    </div>
    <div className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-x-auto">
        <div className="w-max flex pb-28 gap-[10px]">

            {recommendedPlaces ?
                recommendedPlaces.map((recommendedPlace) => {
                    return (
                        <PlaceCardSmallSize
                            isInWishlistProp={
                                profile &&
                                profile.wishlist &&
                                profile.wishlist.includes(recommendedPlace.id)
                            }
                            key={recommendedPlace.id}
                            place={recommendedPlace}
                        />
                    );
                }) : null
            }
        </div>
    </div>
    </>

}
