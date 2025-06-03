import React, { useState, useRef, useEffect } from "react";
import {
  FaHotjar,
  FaKey,
  FaCar,
  FaParking,
  FaDumbbell,
  FaBath,
  FaChargingStation,
  FaFilter,
} from "react-icons/fa";
import { TbSquarePlus } from "react-icons/tb";
import {
  MdHouse,
  MdHolidayVillage,
  MdLocationCity,
  MdPool,
  MdKitchen,
} from "react-icons/md";
import { LuSettings2 } from "react-icons/lu";
import { useTranslations, useLocale } from "next-intl";
import FilterPopup from "@/app/components/FilterPopup/FilterPopup";
import ListViewIcon from "@/app/svgIcons/ListViewIcon";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Feature } from "@/types/feature.type";
import { FilterOptions } from "@/types/filter-options.type";
import { FilterType } from "@/types/filter.type";
import NewFilterItem from "./NewFilterItem/NewFilterItem";
import SizeFilterItem from "./SizeFilterItem/SizeFilterıtem";
import { Hotel } from "@/types/hotel.type";
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
}) {
  const t = useTranslations("filterList");
  const locale = useLocale();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const handleFilterClick = (featureItem: Feature) => {
    setSelectedFeatures(
      selectedFeatures.some((sf) => sf._id === featureItem._id)
        ? selectedFeatures.filter((sf) => sf._id !== featureItem._id)
        : [...selectedFeatures, featureItem]
    );
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
  };

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
        className={`bg-white flex flex-row ${
          currentView === "map"
            ? "fixed lg:top-24 top-[80px] left-0 right-0 w-full lg:w-[60%] lg:shadow-lg"
            : "mt-0 mb-7 relative w-full border-b border-[#F0F0F0]"
        } z-10  mx-auto  lg:rounded-2xl lg:border-none border-b border-[#F0F0F0] `}
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
          className="hidden lg:flex items-center justify-center border-r px-2 py-2 border-gray-200 cursor-pointer  "
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
            className="lg:hidden flex items-center justify-center cursor-pointer bg-[#262626] w-[40px] h-[40px] rounded-2xl mt-2 translate-x-3 mr-2 z-10"
          >
            <div className="ease-in-out hover:bg-[#F5F5F5] transition-all duration-300 p-2 rounded-lg">
              <img src="/trash-02.png" className="w-5 h-5" />
            </div>
          </div>
        )}

        <div className="flex-1 flex items-center relative overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex flex-row items-center overflow-x-auto scrollbar-hide w-full no-scrollbar px-3 py-2 gap-3 filter-scroll"
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
                className={`flex flex-row items-center cursor-pointer rounded-2xl px-3 py-2 whitespace-nowrap transition-colors duration-200 ${
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
            {t("allFilters")}
          </p>
        </div>
      </div>
    </>
  );
}
