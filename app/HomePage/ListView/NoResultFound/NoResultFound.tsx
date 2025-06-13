import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import ResidentBox from "../ResidentBox/ResidentBox";
import { Hotel } from "@/types/hotel.type";
import { formatAddress } from "@/app/utils/addressFormatter";
import { getDisplayPrice, getNumericPrice } from "@/app/utils/priceFormatter";
import { useLocale } from "next-intl";
import Footer from "@/app/[locale]/resident/[slug]/Footer/Footer";

// Helper function to get localized text
export const getLocalizedText = (textObj: any, selectedLanguage: string) => {
  return textObj && textObj[selectedLanguage]
    ? textObj[selectedLanguage]
    : textObj?.en || "";
};

type NoResultFoundProps = {
  resetFilters: () => void;
  allHotels?: Hotel[];
  currentView: "map" | "list";
};

export default function NoResultFound({
  resetFilters,
  allHotels = [],
  currentView,
}: NoResultFoundProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const selectedLanguage = useLocale();

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

  // Get first 10 hotels for similar listings
  const similarHotels = allHotels.slice(0, 10);

  return (
    <div className="w-full">
      {/* No Result Found Section */}
      <div
        className={`w-full ${
          currentView === "map" ? "mt-[200px]" : "mt-[100px]"
        } flex flex-col items-center justify-center text-gray-500`}
      >
        <p className="text-center text-[#362C75] font-bold text-[24px]">
          Sonuç Bulunamadı!
        </p>
        <p className="text-center text-[#262626] font-medium text-[16px] mt-4">
          Üzügünüz, arama kriterlerinize uygun ilan bulamadık.
        </p>
        <p className="text-center text-[#595959] font-medium text-[16px] mt-3">
          Filtrelerinizi sıfırlayarak yeniden arama yapmayı deneyin.
        </p>
        <button
          onClick={() => {
            resetFilters();
          }}
          className="bg-[#5E5691] rounded-2xl py-4 px-6 flex items-center justify-center text-white mt-5"
        >
          Filtreleri Sıfırla
        </button>
      </div>

      {/* Similar Listings Section */}
      {similarHotels.length > 0 && (
        <div className="w-full mt-16 mb-8">
          <h2 className="text-start text-[#262626] font-bold text-[24px] mb-8 ml-6">
            Benzer İlanlar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 bg-white px-2">
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
      <Footer
        customClassName="w-full max-w-full px-6"
        customMaxWidth="max-w-[1440px]"
        customPadding="md:px-4 px-2"
        fullWidthTopBorder={true}
        fullWidthBottomBorder={true}
        fullWidthStripe={true}
      />
    </div>
  );
}
