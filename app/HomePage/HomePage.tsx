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
import { filterHotelsByProximity } from "@/app/utils/geoUtils";
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
  hotels: hotelsFromParam,
  filterOptions,
  allQuickFilters,
}: {
  features: Feature[];
  hotels: Hotel[];
  filterOptions: FilterOptions;
  allQuickFilters: Feature[];
}) {
  let hotels = hotelsFromParam;

  const t = useTranslations("common");
  const [currentView, setCurrentView] = useState<"map" | "list">("map");
  const [filters, setFilters] = useState<FilterType | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [sortOption, setSortOption] = useState<
    "ascending" | "descending" | null
  >(null);

  // Transition states
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextView, setNextView] = useState<"map" | "list" | null>(null);

  // States moved from FilterPopup component
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [minArea, setMinArea] = useState<number | "">("");
  const [maxArea, setMaxArea] = useState<number | "">("");
  const [roomCount, setRoomCount] = useState<string>("");
  const [bathroomCount, setBathroomCount] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
  const [interiorFeatures, setInteriorFeatures] = useState<any[]>([]);
  const [selectedExteriorFeatures, setSelectedExteriorFeatures] = useState<
    any[]
  >([]);
  const [selectedAccessibilityFeatures, setSelectedAccessibilityFeatures] =
    useState<any[]>([]);
  const [accessibilityFeatures, setAccessibilityFeatures] = useState<any[]>([]);
  const [selectedFaceFeatures, setSelectedFaceFeatures] = useState<any[]>([]);
  const [faceFeatures, setFaceFeatures] = useState<any[]>([]);
  const [currencyCode, setCurrencyCode] = useState("₺");

  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState<any | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [listingType, setListingType] = useState<"For Sale" | "For Rent">(
    "For Sale"
  );
  const [searchRadius, setSearchRadius] = useState<number>(5); // Default 50km radius

  useEffect(() => {
    // Get selected currency from localStorage
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  // Handle view transitions
  const handleViewChange = (newView: "map" | "list") => {
    if (newView === currentView || isTransitioning) return;

    setIsTransitioning(true);
    setNextView(newView);

    // After fade out completes, change the view
    setTimeout(() => {
      setCurrentView(newView);
      setNextView(null);

      // After view change, fade back in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  if (listingType) {
    hotels = hotels.filter((hotel) =>
      Object.values(hotel.listingType).some((value) => value === listingType)
    );
  }

  let filteredHotels = hotels;

  if (selectedLocation && selectedLocation.coordinates) {
    // Filter hotels by proximity to selected location using the selected radius
    const [targetLon, targetLat] = selectedLocation.coordinates;
    filteredHotels = filterHotelsByProximity(
      filteredHotels,
      targetLat,
      targetLon,
      searchRadius
    );
  }

  if (filters) {
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

    if (
      filters.roomCount !== undefined &&
      filters.roomCount !== null &&
      filters.roomCount > 0
    ) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return hotel.roomCount === filters.roomCount;
      });
    }

    if (
      filters.bathroomCount !== undefined &&
      filters.bathroomCount !== null &&
      filters.bathroomCount > 0
    ) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return hotel.bathroomCount === filters.bathroomCount;
      });
    }

    if (
      filters.minProjectArea !== undefined &&
      filters.minProjectArea !== null &&
      filters.minProjectArea > 0
    ) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return hotel.projectArea >= filters.minProjectArea!;
      });
    }

    if (
      filters.maxProjectArea !== undefined &&
      filters.maxProjectArea !== null &&
      filters.maxProjectArea > 0
    ) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return hotel.projectArea <= filters.maxProjectArea!;
      });
    }

    if (filters.interiorFeatureIds) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return filters.interiorFeatureIds!.every((featureId) =>
          hotel.featureIds.includes(featureId)
        );
      });
    }

    if (filters.exteriorFeatureIds) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return filters.exteriorFeatureIds!.every((featureId) =>
          hotel.featureIds.includes(featureId)
        );
      });
    }

    if (filters.accessibilityFeatureIds) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return filters.accessibilityFeatureIds!.every((featureId: string) =>
          hotel.featureIds.includes(featureId)
        );
      });
    }

    if (filters.faceFeatureIds) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return filters.faceFeatureIds!.some(
          (featureId: string) => hotel.face === featureId
        );
      });
    }

    if (filters.isNewSelected) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      filteredHotels = filteredHotels.filter((hotel) => {
        const hotelCreatedAt = new Date(hotel.createdAt);
        return hotelCreatedAt >= sevenDaysAgo;
      });
    }

    if (
      filters.isOnePlusOneSelected ||
      filters.isTwoPlusOneSelected ||
      filters.isThreePlusOneSelected
    ) {
      const selectedRoomTypes: string[] = [];
      if (filters.isOnePlusOneSelected) selectedRoomTypes.push("1+1");
      if (filters.isTwoPlusOneSelected) selectedRoomTypes.push("2+1");
      if (filters.isThreePlusOneSelected) selectedRoomTypes.push("3+1");

      filteredHotels = filteredHotels.filter((hotel) => {
        return selectedRoomTypes.includes(hotel.roomAsText);
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
            setInteriorFeatures([]);
            setSelectedExteriorFeatures([]);
            setSelectedAccessibilityFeatures([]);
            setAccessibilityFeatures([]);
            setSelectedFaceFeatures([]);
            setFaceFeatures([]);
            setMinPrice("");
            setMaxPrice("");
            setMinArea("");
            setMaxArea("");
            setRoomCount("");
            setBathroomCount("");
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
        searchRadius={searchRadius}
        setSearchRadius={setSearchRadius}
      />
      <FilterList
        features={features}
        selectedFeatures={selectedFeatures}
        setSelectedFeatures={setSelectedFeatures}
        currentView={currentView}
        listingType={listingType}
        setListingType={setListingType}
        onChangeCurrentView={() =>
          handleViewChange(currentView === "map" ? "list" : "map")
        }
        filterOptions={filterOptions}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedPropertyType={selectedPropertyType}
        setSelectedPropertyType={setSelectedPropertyType}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filters={filters || null}
        setFilters={setFilters}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minArea={minArea}
        setMinArea={setMinArea}
        maxArea={maxArea}
        setMaxArea={setMaxArea}
        roomCount={roomCount}
        setRoomCount={setRoomCount}
        bathroomCount={bathroomCount}
        setBathroomCount={setBathroomCount}
        selectedExteriorFeatures={selectedExteriorFeatures}
        setSelectedExteriorFeatures={setSelectedExteriorFeatures}
        selectedAccessibilityFeatures={selectedAccessibilityFeatures}
        setSelectedAccessibilityFeatures={setSelectedAccessibilityFeatures}
        accessibilityFeatures={accessibilityFeatures}
        setAccessibilityFeatures={setAccessibilityFeatures}
        selectedFaceFeatures={selectedFaceFeatures}
        setSelectedFaceFeatures={setSelectedFaceFeatures}
        faceFeatures={faceFeatures}
        setFaceFeatures={setFaceFeatures}
        currencyCode={currencyCode}
        setCurrencyCode={setCurrencyCode}
        interiorFeatures={interiorFeatures}
        setInteriorFeatures={setInteriorFeatures}
        allQuickFilters={allQuickFilters}
      />

      {/* View Container with Transitions */}
      <div className="relative overflow-hidden">
        {/* Loading overlay during transitions */}
        {isTransitioning && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="loading-pulse">
              <div className="w-8 h-8 border-2 border-[#5E5691] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {(filters || selectedLocation) && filteredHotels.length === 0 ? (
          <div
            className={`transition-all duration-400 ease-out ${
              isTransitioning
                ? "opacity-0 transform translate-y-6 scale-95"
                : "opacity-100 transform translate-y-0 scale-100 animate-fade-in-up"
            }`}
          >
            <NoResultsFound />
          </div>
        ) : (
          <div
            className={`transition-all duration-400 ease-out ${
              isTransitioning
                ? "opacity-0 transform translate-y-6 scale-95"
                : "opacity-100 transform translate-y-0 scale-100"
            } ${
              currentView === "map"
                ? "map-to-list-transition"
                : "list-to-map-transition"
            }`}
          >
            {currentView === "map" ? (
              <div className={!isTransitioning ? "animate-slide-in-left" : ""}>
                <MapView
                  key={selectedFeatures.length}
                  hotels={filteredHotels}
                  totalHotelsCount={hotels.length}
                  selectedLocation={selectedLocation}
                  searchRadius={searchRadius}
                />
              </div>
            ) : (
              <div className={!isTransitioning ? "animate-slide-in-right" : ""}>
                <ListView
                  hotels={filteredHotels}
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* <ViewSwitcher currentView={currentView} setCurrentView={setCurrentView} /> */}
    </div>
  );
}
