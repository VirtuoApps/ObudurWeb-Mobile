import React, { useState, useEffect } from "react";
import ResidentBox from "./ResidentBox/ResidentBox";
import { Hotel } from "@/types/hotel.type";
import { formatAddress } from "@/app/utils/addressFormatter";
import SortAndSaveFiltering from "./SortAndSaveFiltering/SortAndSaveFiltering";

// Currency symbols mapping
const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  TRY: "₺",
  RUB: "₽",
};

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
}: {
  hotels: Hotel[];
  sortOption: "ascending" | "descending" | null;
  setSortOption: React.Dispatch<
    React.SetStateAction<"ascending" | "descending" | null>
  >;
}) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  // Get selected currency and language from localStorage
  useEffect(() => {
    const storedCurrency = localStorage.getItem("selectedCurrency");
    const storedLanguage = localStorage.getItem("selectedLanguage");

    if (storedCurrency) {
      setSelectedCurrency(storedCurrency);
    }

    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
    }

    // Setup listener for currency and language changes
    const handleStorageChange = () => {
      const currency = localStorage.getItem("selectedCurrency");
      const language = localStorage.getItem("selectedLanguage");

      if (currency && currency !== selectedCurrency) {
        setSelectedCurrency(currency);
      }

      if (language && language !== selectedLanguage) {
        setSelectedLanguage(language);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [selectedCurrency, selectedLanguage]);

  // Helper function to get display price in the selected currency
  const getDisplayPrice = (hotel: Hotel) => {
    if (!hotel.price || hotel.price.length === 0) return "";

    // Find price in selected currency
    const selectedPrice = hotel.price.find(
      (p) => p.currency === selectedCurrency
    );

    // If selected currency is not available, use USD or the first available price
    const usdPrice = hotel.price.find((p) => p.currency === "USD");
    const price = selectedPrice || usdPrice || hotel.price[0];

    const symbol = currencySymbols[price.currency] || price.currency;

    // Format the price with the appropriate currency symbol
    return price.currency === "USD" || price.currency === "RUB"
      ? `${symbol}${price.amount}`
      : `${price.amount}${symbol}`;
  };

  // Helper function to get numeric price for sorting
  const getNumericPrice = (hotel: Hotel) => {
    if (!hotel.price || hotel.price.length === 0) return 0;

    // Find price in selected currency
    const selectedPrice = hotel.price.find(
      (p) => p.currency === selectedCurrency
    );

    // If selected currency is not available, use USD or the first available price
    const usdPrice = hotel.price.find((p) => p.currency === "USD");
    const price = selectedPrice || usdPrice || hotel.price[0];

    return price.amount;
  };

  // Sort hotels based on sortOption
  const sortedHotels = [...hotels].sort((a, b) => {
    if (!sortOption) return 0;

    const priceA = getNumericPrice(a);
    const priceB = getNumericPrice(b);

    return sortOption === "ascending" ? priceA - priceB : priceB - priceA;
  });

  return (
    <>
      <SortAndSaveFiltering
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 bg-white  px-2 pb-28">
        {sortedHotels.map((hotel) => (
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
            price={getDisplayPrice(hotel)}
            bedCount={hotel.bedRoomCount.toString()}
            floorCount={"2"}
            area={`${hotel.projectArea}m2`}
            locationText={formatAddress(hotel, selectedLanguage)}
            image={hotel.images[0]}
            images={hotel.images}
            isFavorite={false}
            roomAsText={hotel.roomAsText}
          />
        ))}
      </div>
    </>
  );
}
