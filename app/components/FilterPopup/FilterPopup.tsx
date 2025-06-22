"use client";

import { AiFillSafetyCertificate, AiOutlineFire } from "react-icons/ai";
import { BiHealth, BiStore, BiTrain } from "react-icons/bi";
import { BsFillHouseFill, BsTv } from "react-icons/bs";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MapPinIcon,
  MinusIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon as ChevronDownSolidIcon,
  MagnifyingGlassIcon,
  XMarkIcon as XMarkSolidIcon,
} from "@heroicons/react/20/solid";
import {
  FaParking,
  FaSwimmingPool,
  FaTemperatureHigh,
  FaWarehouse,
} from "react-icons/fa";
import {
  Feature,
  FilterOptions,
  HotelCategory,
  HotelType,
} from "@/types/filter-options.type";
import {
  GiClothes,
  GiGardeningShears,
  GiGate,
  GiWashingMachine,
} from "react-icons/gi";
import { IoRestaurantOutline, IoSchool } from "react-icons/io5";
import {
  MdBalcony,
  MdElevator,
  MdFireplace,
  MdKitchen,
  MdSecurity,
  MdWindow,
} from "react-icons/md";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import React, { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import GeneralSelect from "../GeneralSelect/GeneralSelect";
import { HomeIcon } from "@heroicons/react/24/outline";
import { Hotel } from "@/types/hotel.type";
import { ImSpoonKnife } from "react-icons/im";
import { RiWifiFill } from "react-icons/ri";
import { TagIcon } from "@heroicons/react/24/outline";
import { TbAirConditioning } from "react-icons/tb";
import axiosInstance from "@/axios";
import { currencyOptions } from "../LanguageSwitcher";
import { filterHotelsByProximity } from "@/app/utils/geoUtils";
import { setIsFilterApplied } from "@/app/store/favoritesSlice";
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch();
  const t = useTranslations("filter");
  const listingTypeTranslations = useTranslations("listingType");

  const locale = useLocale();

  // Temporary states for popup (only applied when "Apply" is clicked)
  const [tempListingType, setTempListingType] = useState<
    "For Sale" | "For Rent"
  >(listingType);
  const [tempSelectedLocation, setTempSelectedLocation] =
    useState<any>(selectedLocation);
  const [tempSelectedPropertyType, setTempSelectedPropertyType] =
    useState<any>(selectedPropertyType);
  const [tempSelectedCategory, setTempSelectedCategory] =
    useState<any>(selectedCategory);
  const [tempFilters, setTempFilters] = useState<any>(filters);
  const [tempMinPrice, setTempMinPrice] = useState<number | "">(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState<number | "">(maxPrice);
  const [tempMinArea, setTempMinArea] = useState<number | "">(minArea);
  const [tempMaxArea, setTempMaxArea] = useState<number | "">(maxArea);
  const [tempRoomCount, setTempRoomCount] = useState<string>(roomCount);
  const [tempBathroomCount, setTempBathroomCount] =
    useState<string>(bathroomCount);
  const [tempSelectedExteriorFeatures, setTempSelectedExteriorFeatures] =
    useState<any[]>(selectedExteriorFeatures);
  const [tempInteriorFeatures, setTempInteriorFeatures] =
    useState<any[]>(interiorFeatures);
  const [
    tempSelectedAccessibilityFeatures,
    setTempSelectedAccessibilityFeatures,
  ] = useState<any[]>(selectedAccessibilityFeatures);
  const [tempSelectedFaceFeatures, setTempSelectedFaceFeatures] =
    useState<any[]>(selectedFaceFeatures);

  // Location search state variables - similar to LocationSelect.tsx
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingCoordinates, setIsFetchingCoordinates] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hotel types state
  const [hotelTypes, setHotelTypes] = useState<HotelType[]>([]);
  const [isLoadingHotelTypes, setIsLoadingHotelTypes] = useState(false);

  /* -------------------- Mobile drag-to-close logic -------------------- */
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);

  const tForRoomCounts = useTranslations("adminCreation.step2_house");

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

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Only enable on mobile (screen width < 768px)
    if (window.innerWidth >= 768) return;
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY === null || window.innerWidth >= 768) return;
    const deltaY = e.touches[0].clientY - touchStartY;
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (window.innerWidth >= 768) return;
    if (translateY > 120) {
      onClose();
    }
    setTranslateY(0);
    setTouchStartY(null);
  };

  // Initialize temporary states when popup opens
  useEffect(() => {
    if (isOpen) {
      setTempListingType(listingType);
      setTempSelectedLocation(selectedLocation);
      setTempSelectedPropertyType(selectedPropertyType);
      setTempSelectedCategory(selectedCategory);
      setTempFilters(filters);
      setTempMinPrice(minPrice);
      setTempMaxPrice(maxPrice);
      setTempMinArea(minArea);
      setTempMaxArea(maxArea);
      setTempBathroomCount(bathroomCount);

      if (filters?.exteriorFeatureIds) {
        const exteriorFeaturesWithFilter = filterOptions.outsideFeatures.filter(
          (feature) => filters.exteriorFeatureIds.includes(feature._id)
        );
        setTempSelectedExteriorFeatures(exteriorFeaturesWithFilter);
      } else {
        setTempSelectedExteriorFeatures(selectedExteriorFeatures);
      }

      if (filters?.interiorFeatureIds) {
        const interiorFeaturesWithFilter =
          filterOptions.interiorFeatures.filter((feature) =>
            filters.interiorFeatureIds.includes(feature._id)
          );
        setTempInteriorFeatures(interiorFeaturesWithFilter);
      } else {
        setTempInteriorFeatures(interiorFeatures);
      }

      if (filters?.accessibilityFeatureIds) {
        const accessibilityFeaturesWithFilter =
          filterOptions.accessibilityFeatures.filter((feature) =>
            filters.accessibilityFeatureIds.includes(feature._id)
          );
        setTempSelectedAccessibilityFeatures(accessibilityFeaturesWithFilter);
      } else {
        setTempSelectedAccessibilityFeatures(selectedAccessibilityFeatures);
      }

      if (filters?.faceFeatureIds) {
        const faceFeaturesWithFilter = filterOptions.faceFeatures.filter(
          (feature) => filters.faceFeatureIds.includes(feature._id)
        );
        setTempSelectedFaceFeatures(faceFeaturesWithFilter);
      } else {
        setTempSelectedFaceFeatures(selectedFaceFeatures);
      }

      setTempRoomCount(roomCount);
    }
  }, [
    isOpen,
    listingType,
    selectedLocation,
    selectedPropertyType,
    selectedCategory,
    filters,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    roomCount,
    bathroomCount,
    selectedExteriorFeatures,
    interiorFeatures,
    selectedAccessibilityFeatures,
    selectedFaceFeatures,
  ]);

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
        const newSuggestions = data.predictions.map((prediction: any) => {
          const parts = prediction.description.split(",");
          const name = parts[0].trim(); // Get main part of description
          const description = parts.slice(1).join(",").trim(); // Get secondary part (province, country etc.)

          return {
            name,
            description,
            href: "#",
            place_id: prediction.place_id,
          };
        });
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
        `/api/places/details?place_id=${encodeURIComponent(
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
    const isCurrentlySelected = tempInteriorFeatures.some(
      (f: any) => f._id === feature._id
    );

    setTempInteriorFeatures((prev: any[]) =>
      isCurrentlySelected
        ? prev.filter((f: any) => f._id !== feature._id)
        : [...prev, feature]
    );
  };

  const toggleExteriorFeature = (feature: any) => {
    const isCurrentlySelected = tempSelectedExteriorFeatures.some(
      (f: any) => f._id === feature._id
    );

    setTempSelectedExteriorFeatures((prev: any[]) =>
      isCurrentlySelected
        ? prev.filter((f: any) => f._id !== feature._id)
        : [...prev, feature]
    );
  };

  const toggleAccessibilityFeature = (feature: Feature) => {
    setTempSelectedAccessibilityFeatures((prev: any[]) =>
      prev.some((f: any) => f._id === feature._id)
        ? prev.filter((f: any) => f._id !== feature._id)
        : [...prev, feature]
    );
  };

  const toggleFaceFeature = (feature: Feature) => {
    setTempSelectedFaceFeatures((prev: any[]) =>
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

  // Calculate filtered results count - Updated to match HomePage.tsx logic
  const getFilteredResultsCount = () => {
    let filteredHotels = hotels;

    // Filter by listing type
    if (tempListingType) {
      filteredHotels = filteredHotels.filter((hotel) =>
        Object.values(hotel.listingType).some(
          (value) => value === tempListingType
        )
      );
    }

    // Filter by location proximity
    if (tempSelectedLocation && tempSelectedLocation.coordinates) {
      const [targetLon, targetLat] = tempSelectedLocation.coordinates;
      filteredHotels = filterHotelsByProximity(
        filteredHotels,
        targetLat,
        targetLon,
        searchRadius
      );
    }

    // Create a temporary filters object for consistent filtering
    const filtersForCount = {
      propertyType: tempSelectedPropertyType?.name || null,
      roomAsText: tempSelectedCategory?.name || null,
      minPrice: tempMinPrice !== "" ? tempMinPrice : null,
      maxPrice: tempMaxPrice !== "" ? tempMaxPrice : null,
      roomCount: tempRoomCount !== "" ? parseInt(tempRoomCount) : null,
      bathroomCount:
        tempBathroomCount !== "" ? parseInt(tempBathroomCount) : null,
      minProjectArea: tempMinArea !== "" ? Number(tempMinArea) : null,
      maxProjectArea: tempMaxArea !== "" ? Number(tempMaxArea) : null,
      interiorFeatureIds:
        tempInteriorFeatures.length > 0
          ? tempInteriorFeatures.map((f: any) => f._id)
          : null,
      exteriorFeatureIds:
        tempSelectedExteriorFeatures.length > 0
          ? tempSelectedExteriorFeatures.map((f: any) => f._id)
          : null,
      accessibilityFeatureIds:
        tempSelectedAccessibilityFeatures.length > 0
          ? tempSelectedAccessibilityFeatures.map((f: any) => f._id)
          : null,
      faceFeatureIds:
        tempSelectedFaceFeatures.length > 0
          ? tempSelectedFaceFeatures.map((f: any) => f._id)
          : null,
      isNewSelected: tempFilters?.isNewSelected || false,
      isOnePlusOneSelected: tempFilters?.isOnePlusOneSelected || false,
      isTwoPlusOneSelected: tempFilters?.isTwoPlusOneSelected || false,
      isThreePlusOneSelected: tempFilters?.isThreePlusOneSelected || false,
    };

    // Apply filters using HomePage logic
    if (filtersForCount.propertyType) {
      filteredHotels = filteredHotels.filter((hotel) =>
        Object.values(hotel.entranceType).some(
          (value) => value === filtersForCount.propertyType
        )
      );
    }

    if (filtersForCount.roomAsText) {
      filteredHotels = filteredHotels.filter((hotel) =>
        Object.values(hotel.housingType).some(
          (value) => value === filtersForCount.roomAsText
        )
      );
    }

    if (
      filtersForCount.minPrice !== undefined &&
      filtersForCount.minPrice !== null
    ) {
      filteredHotels = filteredHotels.filter((hotel) => {
        const priceInSelectedCurrency = hotel.price.find(
          (price) => price.currency === selectedCurrency
        );
        return priceInSelectedCurrency
          ? priceInSelectedCurrency.amount >= filtersForCount.minPrice!
          : true;
      });
    }

    if (
      filtersForCount.maxPrice !== undefined &&
      filtersForCount.maxPrice !== null
    ) {
      filteredHotels = filteredHotels.filter((hotel) => {
        const priceInSelectedCurrency = hotel.price.find(
          (price) => price.currency === selectedCurrency
        );
        return priceInSelectedCurrency
          ? priceInSelectedCurrency.amount <= filtersForCount.maxPrice!
          : true;
      });
    }

    if (
      filtersForCount.roomCount !== undefined &&
      filtersForCount.roomCount !== null &&
      filtersForCount.roomCount > 0
    ) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return hotel.roomCount === filtersForCount.roomCount;
      });
    }

    if (
      filtersForCount.bathroomCount !== undefined &&
      filtersForCount.bathroomCount !== null &&
      filtersForCount.bathroomCount > 0
    ) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return hotel.bathroomCount === filtersForCount.bathroomCount;
      });
    }

    if (
      filtersForCount.minProjectArea !== undefined &&
      filtersForCount.minProjectArea !== null &&
      filtersForCount.minProjectArea > 0
    ) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return hotel.projectArea >= filtersForCount.minProjectArea!;
      });
    }

    if (
      filtersForCount.maxProjectArea !== undefined &&
      filtersForCount.maxProjectArea !== null &&
      filtersForCount.maxProjectArea > 0
    ) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return hotel.projectArea <= filtersForCount.maxProjectArea!;
      });
    }

    if (
      filtersForCount.interiorFeatureIds &&
      filtersForCount.interiorFeatureIds.length > 0
    ) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return filtersForCount.interiorFeatureIds!.every((featureId: string) =>
          hotel.featureIds.includes(featureId)
        );
      });
    }

    if (
      filtersForCount.exteriorFeatureIds &&
      filtersForCount.exteriorFeatureIds.length > 0
    ) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return filtersForCount.exteriorFeatureIds!.every((featureId: string) =>
          hotel.featureIds.includes(featureId)
        );
      });
    }

    if (
      filtersForCount.accessibilityFeatureIds &&
      filtersForCount.accessibilityFeatureIds.length > 0
    ) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return filtersForCount.accessibilityFeatureIds!.every(
          (featureId: string) => hotel.featureIds.includes(featureId)
        );
      });
    }

    if (
      filtersForCount.faceFeatureIds &&
      filtersForCount.faceFeatureIds.length > 0
    ) {
      filteredHotels = filteredHotels.filter((hotel) => {
        return filtersForCount.faceFeatureIds!.some((featureId: string) =>
          hotel.faces.includes(featureId)
        );
      });
    }

    if (filtersForCount.isNewSelected) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      filteredHotels = filteredHotels.filter((hotel) => {
        const hotelCreatedAt = new Date(hotel.createdAt);
        return hotelCreatedAt >= sevenDaysAgo;
      });
    }

    if (
      filtersForCount.isOnePlusOneSelected ||
      filtersForCount.isTwoPlusOneSelected ||
      filtersForCount.isThreePlusOneSelected
    ) {
      const selectedRoomTypes: string[] = [];
      if (filtersForCount.isOnePlusOneSelected) selectedRoomTypes.push("1+1");
      if (filtersForCount.isTwoPlusOneSelected) selectedRoomTypes.push("2+1");
      if (filtersForCount.isThreePlusOneSelected) selectedRoomTypes.push("3+1");

      filteredHotels = filteredHotels.filter((hotel) => {
        return selectedRoomTypes.includes(hotel.roomAsText);
      });
    }

    // Filter by selected features (quick filters) - matching HomePage logic
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

    return filteredHotels.length;
  };

  const resultsCount = getFilteredResultsCount();

  // Check if any filters are selected (using temporary states)
  const hasActiveFilters = () => {
    return (
      tempMinPrice !== "" ||
      tempMaxPrice !== "" ||
      tempMinArea !== "" ||
      tempMaxArea !== "" ||
      tempRoomCount !== "" ||
      tempBathroomCount !== "" ||
      tempInteriorFeatures.length > 0 ||
      tempSelectedExteriorFeatures.length > 0 ||
      tempSelectedAccessibilityFeatures.length > 0 ||
      tempSelectedFaceFeatures.length > 0 ||
      tempSelectedLocation ||
      tempSelectedPropertyType ||
      tempSelectedCategory ||
      (tempFilters &&
        (tempFilters.isOnePlusOneSelected ||
          tempFilters.isTwoPlusOneSelected ||
          tempFilters.isThreePlusOneSelected ||
          tempFilters.isNewSelected))
    );
  };

  // Apply temporary filters to actual filters
  const applyFilters = () => {
    setListingType(tempListingType);
    setSelectedLocation(tempSelectedLocation);
    setSelectedPropertyType &&
      setSelectedPropertyType(tempSelectedPropertyType);
    setSelectedCategory && setSelectedCategory(tempSelectedCategory);
    setFilters({
      ...tempFilters,
      propertyType: tempSelectedPropertyType?.name || null,
      propertyTypeId: tempSelectedPropertyType?._id || null,
      listingType: tempListingType,
      state: tempSelectedLocation?.name || null,
      categoryId: tempSelectedCategory?._id || null,
      interiorFeatureIds: tempInteriorFeatures.map((f: any) => f._id),
      exteriorFeatureIds: tempSelectedExteriorFeatures.map((f: any) => f._id),
      accessibilityFeatureIds: tempSelectedAccessibilityFeatures.map(
        (f: any) => f._id
      ),
      faceFeatureIds: tempSelectedFaceFeatures.map((f: any) => f._id),
    });
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setMinArea(tempMinArea);
    setMaxArea(tempMaxArea);
    setRoomCount(tempRoomCount);
    setBathroomCount(tempBathroomCount);
    setSelectedExteriorFeatures(tempSelectedExteriorFeatures);
    setInteriorFeatures(tempInteriorFeatures);
    setSelectedAccessibilityFeatures(tempSelectedAccessibilityFeatures);
    setSelectedFaceFeatures(tempSelectedFaceFeatures);

    // Update quick filters (selectedFeatures) based on interior and exterior features
    const newSelectedFeatures = [
      ...tempInteriorFeatures.filter((f: any) =>
        selectedFeatures.some((sf: any) => sf._id === f._id)
      ),
      ...tempSelectedExteriorFeatures.filter((f: any) =>
        selectedFeatures.some((sf: any) => sf._id === f._id)
      ),
    ];
    setSelectedFeatures(newSelectedFeatures);

    dispatch(setIsFilterApplied(true));
    onClose && onClose();
  };

  // Clear all temporary filters
  const clearAllTempFilters = () => {
    setTempMinPrice("");
    setTempMaxPrice("");
    setTempMinArea("");
    setTempMaxArea("");
    setTempRoomCount("");
    setTempBathroomCount("");
    setTempInteriorFeatures([]);
    setTempSelectedExteriorFeatures([]);
    setTempSelectedAccessibilityFeatures([]);
    setTempSelectedFaceFeatures([]);
    setTempSelectedLocation(null);
    setTempSelectedPropertyType(null);
    setTempSelectedCategory(null);
    setTempFilters({
      listingType: null,
      state: null,
      propertyType: null,
      roomAsText: null,
      isOnePlusOneSelected: false,
      isTwoPlusOneSelected: false,
      isThreePlusOneSelected: false,
      isNewSelected: false,
    });
  };

  const isWorkPlaceSelected =
    tempSelectedPropertyType &&
    tempSelectedPropertyType.originalData.name.tr === "İş Yeri";

  const isLandSelected =
    tempSelectedPropertyType &&
    tempSelectedPropertyType.originalData.name.tr === "Arsa";

  console.log({
    tempSelectedPropertyType,
    isLandSelected,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-start pt-[104px] md:items-center justify-center lg:p-4 overflow-y-auto">
      <div
        className="fixed inset-0"
        onClick={onClose}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      ></div>

      <div
        className="relative bg-white rounded-t-2xl md:rounded-2xl shadow-xl max-w-[600px] w-full mx-auto h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col md:mt-0"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: touchStartY ? "none" : "transform 0.3s ease-out",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header - Fixed at top */}
        <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 rounded-t-2xl relative">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-lg font-bold text-gray-700">
              {t("title")}
            </h2>
            <button
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={onClose}
            >
              <XMarkIcon className="w-8 h-8 md:w-6 md:h-6 text-gray-700" />
            </button>
          </div>
          {/* Drag handle visible only on mobile */}
          <span className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-gray-300 rounded-full md:hidden"></span>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6 pt-3">
          <div className="relative flex rounded-[12px] bg-[#f0f0f0]   w-full h-[56px] items-center">
            {/* Sliding Background */}
            <div
              className={`absolute w-[calc(50%-4px)] bg-[#362C75] rounded-[12px] transition-all duration-500 ease-in-out shadow-md h-[48px] ${
                tempListingType === "For Sale"
                  ? "translate-x-[4px]"
                  : "translate-x-[calc(100%+4px)]"
              }`}
            />

            {/* For Sale Toggle Button */}
            <button
              className={`relative z-10 py-3 px-4 text-base md:text-sm font-medium transition-all duration-500 ease-in-out cursor-pointer rounded-[12px] h-[56px] flex-1 flex items-center justify-center ${
                tempListingType === "For Sale"
                  ? "text-white"
                  : "text-gray-700 hover:text-gray-800"
              }`}
              onClick={() => setTempListingType("For Sale")}
              aria-pressed={tempListingType === "For Sale"}
              role="switch"
            >
              <span className="transition-all duration-200 ease-in-out relative z-10">
                {listingTypeTranslations("forSale")}
              </span>
            </button>

            {/* For Rent Toggle Button */}
            <button
              className={`relative z-10 py-3 px-4 text-base md:text-sm font-medium transition-all duration-500 ease-in-out cursor-pointer rounded-[12px] h-[56px] flex-1 flex items-center justify-center ${
                tempListingType === "For Rent"
                  ? "text-white"
                  : "text-gray-700 hover:text-gray-800"
              }`}
              onClick={() => setTempListingType("For Rent")}
              aria-pressed={tempListingType === "For Rent"}
              role="switch"
            >
              <span className="transition-all duration-200 ease-in-out relative z-10">
                {listingTypeTranslations("forRent")}
              </span>
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

                    setTempSelectedLocation(locationWithCoordinates);
                    setShowSearch(false);
                    setIsOpen(false);
                    setSuggestions([]);
                    setShowSuggestions(false);
                    buttonRef.current?.click();
                  };

                  // Convert suggestions to the expected format (same as LocationSelect.tsx)
                  const searchResults = suggestions.map((suggestion) => {
                    const parts = suggestion.description
                      ? [suggestion.name, suggestion.description]
                      : [suggestion.name];
                    const name = parts[0].trim(); // Get main part of description
                    const description = parts.slice(1).join(",").trim(); // Get secondary part (province, country etc.)

                    return {
                      name,
                      description,
                      href: "#",
                      place_id: suggestion.place_id,
                    };
                  });

                  // Combine suggestions with filtered locations for display
                  const displayLocations =
                    showSuggestions && searchResults.length > 0
                      ? searchResults
                      : [];

                  return (
                    <>
                      <PopoverButton
                        ref={buttonRef}
                        className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-[16px] px-4 py-3 h-[56px] text-base md:text-sm text-gray-700"
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
                                {tempSelectedLocation
                                  ? `${tempSelectedLocation.name}`
                                  : t("selectLocation") || "Select Location"}
                              </span>
                            </>
                          )}
                        </div>

                        {tempSelectedLocation && tempSelectedLocation.name && (
                          <XMarkSolidIcon
                            className="h-5 w-5 text-black ml-2 cursor-pointer"
                            aria-hidden="true"
                            onClick={() => {
                              setTempSelectedLocation(null);
                              setShowSearch(true);
                              setSearchQuery("");
                              setSuggestions([]);
                              setShowSuggestions(false);
                            }}
                          />
                        )}
                      </PopoverButton>

                      <PopoverPanel className="absolute z-20 mt-2 w-full py-1 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
                        <div className="w-full overflow-hidden rounded-xl bg-white text-base md:text-sm shadow-lg ring-1 ring-gray-900/5">
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
                                    <div className="flex-1">
                                      <div className="font-normal text-[#595959] flex items-center">
                                        {location.name}
                                      </div>
                                      {location.description && (
                                        <div className="text-xs md:text-xs text-gray-400 mt-1">
                                          {location.description}
                                        </div>
                                      )}
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
                  selectedItem={tempSelectedPropertyType}
                  onSelect={(propertyType) => {
                    setTempSelectedPropertyType(propertyType);
                    // Reset category when property type changes
                    setTempSelectedCategory(null);
                  }}
                  options={hotelTypes.map((hotelType) => ({
                    _id: hotelType._id,
                    name: (hotelType.name as any)[locale] || hotelType.name.tr,
                    href: "#",
                    originalData: hotelType, // Keep reference to original data for category filtering
                  }))}
                  defaultText={t("selectEstateType") || "Select Property Type"}
                  extraClassName="w-full bg-white border border-gray-200 h-[56px] text-base md:text-sm text-gray-700 "
                  popoverExtraClassName=" md:max-w-[300px] max-w-[190px]"
                />
              </div>
            </div>

            {/* Category Section */}
            <div className="w-1/2">
              <div className="mt-3">
                <GeneralSelect
                  selectedItem={tempSelectedCategory}
                  onSelect={(category) => {
                    // Only allow selection if property type is selected and has categories
                    if (tempSelectedPropertyType?.originalData?.categories) {
                      setTempSelectedCategory(category);
                    }
                  }}
                  options={
                    tempSelectedPropertyType?.originalData?.categories
                      ? tempSelectedPropertyType.originalData.categories.map(
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
                  extraClassName="w-full bg-white border border-gray-200 h-[56px] text-base md:text-sm text-gray-700"
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
                className="text-base md:text-sm text-[#8c8c8c] hover:underline cursor-pointer"
                onClick={() => {
                  setTempMinPrice("");
                  setTempMaxPrice("");
                }}
              >
                {t("reset")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={tempMinPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers
                    if (value === "" || /^\d+$/.test(value)) {
                      setTempMinPrice(value === "" ? "" : Number(value));
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
                  className="w-full bg-white border border-gray-200 rounded-[16px] px-4 py-2 h-[56px] text-base md:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  value={tempMaxPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers
                    if (value === "" || /^\d+$/.test(value)) {
                      setTempMaxPrice(value === "" ? "" : Number(value));
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
                  className="w-full bg-white border border-gray-200  px-4 py-2 h-[56px] rounded-[16px] text-base md:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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

          {!isWorkPlaceSelected && !isLandSelected && (
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
                    selectedItem={
                      tempRoomCount
                        ? {
                            name: generateRoomCountOptions().find(
                              (option) => option.value === +tempRoomCount
                            )?.label,
                          }
                        : null
                    }
                    onSelect={(room) => {
                      if (room) setTempRoomCount(room.value.toString());
                      else setTempRoomCount(""); // Reset if no room selected
                    }}
                    options={generateRoomCountOptions().map((room) => ({
                      name: room.label,
                      value: room.value,
                      href: "#",
                    }))}
                    defaultText={t("roomsSelect") || "Select Room Count"}
                    extraClassName="w-full bg-white border border-gray-200 h-[56px] text-base md:text-sm text-gray-700"
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
                    selectedItem={
                      tempBathroomCount ? { name: tempBathroomCount } : null
                    }
                    onSelect={(bathroom) => {
                      if (bathroom) setTempBathroomCount(bathroom.name);
                      else setTempBathroomCount(""); // Reset if no bathroom selected
                    }}
                    options={[0, 1, 2, 3, 4, 5].map((bathroom: number) => ({
                      name: bathroom.toString(),
                      href: "#",
                    }))}
                    defaultText={
                      t("bathroomsSelect") || "Select Bathroom Count"
                    }
                    extraClassName="w-full bg-white border border-gray-200 h-[56px] text-base md:text-sm text-gray-700"
                    popoverExtraClassName=" md:max-w-[300px] max-w-[190px]"
                  />
                </div>
              </div>
            </div>
          )}
          {/* Area Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-700">
                {t("area")}
              </h3>
              <button
                className="text-base md:text-sm text-[#8c8c8c] hover:underline cursor-pointer"
                onClick={() => {
                  setTempMinArea("");
                  setTempMaxArea("");
                }}
              >
                {t("reset")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={tempMinArea}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers
                    if (value === "" || /^\d+$/.test(value)) {
                      setTempMinArea(value === "" ? "" : Number(value));
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
                  className="w-full bg-white border border-gray-200 rounded-[16px] px-4 py-2 h-[56px] text-base md:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  value={tempMaxArea}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers
                    if (value === "" || /^\d+$/.test(value)) {
                      setTempMaxArea(value === "" ? "" : Number(value));
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
                  className="w-full bg-white border border-gray-200 rounded-[16px] px-4 py-2 h-[56px] text-base md:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
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

          {!isLandSelected && (
            <>
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
                        {tempSelectedFaceFeatures.length > 0 ? (
                          <span className="text-base md:text-sm font-normal text-[#595959]">
                            ({tempSelectedFaceFeatures.length})
                          </span>
                        ) : null}
                      </h3>
                      <button className="text-base md:text-sm text-[#8c8c8c] hover:underline cursor-pointer">
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
                            const isSelected = tempSelectedFaceFeatures.find(
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
                                } border rounded-[16px] h-[40px] px-3 py-1 text-base md:text-sm font-medium  cursor-pointer transition-all duration-300 hover:bg-[#F5F5F5]`}
                              >
                                {feature.iconUrl && (
                                  <img
                                    src={feature.iconUrl}
                                    className="w-[24px] h-[24px] mr-2"
                                  />
                                )}
                                {feature.name[locale]}
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
                    {tempInteriorFeatures.length > 0 ? (
                      <span className="text-base md:text-sm font-normal text-[#595959]">
                        ({tempInteriorFeatures.length})
                      </span>
                    ) : null}
                  </h3>
                  <button className="text-base md:text-sm text-[#8c8c8c] hover:underline cursor-pointer">
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
                        const isSelected = tempInteriorFeatures.find(
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
                            } border rounded-[16px] h-[40px] px-3 py-1 text-base md:text-sm font-medium  cursor-pointer transition-all duration-300 hover:bg-[#F5F5F5]`}
                          >
                            <img
                              src={feature.iconUrl}
                              className="w-[24px] h-[24px] mr-2"
                            />
                            {feature.name[locale]}
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
                    {tempSelectedExteriorFeatures.length > 0 ? (
                      <span className="text-base md:text-sm font-normal text-[#595959]">
                        ({tempSelectedExteriorFeatures.length})
                      </span>
                    ) : null}
                  </h3>
                  <button className="text-base md:text-sm text-[#8c8c8c] hover:underline cursor-pointer">
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
                        const isSelected = tempSelectedExteriorFeatures.find(
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
                            } border rounded-[16px] h-[40px] px-3 py-1 text-base md:text-sm font-medium  cursor-pointer transition-all duration-300 hover:bg-[#F5F5F5]`}
                          >
                            <img
                              src={feature.iconUrl}
                              className="w-[24px] h-[24px] mr-2"
                            />
                            {feature.name[locale]}
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
                        {tempSelectedAccessibilityFeatures.length > 0 ? (
                          <span className="text-base md:text-sm font-normal text-[#595959]">
                            ({tempSelectedAccessibilityFeatures.length})
                          </span>
                        ) : null}
                      </h3>
                      <button className="text-base md:text-sm text-[#8c8c8c] hover:underline cursor-pointer">
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
                              const isSelected =
                                tempSelectedAccessibilityFeatures.find(
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
                                  } border rounded-[16px] h-[40px] px-3 py-1 text-base md:text-sm font-medium  cursor-pointer transition-all duration-300 hover:bg-[#F5F5F5]`}
                                >
                                  {feature.iconUrl && (
                                    <img
                                      src={feature.iconUrl}
                                      className="w-[24px] h-[24px] mr-2"
                                    />
                                  )}
                                  {feature.name[locale]}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </>
          )}

          {/* Location Features Section */}

          {/* Add some bottom padding to prevent content from hiding behind the fixed footer */}
          <div className="pb-20"></div>
        </div>

        {/* Footer Buttons - Fixed at bottom */}
        <div className="sticky bottom-0 left-0 right-0 bg-white z-10 p-6 border-t border-gray-100 rounded-b-2xl">
          <div className="grid grid-cols-2 gap-4">
            {hasActiveFilters() && (
              <button
                className="w-full h-[56px] text-base md:text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-[16px] hover:bg-gray-50"
                onClick={clearAllTempFilters}
              >
                {t("clearAll")}
              </button>
            )}
            <button
              onClick={applyFilters}
              disabled={hasActiveFilters() && resultsCount === 0}
              className={`w-full h-[56px] text-base md:text-sm font-medium text-white rounded-[16px] cursor-pointer ${
                hasActiveFilters() && resultsCount === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#5E5691] hover:bg-[#4a4574]"
              } ${hasActiveFilters() ? "col-span-1" : "col-span-2"}`}
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
