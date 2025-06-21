"use client";

import React, { useEffect, useState } from "react";
import { SavedFilter, savedFiltersApi } from "../api/savedFilters";
import { useLocale, useTranslations } from "next-intl";

import { Feature } from "@/types/feature.type";
import FilterBox from "./FilterBox/FilterBox";
import FilterBoxSkeleton from "./FilterBoxSkeleton";
import { FilterOptions } from "@/types/filter-options.type";
import Footer from "../resident/[slug]/Footer/Footer";
import Header from "../admin/Header/Header";
import HeaderSection from "./HeaderSection/HeaderSection";
import { Hotel } from "@/types/hotel.type";
import ResidentBox from "@/app/HomePage/ListView/ResidentBox/ResidentBox";
import SimpleHeader from "@/app/components/SimpleHeader/SimpleHeader";
import axiosInstance from "@/axios";
import { formatAddress } from "@/app/utils/addressFormatter";
import { getDisplayPrice } from "@/app/utils/priceFormatter";
import { getLocalizedText } from "../favorilerim/page";
import { useRouter } from "@/app/utils/router";

export default function FavoriAramalarPage() {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [allQuickFilters, setAllQuickFilters] = useState<Feature[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const selectedLanguage = useLocale();
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const t = useTranslations("savedSearchesPage");

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setDataLoading(true);
      setError(null);

      // Fetch all required data in parallel
      const [
        filtersResponse,
        filterOptionsResponse,
        hotelsResponse,
        quickFiltersResponse,
      ] = await Promise.all([
        savedFiltersApi.getMySavedFilters(),
        axiosInstance.get("/hotels/filter-options"),
        axiosInstance.get("/hotels"),
        axiosInstance.get("/features/all-quick-filters"),
      ]);

      setSavedFilters(filtersResponse);
      setFilterOptions(filterOptionsResponse.data);
      setHotels(hotelsResponse.data);
      setAllQuickFilters(quickFiltersResponse.data);
    } catch (err) {
      setError("Favori aramalar yüklenirken bir hata oluştu.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
      setDataLoading(false);
    }
  };

  const handleUpdate = () => {
    // Refresh saved filters after update
    fetchData();
  };

  const handleDelete = async (filterId: string) => {
    try {
      await savedFiltersApi.deleteSavedFilter(filterId);
      // Refresh the list after deletion
      await fetchData();
    } catch (error) {
      console.error("Error deleting filter:", error);
      setError("Filtre silinirken bir hata oluştu.");
    }
  };

  const getRandomHotels = (count: number = 4): Hotel[] => {
    if (hotels.length === 0) return [];

    const shuffled = [...hotels].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <div className="w-full">
      <SimpleHeader
        showBackButton
        backUrl="/"
        customMaxWidth="max-w-full px-5"
      />

      <div className="w-full bg-[#ebeaf1] min-h-screen  sm:px-6 lg:px-0">
        <HeaderSection totalFilters={savedFilters.length} />
        <div className="w-full max-w-[1440px] mx-auto pb-8 px-4">
          {loading || dataLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <FilterBoxSkeleton />
              <FilterBoxSkeleton />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-red-600 text-sm sm:text-base">{error}</div>
            </div>
          ) : savedFilters.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center text-gray-500 pt-10">
              <div
                className={`w-full flex flex-col items-center justify-center text-gray-500 pt-10`}
              >
                <p className="text-center text-[#362C75] font-bold text-[24px]">
                  {t("noSearchesTitle")}
                </p>
                <p className="text-center text-[#262626] font-medium text-[16px] mt-4">
                  {t("noSearchesSubtitle")}
                </p>
                <p className="text-center text-[#595959] font-medium text-[16px] mt-3">
                  {t("noSearchesDescription")}
                </p>
                <button
                  onClick={() => {
                    localStorage.setItem("currentView", "list");
                    router.push(`/`);
                  }}
                  className="bg-[#5E5691] rounded-2xl py-4 px-6 flex items-center justify-center text-white mt-5"
                >
                  {t("searchButton")}
                </button>
              </div>

              <div className="mt-10 mb-6">
                <h2 className="text-start text-[#262626] font-bold text-[24px] mb-8 ml-6">
                  {t("suggestedListingsTitle")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 px-2">
                  {getRandomHotels(6).map((hotel) => (
                    <ResidentBox
                      key={hotel._id}
                      hotelId={hotel._id}
                      slug={hotel.slug}
                      type={getLocalizedText(
                        hotel.listingType,
                        selectedLanguage
                      )}
                      isOptinable={false}
                      residentTypeName={getLocalizedText(
                        hotel.housingType,
                        selectedLanguage
                      )}
                      title={getLocalizedText(hotel.title, selectedLanguage)}
                      price={getDisplayPrice(hotel.price, selectedCurrency)}
                      bedCount={hotel.bedRoomCount.toString()}
                      floorCount={hotel.floorCount?.toString()}
                      area={`${hotel.projectArea}m2`}
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
              </div>
            </div>
          ) : !filterOptions ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-red-600 text-sm sm:text-base">
                Filtre seçenekleri yüklenemedi.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {savedFilters.map((filter) => (
                <FilterBox
                  key={filter._id}
                  filter={filter}
                  onUpdate={handleUpdate}
                  onDelete={() => handleDelete(filter._id || "")}
                  filterOptions={filterOptions}
                  hotels={hotels}
                  selectedCurrency="USD" // Default currency
                  searchRadius={5} // Default search radius in km
                  allQuickFilters={allQuickFilters}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer
        customMaxWidth="max-w-[1448px]"
        customPadding="md:px-4 px-2"
        fullWidthTopBorder={true}
        fullWidthBottomBorder={true}
        fullWidthStripe={true}
      />
    </div>
  );
}
