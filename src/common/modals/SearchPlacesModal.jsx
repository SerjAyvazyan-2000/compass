"use client";

import BackSvg from "../../../public/icons/back.svg";
import TimeSvg from "../../../public/icons/time.svg";
import FilterSvg from "../../../public/icons/filter.svg";
import CloseXSvg from "../../../public/icons/close.svg";
import {useEffect, useState} from "react";
import { useLocalStorage } from "react-use";
import { PlaceCardSmallSize } from "@/common/PlaceCard";
import { RecommendedPlaces } from "@/common/RecommendedPlaces";
import { FilterModal } from "./FilterModal";
import { useDebounce } from "react-use";

export function SearchPlacesModal({
  handleCloseModal,
  searchValue,
  setSearchValue,
}) {
  const [recentlySearches, setRecentlySearches] = useLocalStorage(
    "searched-values",
    []
  );
  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false);
  const [searchDebouncedValue, setSearchDebouncesValue] = useState("");
  const [_] = useDebounce(
    () => {
      if (!recentlySearches.includes(searchValue)) {
        setSearchDebouncesValue(searchValue);
        if (
          searchDebouncedValue.length &&
          !recentlySearches.includes(searchDebouncedValue)
        ) {
          const isOverLimit = recentlySearches.length >= 4;
          if (isOverLimit) {
            recentlySearches.pop();
          }

          setRecentlySearches([searchDebouncedValue, ...recentlySearches]);
        }
      }
    },
    1000,
    [searchValue, searchDebouncedValue, recentlySearches, setRecentlySearches]
  );

  useEffect(()=>{
    console.log(recentlySearches,'recentlySearches')
  },[recentlySearches])

  return (
    <>
      <FilterModal
        isOpenFilterModal={isOpenFilterModal}
        handleCloseFilter={() => setIsOpenFilterModal(false)}
      />
      <div className="px-4 w-full h-screen z-10 top-0 fixed overflow-y-auto safe-top bg-white">
        <div className="flex items-center justify-center gap-2.5 mt-2.5 desktop:pt-2 pb-2.5 pt-5">
          <button
            className="py-2.5 px-0.5"
            onClick={() => (setSearchValue(""), handleCloseModal())}
          >
            <BackSvg />
          </button>
          <input
            autoFocus
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full border-2 rounded-[20px] p-4 font-medium flex gap-[1px] placeholder:pl-2 placeholder:font-normal placeholder-shown:text-main-blue border-[#D2D2D2] text-[#5A5A5A] outline-none"
            placeholder="Where do you plan to go?"
          />
          {searchDebouncedValue.length > 0 && (
            <button onClick={() => setIsOpenFilterModal(true)}>
              <FilterSvg />
            </button>
          )}
        </div>
        {searchDebouncedValue.length > 0 ? (
          <div className="py-2.5 flex flex-col gap-2.5 w-full overflow-y-auto">
            <div className="">
              <h2 className="font-medium text-dark-blue">
                Place Name&quot;{searchValue}&quot;
              </h2>
            </div>
            <div className="mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 mobile-min:grid-cols-1 pb-14 lg:grid-cols-4 gap-2.5 ">
              <PlaceCardSmallSize
                placeImage={"/images/placeImage.jpeg"}
                placeName={"Lake Como"}
                placeRating={4.9}
              />
              <PlaceCardSmallSize
                placeImage={"/images/placeImage.jpeg"}
                placeName={"Lake Como"}
                placeRating={4.9}
              />
              <PlaceCardSmallSize
                placeImage={"/images/placeImage.jpeg"}
                placeName={"Lake Como"}
                placeRating={4.9}
              />
              <PlaceCardSmallSize
                placeImage={"/images/placeImage.jpeg"}
                placeName={"Lake Como"}
                placeRating={4.9}
              />
              <PlaceCardSmallSize
                placeImage={"/images/placeImage.jpeg"}
                placeName={"Lake Como"}
                placeRating={4.9}
              />
              <PlaceCardSmallSize
                placeImage={"/images/placeImage.jpeg"}
                placeName={"Lake Como"}
                placeRating={4.9}
              />
            </div>
          </div>
        ) : (
          <div className="py-2.5 flex flex-col gap-2.5">
            {recentlySearches.length !== 0 && (
              <>
                <h2 className="font-semibold text-dark-blue">
                  Recently Search
                </h2>
                {recentlySearches.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <button
                      onClick={() => setSearchValue(item)}
                      className="flex items-center gap-1.5 w-2/3"
                    >
                      <TimeSvg />
                      <span className="opacity-40 text-sm">{item}</span>
                    </button>
                    <button
                      onClick={() =>
                        setRecentlySearches(
                          recentlySearches.filter((_, i) => i !== idx)
                        )
                      }
                      className="p-2"
                    >
                      <CloseXSvg />
                    </button>
                  </div>
                ))}
              </>
            )}
            <h2 className="font-semibold text-dark-blue">Recommended</h2>
            <RecommendedPlaces />
          </div>
        )}
      </div>
    </>
  );
}
