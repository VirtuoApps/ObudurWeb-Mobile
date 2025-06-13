"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { fetchUserFavorites } from "@/app/store/favoritesSlice";
import ResidentBox from "@/app/HomePage/ListView/ResidentBox/ResidentBox";
import { useRouter } from "@/app/utils/router";
import { useTranslations } from "next-intl";
import AuthPopup from "@/app/components/AuthPopup/AuthPopup";
import axiosInstance from "@/axios";
import { Hotel } from "@/types/hotel.type";
import { formatAddress } from "@/app/utils/addressFormatter";
import { getDisplayPrice, getNumericPrice } from "@/app/utils/priceFormatter";
import { useLocale } from "next-intl";

// Helper function to get localized text
export const getLocalizedText = (textObj: any, selectedLanguage: string) => {
  return textObj && textObj[selectedLanguage]
    ? textObj[selectedLanguage]
    : textObj?.en || "";
};

export default function FavoritesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const t = useTranslations();
  const selectedLanguage = useLocale();
  const user = useSelector((state: RootState) => state.user.user);
  const { favorites, loading, error } = useSelector(
    (state: RootState) => state.favorites
  );
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [sortOption, setSortOption] = useState<
    "ascending" | "descending" | "newest" | "oldest" | null
  >(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");

  // Get selected currency from localStorage
  useEffect(() => {
    const storedCurrency = localStorage.getItem("selectedCurrency");

    if (storedCurrency) {
      setSelectedCurrency(storedCurrency);
    }

    // Setup listener for currency changes
    const handleStorageChange = () => {
      const currency = localStorage.getItem("selectedCurrency");

      if (currency && currency !== selectedCurrency) {
        setSelectedCurrency(currency);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [selectedCurrency]);

  // Fetch all hotels for similar listings
  useEffect(() => {
    const fetchAllHotels = async () => {
      try {
        const hotelsResponse = await axiosInstance.get("/hotels");
        setAllHotels(hotelsResponse.data as Hotel[]);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchAllHotels();
  }, []);

  useEffect(() => {
    // This effect is now streamlined to prevent double-fetching favorites.
    // It waits 500ms to ensure the user's authentication state is settled
    // before proceeding.

    if (!checkedAuth) {
      // On initial load, we wait before checking for the user.
      const timer = setTimeout(() => {
        setCheckedAuth(true);
      }, 500);
      return () => clearTimeout(timer);
    }

    // Once the initial check is done, this logic runs based on user state.
    if (user) {
      // If the user is logged in, close the auth popup and fetch favorites.
      setIsAuthPopupOpen(false);
      dispatch(fetchUserFavorites());
    } else {
      // If no user is found, open the auth popup.
      setIsAuthPopupOpen(true);
    }
  }, [user, checkedAuth, dispatch]);

  const handleAuthClose = () => {
    setIsAuthPopupOpen(false);
    if (!user) {
      // If still not logged in, redirect to homepage
      router.push("/");
    }
  };

  const handleSortSelection = (
    option: "ascending" | "descending" | "newest" | "oldest"
  ) => {
    setSortOption(option);
    setIsSortOpen(false);
  };

  const getSortDisplayText = () => {
    switch (sortOption) {
      case "ascending":
        return "En Düşük Fiyat";
      case "descending":
        return "En Yüksek Fiyat";
      case "newest":
        return "Önce En Yeni İlan";
      case "oldest":
        return "Önce En Eski İlan";
      default:
        return "Sırala";
    }
  };

  // Function to get 4 random hotels from all hotels
  const getRandomHotels = (count: number = 4): Hotel[] => {
    if (allHotels.length === 0) return [];

    const shuffled = [...allHotels].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Sort favorites based on selected option
  const sortedFavorites = React.useMemo(() => {
    if (!sortOption) return favorites;

    const sorted = [...favorites];

    switch (sortOption) {
      case "ascending":
        return sorted.sort((a, b) => {
          const priceA = a.hotelDetails?.price?.[0]?.amount || 0;
          const priceB = b.hotelDetails?.price?.[0]?.amount || 0;
          return priceA - priceB;
        });
      case "descending":
        return sorted.sort((a, b) => {
          const priceA = a.hotelDetails?.price?.[0]?.amount || 0;
          const priceB = b.hotelDetails?.price?.[0]?.amount || 0;
          return priceB - priceA;
        });
      case "newest":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
      case "oldest":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateA.getTime() - dateB.getTime();
        });
      default:
        return sorted;
    }
  }, [favorites, sortOption]);

  // Get 4 random hotels for similar listings
  const similarHotels = React.useMemo(() => getRandomHotels(4), [allHotels]);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">Favori İlanlar</h1>
        <p className=" text-[#595959] text-sm">
          {favorites.length} adet favori ilanınız var.
        </p>
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">Favorilerim</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>
            Favorilerinizi yüklerken bir hata oluştu. Lütfen daha sonra tekrar
            deneyin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 pb-0 px-2">
      {/* Header with sorting - matching SortAndSaveFiltering design */}
      <div className="justify-between items-start mb-8 hidden lg:flex">
        <div>
          <h1 className="text-[#262626] font-bold text-2xl">Favori İlanlar</h1>
          <p className="text-[#595959] text-sm">
            {favorites.length} adet favori ilanınız var.
          </p>
        </div>

        <div className="flex flex-row items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="border bg-transparent flex flex-row items-center justify-between rounded-xl px-5 py-3 cursor-pointer min-w-[240px]"
            >
              <p className="text-sm text-gray-500 font-semibold mr-12">
                {getSortDisplayText()}
              </p>
              <img
                src="/chevron-down.png"
                className={`w-6 h-6 transition-transform duration-200 ${
                  isSortOpen ? "rotate-180" : ""
                }`}
                alt="arrow-down"
              />
            </button>

            {isSortOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg z-10">
                <div
                  className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 font-semibold"
                  onClick={() => handleSortSelection("ascending")}
                >
                  <p className="text-sm">En Düşük Fiyat</p>
                </div>
                <div
                  className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 font-semibold"
                  onClick={() => handleSortSelection("descending")}
                >
                  <p className="text-sm">En Yüksek Fiyat</p>
                </div>
                <div
                  className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 font-semibold"
                  onClick={() => handleSortSelection("newest")}
                >
                  <p className="text-sm">Önce En Yeni İlan</p>
                </div>
                <div
                  className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 font-semibold"
                  onClick={() => handleSortSelection("oldest")}
                >
                  <p className="text-sm">Önce En Eski İlan</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile header - without sorting for now */}
      <div className="block lg:hidden mb-8">
        <h1 className="text-[#262626] font-bold text-2xl">Favori İlanlar</h1>
        <p className="text-[#595959] text-sm">
          {favorites.length} adet favori ilanınız var.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-700 mb-4">
            Henüz favori ilanınız bulunmamaktadır.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            İlanları Keşfet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 -mx-3">
          {sortedFavorites.map((favorite) => {
            const hotel = favorite.hotelDetails;
            if (!hotel) return null;

            // Format the price
            let priceDisplay = "";
            if (hotel.price && hotel.price.length > 0) {
              const price = hotel.price[0];
              priceDisplay = `${price.amount.toLocaleString()} ${
                price.currency
              }`;
            }

            const price = hotel.price[0];

            return (
              <ResidentBox
                key={favorite._id}
                isFavorite={true}
                hotelId={hotel._id}
                slug={hotel.slug}
                type={hotel.listingType?.tr || "Satılık"}
                residentTypeName={hotel.housingType?.tr || "Modern Villa"}
                title={hotel.title?.tr || ""}
                price={priceDisplay}
                bedCount={hotel.bedRoomCount?.toString() || ""}
                floorCount={hotel.floorCount?.toString() || ""}
                area={`${hotel.totalSize}m²` || ""}
                locationText={`${hotel.city?.tr}, ${hotel.state?.tr}` || ""}
                image={
                  hotel.images && hotel.images.length > 0
                    ? hotel.images[0]
                    : "/example-house.png"
                }
                images={hotel.images || []}
                roomAsText={hotel.roomAsText?.tr || ""}
                roomCount={hotel.roomCount || 0}
                entranceType={hotel.entranceType}
                priceAsNumber={hotel.price[0].amount}
                areaAsNumber={+hotel.projectArea}
              />
            );
          })}
        </div>
      )}

      {/* Similar Listings Section - Always shown */}
      {similarHotels.length > 0 && (
        <div className="w-full mt-16 mb-8 -mx-5">
          <h2 className="text-start text-[#262626] font-bold text-[24px] mb-8 ml-6">
            Benzer İlanlar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 bg-white px-2">
            {similarHotels.map((hotel) => (
              <ResidentBox
                key={hotel._id}
                hotelId={hotel._id}
                slug={hotel.slug}
                type={getLocalizedText(hotel.listingType, selectedLanguage)}
                isOptinable={false}
                residentTypeName={getLocalizedText(
                  hotel.housingType,
                  selectedLanguage
                )}
                title={getLocalizedText(hotel.title, selectedLanguage)}
                price={getDisplayPrice(hotel.price, selectedCurrency)}
                bedCount={hotel.bedRoomCount.toString()}
                floorCount={"2"}
                area={`${hotel.projectArea}m2`}
                locationText={formatAddress(hotel, selectedLanguage)}
                image={hotel.images[0]}
                images={hotel.images}
                isFavorite={false}
                roomAsText={hotel.roomAsText}
                isListView={true}
                roomCount={hotel.roomCount || 0}
                entranceType={hotel.entranceType}
                priceAsNumber={hotel.price[0].amount}
                areaAsNumber={+hotel.projectArea}
              />
            ))}
          </div>
        </div>
      )}

      <AuthPopup isOpen={isAuthPopupOpen} onClose={handleAuthClose} />
    </div>
  );
}
