"use client";
import Image from "next/image";
import placeImage from "../../../../public/images/placeImage.jpeg";
import profileImage from "../../../../public/images/profile-image.jpeg";
import BackSvg from "../../../../public/icons/back.svg";
import BookmarkSvg from "../../../../public/icons/bookmark.svg";
import StarSvg from "../../../../public/icons/star.svg";
import LocationSvg from "../../../../public/icons/location.svg";
import CallCvg from "../../../../public/icons/call.svg";
import MessagesSvg from "../../../../public/icons/messages.svg";
import WriteReviewSvg from "../../../../public/icons/write-review.svg";
import ReviewStarVerySadSvg from "../../../../public/icons/review-star-very-sad.svg";
import ReviewStarSadSvg from "../../../../public/icons/review-star-sad.svg";
import ReviewStarMiddleSvg from "../../../../public/icons/review-star-middle.svg";
import ReviewStarHappySvg from "../../../../public/icons/review-star-happy.svg";
import ReviewStarVeryHappySvg from "../../../../public/icons/review-star-very-happy.svg";
import DirectionSvg from "../../../../public/icons/direction.svg";
import GlobeSvg from "../../../../public/icons/globe.svg";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useSwipeable } from "react-swipeable";
import { RecommendedPlaces } from "@/common/RecommendedPlaces";
import { ProfileContext } from "@/layouts/Providers";
import VideoPlayer from "@/common/VideoPlayer";

import { db } from "../../../../firebase/config";
import { deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function PlaceCardViewModal({ placeId }) {
  const [place, setPlace] = useState(null);
  const [placeInfoMenu, setPlaceInfoMenu] = useState("Overview");
  const [isSeeMoreOpen, setIsSeeMoreOpen] = useState(false);
  const [isOpenWriteReview, setIsOpenWriteReview] = useState(false);
  const [writeReviewRate, setWriteReviewRate] = useState(5);
  const { profile, setProfile } = useContext(ProfileContext);
  const [isOpenAllPlaceImagesView, setIsOpenAllPlaceImagesView] =
    useState(false);
  const [isInWishlist, setIsInWishlist] = useState(null);

  const [placeImageView, setPlaceImageView] = useState("");
  const swipeWriteReview = useRef(null);
  const router = useRouter();

  const swipeable = useSwipeable({
    onSwiping: (eventData) => {
      if (eventData.dir === "Down" && swipeWriteReview.current) {
        const newTranslateY = Math.max(eventData.absY, 0);

        swipeWriteReview.current.style.transform = `translateY(${newTranslateY}px)`;
      }
    },
    onSwiped: (eventData) => {
      if (swipeWriteReview.current) {
        if (eventData.absY > 80 && eventData.dir === "Down") {
          setIsOpenWriteReview(false);
        }

        swipeWriteReview.current.style.transform = `translateY(0px)`;
      }
    },
  });

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
        [`wishlist.${placeId}`]: placeId,
      });
    } else {
      // Remove from wishlist
      await updateDoc(userRef, {
        [`wishlist.${placeId}`]: deleteField(),
      });
    }
  }

  useEffect(() => {
    async function getPlace() {
      try {
        const placeRef = doc(db, "places/", placeId);
        const getPlace = await getDoc(placeRef);
        if (getPlace.exists()) {
          setPlaceImageView(getPlace.data().pics[0]);
          setPlace(getPlace.data());
        }
      } catch (error) {}
    }
    getPlace();
  }, []);
  useEffect(() => {
    setIsInWishlist(profile && profile.wishlist.includes(placeId));
  }, [profile]);
  return (
    <>
      {place && (
        <>
          <div
            className={clsx(
              "w-screen h-screen z-10 bg-white flex overflow-hidden items-center flex-col",
              isOpenWriteReview ? "fixed" : "static"
            )}
          >
            <div className="w-full overflow-y-auto h-screen">
              <div className="w-full flex justify-center relative h-max">
                <img
                  src={placeImageView}
                  alt="place-name"
                  className="object-cover desktop:h-[500px] h-[600px] desktop-big:w-[375px] tablet:w-full"
                />
                <Link
                  href=".."
                  className="absolute py-4 px-5 bg-[#323131]/40 rounded-[9px] top-16 [&_path]:stroke-white left-3"
                >
                  <BackSvg />
                </Link>
                <button
                  onClick={addOrDeleteFromWishlist}
                  className="absolute py-2.5 px-3 bg-[#323131]/40 rounded-[9px] top-16 right-3"
                >
                  <BookmarkSvg
                    className={clsx(
                      "w-[22px] h-6 transition-all duration-300",
                      isInWishlist
                        ? "[&_path]:fill-[#FF2D55] [&_path]:stroke-[#FF2D55]"
                        : "[&_path]:stroke-white"
                    )}
                  />
                </button>
                <div
                  className={clsx(
                    "absolute bottom-20 w-[83%] flex p-3 bg-white/60 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-2xl",
                    isOpenAllPlaceImagesView
                      ? "overflow-x-auto"
                      : "overflow-x-hidden"
                  )}
                >
                  <div className="flex items-center gap-5 h-max">
                    {place.pics.length >= 5 && !isOpenAllPlaceImagesView ? (
                      <>
                        {place.pics.slice(0, 3).map((image, idx) => (
                          <button
                            onClick={() => setPlaceImageView(image)}
                            key={idx}
                            className="border-[3px] border-white rounded-xl w-[54px] h-[54px]"
                          >
                            <img
                              src={image}
                              alt="place-name"
                              className="object-cover w-full h-full rounded-lg"
                            />
                          </button>
                        ))}
                        <button
                          onClick={() => setIsOpenAllPlaceImagesView(true)}
                          className="border-[3px] border-white rounded-xl w-[54px] h-[54px] relative"
                        >
                          <img
                            src={place.pics[4]}
                            alt="place-name"
                            className="object-cover w-full h-full rounded-lg"
                          />
                          <div className="absolute w-full h-full bg-[#323131] top-0 rounded-lg flex items-center justify-center text-white">
                            +{place.pics.length - 3}
                          </div>
                        </button>
                      </>
                    ) : (
                      <>
                        {place.pics.map((image, idx) => (
                          <button
                            onClick={() => setPlaceImageView(image)}
                            key={idx}
                            className="border-[3px] border-white rounded-xl w-[54px] h-[54px]"
                          >
                            <img
                              src={image}
                              alt="place-name"
                              className="object-cover w-full h-full rounded-lg"
                            />
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full absolute top-[550px] rounded-t-[20px] bg-white flex flex-col pt-5 pb-28 gap-2.5">
                  <span className="w-full flex items-center justify-between px-4">
                    <h3 className="text-xl font-semibold">{place.name}</h3>
                    <span className="flex items-center bg-main-blue/10 rounded-full gap-[3px] px-2.5 py-1.5">
                      <span>
                        <StarSvg className="w-3 h-3 [&_path]:fill-main-blue [&_path]:stroke-main-blue" />
                      </span>
                      <h4 className="text-main-blue font-roboto text-xs">
                        {place.rating}
                      </h4>
                    </span>
                  </span>
                  <span className="flex px-4">
                    <LocationSvg className="w-5 h-5" />
                    <p className="text-[#848282]">{place.locationName}</p>
                  </span>

                  <div className="pt-4 pb-1 gap-4 flex items-center px-4">
                    {["Overview", "Video", "Reviews", "Near you"].map(
                      (menuValue) => (
                        <button
                          className={clsx(
                            "transition-all duration-500 border-b font-medium",
                            placeInfoMenu === menuValue
                              ? "text-dark-blue border-b-dark-blue"
                              : "text-[#848282] border-b-transparent"
                          )}
                          onClick={() => setPlaceInfoMenu(menuValue)}
                          key={menuValue}
                        >
                          {menuValue}
                        </button>
                      )
                    )}
                  </div>
                  {placeInfoMenu === "Overview" ? (
                    <>
                      <div className="px-4">
                        <p className="text-sm">
                          {place.description.split(" ").length > 20 &&
                          !isSeeMoreOpen
                            ? place.description
                                .split(" ")
                                .slice(0, 20)
                                .join(" ")
                            : place.description}
                          <span
                            onClick={() => setIsSeeMoreOpen(!isSeeMoreOpen)}
                            className={clsx(
                              "text-sm text-main-blue font-medium cursor-pointer",
                              place.description.split(" ") <= 20
                                ? "hidden"
                                : "block"
                            )}
                          >
                            See {isSeeMoreOpen ? "less" : "More..."}
                          </span>
                        </p>
                      </div>
                      <h4 className="text-sm font-semibold px-4">Location</h4>
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2427.7941649640784!2d13.398503076322426!3d52.51906403629932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851def3c2d14b%3A0x780e68d5b02f8afc!2z0JHQtdGA0LvQuNC90YHQutC40Lkg0LrQsNGE0LXQtNGA0LDQu9GM0L3Ri9C5INGB0L7QsdC-0YA!5e0!3m2!1sru!2sam!4v1733257227073!5m2!1sru!2sam"
                        className="w-full h-[270px] px-4"
                        allowFullScreen=""
                        loading="lazy"
                      ></iframe>

                      <span className="w-full flex justify-between border-b px-4 border-b-[#D9D9D9]/50 py-2.5">
                        <h5 className="text-sm font-semibold">
                          Business Hours
                        </h5>
                        <span className="font-medium text-sm text-main-blue flex items-center gap-1.5">
                          Open Now{" "}
                          <span className="w-1.5 h-1.5 rounded-full bg-main-blue inline" />
                        </span>
                      </span>
                      <span className="w-full flex justify-between border-b border-b-[#D9D9D9]/50 pb-2.5 px-4">
                        <h5 className="text-[#848282]">Mon to Fri</h5>
                        <span className="font-semibold text-sm">
                          9:00 AM - 5:00 PM
                        </span>
                      </span>
                      <span className="w-full flex justify-between border-b border-b-[#D9D9D9]/50 pb-2.5 px-4">
                        <h5 className="text-[#848282]">Sat</h5>
                        <span className="font-semibold text-sm">
                          9:00 AM - 2:00 PM
                        </span>
                      </span>
                      <span className="w-full flex justify-between pb-2.5 px-4">
                        <h5 className="text-[#848282]">Sun</h5>
                        <span className="font-semibold text-sm">Closed</span>
                      </span>
                      <h5 className="font-semibold text-sm px-4">Contact Us</h5>
                      <span className="w-full flex border-b border-b-[#D9D9D9]/50 pb-2.5 items-center gap-1.5 px-4">
                        <span>
                          <CallCvg />
                        </span>
                        <p className="text-[#848282]">{place.phone}</p>
                      </span>
                      <span className="w-full flex pb-2.5 items-center gap-1.5 px-4">
                        <span>
                          <MessagesSvg />
                        </span>
                        <p className="text-[#848282]">{place.mail}</p>
                      </span>
                    </>
                  ) : placeInfoMenu === "Video" ? (
                    <div className="flex justify-center w-full">
                      <VideoPlayer url={place.video[0].url} />
                    </div>
                  ) : placeInfoMenu === "Reviews" ? (
                    <div className="bg-white">
                      <div className="flex flex-col w-full relative z-10 px-4">
                        <span className="flex items-center gap-5 mobile-min:gap-4">
                          <span className="text-[40px] font-roboto text-main-blue">
                            {place.rating}
                          </span>
                          <span className="flex gap-4">
                            {[1, 2, 3, 4, 5].map((rate) => (
                              <StarSvg
                                key={rate}
                                className={clsx(
                                  "w-6 h-6",
                                  Math.round(place.rating) >= rate
                                    ? "[&_path]:fill-main-blue [&_path]:stroke-main-blue"
                                    : "[&_path]:fill-[#D9D9D9] [&_path]:stroke-[#D9D9D9]"
                                )}
                              />
                            ))}
                          </span>
                        </span>
                        <span className="flex w-full justify-between">
                          <p>8 Reviews</p>
                          <button
                            onClick={() => setIsOpenWriteReview(true)}
                            className="text-main-blue flex gap-1.5 items-center"
                          >
                            <span className="underline">Write a Review</span>
                            <WriteReviewSvg />
                          </button>
                        </span>
                        <div className="border p-2.5 rounded-[20px] border-[#D2D2D2]/50 flex mt-2.5 w-full flex-col">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2.5">
                              <Image
                                src={profileImage}
                                alt="avatar"
                                className="w-[52px] h-[52px] object-cover rounded-[10px]"
                              />
                              <span className="flex flex-col gap-2.5">
                                <h6 className="font-roboto font-medium text-dark-blue leading-[18px]">
                                  Ivan Ivanov
                                </h6>
                                <span className="flex items-center bg-main-blue/10 rounded-full gap-[3px] px-2.5 w-max py-1.5">
                                  <span>
                                    <StarSvg className="w-3 h-3 [&_path]:fill-main-blue [&_path]:stroke-main-blue" />
                                  </span>
                                  <h4 className="text-main-blue font-roboto text-xs">
                                    {place.rating}
                                  </h4>
                                </span>
                              </span>
                            </div>

                            <span className="text-xs font-roboto text-[#848282] mt-2">
                              6h ago
                            </span>
                          </div>
                          <p className="text-[#848282] font-roboto text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipisci
                            elit, sed eiusmod tempor incidunt ut labore et
                            dolore magna aliqua.
                          </p>
                        </div>
                        <div className="border p-2.5 rounded-[20px] border-[#D2D2D2]/50 flex mt-2.5 w-full flex-col">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2.5">
                              <Image
                                src={profileImage}
                                alt="avatar"
                                className="w-[52px] h-[52px] object-cover rounded-[10px]"
                              />
                              <span className="flex flex-col gap-2.5">
                                <h6 className="font-roboto font-medium text-dark-blue leading-[18px]">
                                  Ivan Ivanov
                                </h6>
                                <span className="flex items-center bg-main-blue/10 rounded-full gap-[3px] px-2.5 w-max py-1.5">
                                  <span>
                                    <StarSvg className="w-3 h-3 [&_path]:fill-main-blue [&_path]:stroke-main-blue" />
                                  </span>
                                  <h4 className="text-main-blue font-roboto text-xs">
                                    {place.rating}
                                  </h4>
                                </span>
                              </span>
                            </div>

                            <span className="text-xs font-roboto text-[#848282] mt-2">
                              6h ago
                            </span>
                          </div>
                          <p className="text-[#848282] font-roboto text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipisci
                            elit, sed eiusmod tempor incidunt ut labore et
                            dolore magna aliqua.
                          </p>
                        </div>
                        <div className="border p-2.5 rounded-[20px] border-[#D2D2D2]/50 flex mt-2.5 w-full flex-col">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2.5">
                              <Image
                                src={profileImage}
                                alt="avatar"
                                className="w-[52px] h-[52px] object-cover rounded-[10px]"
                              />
                              <span className="flex flex-col gap-2.5">
                                <h6 className="font-roboto font-medium text-dark-blue leading-[18px]">
                                  Ivan Ivanov
                                </h6>
                                <span className="flex items-center bg-main-blue/10 rounded-full gap-[3px] px-2.5 w-max py-1.5">
                                  <span>
                                    <StarSvg className="w-3 h-3 [&_path]:fill-main-blue [&_path]:stroke-main-blue" />
                                  </span>
                                  <h4 className="text-main-blue font-roboto text-xs">
                                    {place.rating}
                                  </h4>
                                </span>
                              </span>
                            </div>

                            <span className="text-xs font-roboto text-[#848282] mt-2">
                              6h ago
                            </span>
                          </div>
                          <p className="text-[#848282] font-roboto text-sm">
                            Lorem ipsum dolor sit amet, consectetur adipisci
                            elit, sed eiusmod tempor incidunt ut labore et
                            dolore magna aliqua.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 flex flex-col gap-1.5 pt-1.5 relative overflow-hidden [&>div>div]:pb-10">
                      <span className="flex justify-between">
                        <h5 className="font-semibold text-sm">
                          Popular places
                        </h5>
                        <button className="underline text-sm font-medium text-main-blue">
                          View all
                        </button>
                      </span>
                      <RecommendedPlaces />

                      <div className="flex flex-col gap-1.5 relative -top-6 [&>div>div]:pb-0 [&>div]:pb-0">
                        <span className="flex justify-between">
                          <h5 className="font-semibold text-sm">Drinks</h5>
                          <button className="underline text-sm font-medium text-main-blue">
                            View all
                          </button>
                        </span>
                        <RecommendedPlaces />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="fixed w-full bottom-0 flex justify-between gap-2.5 pt-2.5  pb-5 px-4 bg-white z-10">
              <Link
                href={place.website}
                target="_blank"
                className="rounded-[20px] border-2 border-main-blue p-4 text-main-blue w-full font-medium flex items-center justify-center gap-2.5"
              >
                <GlobeSvg />
                <span>Website</span>
              </Link>
              <button className="rounded-[20px] border-2 border-main-blue p-4 w-full font-medium bg-main-blue text-white flex items-center justify-center gap-2.5">
                <DirectionSvg />
                <span>Direction</span>
              </button>
            </div>
          </div>
          <div
            onClick={() => setIsOpenWriteReview(false)}
            className={clsx(
              "h-screen fixed transition-colors top-0 duration-1000 ",
              isOpenWriteReview
                ? "z-20 bg-black/65 w-full"
                : "-z-10 bg-transparent w-0"
            )}
          ></div>
          <div
            id="write-review"
            onClick={(e) =>
              e.target.id === "write-review" && setIsOpenWriteReview(false)
            }
            ref={swipeWriteReview}
            className={clsx(
              "transition-all fixed duration-1000 flex z-30 top-0 w-full h-screen will-change-transform"
            )}
            style={{
              transform: `translateY(${!isOpenWriteReview ? 4000 : 0}px)`,
            }}
          >
            <div className="rounded-t-[20px] bg-white w-screen mt-auto pt-2.5 px-2.5 pb-5">
              <div
                {...swipeable}
                onDoubleClick={() => setIsOpenWriteReview(false)}
                className="flex items-center flex-col w-full gap-2.5 pb-2.5 cursor-pointer"
              >
                <span className="min-h-1 w-20 bg-[#D9D9D9]" />
                <h6 className="text-dark-blue font-medium">Write a Review</h6>
                {profile ? (
                  <>
                    <p className="text-[#848282]">Lorem ipsum dolor sit amet</p>
                    <span className="flex items-center gap-0.5">
                      {[
                        <ReviewStarVerySadSvg key="ReviewStarVerySadSvg" />,
                        <ReviewStarSadSvg key="ReviewStarSadSvg" />,
                        <ReviewStarMiddleSvg key="ReviewStarMiddleSvg" />,
                        <ReviewStarHappySvg key="ReviewStarHappySvg" />,
                        <ReviewStarVeryHappySvg key="ReviewStarVeryHappySvg" />,
                      ].map((star, idx) => (
                        <button
                          onClick={() => setWriteReviewRate(idx)}
                          key={idx}
                          className={clsx(
                            "[&>svg_*]:transition-all [&>svg_*]:duration-500",
                            writeReviewRate >= idx
                              ? "[&>svg>:first-child]:fill-main-blue [&>svg>:first-child]:stroke-main-blue [&>svg>:not(:first-child)]:fill-white"
                              : "[&>svg>:first-child]:fill-[#E8E8E8] [&>svg>:first-child]:stroke-[#E8E8E8] [&>svg>:not(:first-child)]:fill-[#C6C6C6]"
                          )}
                        >
                          {star}
                        </button>
                      ))}
                    </span>
                    <textarea className="p-4 border border-[#D2D2D2] w-full h-[150px] rounded-[20px] outline-none"></textarea>
                    <button className="w-full rounded-full bg-main-blue p-4 text-white font-medium font-roboto">
                      Add Review
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-[#848282] text-center">
                      if you have not registered, a comment will be displayed
                      after verification
                    </p>
                    <div className="flex items-center gap-2.5 w-full">
                      <button
                        className="rounded-[20px] p-4 text-main-blue border-2 border-main-blue w-full"
                        onClick={() => setIsOpenWriteReview(false)}
                      >
                        Continue
                      </button>
                      <Link
                        className="p-4 rounded-[20px] bg-main-blue text-white w-full text-center border-2 border-main-blue"
                        href="/auth"
                      >
                        Login
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
