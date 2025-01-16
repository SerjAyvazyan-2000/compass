import { useRef, useState } from "react";
import BackSvg from "../../../public/icons/back.svg";
import StarSvg from "../../../public/icons/star.svg";
import CheckSvg from "../../../public/icons/check.svg";
import { categories } from "@/constants/categories";
import Image from "next/image";
import clsx from "clsx";
import { useSwipeable } from "react-swipeable";

export function FilterModal({ handleCloseFilter, isOpenFilterModal }) {
  const [selectedRate, setSelectedRate] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isOpenLocation, setIsOpenLocation] = useState(false);
  const [isAllLocationChecked, setIsAllLocationChecked] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const swipeLocationRef = useRef(null);

  const handleSelectLocation = ({ selectedLocation, isSelectedLocation }) => {
    if (isAllLocationChecked) {
      setIsAllLocationChecked(false);
    }
    isSelectedLocation
      ? setSelectedLocations((prev) =>
          prev.filter((selected) => selected !== selectedLocation)
        )
      : setSelectedLocations((prev) => [...prev, selectedLocation]);
  };

  const handleIsAllLocation = () => {
    selectedLocations.length
      ? (setIsAllLocationChecked(true), setSelectedLocations([]))
      : !isAllLocationChecked && setIsAllLocationChecked(true);
  };

  const swipeable = useSwipeable({
    onSwiping: (eventData) => {
      if (eventData.dir === "Down" && swipeLocationRef.current) {
        const newTranslateY = Math.max(eventData.absY, 0);

        swipeLocationRef.current.style.transform = `translateY(${newTranslateY}px)`;
      }
    },
    onSwiped: (eventData) => {
      if (swipeLocationRef.current) {
        if (eventData.absY > 80 && eventData.dir === "Down") {
          setIsOpenLocation(false);
        }

        swipeLocationRef.current.style.transform = `translateY(0px)`;
      }
    },
  });

  return (
    <>
      <div
        className={clsx(
          "w-screen h-screen bg-white fixed z-20 top-0 transition-all duration-700 safe-top pb-2.5",
          isOpenFilterModal ? "translate-x-0" : "translate-x-[1500px]"
        )}
      >
        <div className="w-full h-full pb-20 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] mt-2.5 [scrollbar-width:none]">
          <div className="flex items-center justify-between pt-[33px] desktop:py-[21px] px-4 w-full">
            <button onClick={handleCloseFilter} className="py-2.5 px-0.5">
              <BackSvg />
            </button>
            <h4 className="font-medium mx-auto font-roboto pr-3">Filter</h4>
          </div>
          <div className="flex flex-col gap-2.5 desktop:gap-2 py-2.5 desktop:py-0 px-4">
            <h5 className="text-dark-blue font-medium">Location</h5>
            <button
              onClick={() => setIsOpenLocation(true)}
              className="w-full p-4 justify-between rounded-[20px] border flex items-center border-[#D2D2D2] "
            >
              {" "}
              <span className="text-sm opacity-40 flex">
                {isAllLocationChecked
                  ? "All"
                  : !isAllLocationChecked && !selectedLocations.length
                  ? "Select"
                  : selectedLocations.length && selectedLocations.join(", ")}
              </span>
              <BackSvg className="rotate-180" />
            </button>
            <h5 className="text-dark-blue font-medium">Category</h5>
            <div className="flex flex-wrap gap-2.5">
              {categories.map((category, idx) => {
                const isSelectedCategory = selectedCategories.includes(
                  category.categoryName
                );
                return (
                  <button
                    onClick={() =>
                      isSelectedCategory
                        ? setSelectedCategories((prev) =>
                            prev.filter(
                              (selected) => selected !== category.categoryName
                            )
                          )
                        : setSelectedCategories((prev) => [
                            ...prev,
                            category.categoryName,
                          ])
                    }
                    key={idx}
                    className={clsx(
                      "flex w-max gap-1 border py-2.5 px-4 transition-all duration-300 items-center rounded-[20px]",
                      isSelectedCategory
                        ? "border-transparent bg-main-blue/10"
                        : "border-[#D2D2D2]"
                    )}
                  >
                    <Image
                      src={category.categoryIcon}
                      alt={category.categoryIcon}
                    />
                    <span
                      className={clsx(
                        "text-sm",
                        isSelectedCategory ? "text-main-blue" : "text-[#CAC8C8]"
                      )}
                    >
                      {category.categoryName}
                    </span>
                  </button>
                );
              })}
            </div>
            <h5 className="text-dark-blue font-medium">Text</h5>
            <button className="w-full p-4 justify-between rounded-[20px] border flex items-center border-[#D2D2D2] ">
              {" "}
              <span className="text-sm opacity-40">Select</span>
              <BackSvg className="rotate-180" />
            </button>
            <h5 className="text-dark-blue font-medium">Text</h5>
            <div className="flex gap-2.5">
              <input
                className="text-center p-4 rounded-[20px] border w-full border-[#D2D2D2] text-sm"
                placeholder="0"
              />
              <input
                className="text-center text-sm p-4 rounded-[20px] border w-full border-[#D2D2D2]"
                placeholder="99999"
              />
            </div>
            <h5 className="text-dark-blue font-medium">Rating</h5>
            <div className="flex gap-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-0.5">
              {[1, 2, 3, 4, 5].map((rate) => (
                <button
                  onClick={() => setSelectedRate(rate)}
                  className={clsx(
                    "border border-[#CAC8C8] py-2.5 px-4 text-[#CAC8C8] transition-all duration-500 text-sm flex gap-0.5 rounded-[20px] items-center",
                    selectedRate === rate
                      ? "bg-main-blue/10 border-main-blue/10"
                      : "text-[#CAC8C8] border-[#CAC8C8]"
                  )}
                  key={rate}
                >
                  <StarSvg
                    className={clsx(
                      "w-[17px] h-[17px]",
                      selectedRate === rate
                        ? "fill-main-blue [&_path]:stroke-main-blue"
                        : "fill-[#CAC8C8]"
                    )}
                  />
                  <span
                    className={clsx(
                      "transition-all duration-500",
                      selectedRate === rate
                        ? "text-main-blue"
                        : "text-[#CAC8C8]"
                    )}
                  >
                    {rate}+
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="fixed left-0 right-0 bottom-2 pt-2 tablet:pb-4 pb-1.5 px-4">
            <button className="bg-main-blue text-white p-4 rounded-[20px] w-full font-roboto font-medium">
              Apply Filter
            </button>
          </div>
        </div>

        <div
          className={clsx(
            "absolute h-screen z-10 top-0 transition-colors duration-1000",
            isOpenLocation ? "bg-black/65 w-screen" : "bg-transparent w-0"
          )}
        ></div>
        <div
          id="filter-location"
          onClick={(e) =>
            e.target.id === "filter-location" && setIsOpenLocation(false)
          }
          ref={swipeLocationRef}
          className={clsx(
            "transition-all absolute duration-1000 flex z-20 top-0 w-full h-screen"
          )}
          style={{
            transform: `translateY(${!isOpenLocation ? 4000 : 0}px)`,
          }}
        >
          <div className="bg-white w-full h-[90%] mt-auto flex flex-col items-center px-2.5 pb-2.5 gap-2.5 rounded-t-[20px]">
            <div
              {...swipeable}
              onDoubleClick={() => setIsOpenLocation(false)}
              className="flex items-center flex-col w-full pt-2.5 gap-2.5 cursor-pointer"
            >
              <span className="min-h-1 w-20 bg-[#D9D9D9]" />
              <h6>Location</h6>
            </div>
            <div className="flex flex-col w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <label
                className="flex justify-between w-full border-b-2 p-4 cursor-pointer"
                htmlFor="all-location"
              >
                <span>All</span>
                <input
                  onChange={handleIsAllLocation}
                  className="hidden"
                  id="all-location"
                  type="checkbox"
                />
                <span
                  className={clsx(
                    "w-5 h-5 border-2 rounded-[4px] flex items-center justify-center",
                    isAllLocationChecked
                      ? "border-main-blue bg-main-blue"
                      : "border-[#CAC8C8]"
                  )}
                >
                  {isAllLocationChecked && <CheckSvg />}
                </span>
              </label>
              {[
                "France",
                "Great Britain",
                "Germany",
                "USA",
                "Brazil",
                "Poland",
                "Spain",
                "Argentina",
                "Argentin",
                "Argentia",
                "Argenta",
                "Argentag",
                "Argentas",
                "Argentaa",
              ].map((selectedLocation) => {
                const isSelectedLocation =
                  selectedLocations.includes(selectedLocation);
                return (
                  <label
                    key={selectedLocation}
                    className="flex justify-between w-full border-b-2 p-4 cursor-pointer"
                    htmlFor={selectedLocation}
                  >
                    <span>{selectedLocation}</span>
                    <input
                      onChange={() =>
                        handleSelectLocation({
                          isSelectedLocation,
                          selectedLocation,
                        })
                      }
                      className="hidden"
                      id={selectedLocation}
                      type="checkbox"
                    />
                    <span
                      className={clsx(
                        "w-5 h-5 border-2 rounded-[4px] flex items-center transition-all duration-300 justify-center",
                        isSelectedLocation
                          ? "border-main-blue bg-main-blue"
                          : "border-[#CAC8C8]"
                      )}
                    >
                      {isSelectedLocation && <CheckSvg />}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
