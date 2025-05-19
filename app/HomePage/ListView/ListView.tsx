import React, { useState, useEffect } from "react";
import ResidentBox from "./ResidentBox/ResidentBox";
import { Hotel } from "@/types/hotel.type";
import { formatAddress } from "@/app/utils/addressFormatter";

// Currency symbols mapping
const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  TRY: "₺",
  RUB: "₽",
};

export default function ListView({ hotels }: { hotels: Hotel[] }) {
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

  // Helper function to get localized text
  const getLocalizedText = (textObj: any) => {
    return textObj && textObj[selectedLanguage]
      ? textObj[selectedLanguage]
      : textObj?.en || "";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white  px-2 pb-28">
      {hotels.map((hotel) => (
        <ResidentBox
          key={hotel._id}
          slug={hotel.slug}
          type={getLocalizedText(hotel.listingType)}
          isOptinable={false}
          residentTypeName={getLocalizedText(hotel.housingType)}
          title={getLocalizedText(hotel.title)}
          price={getDisplayPrice(hotel)}
          bedCount={hotel.bedRoomCount.toString()}
          floorCount={"2"}
          area={`${hotel.projectArea}m2`}
          locationText={formatAddress(hotel, selectedLanguage)}
          image={hotel.images[0]}
          isFavorite={false}
        />
      ))}
    </div>
  );
}
