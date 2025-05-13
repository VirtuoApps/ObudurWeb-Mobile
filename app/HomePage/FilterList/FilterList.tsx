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
const iconClassName = "text-xl";
const iconColor = "rgba(0,0,0,0.6)";

export default function FilterList({
  onChangeCurrentView,
  currentView,
  features,
  selectedFeatures,
  setSelectedFeatures,
}: {
  onChangeCurrentView: () => void;
  currentView: "map" | "list";
  features: Feature[];
  selectedFeatures: Feature[];
  setSelectedFeatures: (features: Feature[]) => void;
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
      />
      <div
        className={`bg-white flex flex-row ${
          currentView === "map"
            ? "fixed top-24 left-0 right-0"
            : "mt-5 mb-7 relative"
        } z-10 w-[60%] mx-auto shadow-lg rounded-2xl`}
      >
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-18 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-lg border border-gray-200 shadow-md cursor-pointer"
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
          className="flex items-center justify-center border-r px-4 py-4 border-gray-200  cursor-pointer transition-all duration-200 hover:bg-gray-100 -2xl"
        >
          <ListViewIcon />
        </div>
        <div className="flex-1 flex items-center relative overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex flex-row items-center overflow-x-auto scrollbar-hide w-full no-scrollbar px-3 py-2 gap-3"
          >
            {features.map((filterItem) => (
              <div
                key={filterItem._id}
                className={`flex flex-row items-center cursor-pointer rounded-lg px-3 py-2 whitespace-nowrap ${
                  selectedFeatures.some((sf) => sf._id === filterItem._id)
                    ? "bg-gray-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleFilterClick(filterItem)}
              >
                <img
                  src={filterItem.iconUrl}
                  alt={
                    typeof filterItem.name === "object"
                      ? filterItem.name.en
                      : String(filterItem.name)
                  }
                  className="w-8 h-8 object-contain"
                />
                <p
                  className={`text-xs ml-2 font-light ${
                    selectedFeatures.some((sf) => sf._id === filterItem._id)
                      ? "text-gray-500"
                      : "text-gray-500"
                  }`}
                >
                  {typeof filterItem.name === "object"
                    ? filterItem.name.en
                    : String(filterItem.name)}
                </p>
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
