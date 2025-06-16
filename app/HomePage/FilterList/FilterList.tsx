import {
  FaBath,
  FaCar,
  FaChargingStation,
  FaDumbbell,
  FaFilter,
  FaHotjar,
  FaKey,
  FaParking,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  MdHolidayVillage,
  MdHouse,
  MdKitchen,
  MdLocationCity,
  MdPool,
} from "react-icons/md";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocale, useTranslations } from "next-intl";

import { Feature } from "@/types/feature.type";
import { FilterOptions } from "@/types/filter-options.type";
import FilterPopup from "@/app/components/FilterPopup/FilterPopup";
import { FilterType } from "@/types/filter.type";
import { Hotel } from "@/types/hotel.type";
import ListViewIcon from "@/app/svgIcons/ListViewIcon";
import { LuSettings2 } from "react-icons/lu";
import NewFilterItem from "./NewFilterItem/NewFilterItem";
import SizeFilterItem from "./SizeFilterItem/SizeFilterıtem";
import { TbSquarePlus } from "react-icons/tb";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axiosInstance from "@/axios";
import { setIsFilterApplied } from "@/app/store/favoritesSlice";
import { useScrollDirection } from "../../hooks/useScrollDirection";

const iconClassName = "text-xl";
const iconColor = "rgba(0,0,0,0.6)";

export default function FilterList({
  onChangeCurrentView,
  currentView,
  features,
  selectedFeatures,
  setSelectedFeatures,
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
  allQuickFilters,
  hotels,
  selectedCurrency,
  searchRadius,
  isFilterPopupOpen,
  setIsFilterPopupOpen,
  setIsSaveFilterPopupOpen,
  sortOption,
  setSortOption,
  resultCount,
}: {
  onChangeCurrentView: () => void;
  currentView: "map" | "list";
  features: Feature[];
  selectedFeatures: Feature[];
  setSelectedFeatures: React.Dispatch<React.SetStateAction<Feature[]>>;
  listingType: "For Sale" | "For Rent";
  setListingType: (listingType: "For Sale" | "For Rent") => void;
  filterOptions: FilterOptions;
  selectedLocation: any;
  setSelectedLocation: (selectedLocation: any) => void;
  selectedPropertyType: any;
  setSelectedPropertyType: (selectedPropertyType: any) => void;
  selectedCategory: any;
  setSelectedCategory: (selectedCategory: any) => void;
  filters: FilterType | null;
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
  allQuickFilters: Feature[];
  hotels: Hotel[];
  selectedCurrency: string;
  searchRadius: number;
  isFilterPopupOpen: boolean;
  setIsFilterPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSaveFilterPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sortOption: "ascending" | "descending" | "newest" | "oldest" | null;
  setSortOption: React.Dispatch<
    React.SetStateAction<
      "ascending" | "descending" | "newest" | "oldest" | null
    >
  >;
  resultCount: number;
}) {
  const dispatch = useDispatch();
  const isFilterApplied = useSelector(
    (state: any) => state.favorites.isFilterApplied
  ); // Adjust state path
  const t = useTranslations("filterList");
  const locale = useLocale();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState<
    "ascending" | "descending" | "newest" | "oldest" | null
  >(sortOption);
  const { scrollDirection, isScrolled } = useScrollDirection();

  const handleFilterClick = (featureItem: Feature) => {
    const isCurrentlySelected = selectedFeatures.some(
      (sf) => sf._id === featureItem._id
    );

    // Update selectedFeatures (quick filters)
    setSelectedFeatures(
      isCurrentlySelected
        ? selectedFeatures.filter((sf) => sf._id !== featureItem._id)
        : [...selectedFeatures, featureItem]
    );

    // Check if this feature is an interior or exterior feature and update accordingly
    const isInteriorFeature = filterOptions.interiorFeatures.some(
      (f) => f._id === featureItem._id
    );
    const isExteriorFeature = filterOptions.outsideFeatures.some(
      (f) => f._id === featureItem._id
    );

    if (isInteriorFeature) {
      // Update interior features
      setInteriorFeatures((prev) =>
        isCurrentlySelected
          ? prev.filter((f) => f._id !== featureItem._id)
          : [...prev, featureItem]
      );
    }

    if (isExteriorFeature) {
      // Update exterior features
      setSelectedExteriorFeatures((prev) =>
        isCurrentlySelected
          ? prev.filter((f) => f._id !== featureItem._id)
          : [...prev, featureItem]
      );
    }
  };

  const checkArrows = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkArrows();

      container.addEventListener("scroll", checkArrows);

      const resizeObserver = new ResizeObserver(checkArrows);
      resizeObserver.observe(container);

      return () => {
        container.removeEventListener("scroll", checkArrows);
        resizeObserver.unobserve(container);
      };
    }
  }, []);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    const hasSelectedFeatures = selectedFeatures.length > 0;
    const hasSelectedLocation = selectedLocation !== null;
    const hasSelectedPropertyType = selectedPropertyType !== null;
    const hasSelectedCategory = selectedCategory !== null;
    const hasPriceRange = minPrice !== "" || maxPrice !== "";
    const hasAreaRange = minArea !== "" || maxArea !== "";
    const hasRoomCount = roomCount !== "";
    const hasBathroomCount = bathroomCount !== "";
    const hasExteriorFeatures = selectedExteriorFeatures.length > 0;
    const hasInteriorFeatures = interiorFeatures.length > 0;
    const hasAccessibilityFeatures = selectedAccessibilityFeatures.length > 0;
    const hasFaceFeatures = selectedFaceFeatures.length > 0;
    const hasSizeFilters =
      filters?.isOnePlusOneSelected ||
      filters?.isTwoPlusOneSelected ||
      filters?.isThreePlusOneSelected;
    const isNewSelected = filters?.isNewSelected;

    return (
      hasSelectedFeatures ||
      hasSelectedLocation ||
      hasSelectedPropertyType ||
      hasSelectedCategory ||
      hasPriceRange ||
      hasAreaRange ||
      hasRoomCount ||
      hasBathroomCount ||
      hasExteriorFeatures ||
      hasInteriorFeatures ||
      hasAccessibilityFeatures ||
      hasFaceFeatures ||
      hasSizeFilters ||
      isNewSelected
    );
  };

  const countActiveFilters = () => {
    let count = 0;

    // Quick filters (hızlı filtreler)
    if (selectedFeatures.length > 0) count += selectedFeatures.length;

    // Location, Property Type, Category
    if (selectedLocation !== null) count += 1;
    if (selectedPropertyType !== null) count += 1;
    if (selectedCategory !== null) count += 1;

    // Price range
    if (minPrice !== "" || maxPrice !== "") count += 1;

    // Area range
    if (minArea !== "" || maxArea !== "") count += 1;

    // Room and bathroom counts
    if (roomCount !== "") count += 1;
    if (bathroomCount !== "") count += 1;

    // Room type filters (1+1, 2+1, 3+1)
    if (filters?.isOnePlusOneSelected) count += 1;
    if (filters?.isTwoPlusOneSelected) count += 1;
    if (filters?.isThreePlusOneSelected) count += 1;
    if (filters?.isNewSelected) count += 1;

    // Features - Sadece hızlı filtrelerde olmayan özellikleri say
    const quickFilterIds = selectedFeatures.map((f: any) => f._id);

    // Interior features (hızlı filtrelerde olmayanları say)
    const uniqueInteriorFeatures = interiorFeatures.filter(
      (f: any) => !quickFilterIds.includes(f._id)
    );
    count += uniqueInteriorFeatures.length;

    // Exterior features (hızlı filtrelerde olmayanları say)
    const uniqueExteriorFeatures = selectedExteriorFeatures.filter(
      (f: any) => !quickFilterIds.includes(f._id)
    );
    count += uniqueExteriorFeatures.length;

    // Accessibility features
    if (selectedAccessibilityFeatures.length > 0)
      count += selectedAccessibilityFeatures.length;

    // Face features
    if (selectedFaceFeatures.length > 0) count += selectedFaceFeatures.length;

    return count;
  };

  const handleSortSelection = () =>
    // option: "ascending" | "descending" | "newest" | "oldest"
    {
      setSortOption(selectedSortOption);
      setIsSheetOpen(false);
    };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFeatures([]);
    setSelectedLocation(null);
    setSelectedPropertyType(null);
    setSelectedCategory(null);
    setMinPrice("");
    setMaxPrice("");
    setMinArea("");
    setMaxArea("");
    setRoomCount("");
    setBathroomCount("");
    setSelectedExteriorFeatures([]);
    setInteriorFeatures([]);
    setSelectedAccessibilityFeatures([]);
    setSelectedFaceFeatures([]);
    setFilters({
      ...filters,
      isOnePlusOneSelected: false,
      isTwoPlusOneSelected: false,
      isThreePlusOneSelected: false,
      isNewSelected: false,
    });
    dispatch(setIsFilterApplied(false));
  };

  const isMobile = useSelector((state: any) => state.favorites.isMobile);
  const [isSaveFilterSheetOpen, setIsSaveFilterSheetOpen] = useState(false);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
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
      setIsSheetOpen(false);
    }
    setTranslateY(0);
    setTouchStartY(null);
  };

  const [searchName, setSearchName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = async () => {
    if (!searchName.trim()) return;

    setIsLoading(true);
    try {
      // Prepare the data according to CreateSavedFilterDto
      const filterData = {
        filterName: searchName,
        enableNotifications: false,
        enableMailNotifications: false,
        listingType: listingType || null,
        state: filters?.state || null,
        propertyType:
          selectedPropertyType?.name || filters?.propertyType || null,
        propertyTypeId: selectedPropertyType?._id || null,
        roomAsText: filters?.roomAsText || null,
        categoryId: selectedCategory?._id || null,
        minPrice:
          minPrice !== "" ? Number(minPrice) : filters?.minPrice || null,
        maxPrice:
          maxPrice !== "" ? Number(maxPrice) : filters?.maxPrice || null,
        roomCount:
          roomCount !== "" ? Number(roomCount) : filters?.roomCount || null,
        bathroomCount:
          bathroomCount !== ""
            ? Number(bathroomCount)
            : filters?.bathroomCount || null,
        minProjectArea:
          minArea !== "" ? Number(minArea) : filters?.minProjectArea || null,
        maxProjectArea:
          maxArea !== "" ? Number(maxArea) : filters?.maxProjectArea || null,
        interiorFeatureIds:
          interiorFeatures.map((f) => f._id).length > 0
            ? interiorFeatures.map((f) => f._id)
            : filters?.interiorFeatureIds || null,
        exteriorFeatureIds:
          selectedExteriorFeatures.map((f) => f._id).length > 0
            ? selectedExteriorFeatures.map((f) => f._id)
            : filters?.exteriorFeatureIds || null,
        accessibilityFeatureIds:
          selectedAccessibilityFeatures.map((f) => f._id).length > 0
            ? selectedAccessibilityFeatures.map((f) => f._id)
            : filters?.accessibilityFeatureIds || null,
        faceFeatureIds:
          selectedFaceFeatures.map((f) => f._id).length > 0
            ? selectedFaceFeatures.map((f) => f._id)
            : filters?.faceFeatureIds || null,
        locationFeatureIds: null,
        isNewSelected: filters?.isNewSelected || null,
        isOnePlusOneSelected: filters?.isOnePlusOneSelected || null,
        isTwoPlusOneSelected: filters?.isTwoPlusOneSelected || null,
        isThreePlusOneSelected: filters?.isThreePlusOneSelected || null,
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
            : undefined,
        selectedLocation,
        resultCount,
      };

      // Remove null values to send only set filters
      const cleanedData = Object.entries(filterData).reduce(
        (acc, [key, value]) => {
          if (
            value !== null &&
            value !== undefined &&
            (Array.isArray(value) ? value.length > 0 : true)
          ) {
            acc[key] = value;
          }
          return acc;
        },
        {} as any
      );

      // Send POST request to save filter
      const response = await axiosInstance.post("/saved-filters/", cleanedData);

      if (response.data) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Error saving filter:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  if (isFilterApplied && isMobile) {
    return (
      <>
        <FilterPopup
          isOpen={isFilterPopupOpen}
          onClose={() => setIsFilterPopupOpen(false)}
          listingType={listingType}
          setListingType={setListingType}
          filterOptions={filterOptions}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedPropertyType={selectedPropertyType}
          setSelectedPropertyType={setSelectedPropertyType}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filters={filters}
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
          selectedFeatures={selectedFeatures}
          setSelectedFeatures={setSelectedFeatures}
          selectedExteriorFeatures={selectedExteriorFeatures}
          setSelectedExteriorFeatures={setSelectedExteriorFeatures}
          currencyCode={currencyCode}
          setCurrencyCode={setCurrencyCode}
          interiorFeatures={interiorFeatures}
          setInteriorFeatures={setInteriorFeatures}
          accessibilityFeatures={accessibilityFeatures}
          setAccessibilityFeatures={setAccessibilityFeatures}
          selectedAccessibilityFeatures={selectedAccessibilityFeatures}
          setSelectedAccessibilityFeatures={setSelectedAccessibilityFeatures}
          faceFeatures={faceFeatures}
          setFaceFeatures={setFaceFeatures}
          selectedFaceFeatures={selectedFaceFeatures}
          setSelectedFaceFeatures={setSelectedFaceFeatures}
          hotels={hotels}
          selectedCurrency={selectedCurrency}
          searchRadius={searchRadius}
        />
        <div
          className={`bg-white flex flex-row transition-all duration-350 ease-in-out ${
            currentView === "map"
              ? `fixed lg:top-28 ${
                  isScrolled && isMobile ? "top-[72px]" : "top-[71px]"
                } left-0 right-0 w-full lg:w-[924px] lg:shadow-lg ${
                  scrollDirection === "down" && isScrolled && isMobile
                    ? "transform -translate-y-full opacity-0"
                    : "transform translate-y-0 opacity-100"
                }`
              : "mt-0 mb-7 relative w-full border-b border-[#F0F0F0]"
          } z-20  mx-auto  lg:rounded-2xl lg:border-none border-y border-[#F0F0F0] `}
        >
          <div className="flex w-full h-[56px]">
            <button
              onClick={() => setIsFilterPopupOpen(true)}
              className="cursor-pointer grow shrink basis-0 text-[14px] font-medium text-[#595959] border-r border-[#F0F0F0]"
            >
              Filtreler ({countActiveFilters()})
            </button>
            <button
              onClick={() => setIsSaveFilterSheetOpen(true)}
              className="cursor-pointer grow shrink basis-0 text-[14px] font-medium text-[#262626]"
            >
              Aramayı Kaydet
            </button>
            <button
              onClick={() => setIsSheetOpen(true)}
              className="cursor-pointer grow shrink basis-0 text-[14px] font-medium text-[#595959] border-l border-[#F0F0F0]"
            >
              <p className="text-sm text-gray-500 font-semibold">Sırala</p>
            </button>

            {isSheetOpen && (
              <div className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center lg:p-4 overflow-y-auto">
                <div
                  className="fixed inset-0"
                  onClick={() => setIsSheetOpen(false)}
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                ></div>
                <div
                  className="relative bg-white rounded-t-[24px] shadow-xl max-w-[600px] w-full mx-auto max-h-[calc(100vh-112px)] flex flex-col"
                  style={{
                    transform: `translateY(${translateY}px)`,
                    transition: touchStartY
                      ? "none"
                      : "transform 0.3s ease-out",
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Header */}
                  <div className="sticky top-0 bg-white z-10 p-4 pb-0 rounded-t-[24px] relative">
                    <div className="flex items-center justify-between"></div>
                    <span className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-gray-300 rounded-full md:hidden"></span>
                  </div>

                  {/* Scrollable content area */}
                  <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-[16px]">
                    <div className="top-full left-0 right-0 mt-1 bg-white z-10 flex flex-col gap-[8px]">
                      <div
                        className={`px-5 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 font-semibold rounded-2xl flex items-center gap-2 outline ${
                          selectedSortOption === "ascending"
                            ? "outline-[#595959]"
                            : "outline-[#F0F0F0]"
                        }`}
                        onClick={() => setSelectedSortOption("ascending")}
                      >
                        <div className="relative w-[16px] h-[16px] rounded-full border border-black flex items-center justify-center">
                          {selectedSortOption === "ascending" && (
                            <div className="w-[10px] h-[10px] rounded-full bg-[#362C75]"></div>
                          )}
                        </div>
                        <p className="text-sm">Önce en düşük fiyat</p>
                      </div>
                      <div
                        className={`px-5 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 font-semibold rounded-2xl flex items-center gap-2 outline ${
                          selectedSortOption === "descending"
                            ? "outline-[#595959]"
                            : "outline-[#F0F0F0]"
                        }`}
                        onClick={() => setSelectedSortOption("descending")}
                      >
                        <div className="relative w-[16px] h-[16px] rounded-full border border-black flex items-center justify-center">
                          {selectedSortOption === "descending" && (
                            <div className="w-[10px] h-[10px] rounded-full bg-[#362C75]"></div>
                          )}
                        </div>
                        <p className="text-sm">Önce en yüksek fiyat</p>
                      </div>
                      <div
                        className={`px-5 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 font-semibold rounded-2xl flex items-center gap-2 outline ${
                          selectedSortOption === "newest"
                            ? "outline-[#595959]"
                            : "outline-[#F0F0F0]"
                        }`}
                        onClick={() => setSelectedSortOption("newest")}
                      >
                        <div className="relative w-[16px] h-[16px] rounded-full border border-black flex items-center justify-center">
                          {selectedSortOption === "newest" && (
                            <div className="w-[10px] h-[10px] rounded-full bg-[#362C75]"></div>
                          )}
                        </div>
                        <p className="text-sm">Önce en yeni ilan</p>
                      </div>
                      {/* <div
                  className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 font-semibold"
                  onClick={() => setSelectedSortOption("oldest")}
                >
                  <p className="text-sm">Önce En Eski İlan</p>
                </div> */}
                    </div>

                    <div className="border-b border-gray-200"></div>

                    <button
                      type="button"
                      className={`mb-[16px] h-[54px] justify-center w-full inline-flex items-center gap-2 px-4 py-1.5 rounded-full transition font-medium cursor-pointer bg-[#5E5691] border-[0.5px] border-[#362C75] text-[#362C75]"}`}
                      onClick={handleSortSelection}
                    >
                      Sırala
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {isSaveFilterSheetOpen && (
          <div className="fixed bottom-0 left-0 inset-0 z-[99999] flex items-end md:items-center justify-center lg:p-4 overflow-y-auto">
            <div
              className="fixed inset-0"
              onClick={() => setIsSaveFilterSheetOpen(false)}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            ></div>

            <div
              className="relative bg-white rounded-t-[24px] shadow-xl max-w-[600px] w-full mx-auto max-h-[calc(100vh-112px)] flex flex-col"
              style={{
                transform: `translateY(${translateY}px)`,
                transition: touchStartY ? "none" : "transform 0.3s ease-out",
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {isSuccess ? (
                <>
                  <div className="flex justify-between items-start p-4">
                    <h2 className="text-2xl font-bold text-[#262626]">
                      Kaydedildi!
                    </h2>
                    <button
                      onClick={() => {
                        setSearchName("");
                        setIsSuccess(false);
                        setIsSaveFilterSheetOpen(false);
                      }}
                      className="w-6 h-6 flex items-center justify-center cursor-pointer "
                    >
                      <img
                        src="/popup-close-icon.png"
                        alt="close"
                        className="w-6 h-6"
                      />
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <h2 className="text-[#262626] font-kumbh font-bold text-base leading-[140%] tracking-[0%] align-start">
                      Arama filtreleriniz başarılı bir şekilde kaydedildi.
                    </h2>
                    <p className="text-[#595959] font-kumbh font-medium text-base leading-[140%] tracking-[0%] align-start">
                      Artık profilinizden kayıtlı aramalarınıza ulaşabilir,
                      dilerseniz bildirim ayarlarını değiştirebilirsiniz.
                    </p>

                    <button
                      onClick={() => {
                        setSearchName("");
                        setIsSuccess(false);
                        setIsSaveFilterSheetOpen(false);
                      }}
                      className="mt-8 py-4 px-16 rounded-2xl w-full text-white font-medium 
                         transition-colors cursor-pointer"
                      style={{
                        backgroundColor: "#5E5691",
                      }}
                    >
                      Kapat
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="sticky top-0 bg-white z-10 px-4 py-[22px] rounded-t-[24px] relative">
                    <div className="flex items-center justify-between">
                      <h2 className="md:text-lg text-2xl font-bold text-[#262626]">
                        Aramayı Kaydet
                      </h2>
                      <button
                        onClick={() => {
                          setSearchName("");
                          setIsSuccess(false);
                          setIsSaveFilterSheetOpen(false);
                        }}
                        className="w-6 h-6 flex items-center justify-center cursor-pointer "
                      >
                        <img
                          src="/popup-close-icon.png"
                          alt="close"
                          className="w-6 h-6"
                        />
                      </button>
                    </div>
                    <span className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-gray-300 rounded-full md:hidden"></span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-[16px]">
                    <div className="top-full left-0 right-0 mt-1 bg-white z-10 flex flex-col gap-[8px]">
                      {/* Search Name Section */}
                      <div className="mb-10">
                        <label className="block text-lg font-bold text-[#262626] mb-2">
                          Arama Adı
                        </label>
                        <input
                          type="text"
                          value={searchName}
                          onChange={(e) => setSearchName(e.target.value)}
                          placeholder="Yeni aramam"
                          className="w-full px-6 py-4 bg-[#FCFCFC] border border-[#D9D9D9] rounded-2xl 
                         text-[#8C8C8C] placeholder-[#8C8C8C] focus:outline-none focus:border-[#262626]
                         focus:text-[#262626] transition-colors"
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            setSearchName("");
                            setIsSuccess(false);
                            setIsSaveFilterSheetOpen(false);
                          }}
                          disabled={isLoading}
                          className="flex-1 py-4 px-6 border-2 border-[#BFBFBF] rounded-2xl 
                         text-[#262626] font-medium hover:bg-gray-50 transition-colors cursor-pointer
                         disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Vazgeç
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={!searchName || isLoading}
                          className={`flex-1 py-4 px-6 rounded-2xl font-medium transition-colors cursor-pointer ${
                            searchName && !isLoading
                              ? "bg-[#5E5691] text-[#FCFCFC] hover:bg-[#5E5691]"
                              : "bg-[#F0F0F0] text-[#8C8C8C] cursor-not-allowed"
                          }`}
                        >
                          {isLoading ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <FilterPopup
        isOpen={isFilterPopupOpen}
        onClose={() => setIsFilterPopupOpen(false)}
        listingType={listingType}
        setListingType={setListingType}
        filterOptions={filterOptions}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedPropertyType={selectedPropertyType}
        setSelectedPropertyType={setSelectedPropertyType}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filters={filters}
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
        selectedFeatures={selectedFeatures}
        setSelectedFeatures={setSelectedFeatures}
        selectedExteriorFeatures={selectedExteriorFeatures}
        setSelectedExteriorFeatures={setSelectedExteriorFeatures}
        currencyCode={currencyCode}
        setCurrencyCode={setCurrencyCode}
        interiorFeatures={interiorFeatures}
        setInteriorFeatures={setInteriorFeatures}
        accessibilityFeatures={accessibilityFeatures}
        setAccessibilityFeatures={setAccessibilityFeatures}
        selectedAccessibilityFeatures={selectedAccessibilityFeatures}
        setSelectedAccessibilityFeatures={setSelectedAccessibilityFeatures}
        faceFeatures={faceFeatures}
        setFaceFeatures={setFaceFeatures}
        selectedFaceFeatures={selectedFaceFeatures}
        setSelectedFaceFeatures={setSelectedFaceFeatures}
        hotels={hotels}
        selectedCurrency={selectedCurrency}
        searchRadius={searchRadius}
      />
      <div
        className={`bg-white flex flex-row transition-all duration-350 ease-in-out ${
          currentView === "map"
            ? `fixed lg:top-28 ${
                isScrolled ? "top-[72px]" : "top-[71px]"
              } left-0 right-0 w-full lg:w-[924px] lg:shadow-lg ${
                scrollDirection === "down" && isScrolled
                  ? "transform -translate-y-full opacity-0"
                  : "transform translate-y-0 opacity-100"
              }`
            : "mt-0 mb-7 relative w-full border-b border-[#F0F0F0]"
        } z-20  mx-auto  lg:rounded-2xl lg:border-none border-b border-[#F0F0F0] `}
      >
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-27 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-lg border border-gray-200 shadow-md cursor-pointer hidden lg:block"
          >
            <FiChevronRight className="text-gray-600 text-sm" />
          </button>
        )}

        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-10 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-lg border border-gray-200 shadow-md cursor-pointer hidden lg:block"
          >
            <FiChevronLeft className="text-gray-600 text-sm" />
          </button>
        )}

        <div
          onClick={onChangeCurrentView}
          className={`hidden lg:flex items-center justify-center border-r py-[10px] border-gray-200 cursor-pointer ${
            currentView === "map" ? "px-[10px]" : "px-[16px]"
          }`}
        >
          <div className="ease-in-out  hover:bg-[#F5F5F5] transition-all duration-300 p-2 rounded-lg">
            {currentView === "map" && <ListViewIcon />}
            {currentView !== "map" && (
              <img src="/map-icon.png" className="w-4 h-4  " />
            )}
          </div>
        </div>

        {hasActiveFilters() && (
          <div
            onClick={clearAllFilters}
            className="lg:hidden flex items-center justify-center cursor-pointer w-[40px] h-[40px] rounded-2xl translate-x-3 z-10 h-[inherit] mr-2"
          >
            <div className="ease-in-out hover:bg-[#F5F5F5] transition-all duration-300 p-2 rounded-lg bg-[#262626]">
              <img src="/trash-02.png" className="w-5 h-5" />
            </div>
          </div>
        )}

        <div className="flex-1 flex items-center relative overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex flex-row items-center overflow-x-auto scrollbar-hide w-full no-scrollbar px-3 py-3 lg:py-[7px] gap-2 filter-scroll"
          >
            <NewFilterItem filters={filters} setFilters={setFilters} />
            <SizeFilterItem
              isSelected={filters?.isOnePlusOneSelected || false}
              onToggleSelected={() =>
                setFilters({
                  ...filters,
                  isOnePlusOneSelected: !filters?.isOnePlusOneSelected,
                })
              }
              iconUrl="/1+1.png"
              text="1+1"
            />
            <SizeFilterItem
              isSelected={filters?.isTwoPlusOneSelected || false}
              onToggleSelected={() =>
                setFilters({
                  ...filters,
                  isTwoPlusOneSelected: !filters?.isTwoPlusOneSelected,
                })
              }
              iconUrl="/2+1.png"
              text="2+1"
            />
            <SizeFilterItem
              isSelected={filters?.isThreePlusOneSelected || false}
              onToggleSelected={() =>
                setFilters({
                  ...filters,
                  isThreePlusOneSelected: !filters?.isThreePlusOneSelected,
                })
              }
              iconUrl="/3+1.png"
              text="3+1"
            />
            {allQuickFilters.map((filterItem) => (
              <div
                key={filterItem._id}
                className={`flex flex-row items-center cursor-pointer rounded-2xl px-3 py-2 whitespace-nowrap transition-colors duration-200 flex-shrink-0 ${
                  selectedFeatures.some((sf) => sf._id === filterItem._id)
                    ? "bg-[#EBEAF180] border-[0.5px] border-[#362C75] text-[#362C75] "
                    : "bg-white hover:bg-[#F5F5F5] border-[0.5px] border-transparent"
                }`}
                onClick={() => handleFilterClick(filterItem)}
              >
                <div className="flex items-center w-full">
                  <img
                    src={filterItem.iconUrl}
                    alt={
                      typeof filterItem.name === "object"
                        ? filterItem.name.en
                        : String(filterItem.name)
                    }
                    className="w-[24px] h-[24px] object-contain flex-shrink-0"
                  />
                  <p className="text-[14px] ml-2 text-[#595959] font-medium">
                    {typeof filterItem.name === "object"
                      ? filterItem.name[
                          locale as keyof typeof filterItem.name
                        ] || filterItem.name.en
                      : String(filterItem.name)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className="hidden lg:flex justify-center items-center w-full md:w-auto px-1  border-l border-gray-200 cursor-pointer"
          onClick={() => setIsFilterPopupOpen(true)}
        >
          <p className="text-xs font-bold   text-gray-600 whitespace-nowrap hover:bg-[#F5F5F5] transition-all duration-300 p-2 rounded-lg ml-3 mr-3">
            {t("allFilters")}{" "}
            {countActiveFilters() > 0 && `(${countActiveFilters()})`}
          </p>
        </div>
      </div>
    </>
  );
}
