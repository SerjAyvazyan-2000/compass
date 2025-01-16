"use client";
import { PlaceCardInWishlist } from "@/common/PlaceCard";
import { Spinner } from "@/common/Spinner";
import { ProfileContext } from "@/layouts/Providers";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../../../firebase/config";

export default function Wishlist() {
  const { profile } = useContext(ProfileContext);
  const [loading, setLoading] = useState(false);
  const [wishlistPlaces, setWishlistPlaces] = useState([]);

  useEffect(() => {
    async function getWishlistPlaces() {
      setLoading(true);
      try {
        if (
          profile &&
          profile.wishlist.length !== 0 &&
          !wishlistPlaces.length
        ) {
          const places = await Promise.all(
            profile.wishlist.map(async (placeId) => {
              const placeRef = doc(db, "places/", placeId);
              const getPlace = await getDoc(placeRef);
              return { id: getPlace.id, ...getPlace.data() };
            })
          );
          if (places.length !== 0) {
            setWishlistPlaces(places);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getWishlistPlaces();
  }, [profile]);

  return (
    <div className="flex flex-col px-4 pb-28 w-screen h-screen overflow-y-auto safe-top">
      <div className="flex items-center w-full mb-5 justify-between mt-5">
        <h1 className="font-semibold text-3xl text-wrap text-dark-blue">
          Wishlist
        </h1>
      </div>
      {loading ? (
        <Spinner className={"mt-12 mx-auto"} />
      ) : (
        <>
          {wishlistPlaces.length !== 0 ? (
            <div className="mx-auto w-full grid mobile-min:grid-cols-1 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {wishlistPlaces.map((place) => (
                <PlaceCardInWishlist
                  isInWishlistProp={
                    profile &&
                    profile.wishlist &&
                    profile.wishlist.includes(place.id)
                  }
                  key={place.id}
                  place={place}
                />
              ))}
            </div>
          ) : (
            <h2 className="text-[#848282] text-xl mx-auto mt-12">No Places</h2>
          )}
        </>
      )}
    </div>
  );
}
