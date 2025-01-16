"use client";

import React, {useContext, useEffect, useState} from "react";
import NotificationsProfile from "@/layouts/NotificationsProfile";
import {SearchPlacesModal} from "@/common//modals/SearchPlacesModal";
import {RecommendedPlaces} from "@/common/RecommendedPlaces";
import {PlaceCardBigSize} from "@/common/PlaceCard";
import {createPortal} from "react-dom";
import clsx from "clsx";
import {useRouter} from "next/navigation";
import SeeAllPlacesCard from "@/common/SeeAllPlacesCard";
import Link from "next/link";
import {Spinner} from "@/common/Spinner";
import {
    fetchAllPlaces,
    fetchCategories, fetchCollections,
    fetchPlacesWithPagination,
} from "@/utils/fetch-paginations";
import {useDebounce} from "react-use";
import {db} from "../../../firebase/config";
import {addDoc, collection, setDoc} from "firebase/firestore";
import {ProfileContext} from "@/layouts/Providers";

export const Home = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isOpenSearchModal, setIsOpenSearchModal] = useState(false);
    const [places, setPlaces] = useState([]);
    const [colections, setColections] = useState([]);

    const [searchValue, setSearchValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [recommendedPlaces, setRecommendedPlaces] = useState([]);
    const router = useRouter();
    const {profile} = useContext(ProfileContext)


    const [,] = useDebounce(
        async () => {
            setLoading(true);
            try {
                if (selectedCategories.length === 0) {
                    return;
                }
                const {places} = await fetchPlacesByCategory(selectedCategories);

                setPlaces(places);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        },
        1000,
        [selectedCategories]
    );


    useEffect(() => {
        async function getPlaces() {
            setLoading(true);
            try {
                const {places, lastVisible} = await fetchPlacesWithPagination();

                setPlaces(places);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        getPlaces();
    }, []);

    useEffect(() => {
        async function setLoca() {
            const re = collection(db, "places");
            const g = await addDoc(re, {
                name: "Erevan",
                locationName:
                    "Yerevan, capital of Armenia. It is situated on the Hrazdan River, 14 miles (23 km)",
                phone: "+374969119791",
                mail: "erevan@gmail.com",
                pics: [
                    "https://firebasestorage.googleapis.com/v0/b/bali-app-351ba.firebasestorage.app/o/places%2Finteresting-angle-from.jpg?alt=media&token=5ffc9537-7b41-4986-80ee-e5cd0695a7f0",
                    "https://firebasestorage.googleapis.com/v0/b/bali-app-351ba.firebasestorage.app/o/places%2F%D0%91%D0%B5%D0%B7%20%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.webp?alt=media&token=c19893d9-d04a-4e64-84ec-c06c46b401b3",
                    "https://firebasestorage.googleapis.com/v0/b/bali-app-351ba.firebasestorage.app/o/places%2FshutterstockRF720023851.jpg?alt=media&token=9ce85ac2-bb51-401c-ad89-e9a730bce4fb",
                    "https://firebasestorage.googleapis.com/v0/b/bali-app-351ba.firebasestorage.app/o/places%2FiStock-1354694344.jpg?alt=media&token=5b9ec7d3-1204-4d56-b6cd-2ffb5a52b104",
                    "https://firebasestorage.googleapis.com/v0/b/bali-app-351ba.firebasestorage.app/o/places%2Farmenia2.jpg?alt=media&token=3b68e39a-8741-4200-bc6b-f960a2017a0f",
                ],
                description:
                    "Yerevan is the administrative, cultural, and industrial center of the country, as its primate city. It has been the capital since 1918, the fourteenth in the history of Armenia and the seventh located in or around the Ararat Plain. The city also serves as the seat of the Araratian Pontifical Diocese, which is the largest diocese of the Armenian Apostolic Church and one of the oldest dioceses in the world.",
                website: "https://visityerevan.am/en/",
                rating: 4.3,
                category: "Beach",
            });
        }
    }, []);

    useEffect(() => {
        async function getRecommendedPlaces() {
            try {
                const {places, lastVisible} =
                    await fetchRecommendedPlacesWithPagination();
                setRecommendedPlaces(places);
            } catch (error) {
                console.log(error);
            }
        }

        getRecommendedPlaces();
    }, []);


    useEffect(() => {
        const loadCategories = async () => {
            try {
                const fetchedCategories = await fetchCategories();
                if (fetchedCategories && fetchedCategories.length > 0) {
                    setCategories(fetchedCategories);
                }
            } catch (error) {
                console.error("Ошибка при загрузке категорий", error);
            }
        };

        if (categories.length === 0) {
            loadCategories();
        }
    }, [categories]);


    useEffect(() => {
        const loadPlaces = async () => {
            setLoading(true);
            try {
                const fetchedPlaces = await fetchAllPlaces();
                setPlaces(fetchedPlaces); // Сохраняем данные в стейт
            } catch (error) {
                console.error("Ошибка при загрузке мест:", error);
            } finally {
                setLoading(false); // Снимаем индикатор загрузки
            }
        };

        loadPlaces();
    }, []);


    useEffect(() => {
        const loadColections = async () => {
            try {
                const fetchedCollections = await fetchCollections();
                setColections(fetchedCollections); // Сохраняем данные в стейт
            } catch (error) {
                console.error("Ошибка при загрузке мест:", error);
            }
        };

        loadColections();
    }, []);


    useEffect(() => {
        console.log(colections, 'colections')
        console.log(places, 'places')

    }, [colections, places]);

    const icons = [
        "/icons/categories/todo.svg",
        "/icons/categories/beach.svg",
        "/icons/categories/camp.svg",
        "/icons/categories/mountain.svg",
    ];


    return (
        <>
            {searchValue.length || isOpenSearchModal ? (
                createPortal(
                    <SearchPlacesModal
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        handleCloseModal={() => setIsOpenSearchModal(false)}
                    />,
                    document.body
                )
            ) : (
                <div className="w-screen h-screen overflow-y-auto safe-top">
                    <div className="flex flex-col py-2.5 px-4 overflow-x-hidden relative">
                        <div className="flex w-full my-2.5 min-h-16 justify-between items-start">
                            <h1 className="font-poppins font-semibold text-3xl text-dark-blue text-wrap">
                                Where do you wanna go?
                            </h1>
                            <div>
                                <NotificationsProfile/>
                            </div>
                        </div>
                        <input
                            value={searchValue}
                            onChange={(e) =>
                                isOpenSearchModal
                                    ? null
                                    : !searchValue.length &&
                                    (setSearchValue(e.target.value), setIsOpenSearchModal(true))
                            }
                            className="w-full border-2 rounded-[20px] mt-2.5 py-[18px] border-[#D2D2D2] px-4 outline-none"
                            placeholder="Search place"
                        />
                        {categories && categories.length &&
                            <div id="category-menu" className="overflow-x-auto font-poppins">
                                <div className="flex pt-5 pb-2 w-max">

                                    {categories.map((category, idx) => {
                                        const iconPath = icons[idx % icons.length];

                                        const isSelected = selectedCategories.includes(
                                            category.name
                                        );
                                        return (
                                            <button
                                                onClick={() =>
                                                    isSelected
                                                        ? setSelectedCategories((prev) =>
                                                            prev.filter(
                                                                (selected) => selected !== category.name
                                                            )
                                                        )
                                                        : setSelectedCategories((prev) => [
                                                            ...prev,
                                                            category.name,
                                                        ])
                                                }
                                                key={idx}
                                                className="flex w-max mx-5 gap-1.5 font-medium"
                                            >
                                                <div className="w-[20px] h-[20px]">
                                                    <img src={iconPath} alt={`Icon for ${category.name}`}/>
                                                </div>

                                                <span
                                                    className={clsx(
                                                        "transition-all duration-300",
                                                        !isSelected && "text-[#848282]"
                                                    )}
                                                >
                                               {category.name}

                          </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        }
                        {loading ? (
                            <Spinner className={"mx-auto mt-12"}/>
                        ) : (
                            <>
                                <div
                                    className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    <div className="flex mt-4 gap-[10px] w-max pb-14">
                                        {places &&
                                            places.map((place) => {
                                                return (
                                                    <PlaceCardBigSize
                                                        isInWishlistProp={
                                                            profile &&
                                                            profile.wishlist &&
                                                            profile.wishlist.includes(place.id)
                                                        }
                                                        key={place.id}
                                                        place={place}
                                                    />
                                                );
                                            })}
                                        <SeeAllPlacesCard/>
                                    </div>
                                </div>
                                {colections.length !== 0 && (
                                    <>
                                        <RecommendedPlaces recommendedPlaces={colections}/>


                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
