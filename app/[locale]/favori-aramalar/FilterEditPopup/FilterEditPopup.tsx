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
import { currencyOptions } from "../../../components/LanguageSwitcher";
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
import axiosInstance from "@/axios";
import { Hotel } from "@/types/hotel.type";
import { filterHotelsByProximity } from "@/app/utils/geoUtils";
import GeneralSelect from "../../../components/GeneralSelect/GeneralSelect";
import { SavedFilter, savedFiltersApi } from "../../api/savedFilters";

type FilterEditPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  filter: SavedFilter;
  onUpdate: () => void;
  filterOptions: FilterOptions;
  hotels: Hotel[];
  selectedCurrency: string;
  searchRadius: number;
  allQuickFilters: Feature[];
};

export default function FilterEditPopup({
  isOpen,
  onClose,
  filter,
  onUpdate,
  filterOptions,
  hotels,
  selectedCurrency,
  searchRadius,
  allQuickFilters,
}: FilterEditPopupProps) {
  const t = useTranslations("filter");
  const listingTypeTranslations = useTranslations("listingType");
  const locale = useLocale();

  // Initialize state with filter values
  const [listingType, setListingType] = useState<"For Sale" | "For Rent">(
    (filter.listingType as "For Sale" | "For Rent") || "For Sale"
  );
  const [selectedLocation, setSelectedLocation] = useState<any>(
    filter.selectedLocation || null
  );
  const [selectedPropertyType, setSelectedPropertyType] = useState<any>(
    filter.propertyType
      ? { _id: filter.propertyTypeId, name: filter.propertyType }
      : null
  );
  const [selectedCategory, setSelectedCategory] = useState<any>(
    filter.categoryId
      ? { _id: filter.categoryId, name: filter.roomAsText }
      : null
  );
  const [minPrice, setMinPrice] = useState<number | "">(filter.minPrice || "");
  const [maxPrice, setMaxPrice] = useState<number | "">(filter.maxPrice || "");
  const [minArea, setMinArea] = useState<number | "">(
    filter.minProjectArea || ""
  );
  const [maxArea, setMaxArea] = useState<number | "">(
    filter.maxProjectArea || ""
  );
  const [roomCount, setRoomCount] = useState<string>(
    filter.roomCount?.toString() || ""
  );
  const [bathroomCount, setBathroomCount] = useState<string>(
    filter.bathroomCount?.toString() || ""
  );
  const [interiorFeatures, setInteriorFeatures] = useState<any[]>([]);
  const [selectedExteriorFeatures, setSelectedExteriorFeatures] = useState<
    any[]
  >([]);
  const [selectedAccessibilityFeatures, setSelectedAccessibilityFeatures] =
    useState<any[]>([]);
  const [selectedFaceFeatures, setSelectedFaceFeatures] = useState<any[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<any[]>(
    filter.selectedFeatures || []
  );

  // Additional state
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingCoordinates, setIsFetchingCoordinates] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hotelTypes, setHotelTypes] = useState<HotelType[]>([]);
  const [isLoadingHotelTypes, setIsLoadingHotelTypes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Collapsed states
  const [interiorFeaturesCollapsed, setInteriorFeaturesCollapsed] =
    useState(true);
  const [exteriorFeaturesCollapsed, setExteriorFeaturesCollapsed] =
    useState(true);
  const [accessibilityFeaturesCollapsed, setAccessibilityFeaturesCollapsed] =
    useState(true);
  const [faceFeaturesCollapsed, setFaceFeaturesCollapsed] = useState(true);
  const [quickFiltersCollapsed, setQuickFiltersCollapsed] = useState(true);

  // Initialize features from filter
  useEffect(() => {
    if (filter.interiorFeatureIds) {
      const features = filter.interiorFeatureIds
        .map((id) => filterOptions.interiorFeatures.find((f) => f._id === id))
        .filter(Boolean);
      setInteriorFeatures(features);
    }

    if (filter.exteriorFeatureIds) {
      const features = filter.exteriorFeatureIds
        .map((id) => filterOptions.outsideFeatures.find((f) => f._id === id))
        .filter(Boolean);
      setSelectedExteriorFeatures(features);
    }

    if (filter.accessibilityFeatureIds) {
      const features = filter.accessibilityFeatureIds
        .map((id) =>
          filterOptions.accessibilityFeatures.find((f) => f._id === id)
        )
        .filter(Boolean);
      setSelectedAccessibilityFeatures(features);
    }

    if (filter.faceFeatureIds) {
      const features = filter.faceFeatureIds
        .map((id) => filterOptions.faceFeatures.find((f) => f._id === id))
        .filter(Boolean);
      setSelectedFaceFeatures(features);
    }
  }, [filter, filterOptions]);

  // Fetch hotel types
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
        setHotelTypes(filterOptions.hotelTypes || []);
      } finally {
        setIsLoadingHotelTypes(false);
      }
    };

    if (isOpen) {
      fetchHotelTypes();
    }
  }, [isOpen, filterOptions]);

  // Location search functions
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

  const fetchLocationCoordinates = async (
    placeId: string
  ): Promise<[number, number] | null> => {
    try {
      setIsFetchingCoordinates(true);
      const response = await fetch(
        `/api/places/details?place_id=${encodeURIComponent(
          placeId
        )}&language=${locale}`
      );

      const data = await response.json();

      if (data.status === "OK" && data.result?.geometry?.location) {
        const { lat, lng } = data.result.geometry.location;
        return [lng, lat];
      }

      return null;
    } catch (error) {
      console.error("Error fetching location coordinates:", error);
      return null;
    } finally {
      setIsFetchingCoordinates(false);
    }
  };

  // Feature toggle functions
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

  const toggleQuickFilter = (feature: Feature) => {
    setSelectedFeatures((prev: any[]) =>
      prev.some((f: any) => f._id === feature._id)
        ? prev.filter((f: any) => f._id !== feature._id)
        : [...prev, feature]
    );
  };

  // Handle update
  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        listingType: listingType || null,
        propertyType: selectedPropertyType?.name || null,
        propertyTypeId: selectedPropertyType?._id || null,
        roomAsText: selectedCategory?.name || null,
        categoryId: selectedCategory?._id || null,
        minPrice: minPrice !== "" ? Number(minPrice) : null,
        maxPrice: maxPrice !== "" ? Number(maxPrice) : null,
        roomCount: roomCount !== "" ? Number(roomCount) : null,
        bathroomCount: bathroomCount !== "" ? Number(bathroomCount) : null,
        minProjectArea: minArea !== "" ? Number(minArea) : null,
        maxProjectArea: maxArea !== "" ? Number(maxArea) : null,
        interiorFeatureIds:
          interiorFeatures.length > 0
            ? interiorFeatures.map((f) => f._id)
            : null,
        exteriorFeatureIds:
          selectedExteriorFeatures.length > 0
            ? selectedExteriorFeatures.map((f) => f._id)
            : null,
        accessibilityFeatureIds:
          selectedAccessibilityFeatures.length > 0
            ? selectedAccessibilityFeatures.map((f) => f._id)
            : null,
        faceFeatureIds:
          selectedFaceFeatures.length > 0
            ? selectedFaceFeatures.map((f) => f._id)
            : null,
        selectedFeatures:
          selectedFeatures.length > 0
            ? selectedFeatures.map((feature) => ({
                _id: feature._id,
                name:
                  typeof feature.name === "string"
                    ? feature.name
                    : feature.name.tr || feature.name.en || "",
                iconUrl: feature.iconUrl || "",
                featureType: feature.featureType,
                createdAt: feature.createdAt || new Date().toISOString(),
                updatedAt: feature.updatedAt || new Date().toISOString(),
                __v: feature.__v || 0,
              }))
            : null,
        selectedLocation,
      };

      await savedFiltersApi.updateSavedFilter(filter._id!, updateData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating filter:", error);
    } finally {
      setIsLoading(false);
    }
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
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-700">
              Filtreyi Düzenle
            </h2>
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
          {/* Listing Type */}
          <div className={`flex rounded-md w-full`}>
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
                                  if (e.key === " ") {
                                    e.preventDefault();
                                    const input = e.target as HTMLInputElement;
                                    const start = input.selectionStart || 0;
                                    const end = input.selectionEnd || 0;
                                    const newValue =
                                      searchQuery.slice(0, start) +
                                      " " +
                                      searchQuery.slice(end);
                                    setSearchQuery(newValue);
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

          {/* Property Type and Category */}
          <div className="flex flex-row justify-between gap-2 mt-0">
            <div className="w-1/2">
              <div className="mt-3">
                <GeneralSelect
                  selectedItem={selectedPropertyType}
                  onSelect={(propertyType) => {
                    setSelectedPropertyType(propertyType);
                    setSelectedCategory(null);
                  }}
                  options={hotelTypes.map((hotelType) => ({
                    _id: hotelType._id,
                    name: (hotelType.name as any)[locale] || hotelType.name.tr,
                    href: "#",
                    originalData: hotelType,
                  }))}
                  defaultText={t("selectEstateType") || "Select Property Type"}
                  extraClassName="w-full bg-white border border-gray-200 h-[56px] text-sm text-gray-700 "
                  popoverExtraClassName=" md:max-w-[300px] max-w-[190px]"
                />
              </div>
            </div>

            <div className="w-1/2">
              <div className="mt-3">
                <GeneralSelect
                  selectedItem={selectedCategory}
                  onSelect={(category) => {
                    if (selectedPropertyType?.originalData?.categories) {
                      setSelectedCategory(category);
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
                    if (value === "" || /^\d+$/.test(value)) {
                      setMinPrice(value === "" ? "" : Number(value));
                    }
                  }}
                  placeholder={t("minValue")}
                  className="w-full bg-white border border-gray-200 rounded-[16px] px-4 py-2 h-[56px] text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={maxPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d+$/.test(value)) {
                      setMaxPrice(value === "" ? "" : Number(value));
                    }
                  }}
                  placeholder={t("maxValue")}
                  className="w-full bg-white border border-gray-200 px-4 py-2 h-[56px] rounded-[16px] text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Room and Bathroom Count */}
          <div className="flex flex-row justify-between gap-2">
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
                    name: room.toString(),
                    href: "#",
                  }))}
                  defaultText={t("roomsSelect") || "Select Room Count"}
                  extraClassName="w-full bg-white border border-gray-200 h-[56px] text-sm text-gray-700"
                  popoverExtraClassName=" md:max-w-[300px] max-w-[190px]"
                />
              </div>
            </div>

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
                    if (value === "" || /^\d+$/.test(value)) {
                      setMinArea(value === "" ? "" : Number(value));
                    }
                  }}
                  placeholder={t("minValue")}
                  className="w-full bg-white border border-gray-200 rounded-[16px] px-4 py-2 h-[56px] text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={maxArea}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d+$/.test(value)) {
                      setMaxArea(value === "" ? "" : Number(value));
                    }
                  }}
                  placeholder={t("maxValue")}
                  className="w-full bg-white border border-gray-200 rounded-[16px] px-4 py-2 h-[56px] text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
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
                  <div className="mt-3">
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
                            } border rounded-[16px] h-[40px] px-3 py-1 text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-[#F5F5F5]`}
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

          {/* Quick Filters Section */}
          {allQuickFilters && allQuickFilters.length > 0 && (
            <div className="mt-6 border-b border-[#F0F0F0] pb-8">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setQuickFiltersCollapsed(!quickFiltersCollapsed)}
              >
                <h3 className="text-base font-semibold text-gray-700">
                  {useTranslations("savedSearchesPage")("quickFilters")}{" "}
                  {selectedFeatures.length > 0 ? (
                    <span className="text-sm font-normal text-[#595959]">
                      ({selectedFeatures.length})
                    </span>
                  ) : null}
                </h3>
                <button className="text-sm text-[#8c8c8c] hover:underline cursor-pointer">
                  <img
                    src="/chevron-down.png"
                    className={`w-[24px] h-[24px] transform transition-transform duration-300 ${
                      !quickFiltersCollapsed ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
              {!quickFiltersCollapsed && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {allQuickFilters.map((feature) => {
                      const isSelected = selectedFeatures.find(
                        (f: any) => f._id === feature._id
                      );

                      return (
                        <button
                          key={feature._id}
                          onClick={() => toggleQuickFilter(feature)}
                          className={`inline-flex items-center ${
                            isSelected
                              ? "bg-[#EBEAF180] border-[0.5px] border-[#362C75] text-[#362C75]"
                              : "bg-white border-gray-100 text-gray-600"
                          } border rounded-[16px] h-[40px] px-3 py-1 text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-[#F5F5F5]`}
                        >
                          <img
                            src={feature.iconUrl}
                            className="w-[24px] h-[24px] mr-2"
                          />
                          <span>
                            {typeof feature.name === "object"
                              ? feature.name[
                                  locale as keyof typeof feature.name
                                ] || feature.name.en
                              : String(feature.name)}
                          </span>
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
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
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
                        } border rounded-[16px] h-[40px] px-3 py-1 text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-[#F5F5F5]`}
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
              <div className="mt-3">
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
                        } border rounded-[16px] h-[40px] px-3 py-1 text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-[#F5F5F5]`}
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
                  <div className="mt-3">
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
                              } border rounded-[16px] h-[40px] px-3 py-1 text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-[#F5F5F5]`}
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

          <div className="pb-20"></div>
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 left-0 right-0 bg-white z-10 p-6 border-t border-gray-100 rounded-b-2xl">
          <div className="grid grid-cols-2 gap-4">
            <button
              className="w-full h-[56px] text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-[16px] hover:bg-gray-50"
              onClick={onClose}
            >
              İptal
            </button>
            <button
              onClick={handleUpdate}
              disabled={isLoading}
              className={`w-full h-[56px] text-sm font-medium text-white rounded-[16px] cursor-pointer ${
                isLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#5E5691] hover:bg-[#4a4574]"
              }`}
            >
              {isLoading ? "Güncelleniyor..." : "Güncelle"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
