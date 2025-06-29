import React, { useEffect, useState } from "react";
import { getDisplayPrice, getNumericPrice } from "@/app/utils/priceFormatter";

import { Hotel } from "@/types/hotel.type";
import PaginationBox from "./PaginationBox/PaginationBox";
import ResidentBox from "./ResidentBox/ResidentBox";
import SortAndSaveFiltering from "./SortAndSaveFiltering/SortAndSaveFiltering";
import { formatAddress } from "@/app/utils/addressFormatter";
import { renderFloorPositionText } from "@/app/utils/renderFloorPositionText";
import { useLocale } from "next-intl";

// Helper function to get localized text
export const getLocalizedText = (textObj: any, selectedLanguage: string) => {
  return textObj && textObj[selectedLanguage]
    ? textObj[selectedLanguage]
    : textObj?.en || "";
};

export default function ListView({
  hotels,
  sortOption,
  setSortOption,
  setIsSaveFilterPopupOpen,
  isCurrentFilterExist,
}: {
  hotels: Hotel[];
  sortOption: "ascending" | "descending" | "newest" | "oldest" | null;
  setSortOption: React.Dispatch<
    React.SetStateAction<
      "ascending" | "descending" | "newest" | "oldest" | null
    >
  >;
  setIsSaveFilterPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCurrentFilterExist: boolean;
}) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("TRY");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const selectedLanguage = useLocale();

  // Pagination settings
  const itemsPerPage = 25;

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

  // Reset to first page when hotels array changes
  useEffect(() => {
    setCurrentPage(1);
  }, [hotels, sortOption]);

  // Sort hotels based on sortOption
  const sortedHotels = [...hotels].sort((a, b) => {
    if (!sortOption) return 0;

    // Price-based sorting
    if (sortOption === "ascending" || sortOption === "descending") {
      const priceA = getNumericPrice(a.price, selectedCurrency);
      const priceB = getNumericPrice(b.price, selectedCurrency);
      return sortOption === "ascending" ? priceA - priceB : priceB - priceA;
    }

    // Date-based sorting
    if (sortOption === "newest" || sortOption === "oldest") {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOption === "newest" ? dateB - dateA : dateA - dateB;
    }

    return 0;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedHotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHotels = sortedHotels.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Scroll to top with smooth animation
    // Using setTimeout to ensure DOM update completes first
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  };

  return (
    <>
      <SortAndSaveFiltering
        sortOption={sortOption}
        setSortOption={setSortOption}
        totalHotelsCount={hotels.length}
        setIsSaveFilterPopupOpen={setIsSaveFilterPopupOpen}
        isCurrentFilterExist={isCurrentFilterExist}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4 bg-white  px-2 ">
        {currentHotels.map((hotel) => (
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
            bedCount={hotel.bedRoomCount?.toString()}
            floorCount={renderFloorPositionText(
              hotel.floorPosition,
              selectedLanguage
            )}
            area={`${hotel.projectArea}m²`}
            locationText={formatAddress(hotel, selectedLanguage)}
            image={hotel.images[0]}
            images={hotel.images}
            isFavorite={false}
            isListView={true}
            roomCount={hotel.roomCount || 0}
            entranceType={hotel.entranceType}
            priceAsNumber={hotel.price[0].amount}
            areaAsNumber={+hotel.projectArea}
          />
        ))}
      </div>

      {/* Show pagination only if there are more than 25 items */}
      {totalPages > 1 && (
        <div className="w-full flex justify-center items-center mt-8 -mb-14">
          <PaginationBox
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
