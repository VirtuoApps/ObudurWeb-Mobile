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
import { useTranslations } from "next-intl";
import FilterPopup from "@/app/components/FilterPopup/FilterPopup";
import ListViewIcon from "@/app/svgIcons/ListViewIcon";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Feature } from "@/types/feature.type";
import { FilterOptions } from "@/types/filter-options.type";
import { FilterType } from "@/types/filter.type";
import NewFilterItem from "./NewFilterItem/NewFilterItem";
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
  allQuickFilters,
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
  allQuickFilters: Feature[];
}) {
  const t = useTranslations("filterList");
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
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
      />
      <div
        className={`bg-white flex flex-row ${
          currentView === "map"
            ? "fixed top-24 left-0 right-0 w-[60%] shadow-lg"
            : "mt-5 mb-7 relative w-full"
        } z-10  mx-auto  rounded-2xl`}
      >
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-23 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-lg border border-gray-200 shadow-md cursor-pointer"
          >
            <FiChevronRight className="text-gray-600 text-sm" />
          </button>
        )}

        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-10 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-lg border border-gray-200 shadow-md cursor-pointer"
          >
            <FiChevronLeft className="text-gray-600 text-sm" />
          </button>
        )}

        <div
          onClick={onChangeCurrentView}
          className="flex items-center justify-center border-r px-4 py-4 border-gray-200  cursor-pointer transition-all duration-200 hover:bg-[#F5F5F5] -2xl"
        >
          {currentView === "map" && <ListViewIcon />}
          {currentView !== "map" && (
            <img src="/map-icon.png" className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1 flex items-center relative overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex flex-row items-center overflow-x-auto scrollbar-hide w-full no-scrollbar px-3 py-2 gap-3"
          >
            <NewFilterItem filters={filters} setFilters={setFilters} />
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
                      ? filterItem.name.en
                      : String(filterItem.name)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className="flex justify-center items-center w-full md:w-auto px-3 border-l border-gray-200 cursor-pointer"
          onClick={() => setIsFilterPopupOpen(true)}
        >
          <p className="text-xs font-bold ml-1 md:ml-2 text-gray-600 whitespace-nowrap">
            {t("allFilters")}
          </p>
        </div>
      </div>
    </>
  );
}
