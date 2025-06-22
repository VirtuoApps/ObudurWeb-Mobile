"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import EmailVerifiedSuccessPopup from "../components/EmailVerifiedSuccessPopup/EmailVerifiedSuccessPopup";
import { Feature } from "@/types/feature.type";
import FilterList from "./FilterList/FilterList";
import { FilterOptions } from "@/types/filter-options.type";
import { FilterType } from "@/types/filter.type";
import Footer from "../[locale]/resident/[slug]/Footer/Footer";
import Header from "./Header/Header";
import { Hotel } from "@/types/hotel.type";
import ListView, { getLocalizedText } from "./ListView/ListView";
import NoResultFound from "./ListView/NoResultFound/NoResultFound";
import PersonalInformationFormPopup from "../components/PersonalInformationsFormPopup/PersonalInformationsFormPopup";
import SaveFilterPopup from "./SaveFilterPopup/SaveFilterPopup";
import SignupEmailVerifySendPopup from "../components/SignupEMailVerifySendPopup/SignupEmailVerifySendPopup";
import ViewSwitcher from "./ViewSwitcher/ViewSwitcher";
import axiosInstance from "@/axios";
import cities from "./cities";
import { currencyOptions } from "@/app/components/LanguageSwitcher";
import dynamic from "next/dynamic";
import { filterHotelsByProximity } from "@/app/utils/geoUtils";
import { states } from "./states";
import { useScrollDirection } from "../hooks/useScrollDirection";
import { useSelector } from "react-redux";
import { useLocale, useTranslations } from "next-intl";
import Bowser from "bowser";
import MapPropertyFloatingCard from "./MapView/MapPropertyFloatingCard/MapPropertyFloatingCard";
import { getDisplayPrice } from "../utils/priceFormatter";
import { formatAddress } from "../utils/addressFormatter";
import { renderFloorPositionText } from "../utils/renderFloorPositionText";

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
  isDefaultSale,
  isDefaultRent,
}: {
  features: Feature[];
  hotels: Hotel[];
  filterOptions: FilterOptions;
  allQuickFilters: Feature[];
  isDefaultSale?: boolean;
  isDefaultRent?: boolean;
}) {
  let hotels = hotelsFromParam;

  const t = useTranslations("common");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [currentView, setCurrentView] = useState<"map" | "list">("map");
  const { isScrolled } = useScrollDirection();
  const isMobile = useSelector((state: any) => state.favorites.isMobile);
  const [filters, setFilters] = useState<FilterType | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [sortOption, setSortOption] = useState<
    "ascending" | "descending" | "newest" | "oldest" | null
  >(null);
  const [browser, setBrowser] = useState<string>("");

  // Transition states
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextView, setNextView] = useState<"map" | "list" | null>(null);
  const [isPinSelected, setIsPinSelected] = useState(false);

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
  const [selectedInfrastructureFeatures, setSelectedInfrastructureFeatures] =
    useState<any[]>([]);
  const [infrastructureFeatures, setInfrastructureFeatures] = useState<any[]>(
    []
  );
  const [selectedSceneryFeatures, setSelectedSceneryFeatures] = useState<any[]>(
    []
  );
  const [sceneryFeatures, setSceneryFeatures] = useState<any[]>([]);
  const [currencyCode, setCurrencyCode] = useState("₺");

  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState<any | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [listingType, setListingType] = useState<"For Sale" | "For Rent">(
    "For Sale"
  );
  const [searchRadius, setSearchRadius] = useState<number>(50); // Default 50km radius
  const [disableMapListButton, setDisableMapListButton] = useState(false);
  const [isSaveFilterPopupOpen, setIsSaveFilterPopupOpen] = useState(false);

  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

  const [showEmailVerifiedPopup, setShowEmailVerifiedPopup] = useState(false);
  const [showSignupEmailVerifySendPopup, setShowSignupEmailVerifySendPopup] =
    useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [hideSelectedHotel, setHideSelectedHotel] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);

  const [
    isPersonalInformationFormPopupOpen,
    setIsPersonalInformationFormPopupOpen,
  ] = useState(false);

  const tForRoomCounts = useTranslations("adminCreation.step2_house");

  const locale = useLocale();

  const generateRoomCountOptions = () => {
    return [
      { value: 9999999, label: tForRoomCounts("options.roomCounts.studio") },
      { value: 1, label: tForRoomCounts("options.roomCounts.1+1") },
      { value: 2, label: tForRoomCounts("options.roomCounts.2+1") },
      { value: 3, label: tForRoomCounts("options.roomCounts.3+1") },
      { value: 4, label: tForRoomCounts("options.roomCounts.4+1") },
      { value: 5, label: tForRoomCounts("options.roomCounts.5+1") },
      { value: 6, label: tForRoomCounts("options.roomCounts.6+1") },
      { value: 7, label: tForRoomCounts("options.roomCounts.7+1") },
      { value: 8, label: tForRoomCounts("options.roomCounts.8+1") },
      { value: 9, label: tForRoomCounts("options.roomCounts.9+1") },
      { value: 10, label: tForRoomCounts("options.roomCounts.10+") },
    ];
  };

  useEffect(() => {
    if (searchParams.get("emailConfirmed") === "true") {
      setShowEmailVerifiedPopup(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.get("showSignupEmailVerifySendPopup") === "true") {
      setShowSignupEmailVerifySendPopup(true);
    }
  }, [searchParams]);

  const handleCloseEmailVerifiedPopup = () => {
    setShowEmailVerifiedPopup(false);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("emailConfirmed");
    const newSearch = newParams.toString();
    const newUrl = newSearch ? `${pathname}?${newSearch}` : pathname;
    router.replace(newUrl, { scroll: false });
  };

  // Function to apply saved filter
  const applySavedFilter = async (filterId: string) => {
    try {
      const response = await axiosInstance.get(
        `/saved-filters/mine/${filterId}`
      );
      const savedFilter = response.data;

      if (savedFilter) {
        // Apply filter data to states
        if (savedFilter.listingType) {
          setListingType(savedFilter.listingType);
        }

        if (savedFilter.selectedLocation) {
          setSelectedLocation(savedFilter.selectedLocation);
        }

        if (savedFilter.propertyTypeId && savedFilter.propertyType) {
          setSelectedPropertyType({
            _id: savedFilter.propertyTypeId,
            name: savedFilter.propertyType,
          });
        }

        if (savedFilter.categoryId) {
          setSelectedCategory({ _id: savedFilter.categoryId });
        }

        // Apply filters object
        const filterData: FilterType = {
          listingType: savedFilter.listingType || null,
          state: savedFilter.state || null,
          propertyType: savedFilter.propertyType || null,
          roomAsText: savedFilter.roomAsText || null,
          minPrice: savedFilter.minPrice || null,
          maxPrice: savedFilter.maxPrice || null,
          roomCount: savedFilter.roomCount || null,
          bathroomCount: savedFilter.bathroomCount || null,
          minProjectArea: savedFilter.minProjectArea || null,
          maxProjectArea: savedFilter.maxProjectArea || null,
          interiorFeatureIds: savedFilter.interiorFeatureIds || null,
          exteriorFeatureIds: savedFilter.exteriorFeatureIds || null,
          accessibilityFeatureIds: savedFilter.accessibilityFeatureIds || null,
          faceFeatureIds: savedFilter.faceFeatureIds || null,
          isNewSelected: savedFilter.isNewSelected || null,
          isOnePlusOneSelected: savedFilter.isOnePlusOneSelected || null,
          isTwoPlusOneSelected: savedFilter.isTwoPlusOneSelected || null,
          isThreePlusOneSelected: savedFilter.isThreePlusOneSelected || null,
        };

        setFilters(filterData);

        // Apply individual filter states
        setMinPrice(savedFilter.minPrice || "");
        setMaxPrice(savedFilter.maxPrice || "");
        setMinArea(savedFilter.minProjectArea || "");
        setMaxArea(savedFilter.maxProjectArea || "");
        setRoomCount(
          savedFilter.roomCount ? savedFilter.roomCount.toString() : ""
        );
        setBathroomCount(
          savedFilter.bathroomCount ? savedFilter.bathroomCount.toString() : ""
        );

        // Apply selected features
        if (
          savedFilter.selectedFeatures &&
          savedFilter.selectedFeatures.length > 0
        ) {
          setSelectedFeatures(savedFilter.selectedFeatures);
        }

        // Apply feature arrays
        if (
          savedFilter.interiorFeatureIds &&
          savedFilter.interiorFeatureIds.length > 0
        ) {
          // You might need to fetch feature details if needed
          const interiorFeatureData = savedFilter.interiorFeatureIds.map(
            (id: string) => ({ _id: id })
          );
          setInteriorFeatures(interiorFeatureData);
        }

        if (
          savedFilter.exteriorFeatureIds &&
          savedFilter.exteriorFeatureIds.length > 0
        ) {
          const exteriorFeatureData = savedFilter.exteriorFeatureIds.map(
            (id: string) => ({ _id: id })
          );
          setSelectedExteriorFeatures(exteriorFeatureData);
        }

        if (
          savedFilter.accessibilityFeatureIds &&
          savedFilter.accessibilityFeatureIds.length > 0
        ) {
          const accessibilityFeatureData =
            savedFilter.accessibilityFeatureIds.map((id: string) => ({
              _id: id,
            }));
          setSelectedAccessibilityFeatures(accessibilityFeatureData);
        }

        if (
          savedFilter.faceFeatureIds &&
          savedFilter.faceFeatureIds.length > 0
        ) {
          const faceFeatureData = savedFilter.faceFeatureIds.map(
            (id: string) => ({ _id: id })
          );
          setSelectedFaceFeatures(faceFeatureData);
        }

        if (
          savedFilter.infrastructureFeatureIds &&
          savedFilter.infrastructureFeatureIds.length > 0
        ) {
          const infrastructureFeatureData =
            savedFilter.infrastructureFeatureIds.map((id: string) => ({
              _id: id,
            }));
          setSelectedInfrastructureFeatures(infrastructureFeatureData);
        }

        if (
          savedFilter.sceneryFeatureIds &&
          savedFilter.sceneryFeatureIds.length > 0
        ) {
          const sceneryFeatureData = savedFilter.sceneryFeatureIds.map(
            (id: string) => ({ _id: id })
          );
          setSelectedSceneryFeatures(sceneryFeatureData);
        }

        // Switch to list view to show results
        setCurrentView("list");

        // Clear the filterId from URL after applying the filter
        router.replace("/", { scroll: false });
      }
    } catch (error) {
      console.error("Error fetching saved filter:", error);
    }
  };

  // Check for filterId in URL params
  useEffect(() => {
    const filterId = searchParams.get("filterId");
    if (filterId) {
      applySavedFilter(filterId);
    } else {
      const localStorageState = localStorage.getItem("currentView");
      if (localStorageState) {
        setCurrentView(localStorageState as "map" | "list");
      } else {
        setCurrentView("map");
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (isDefaultSale) {
      setListingType("For Sale");
      setCurrentView("list");
    }
  }, [isDefaultSale]);

  useEffect(() => {
    if (isDefaultRent) {
      setListingType("For Rent");
      setCurrentView("list");
    }
  }, [isDefaultRent]);

  useEffect(() => {
    // Get selected currency from localStorage
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinArea("");
    setMaxArea("");
    setRoomCount("");
    setBathroomCount("");
    setInteriorFeatures([]);
    setSelectedExteriorFeatures([]);
    setSelectedAccessibilityFeatures([]);
    setSelectedFaceFeatures([]);
    setSelectedInfrastructureFeatures([]);
    setSelectedSceneryFeatures([]);
    setSelectedLocation(null);
    setSelectedPropertyType && setSelectedPropertyType(null);
    setSelectedCategory && setSelectedCategory(null);
    setSelectedFeatures([]);

    setFilters({
      listingType: null,
      state: null,
      propertyType: null,
      roomAsText: null,
      isOnePlusOneSelected: false,
      isTwoPlusOneSelected: false,
      isThreePlusOneSelected: false,
    });
  };
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

  // Handle pin selection change from MapView
  const handlePinSelectionChange = (isSelected: boolean) => {
    setIsPinSelected(isSelected);
  };

  if (listingType) {
    hotels = hotels.filter((hotel) =>
      Object.values(hotel.listingType).some((value) => value === listingType)
    );
  }

  let filteredHotels = hotels;

  if (selectedLocation) {
    const isCity = cities.includes(selectedLocation.name);
    let isState = false;

    Object.keys(states).forEach((state) => {
      if (
        states[state as keyof typeof states].includes(selectedLocation.name)
      ) {
        isState = true;
      }
    });

    if (isCity) {
      const cityComponent = selectedLocation.address_components?.find(
        (comp: any) => comp.types.includes("locality")
      );
      const cityName = cityComponent?.long_name;
      if (cityName) {
        filteredHotels = filteredHotels.filter(
          (hotel) => hotel.state?.tr === cityName
        );
      }
    } else if (isState) {
      const stateComponent = selectedLocation.address_components?.find(
        (comp: any) =>
          comp.types.includes("administrative_area_level_2") ||
          comp.types.includes("administrative_area_level_1")
      );
      const stateName = stateComponent?.long_name;
      if (stateName) {
        filteredHotels = filteredHotels.filter(
          (hotel) => hotel.city?.tr === stateName
        );
      }
    } else if (selectedLocation.coordinates) {
      // Filter hotels by proximity to selected location using the selected radius
      const [targetLon, targetLat] = selectedLocation.coordinates;
      filteredHotels = filterHotelsByProximity(
        filteredHotels,
        targetLat,
        targetLon,
        searchRadius
      );
    }
  }

  if (roomCount !== undefined && roomCount !== null && +roomCount > 0) {
    filteredHotels = filteredHotels.filter((hotel) => {
      return hotel.roomCount === +roomCount;
    });
  }

  console.log({
    roomCount,
    filteredHotels: filteredHotels.length,
  });

  if (
    bathroomCount !== undefined &&
    bathroomCount !== null &&
    +bathroomCount > 0
  ) {
    filteredHotels = filteredHotels.filter((hotel) => {
      return hotel.bathroomCount === +bathroomCount;
    });
  }

  console.log({
    bathroomCount,
    filteredHotels: filteredHotels.length,
  });

  if (selectedSceneryFeatures.length > 0) {
    filteredHotels = filteredHotels.filter((hotel) => {
      return hotel.viewIds.some((viewId) =>
        selectedSceneryFeatures.some((feature) => feature._id === viewId)
      );
    });
  }

  if (interiorFeatures.length > 0) {
    filteredHotels = filteredHotels.filter((hotel) => {
      return interiorFeatures.every((feature) =>
        hotel.featureIds.includes(feature._id)
      );
    });
  }

  console.log({
    interiorFeatures,
    filteredHotels: filteredHotels.length,
  });

  if (selectedExteriorFeatures.length > 0) {
    filteredHotels = filteredHotels.filter((hotel) => {
      return selectedExteriorFeatures.every((feature) => {
        const isHousingTypeMatch =
          hotel.housingType.tr === selectedExteriorFeatures[0].name.tr;

        if (isHousingTypeMatch) {
          return true;
        }

        return hotel.featureIds.includes(feature._id);
      });
    });
  }

  console.log({
    selectedExteriorFeatures,
    filteredHotels: filteredHotels.length,
  });

  if (selectedFaceFeatures.length > 0) {
    filteredHotels = filteredHotels.filter((hotel) => {
      return selectedFaceFeatures.every((feature) =>
        hotel.faces.includes(feature._id)
      );
    });
  }

  console.log({
    selectedFaceFeatures,
    filteredHotels: filteredHotels.length,
  });

  if (selectedAccessibilityFeatures.length > 0) {
    filteredHotels = filteredHotels.filter((hotel) => {
      return selectedAccessibilityFeatures.every((feature) =>
        hotel.featureIds.includes(feature._id)
      );
    });
  }

  console.log({
    selectedAccessibilityFeatures,
    filteredHotels: filteredHotels.length,
  });

  if (filters) {
    if (filters.propertyType) {
      filteredHotels = filteredHotels.filter((hotel) =>
        Object.values(hotel.entranceType).some(
          (value) => value === filters.propertyType
        )
      );
    }

    if (filters.roomAsText) {
      filteredHotels = filteredHotels.filter((hotel) =>
        Object.values(hotel.housingType).some(
          (value) => value === filters.roomAsText
        )
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

    console.log({
      roomCount: filters.roomCount,
    });

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

    if (filters.interiorFeatureIds && filters.interiorFeatureIds.length > 0) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return filters.interiorFeatureIds!.every((featureId) =>
          hotel.featureIds.includes(featureId)
        );
      });
    }

    if (filters.exteriorFeatureIds && filters.exteriorFeatureIds.length > 0) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return filters.exteriorFeatureIds!.every((featureId) =>
          hotel.featureIds.includes(featureId)
        );
      });
    }

    if (
      filters.accessibilityFeatureIds &&
      filters.accessibilityFeatureIds.length > 0
    ) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return filters.accessibilityFeatureIds!.every((featureId: string) =>
          hotel.featureIds.includes(featureId)
        );
      });
    }

    if (filters.faceFeatureIds && filters.faceFeatureIds.length > 0) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return filters.faceFeatureIds!.some((featureId: string) =>
          hotel.faces.includes(featureId)
        );
      });
    }

    if (
      filters.infrastructureFeatureIds &&
      filters.infrastructureFeatureIds.length > 0
    ) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return filters.infrastructureFeatureIds!.every((featureId: string) =>
          hotel.featureIds.includes(featureId)
        );
      });
    }

    if (filters.sceneryFeatureIds && filters.sceneryFeatureIds.length > 0) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return filters.sceneryFeatureIds!.every((featureId: string) =>
          hotel.featureIds.includes(featureId)
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

    if (filters.isOnePlusOneSelected) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return hotel.roomCount === 1;
      });
    }

    if (filters.isTwoPlusOneSelected) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return hotel.roomCount === 2;
      });
    }

    if (filters.isThreePlusOneSelected) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return hotel.roomCount === 3;
      });
    }
  }

  console.log({
    selectedFeatures,
    filteredHotels: filteredHotels.length,
    filters,
    hotels: hotels.length,
  });

  if (selectedFeatures.length > 0) {
    filteredHotels = filteredHotels.filter((hotel) =>
      selectedFeatures.every((selectedFeature) => {
        const isHousingTypeMatch =
          hotel.housingType.tr === selectedFeature.name.tr;

        console.log({
          isHousingTypeMatch,
        });

        const isFeatureMatch = hotel.featureIds.some(
          (hotelFeature: string | { _id: string }) => {
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
          }
        );

        return isHousingTypeMatch || isFeatureMatch;
      })
    );
  }

  const noResultFound =
    (filters || selectedLocation) && filteredHotels.length === 0;

  console.log("Filtered Hotels: ", +Math.random() * 100);
  console.log({ filteredHotels });

  // Disable body scroll when component mounts
  useEffect(() => {
    // Disable scroll on body
    if (
      (currentView === "map" && !noResultFound && filteredHotels.length > 0) ||
      isFilterPopupOpen
    ) {
      console.log("disable scroll");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function to re-enable scroll when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [currentView, noResultFound, isFilterPopupOpen, filteredHotels]);

  useEffect(() => {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const browserName = browser.getBrowserName();
    setBrowser(browserName);
  }, []);

  return (
    <>
      {showEmailVerifiedPopup && (
        <EmailVerifiedSuccessPopup
          onClose={() => {
            handleCloseEmailVerifiedPopup();

            setIsPersonalInformationFormPopupOpen(true);
          }}
        />
      )}
      {showSignupEmailVerifySendPopup && (
        <SignupEmailVerifySendPopup
          onClose={() => {
            setShowSignupEmailVerifySendPopup(false);
          }}
        />
      )}

      {isPersonalInformationFormPopupOpen && (
        <PersonalInformationFormPopup
          onClose={() => {
            setIsPersonalInformationFormPopupOpen(false);
          }}
        />
      )}

      <SaveFilterPopup
        isOpen={isSaveFilterPopupOpen}
        onClose={() => setIsSaveFilterPopupOpen(false)}
        onSave={() => {}}
        filters={filters}
        listingType={listingType}
        selectedLocation={selectedLocation}
        selectedPropertyType={selectedPropertyType}
        selectedCategory={selectedCategory}
        minPrice={minPrice}
        maxPrice={maxPrice}
        minArea={minArea}
        maxArea={maxArea}
        roomCount={roomCount}
        bathroomCount={bathroomCount}
        selectedFeatures={selectedFeatures}
        interiorFeatures={interiorFeatures}
        selectedExteriorFeatures={selectedExteriorFeatures}
        selectedAccessibilityFeatures={selectedAccessibilityFeatures}
        selectedFaceFeatures={selectedFaceFeatures}
        resultCount={filteredHotels.length}
      />
      <div
        className={`bg-white ${
          isScrolled && isMobile ? "pt-[72px]" : ""
        } transition-all duration-300 z-50`}
      >
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
          setIsFilterPopupOpen={setIsFilterPopupOpen}
          setShowIsPersonalInformationFormPopup={
            setIsPersonalInformationFormPopupOpen
          }
          resetFilters={resetFilters}
          disableMapListButton={disableMapListButton}
          setDisableMapListButton={setDisableMapListButton}
          setIsAuthMenuOpen={setIsAuthMenuOpen}
        />

        <FilterList
          features={features}
          selectedFeatures={selectedFeatures}
          setSelectedFeatures={setSelectedFeatures}
          currentView={currentView}
          listingType={listingType}
          setListingType={setListingType}
          onChangeCurrentView={() => {
            handleViewChange(currentView === "map" ? "list" : "map");
            localStorage.setItem(
              "currentView",
              currentView === "map" ? "list" : "map"
            );
          }}
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
          infrastructureFeatures={infrastructureFeatures}
          setInfrastructureFeatures={setInfrastructureFeatures}
          selectedInfrastructureFeatures={selectedInfrastructureFeatures}
          setSelectedInfrastructureFeatures={setSelectedInfrastructureFeatures}
          sceneryFeatures={sceneryFeatures}
          setSceneryFeatures={setSceneryFeatures}
          selectedSceneryFeatures={selectedSceneryFeatures}
          setSelectedSceneryFeatures={setSelectedSceneryFeatures}
          currencyCode={currencyCode}
          setCurrencyCode={setCurrencyCode}
          interiorFeatures={interiorFeatures}
          setInteriorFeatures={setInteriorFeatures}
          allQuickFilters={allQuickFilters}
          hotels={hotels}
          selectedCurrency={selectedCurrency}
          searchRadius={searchRadius}
          isFilterPopupOpen={isFilterPopupOpen}
          setIsFilterPopupOpen={setIsFilterPopupOpen}
          setIsSaveFilterPopupOpen={setIsSaveFilterPopupOpen}
          sortOption={sortOption}
          setSortOption={setSortOption}
          resultCount={filteredHotels.length}
          isAuthMenuOpen={isAuthMenuOpen}
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

          {filteredHotels.length === 0 ? (
            <div
              className={`transition-all duration-400 ease-out ${
                isTransitioning
                  ? "opacity-0 transform translate-y-6 scale-95"
                  : "opacity-100 transform translate-y-0 scale-100 animate-fade-in-up"
              }`}
            >
              <NoResultFound
                resetFilters={() => {
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
                  setSelectedInfrastructureFeatures([]);
                  setInfrastructureFeatures([]);
                  setSelectedSceneryFeatures([]);
                  setSceneryFeatures([]);
                  setMinPrice("");
                  setMaxPrice("");
                  setMinArea("");
                  setMaxArea("");
                  setRoomCount("");
                  setBathroomCount("");
                }}
                allHotels={hotels}
                currentView={currentView}
              />
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
                <div
                  className={!isTransitioning ? "animate-slide-in-left" : ""}
                >
                  <MapView
                    key={selectedFeatures.length}
                    hotels={filteredHotels}
                    totalHotelsCount={hotels.length}
                    selectedLocation={selectedLocation}
                    searchRadius={searchRadius}
                    onPinSelectionChange={handlePinSelectionChange}
                    selectedHotel={selectedHotel}
                    setSelectedHotel={setSelectedHotel}
                    hideSelectedHotel={hideSelectedHotel}
                    setHideSelectedHotel={setHideSelectedHotel}
                  />
                </div>
              ) : (
                <div
                  className={!isTransitioning ? "animate-slide-in-right" : ""}
                >
                  <ListView
                    hotels={filteredHotels}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    setIsSaveFilterPopupOpen={setIsSaveFilterPopupOpen}
                    isCurrentFilterExist={
                      hotels.length !== filteredHotels.length
                    }
                  />
                  <div className="pt-24 w-full"></div>
                  <Footer />
                </div>
              )}
            </div>
          )}
        </div>

        {/* <ViewSwitcher currentView={currentView} setCurrentView={setCurrentView} /> */}
      </div>

      {!disableMapListButton && (
        <div className="fixed left-0 bottom-0 lg:hidden w-full z-40 px-4 pb-4">
          <div
            className={` bg-[#FCFCFC] border border-[#D9D9D9] flex flex-row items-center justify-center z-40 px-3 h-[40px]  rounded-lg shadow-lg transition-all duration-300`}
            onClick={() => {
              handleViewChange(currentView === "map" ? "list" : "map");
              localStorage.setItem(
                "currentView",
                currentView === "map" ? "list" : "map"
              );
            }}
            style={{
              width: "88px",
            }}
          >
            <img
              src={currentView === "map" ? "/list.png" : "/map-03.png"}
              className="w-5 h-5"
            />
            <p className="text-base text-[#262626] font-medium ml-2">
              {currentView === "map" ? "Liste" : "Harita"}
            </p>
          </div>

          {isMobile && selectedHotel && currentView !== "list" && (
            <MapPropertyFloatingCard
              isVisible={!!selectedHotel && !hideSelectedHotel}
              onClose={() => setSelectedHotel(null)}
              key={selectedHotel._id}
              hotelId={selectedHotel._id}
              slug={selectedHotel.slug}
              type={getLocalizedText(selectedHotel.listingType, locale)}
              isOptinable={false}
              residentTypeName={getLocalizedText(
                selectedHotel.housingType,
                locale
              )}
              title={getLocalizedText(selectedHotel.title, locale)}
              price={getDisplayPrice(selectedHotel.price, selectedCurrency)}
              bedCount={selectedHotel.bedRoomCount.toString()}
              floorCount={renderFloorPositionText(
                selectedHotel.floorPosition,
                locale
              )}
              area={`${selectedHotel.projectArea}m²`}
              locationText={formatAddress(selectedHotel, locale)}
              image={selectedHotel.images[0]}
              images={selectedHotel.images}
              isFavorite={false}
              roomAsText={
                generateRoomCountOptions().find(
                  (option) => option.value === selectedHotel.roomCount
                )?.label || ""
              }
              roomCount={selectedHotel.roomCount || 0}
              entranceType={selectedHotel.entranceType}
              priceAsNumber={selectedHotel.price[0].amount}
              areaAsNumber={+selectedHotel.projectArea}
            />
          )}
        </div>
      )}
    </>
  );
}
