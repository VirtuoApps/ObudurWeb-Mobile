"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PlusIcon,
  MinusIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { RiWifiFill } from "react-icons/ri";
import { AiFillSafetyCertificate, AiOutlineFire } from "react-icons/ai";
import { BsTv, BsFillHouseFill } from "react-icons/bs";
import { ImSpoonKnife } from "react-icons/im";
import {
  FaTemperatureHigh,
  FaWarehouse,
  FaSwimmingPool,
  FaParking,
} from "react-icons/fa";
import {
  GiWashingMachine,
  GiClothes,
  GiGardeningShears,
  GiGate,
} from "react-icons/gi";
import {
  MdKitchen,
  MdWindow,
  MdFireplace,
  MdSecurity,
  MdBalcony,
  MdElevator,
} from "react-icons/md";
import { TbAirConditioning } from "react-icons/tb";
import { IoSchool, IoRestaurantOutline } from "react-icons/io5";
import { BiTrain, BiStore, BiHealth } from "react-icons/bi";
import { currencyOptions } from "../LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";
import {
  FilterOptions,
  Feature,
  HotelType,
  HotelCategory,
} from "@/types/filter-options.type";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  ChevronDownIcon as ChevronDownSolidIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { HomeIcon } from "@heroicons/react/24/outline";
import { TagIcon } from "@heroicons/react/24/outline";
import axiosInstance from "@/axios";
import { Hotel } from "@/types/hotel.type";
import { filterHotelsByProximity } from "@/app/utils/geoUtils";
import GeneralSelect from "../GeneralSelect/GeneralSelect";

type FilterPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  listingType: "For Sale" | "For Rent";
  setListingType: (listingType: "For Sale" | "For Rent") => void;
  filterOptions: FilterOptions;
  selectedLocation: any;
  setSelectedLocation: (selectedLocation: any) => void;
  selectedPropertyType?: any | null;
  setSelectedPropertyType?: (propertyType: any) => void;
  selectedCategory?: any | null;
  setSelectedCategory?: (category: any) => void;
  filters?: any;
  setFilters: (filters: any) => void;
  minPrice: number | "";
  setMinPrice: React.Dispatch<React.SetStateAction<number | "">>;
  maxPrice: number | "";
  setMaxPrice: React.Dispatch<React.SetStateAction<number | "">>;
  minArea: number | "";
  setMinArea: React.Dispatch<React.SetStateAction<number | "">>;
  maxArea: number | "";
  setMaxArea: React.Dispatch<React.SetStateAction<number | "">>;
  roomCount: string;
  setRoomCount: React.Dispatch<React.SetStateAction<string>>;
  bathroomCount: string;
  setBathroomCount: React.Dispatch<React.SetStateAction<string>>;
  selectedFeatures: any[];
  setSelectedFeatures: React.Dispatch<React.SetStateAction<any[]>>;
  selectedExteriorFeatures: any[];
  setSelectedExteriorFeatures: React.Dispatch<React.SetStateAction<any[]>>;
  currencyCode: string;
  setCurrencyCode: React.Dispatch<React.SetStateAction<string>>;
  interiorFeatures: any[];
  setInteriorFeatures: React.Dispatch<React.SetStateAction<any[]>>;
  accessibilityFeatures: any[];
  setAccessibilityFeatures: React.Dispatch<React.SetStateAction<any[]>>;
  selectedAccessibilityFeatures: any[];
  setSelectedAccessibilityFeatures: React.Dispatch<React.SetStateAction<any[]>>;
  faceFeatures: any[];
  setFaceFeatures: React.Dispatch<React.SetStateAction<any[]>>;
  selectedFaceFeatures: any[];
  setSelectedFaceFeatures: React.Dispatch<React.SetStateAction<any[]>>;
  hotels: Hotel[];
  selectedCurrency: string;
  searchRadius: number;
};

export default function FilterPopup({
  isOpen,
  onClose,
  listingType,
  setListingType,
  filterOptions,
  selectedLocation,
  setSelectedLocation,
  selectedPropertyType,
  setSelectedPropertyType,
  selectedCategory,
  setSelectedCategory,
  filters,
  setFilters,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minArea,
  setMinArea,
  maxArea,
  setMaxArea,
  roomCount,
  setRoomCount,
  bathroomCount,
  setBathroomCount,
  selectedFeatures,
  setSelectedFeatures,
  selectedExteriorFeatures,
  setSelectedExteriorFeatures,
  currencyCode,
  setCurrencyCode,
  interiorFeatures,
  setInteriorFeatures,
  accessibilityFeatures,
  setAccessibilityFeatures,
  selectedAccessibilityFeatures,
  setSelectedAccessibilityFeatures,
  faceFeatures,
  setFaceFeatures,
  selectedFaceFeatures,
  setSelectedFaceFeatures,
  hotels,
  selectedCurrency,
  searchRadius,
}: FilterPopupProps) {
  const t = useTranslations("filter");
  const listingTypeTranslations = useTranslations("listingType");

  const locale = useLocale();

  // Location search state variables - similar to LocationSelect.tsx
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingCoordinates, setIsFetchingCoordinates] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hotel types state
  const [hotelTypes, setHotelTypes] = useState<HotelType[]>([]);
  const [isLoadingHotelTypes, setIsLoadingHotelTypes] = useState(false);

  // Fetch hotel types from API
  useEffect(() => {
    const fetchHotelTypes = async () => {
      try {
        setIsLoadingHotelTypes(true);
        const response = await axiosInstance.get(
          "/admin/hotel-types/all-options"
        );
        setHotelTypes(response.data);
      } catch (error) {
        console.error("Error fetching hotel types:", error);
        // Fallback to filterOptions if API fails
        setHotelTypes(filterOptions.hotelTypes || []);
      } finally {
        setIsLoadingHotelTypes(false);
      }
    };

    if (isOpen) {
      // Only fetch when popup is open
      fetchHotelTypes();
    }
  }, [isOpen, filterOptions]);

  // Remove locale-based locations - we only want Google Places suggestions
  // const locations = filterOptions.state.map((state) => ({
  //   name: (state as any)[locale],
  //   description: `${(state.cityOfTheState as any)[locale]}/${
  //     (state.countryOfTheState as any)[locale]
  //   }`,
  //   href: "#",
  // }));

  // Fetch suggestions as user types - similar to LocationSelect.tsx
  const fetchLocationSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/places/autocomplete?input=${encodeURIComponent(
          searchQuery
        )}&language=${locale}`
      );

      const data = await response.json();

      if (data.status === "OK" && data.predictions) {
        const newSuggestions = data.predictions.map((prediction: any) => ({
          name: prediction.description.split(",")[0],
          description: prediction.description
            .split(",")
            .slice(1)
            .join(",")
            .trim(),
          href: "#",
          place_id: prediction.place_id,
        }));
        setSuggestions(newSuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", JSON.stringify(error));
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Fetch coordinates for selected location
  const fetchLocationCoordinates = async (
    placeId: string
  ): Promise<[number, number] | null> => {
    try {
      setIsFetchingCoordinates(true);
      const response = await fetch(
        `/api/places/details?placeId=${encodeURIComponent(
          placeId
        )}&language=${locale}`
      );

      const data = await response.json();

      if (data.status === "OK" && data.result?.geometry?.location) {
        const { lat, lng } = data.result.geometry.location;
        return [lng, lat]; // Return as [longitude, latitude] to match GeoJSON format
      }

      return null;
    } catch (error) {
      console.error("Error fetching location coordinates:", error);
      return null;
    } finally {
      setIsFetchingCoordinates(false);
    }
  };

  const incrementValue = (
    setValue: React.Dispatch<React.SetStateAction<number | "">>,
    currentValue: number | ""
  ) => {
    setValue(currentValue === "" ? 1 : Number(currentValue) + 1);
  };

  const decrementValue = (
    setValue: React.Dispatch<React.SetStateAction<number | "">>,
    currentValue: number | ""
  ) => {
    if (currentValue === "" || Number(currentValue) <= 0) return;
    setValue(Number(currentValue) - 1);
  };

  const toggleFeature = (feature: any) => {
    setInteriorFeatures((prev: any[]) =>
      prev.some((f: any) => f._id === feature._id)
        ? prev.filter((f: any) => f._id !== feature._id)
        : [...prev, feature]
    );
  };

  const toggleExteriorFeature = (feature: any) => {
    setSelectedExteriorFeatures((prev: any[]) =>
      prev.some((f: any) => f._id === feature._id)
        ? prev.filter((f: any) => f._id !== feature._id)
        : [...prev, feature]
    );
  };

  const toggleAccessibilityFeature = (feature: Feature) => {
    setSelectedAccessibilityFeatures((prev: any[]) =>
      prev.some((f: any) => f._id === feature._id)
        ? prev.filter((f: any) => f._id !== feature._id)
        : [...prev, feature]
    );
  };

  const toggleFaceFeature = (feature: Feature) => {
    setSelectedFaceFeatures((prev: any[]) =>
      prev.some((f: any) => f._id === feature._id)
        ? prev.filter((f: any) => f._id !== feature._id)
        : [...prev, feature]
    );
  };

  const resetFeatures = () => {
    setInteriorFeatures([]);
  };

  const resetExteriorFeatures = () => {
    setSelectedExteriorFeatures([]);
  };

  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      const currency = currencyOptions.find(
        (option) => option.code === savedCurrency
      );
      if (currency?.symbol && currency.symbol !== currencyCode) {
        setCurrencyCode(currency.symbol);
      }
    }
  }, [currencyCode, setCurrencyCode]);

  const [interiorFeaturesCollapsed, setInteriorFeaturesCollapsed] =
    useState(true);
  const [exteriorFeaturesCollapsed, setExteriorFeaturesCollapsed] =
    useState(true);
  const [accessibilityFeaturesCollapsed, setAccessibilityFeaturesCollapsed] =
    useState(true);
  const [faceFeaturesCollapsed, setFaceFeaturesCollapsed] = useState(true);

  // Calculate filtered results count
  const getFilteredResultsCount = () => {
    let filteredHotels = hotels;

    // Filter by listing type
    if (listingType) {
      filteredHotels = filteredHotels.filter((hotel) =>
        Object.values(hotel.listingType).some((value) => value === listingType)
      );
    }

    // Filter by location proximity
    if (selectedLocation && selectedLocation.coordinates) {
      const [targetLon, targetLat] = selectedLocation.coordinates;
      filteredHotels = filterHotelsByProximity(
        filteredHotels,
        targetLat,
        targetLon,
        searchRadius
      );
    }

    // Filter by property type
    if (selectedPropertyType?.name) {
      filteredHotels = filteredHotels.filter((hotel) =>
        Object.values(hotel.housingType).some(
          (value) => value === selectedPropertyType.name
        )
      );
    }

    // Filter by category (room type)
    if (selectedCategory?.name) {
      filteredHotels = filteredHotels.filter(
        (hotel) => hotel.roomAsText === selectedCategory.name
      );
    }

    // Filter by price
    if (minPrice !== "") {
      filteredHotels = filteredHotels.filter((hotel) => {
        const priceInSelectedCurrency = hotel.price.find(
          (price) => price.currency === selectedCurrency
        );
        return priceInSelectedCurrency
          ? priceInSelectedCurrency.amount >= Number(minPrice)
          : true;
      });
    }

    if (maxPrice !== "") {
      filteredHotels = filteredHotels.filter((hotel) => {
        const priceInSelectedCurrency = hotel.price.find(
          (price) => price.currency === selectedCurrency
        );
        return priceInSelectedCurrency
          ? priceInSelectedCurrency.amount <= Number(maxPrice)
          : true;
      });
    }

    // Filter by room count
    if (roomCount !== "") {
      filteredHotels = filteredHotels.filter((hotel) => {
        return hotel.roomCount === parseInt(roomCount);
      });
    }

    // Filter by bathroom count
    if (bathroomCount !== "") {
      filteredHotels = filteredHotels.filter((hotel) => {
        return hotel.bathroomCount === parseInt(bathroomCount);
      });
    }

    // Filter by area
    if (minArea !== "") {
      filteredHotels = filteredHotels.filter((hotel) => {
        return hotel.projectArea >= Number(minArea);
      });
    }

    if (maxArea !== "") {
      filteredHotels = filteredHotels.filter((hotel) => {
        return hotel.projectArea <= Number(maxArea);
      });
    }

    // Filter by interior features
    if (interiorFeatures.length > 0) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return interiorFeatures.every((feature) =>
          hotel.featureIds.includes(feature._id)
        );
      });
    }

    // Filter by exterior features
    if (selectedExteriorFeatures.length > 0) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return selectedExteriorFeatures.every((feature) =>
          hotel.featureIds.includes(feature._id)
        );
      });
    }

    // Filter by accessibility features
    if (selectedAccessibilityFeatures.length > 0) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return selectedAccessibilityFeatures.every((feature) =>
          hotel.featureIds.includes(feature._id)
        );
      });
    }

    // Filter by face features
    if (selectedFaceFeatures.length > 0) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return selectedFaceFeatures.some(
          (feature) => hotel.face === feature._id
        );
      });
    }

    // Filter by selected features (quick filters)
    if (selectedFeatures.length > 0) {
      filteredHotels = filteredHotels.filter((hotel) =>
        selectedFeatures.every((selectedFeature) =>
          hotel.featureIds.some((hotelFeature: string | { _id: string }) => {
            if (
              typeof hotelFeature === "object" &&
              hotelFeature !== null &&
              "_id" in hotelFeature
            ) {
              return hotelFeature._id === selectedFeature._id;
            }
            return hotelFeature === selectedFeature._id;
          })
        )
      );
    }

    // Filter by room size quick filters
    if (filters) {
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

      if (filters.isNewSelected) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        filteredHotels = filteredHotels.filter((hotel) => {
          const hotelCreatedAt = new Date(hotel.createdAt);
          return hotelCreatedAt >= sevenDaysAgo;
        });
      }
    }

    return filteredHotels.length;
  };

  const resultsCount = getFilteredResultsCount();

  // Check if any filters are selected
  const hasActiveFilters = () => {
    return (
      minPrice !== "" ||
      maxPrice !== "" ||
      minArea !== "" ||
      maxArea !== "" ||
      roomCount !== "" ||
      bathroomCount !== "" ||
      interiorFeatures.length > 0 ||
      selectedExteriorFeatures.length > 0 ||
      selectedAccessibilityFeatures.length > 0 ||
      selectedFaceFeatures.length > 0 ||
      selectedLocation ||
      selectedPropertyType ||
      selectedCategory ||
      selectedFeatures.length > 0 ||
      (filters &&
        (filters.isOnePlusOneSelected ||
          filters.isTwoPlusOneSelected ||
          filters.isThreePlusOneSelected ||
          filters.isNewSelected))
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0"
        onClick={onClose}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-xl max-w-[600px] w-full mx-auto max-h-[90vh] flex flex-col">
        {/* Header - Fixed at top */}
        <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-700">{t("title")}</h2>
            <button
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={onClose}
            >
              <XMarkIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6 pt-3">
          <div className={`flex rounded-md  w-full `}>
            <button
              className={`px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer rounded-2xl w-1/2 ${
                listingType === "For Sale"
                  ? "bg-[#362C75] text-white"
                  : "bg-gray-50 text-gray-700"
              }`}
              onClick={() => setListingType("For Sale")}
            >
              {listingTypeTranslations("forSale")}
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer rounded-2xl w-1/2 ${
                listingType === "For Rent"
                  ? "bg-[#362C75] text-white"
                  : "bg-gray-50 text-gray-700"
              }`}
              onClick={() => setListingType("For Rent")}
            >
              {listingTypeTranslations("forRent")}
            </button>
          </div>

          {/* Location Section */}
          <div className="mt-3">
            <div className="mt-3">
              <Popover className="relative w-full">
                {({ open }) => {
                  const [isOpen, setIsOpen] = useState(false);
                  const [searchQuery, setSearchQuery] = useState("");
                  const [showSearch, setShowSearch] = useState(true);
                  const buttonRef = useRef<HTMLButtonElement>(null);

                  useEffect(() => {
                    if (open !== isOpen) {
                      setIsOpen(open);
                    }
                  }, [open, isOpen]);

                  useEffect(() => {
                    if (!isOpen) {
                      setSearchQuery("");
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }
                    if (isOpen && !showSearch) {
                      setShowSearch(true);
                    }
                  }, [isOpen, showSearch]);

                  // Debounced search effect
                  useEffect(() => {
                    if (searchTimeoutRef.current) {
                      clearTimeout(searchTimeoutRef.current);
                    }

                    if (searchQuery.length >= 3) {
                      searchTimeoutRef.current = setTimeout(() => {
                        fetchLocationSuggestions(searchQuery);
                      }, 300);
                    } else {
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }

                    return () => {
                      if (searchTimeoutRef.current) {
                        clearTimeout(searchTimeoutRef.current);
                      }
                    };
                  }, [searchQuery]);

                  const handleLocationSelect = async (location: any) => {
                    // Fetch coordinates for the selected location if it has place_id
                    let locationWithCoordinates = location;
                    if (location.place_id) {
                      const coordinates = await fetchLocationCoordinates(
                        location.place_id
                      );
                      locationWithCoordinates = {
                        ...location,
                        coordinates,
                      };
                    }

                    setSelectedLocation(locationWithCoordinates);
                    setShowSearch(false);
                    setIsOpen(false);
                    setSuggestions([]);
                    setShowSuggestions(false);
                    buttonRef.current?.click();
                  };

                  // Combine suggestions with filtered locations for display
                  const displayLocations =
                    showSuggestions && suggestions.length > 0
                      ? suggestions
                      : [];

                  return (
                    <>
                      <PopoverButton
                        ref={buttonRef}
                        className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-[16px] px-4 py-3 h-[56px] text-sm text-gray-700"
                      >
                        <div className="flex items-center flex-1">
                          {isOpen && showSearch ? (
                            <>
                              <img
                                src="/marker-02_(2).png"
                                className="h-6 w-6 mr-1 flex-shrink-0"
                              />
                              <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={
                                  t("selectLocation") || "Search location"
                                }
                                className="outline-none w-full bg-transparent"
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                  e.stopPropagation();
                                  // Prevent space from closing the popover
                                  if (e.key === " ") {
                                    e.preventDefault();
                                    // Manually add space to the input value
                                    const input = e.target as HTMLInputElement;
                                    const start = input.selectionStart || 0;
                                    const end = input.selectionEnd || 0;
                                    const newValue =
                                      searchQuery.slice(0, start) +
                                      " " +
                                      searchQuery.slice(end);
                                    setSearchQuery(newValue);
                                    // Set cursor position after the space
                                    setTimeout(() => {
                                      input.setSelectionRange(
                                        start + 1,
                                        start + 1
                                      );
                                    }, 0);
                                  }
                                }}
                                onKeyUp={(e) => e.stopPropagation()}
                                autoFocus
                              />
                            </>
                          ) : (
                            <>
                              <img
                                src="/marker-02_(2).png"
                                className="h-6 w-6 mr-1 flex-shrink-0"
                              />
                              <span className="truncate">
                                {selectedLocation
                                  ? `${selectedLocation.name}`
                                  : t("selectLocation") || "Select Location"}
                              </span>
                            </>
                          )}
                        </div>
                        <ChevronDownSolidIcon
                          className="h-5 w-5 text-gray-400 ml-2"
                          aria-hidden="true"
                        />
                      </PopoverButton>

                      <PopoverPanel className="absolute z-20 mt-2 w-full py-1 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
                        <div className="w-full overflow-hidden rounded-xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
                          <div className="p-4">
                            {(isSearching || isFetchingCoordinates) && (
                              <div className="p-3 text-center text-gray-500">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mx-auto"></div>
                                <span className="ml-2">
                                  {isSearching
                                    ? "Searching..."
                                    : "Getting location..."}
                                </span>
                              </div>
                            )}

                            {!isSearching &&
                            !isFetchingCoordinates &&
                            displayLocations.length > 0 ? (
                              displayLocations.map(
                                (location: any, index: number) => (
                                  <div
                                    key={
                                      location.place_id ||
                                      `${location.name}-${index}`
                                    }
                                    className="group relative flex gap-x-6 rounded-[16px] p-3 hover:bg-gray-50 cursor-pointer"
                                    onClick={() =>
                                      handleLocationSelect(location)
                                    }
                                  >
                                    <div>
                                      <div className="font-normal text-[#595959]">
                                        {location.name}
                                      </div>
                                    </div>
                                  </div>
                                )
                              )
                            ) : !searchQuery &&
                              !isSearching &&
                              !isFetchingCoordinates ? (
                              <div className="p-3 text-center text-gray-500">
                                {t("selectLocation") || "Search location"}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </PopoverPanel>
                    </>
                  );
                }}
              </Popover>
            </div>
          </div>

          {/* Property Type and Category Section - Side by Side */}
          <div className="flex flex-row justify-between gap-2 mt-0">
            {/* Property Type Section */}
            <div className="w-1/2">
              <div className="mt-3">
                <GeneralSelect
                  selectedItem={selectedPropertyType}
                  onSelect={(propertyType) => {
                    setSelectedPropertyType &&
                      setSelectedPropertyType(propertyType);
                    // Reset category when property type changes
                    setSelectedCategory && setSelectedCategory(null);
                  }}
                  options={hotelTypes.map((hotelType) => ({
                    _id: hotelType._id,
                    name: (hotelType.name as any)[locale] || hotelType.name.tr,
                    href: "#",
                    originalData: hotelType, // Keep reference to original data for category filtering
                  }))}
                  defaultText={t("selectEstateType") || "Select Property Type"}
                  extraClassName="w-full bg-white border border-gray-200 h-[56px] text-sm text-gray-700 "
                  popoverExtraClassName=" md:max-w-[300px] max-w-[190px]"
                />
              </div>
            </div>

            {/* Category Section */}
            <div className="w-1/2">
              <div className="mt-3">
                <GeneralSelect
                  selectedItem={selectedCategory}
                  onSelect={(category) => {
                    // Only allow selection if property type is selected and has categories
                    if (selectedPropertyType?.originalData?.categories) {
                      setSelectedCategory && setSelectedCategory(category);
                    }
                  }}
                  options={
                    selectedPropertyType?.originalData?.categories
                      ? selectedPropertyType.originalData.categories.map(
                          (category: HotelCategory) => ({
                            _id: category._id,
                            name:
                              (category.name as any)[locale] ||
                              category.name.tr,
                            href: "#",
                            originalData: category,
                          })
                        )
                      : filterOptions.roomAsText.map((category: string) => ({
                          name: category,
                          href: "#",
                        }))
                  }
                  defaultText={t("selectCategory") || "Select Category"}
                  extraClassName="w-full bg-white border border-gray-200 h-[56px] text-sm text-gray-700"
                  popoverExtraClassName=" md:max-w-[300px] max-w-[190px]"
                />
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-700">
                {t("priceLabel")}
              </h3>
              <button
                className="text-sm text-[#8c8c8c] hover:underline cursor-pointer"
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                }}
              >
                {t("reset")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={minPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers
                    if (value === "" || /^\d+$/.test(value)) {
                      setMinPrice(value === "" ? "" : Number(value));
                    }
                  }}
                  onKeyDown={(e) => {
                    // Allow backspace, delete, tab, escape, enter, and arrow keys
                    if (
                      [8, 9, 27, 13, 37, 38, 39, 40, 46].indexOf(e.keyCode) !==
                        -1 ||
                      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                      (e.keyCode === 65 && e.ctrlKey === true) ||
                      (e.keyCode === 67 && e.ctrlKey === true) ||
                      (e.keyCode === 86 && e.ctrlKey === true) ||
                      (e.keyCode === 88 && e.ctrlKey === true)
                    ) {
                      return;
                    }
                    // Ensure that it is a number and stop the keypress
                    if (
                      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
                      (e.keyCode < 96 || e.keyCode > 105)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder={t("minValue")}
                  className="w-full bg-white border border-gray-200 rounded-[16px] px-4 py-2 h-[56px] text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {/* <div className="absolute right-2 flex flex-col">
                  <button
                    onClick={() => incrementValue(setMinPrice, minPrice)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronUpIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => decrementValue(setMinPrice, minPrice)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                </div> */}
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={maxPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers
                    if (value === "" || /^\d+$/.test(value)) {
                      setMaxPrice(value === "" ? "" : Number(value));
                    }
                  }}
                  onKeyDown={(e) => {
                    // Allow backspace, delete, tab, escape, enter, and arrow keys
                    if (
                      [8, 9, 27, 13, 37, 38, 39, 40, 46].indexOf(e.keyCode) !==
                        -1 ||
                      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                      (e.keyCode === 65 && e.ctrlKey === true) ||
                      (e.keyCode === 67 && e.ctrlKey === true) ||
                      (e.keyCode === 86 && e.ctrlKey === true) ||
                      (e.keyCode === 88 && e.ctrlKey === true)
                    ) {
                      return;
                    }
                    // Ensure that it is a number and stop the keypress
                    if (
                      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
                      (e.keyCode < 96 || e.keyCode > 105)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder={t("maxValue")}
                  className="w-full bg-white border border-gray-200  px-4 py-2 h-[56px] rounded-[16px] text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {/* <div className="absolute right-2 flex flex-col">
                  <button
                    onClick={() => incrementValue(setMaxPrice, maxPrice)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronUpIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => decrementValue(setMaxPrice, maxPrice)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                </div> */}
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between gap-2">
            {/* Room Count Section */}
            <div className="mt-6 w-1/2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-700">
                  {t("rooms")}
                </h3>
              </div>
              <div className="mt-3">
                <GeneralSelect
                  selectedItem={roomCount ? { name: roomCount } : null}
                  onSelect={(room) => {
                    setRoomCount(room.name);
                  }}
                  options={filterOptions.roomCount.map((room) => ({
                    name: room,
                    href: "#",
                  }))}
                  defaultText={t("roomsSelect") || "Select Room Count"}
                  extraClassName="w-full bg-white border border-gray-200 h-[56px] text-sm text-gray-700"
                  popoverExtraClassName=" md:max-w-[300px] max-w-[190px]"
                />
              </div>
            </div>

            {/* Bathroom Count Section */}
            <div className="mt-6 w-1/2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-700">
                  {t("bathrooms") || "Bathrooms"}
                </h3>
              </div>
              <div className="mt-3">
                <GeneralSelect
                  selectedItem={bathroomCount ? { name: bathroomCount } : null}
                  onSelect={(bathroom) => {
                    setBathroomCount(bathroom.name);
                  }}
                  options={filterOptions.bathroomCount.map(
                    (bathroom: number) => ({
                      name: bathroom.toString(),
                      href: "#",
                    })
                  )}
                  defaultText={t("bathroomsSelect") || "Select Bathroom Count"}
                  extraClassName="w-full bg-white border border-gray-200 h-[56px] text-sm text-gray-700"
                  popoverExtraClassName=" md:max-w-[300px] max-w-[190px]"
                />
              </div>
            </div>
          </div>

          {/* Area Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-700">
                {t("area")}
              </h3>
              <button
                className="text-sm text-[#8c8c8c] hover:underline cursor-pointer"
                onClick={() => {
                  setMinArea("");
                  setMaxArea("");
                }}
              >
                {t("reset")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={minArea}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers
                    if (value === "" || /^\d+$/.test(value)) {
                      setMinArea(value === "" ? "" : Number(value));
                    }
                  }}
                  onKeyDown={(e) => {
                    // Allow backspace, delete, tab, escape, enter, and arrow keys
                    if (
                      [8, 9, 27, 13, 37, 38, 39, 40, 46].indexOf(e.keyCode) !==
                        -1 ||
                      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                      (e.keyCode === 65 && e.ctrlKey === true) ||
                      (e.keyCode === 67 && e.ctrlKey === true) ||
                      (e.keyCode === 86 && e.ctrlKey === true) ||
                      (e.keyCode === 88 && e.ctrlKey === true)
                    ) {
                      return;
                    }
                    // Ensure that it is a number and stop the keypress
                    if (
                      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
                      (e.keyCode < 96 || e.keyCode > 105)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder={t("minValue")}
                  className="w-full bg-white border border-gray-200 rounded-[16px] px-4 py-2 h-[56px] text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {/* <div className="absolute right-2 flex flex-col">
                  <button
                    onClick={() => incrementValue(setMinArea, minArea)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronUpIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => decrementValue(setMinArea, minArea)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                </div> */}
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={maxArea}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers
                    if (value === "" || /^\d+$/.test(value)) {
                      setMaxArea(value === "" ? "" : Number(value));
                    }
                  }}
                  onKeyDown={(e) => {
                    // Allow backspace, delete, tab, escape, enter, and arrow keys
                    if (
                      [8, 9, 27, 13, 37, 38, 39, 40, 46].indexOf(e.keyCode) !==
                        -1 ||
                      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                      (e.keyCode === 65 && e.ctrlKey === true) ||
                      (e.keyCode === 67 && e.ctrlKey === true) ||
                      (e.keyCode === 86 && e.ctrlKey === true) ||
                      (e.keyCode === 88 && e.ctrlKey === true)
                    ) {
                      return;
                    }
                    // Ensure that it is a number and stop the keypress
                    if (
                      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
                      (e.keyCode < 96 || e.keyCode > 105)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder={t("maxValue")}
                  className="w-full bg-white border border-gray-200 rounded-[16px] px-4 py-2 h-[56px] text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {/* <div className="absolute right-2 flex flex-col">
                  <button
                    onClick={() => incrementValue(setMaxArea, maxArea)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronUpIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => decrementValue(setMaxArea, maxArea)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                </div> */}
              </div>
            </div>
          </div>

          {/* Face Features Section */}
          {filterOptions.faceFeatures &&
            filterOptions.faceFeatures.length > 0 && (
              <div className="mt-6 border-b border-t border-[#F0F0F0] pb-8 pt-10">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setFaceFeaturesCollapsed(!faceFeaturesCollapsed)
                  }
                >
                  <h3 className="text-base font-semibold text-gray-700">
                    {t("faceFeatures") || "Cephe"}{" "}
                    {selectedFaceFeatures.length > 0 ? (
                      <span className="text-sm font-normal text-[#595959]">
                        ({selectedFaceFeatures.length})
                      </span>
                    ) : null}
                  </h3>
                  <button className="text-sm text-[#8c8c8c] hover:underline cursor-pointer">
                    <img
                      src="/chevron-down.png"
                      className={`w-[24px] h-[24px] transform transition-transform duration-300 ${
                        !faceFeaturesCollapsed ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {!faceFeaturesCollapsed && (
                  <div className="mt-3 ">
                    <div className="flex flex-wrap gap-2">
                      {(filterOptions.faceFeatures || []).map((feature) => {
                        const isSelected = selectedFaceFeatures.find(
                          (f: any) => f._id === feature._id
                        );

                        return (
                          <button
                            key={feature._id}
                            onClick={() => toggleFaceFeature(feature)}
                            className={`inline-flex items-center ${
                              isSelected
                                ? "bg-[#EBEAF180] border-[0.5px] border-[#362C75] text-[#362C75]"
                                : "bg-white border-gray-100 text-gray-600"
                            } border rounded-[16px] h-[40px] px-3 py-1 text-sm font-medium  cursor-pointer transition-all duration-300 hover:bg-[#F5F5F5]`}
                          >
                            {feature.iconUrl && (
                              <img
                                src={feature.iconUrl}
                                className="w-[24px] h-[24px] mr-2"
                              />
                            )}
                            {feature.name.tr}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* Interior Features Section */}
          <div className="mt-6 border-b border-[#F0F0F0] pb-8">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() =>
                setInteriorFeaturesCollapsed(!interiorFeaturesCollapsed)
              }
            >
              <h3 className="text-base font-semibold text-gray-700">
                {t("interiorFeatures")}{" "}
                {interiorFeatures.length > 0 ? (
                  <span className="text-sm font-normal text-[#595959]">
                    ({interiorFeatures.length})
                  </span>
                ) : null}
              </h3>
              <button className="text-sm text-[#8c8c8c] hover:underline cursor-pointer">
                <img
                  src="/chevron-down.png"
                  className={`w-[24px] h-[24px] transform transition-transform duration-300 ${
                    !interiorFeaturesCollapsed ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            {!interiorFeaturesCollapsed && (
              <div className="mt-3 ">
                <div className="flex flex-wrap gap-2 ">
                  {filterOptions.interiorFeatures.map((feature) => {
                    const isSelected = interiorFeatures.find(
                      (f: any) => f._id === feature._id
                    );

                    return (
                      <button
                        key={feature._id}
                        onClick={() => toggleFeature(feature)}
                        className={`inline-flex items-center ${
                          isSelected
                            ? "bg-[#EBEAF180] border-[0.5px] border-[#362C75] text-[#362C75]"
                            : "bg-white border-gray-100 text-gray-600"
                        } border rounded-[16px] h-[40px] px-3 py-1 text-sm font-medium  cursor-pointer transition-all duration-300 hover:bg-[#F5F5F5]`}
                      >
                        <img
                          src={feature.iconUrl}
                          className="w-[24px] h-[24px] mr-2"
                        />
                        {feature.name.tr}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Exterior Features Section */}
          <div className="mt-6 border-b border-[#F0F0F0] pb-8">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() =>
                setExteriorFeaturesCollapsed(!exteriorFeaturesCollapsed)
              }
            >
              <h3 className="text-base font-semibold text-gray-700">
                {t("exteriorFeatures") || "Dış Özellikler"}{" "}
                {selectedExteriorFeatures.length > 0 ? (
                  <span className="text-sm font-normal text-[#595959]">
                    ({selectedExteriorFeatures.length})
                  </span>
                ) : null}
              </h3>
              <button className="text-sm text-[#8c8c8c] hover:underline cursor-pointer">
                <img
                  src="/chevron-down.png"
                  className={`w-[24px] h-[24px] transform transition-transform duration-300 ${
                    !exteriorFeaturesCollapsed ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            {!exteriorFeaturesCollapsed && (
              <div className="mt-3 ">
                <div className="flex flex-wrap gap-2">
                  {filterOptions.outsideFeatures.map((feature) => {
                    const isSelected = selectedExteriorFeatures.find(
                      (f: any) => f._id === feature._id
                    );

                    return (
                      <button
                        key={feature._id}
                        onClick={() => toggleExteriorFeature(feature)}
                        className={`inline-flex items-center ${
                          isSelected
                            ? "bg-[#EBEAF180] border-[0.5px] border-[#362C75] text-[#362C75]"
                            : "bg-white border-gray-100 text-gray-600"
                        } border rounded-[16px] h-[40px] px-3 py-1 text-sm font-medium  cursor-pointer transition-all duration-300 hover:bg-[#F5F5F5]`}
                      >
                        <img
                          src={feature.iconUrl}
                          className="w-[24px] h-[24px] mr-2"
                        />
                        {feature.name.tr}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Accessibility Features Section */}
          {filterOptions.accessibilityFeatures &&
            filterOptions.accessibilityFeatures.length > 0 && (
              <div className="mt-6 border-b border-[#F0F0F0] pb-8">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setAccessibilityFeaturesCollapsed(
                      !accessibilityFeaturesCollapsed
                    )
                  }
                >
                  <h3 className="text-base font-semibold text-gray-700">
                    {t("accessibilityFeatures") ||
                      "Engelliye ve Yaşlıya Yönelik Özellikler"}{" "}
                    {selectedAccessibilityFeatures.length > 0 ? (
                      <span className="text-sm font-normal text-[#595959]">
                        ({selectedAccessibilityFeatures.length})
                      </span>
                    ) : null}
                  </h3>
                  <button className="text-sm text-[#8c8c8c] hover:underline cursor-pointer">
                    <img
                      src="/chevron-down.png"
                      className={`w-[24px] h-[24px] transform transition-transform duration-300 ${
                        !accessibilityFeaturesCollapsed ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {!accessibilityFeaturesCollapsed && (
                  <div className="mt-3 ">
                    <div className="flex flex-wrap gap-2">
                      {(filterOptions.accessibilityFeatures || []).map(
                        (feature) => {
                          const isSelected = selectedAccessibilityFeatures.find(
                            (f: any) => f._id === feature._id
                          );

                          return (
                            <button
                              key={feature._id}
                              onClick={() =>
                                toggleAccessibilityFeature(feature)
                              }
                              className={`inline-flex items-center ${
                                isSelected
                                  ? "bg-[#EBEAF180] border-[0.5px] border-[#362C75] text-[#362C75]"
                                  : "bg-white border-gray-100 text-gray-600"
                              } border rounded-[16px] h-[40px] px-3 py-1 text-sm font-medium  cursor-pointer transition-all duration-300 hover:bg-[#F5F5F5]`}
                            >
                              {feature.iconUrl && (
                                <img
                                  src={feature.iconUrl}
                                  className="w-[24px] h-[24px] mr-2"
                                />
                              )}
                              {feature.name.tr}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* Location Features Section */}

          {/* Add some bottom padding to prevent content from hiding behind the fixed footer */}
          <div className="pb-20"></div>
        </div>

        {/* Footer Buttons - Fixed at bottom */}
        <div className="sticky bottom-0 left-0 right-0 bg-white z-10 p-6 border-t border-gray-100 rounded-b-2xl">
          <div className="grid grid-cols-2 gap-4">
            {(minPrice !== "" ||
              maxPrice !== "" ||
              minArea !== "" ||
              maxArea !== "" ||
              roomCount !== "" ||
              bathroomCount !== "" ||
              interiorFeatures.length > 0 ||
              selectedExteriorFeatures.length > 0 ||
              selectedAccessibilityFeatures.length > 0 ||
              selectedFaceFeatures.length > 0 ||
              selectedLocation ||
              selectedPropertyType ||
              selectedCategory ||
              selectedFeatures.length > 0 ||
              (filters &&
                (filters.isOnePlusOneSelected ||
                  filters.isTwoPlusOneSelected ||
                  filters.isThreePlusOneSelected ||
                  filters.isNewSelected))) && (
              <button
                className="w-full h-[56px] text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-[16px] hover:bg-gray-50"
                onClick={() => {
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

                  onClose && onClose();
                }}
              >
                {t("clearAll")}
              </button>
            )}
            <button
              onClick={() => {
                setFilters({
                  listingType: listingType ? listingType : null,
                  propertyType: selectedPropertyType?.name || null,
                  roomAsText: selectedCategory?.name || null,
                  roomCount: roomCount,
                  bathroomCount: bathroomCount,
                  minProjectArea: minArea,
                  maxProjectArea: maxArea,
                  interiorFeatureIds: interiorFeatures.map((f: any) => f._id),
                  exteriorFeatureIds: selectedExteriorFeatures.map(
                    (f: any) => f._id
                  ),
                  accessibilityFeatureIds: selectedAccessibilityFeatures.map(
                    (f: any) => f._id
                  ),
                  faceFeatureIds: selectedFaceFeatures.map((f: any) => f._id),
                });
                onClose && onClose();
              }}
              disabled={hasActiveFilters() && resultsCount === 0}
              className={`w-full h-[56px] text-sm font-medium text-white rounded-[16px] cursor-pointer ${
                hasActiveFilters() && resultsCount === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#5E5691] hover:bg-[#4a4574]"
              } ${
                minPrice !== "" ||
                maxPrice !== "" ||
                minArea !== "" ||
                maxArea !== "" ||
                roomCount !== "" ||
                bathroomCount !== "" ||
                interiorFeatures.length > 0 ||
                selectedExteriorFeatures.length > 0 ||
                selectedAccessibilityFeatures.length > 0 ||
                selectedFaceFeatures.length > 0 ||
                selectedLocation ||
                selectedPropertyType ||
                selectedCategory ||
                selectedFeatures.length > 0 ||
                (filters &&
                  (filters.isOnePlusOneSelected ||
                    filters.isTwoPlusOneSelected ||
                    filters.isThreePlusOneSelected ||
                    filters.isNewSelected))
                  ? "col-span-1"
                  : "col-span-2"
              }`}
            >
              {hasActiveFilters() && resultsCount === 0
                ? locale === "tr"
                  ? "Uygun İlan Yok"
                  : "No Matching Listings"
                : hasActiveFilters()
                ? `${t("apply")} (${resultsCount} ${
                    resultsCount === 1
                      ? locale === "tr"
                        ? "ilan"
                        : "listing"
                      : locale === "tr"
                      ? "ilan"
                      : "listings"
                  })`
                : t("apply")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
