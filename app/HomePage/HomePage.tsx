"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Header from "./Header/Header";
import FilterList from "./FilterList/FilterList";
import { useTranslations } from "next-intl";
import ViewSwitcher from "./ViewSwitcher/ViewSwitcher";
import ListView from "./ListView/ListView";
import { Feature } from "@/types/feature.type";
import { Hotel } from "@/types/hotel.type";
import { FilterType } from "@/types/filter.type";
import { FilterOptions } from "@/types/filter-options.type";
import { currencyOptions } from "@/app/components/LanguageSwitcher";
const MapView = dynamic(() => import("./MapView/MapView"), {
  ssr: false,
  loading: () => {
    // We need to use a client component for translations in a dynamic component
    return <MapLoadingIndicator />;
  },
});

function MapLoadingIndicator() {
  const t = useTranslations("common");

  return (
    <div className="w-full h-[calc(100vh-155px)] bg-gray-100 flex items-center justify-center">
      {t("loadingMap")}
    </div>
  );
}

export default function HomePage({
  features,
  hotels,
  filterOptions,
}: {
  features: Feature[];
  hotels: Hotel[];
  filterOptions: FilterOptions;
}) {
  const t = useTranslations("common");
  const [currentView, setCurrentView] = useState<"map" | "list">("map");
  const [filters, setFilters] = useState<FilterType | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");

  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);

  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState<any | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [listingType, setListingType] = useState<"For Sale" | "For Rent">(
    "For Sale"
  );

  useEffect(() => {
    // Get selected currency from localStorage
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  let filteredHotels = hotels;

  if (filters) {
    if (filters.listingType) {
      filteredHotels = filteredHotels.filter((hotel) =>
        Object.values(hotel.listingType).some(
          (value) => value === filters.listingType
        )
      );
    }

    if (filters.state) {
      filteredHotels = filteredHotels.filter((hotel) =>
        Object.values(hotel.state).some((value) => value === filters.state)
      );
    }

    if (filters.propertyType) {
      filteredHotels = filteredHotels.filter((hotel) =>
        Object.values(hotel.housingType).some(
          (value) => value === filters.propertyType
        )
      );
    }

    if (filters.roomAsText) {
      filteredHotels = filteredHotels.filter(
        (hotel) => hotel.roomAsText === filters.roomAsText
      );
    }

    if (filters.minPrice !== undefined && filters.minPrice !== null) {
      filteredHotels = filteredHotels.filter((hotel) => {
        // Find the price for the selected currency
        const priceInSelectedCurrency = hotel.price.find(
          (price) => price.currency === selectedCurrency
        );

        // If price in selected currency exists, compare with minPrice
        // Otherwise, return true to keep the hotel (or could default to another currency)
        return priceInSelectedCurrency
          ? priceInSelectedCurrency.amount >= filters.minPrice!
          : true; // Could also return false or use a fallback currency
      });
    }

    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      filteredHotels = filteredHotels.filter((hotel) => {
        const priceInSelectedCurrency = hotel.price.find(
          (price) => price.currency === selectedCurrency
        );

        return priceInSelectedCurrency
          ? priceInSelectedCurrency.amount <= filters.maxPrice!
          : true; // Could also return false or use a fallback currency
      });
    }
  }

  if (selectedFeatures.length > 0) {
    filteredHotels = filteredHotels.filter((hotel) =>
      selectedFeatures.every((selectedFeature) =>
        hotel.featureIds.some((hotelFeature: string | { _id: string }) => {
          // Assuming hotel.features is an array of feature objects with _id
          if (
            typeof hotelFeature === "object" &&
            hotelFeature !== null &&
            "_id" in hotelFeature
          ) {
            return hotelFeature._id === selectedFeature._id;
          }
          // Assuming hotel.features is an array of feature IDs (strings)
          return hotelFeature === selectedFeature._id;
        })
      )
    );
  }

  function NoResultsFound() {
    return (
      <div className="w-full h-[calc(100vh-155px)] flex flex-col items-center justify-center text-gray-500">
        <p>{t("noResultsFound")}</p>
        <button
          onClick={() => {
            setFilters(null);
            setSelectedLocation(null);
            setSelectedPropertyType(null);
            setSelectedCategory(null);
            setListingType("For Sale");
            setSelectedFeatures([]);
          }}
          className="mt-4 px-4 py-2 bg-[#362C75] text-white rounded transition-colors cursor-pointer"
        >
          {t("clearFilters")}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Header
        setFilters={setFilters}
        filterOptions={filterOptions}
        selectedLocation={selectedLocation}
        selectedPropertyType={selectedPropertyType}
        selectedCategory={selectedCategory}
        listingType={listingType}
        setListingType={setListingType}
        setSelectedPropertyType={setSelectedPropertyType}
        setSelectedCategory={setSelectedCategory}
        setSelectedLocation={setSelectedLocation}
      />
      <FilterList
        features={features}
        selectedFeatures={selectedFeatures}
        setSelectedFeatures={setSelectedFeatures}
        currentView={currentView}
        listingType={listingType}
        setListingType={setListingType}
        onChangeCurrentView={() => {
          if (currentView === "map") {
            setCurrentView("list");
          } else {
            setCurrentView("map");
          }
        }}
        filterOptions={filterOptions}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedPropertyType={selectedPropertyType}
        setSelectedPropertyType={setSelectedPropertyType}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setFilters={setFilters}
      />
      {filters && filteredHotels.length === 0 ? (
        <NoResultsFound />
      ) : currentView === "map" ? (
        <MapView
          key={selectedFeatures.length}
          hotels={filteredHotels}
          totalHotelsCount={hotels.length}
        />
      ) : (
        <ListView hotels={filteredHotels} />
      )}
      {/* <ViewSwitcher currentView={currentView} setCurrentView={setCurrentView} /> */}
    </div>
  );
}
