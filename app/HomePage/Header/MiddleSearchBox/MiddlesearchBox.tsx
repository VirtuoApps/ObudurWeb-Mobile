import React, { useState } from "react";
import LocationSelect from "./LocationSelect/LocationSelect";
import PropertyType from "./PropertyType/PropertyType";
import CategorySelect from "./CategorySelect/CategorySelect";
import { useTranslations } from "next-intl";
import { FilterType } from "@/types/filter.type";
import { FilterOptions } from "@/types/filter-options.type";
interface MiddleSearchBoxProps {
  isMobileMenu?: boolean;
  setFilters: (filters: FilterType) => void;
  filterOptions: FilterOptions;
  selectedLocation: any | null;
  selectedPropertyType: any | null;
  selectedCategory: any | null;
  listingType: "For Sale" | "For Rent";
  setListingType: (listingType: "For Sale" | "For Rent") => void;
  setSelectedLocation: (location: any) => void;
  setSelectedPropertyType: (propertyType: any) => void;
  setSelectedCategory: (category: any) => void;
  searchRadius?: number;
  setSearchRadius?: (radius: number) => void;
}

export default function MiddleSearchBox({
  isMobileMenu = false,
  setFilters,
  filterOptions,
  selectedLocation,
  selectedPropertyType,
  selectedCategory,
  listingType,
  setListingType,
  setSelectedLocation,
  setSelectedPropertyType,
  setSelectedCategory,
  searchRadius,
  setSearchRadius,
}: MiddleSearchBoxProps) {
  const t = useTranslations("listingType");
  const filterT = useTranslations("filter");

  const onApplyFilters = () => {
    setFilters({
      listingType: listingType,
      state: selectedLocation?.name || null,
      propertyType: selectedPropertyType?.name || null,
      propertyTypeId: selectedPropertyType?._id || null,
      roomAsText: selectedCategory?.name || null,
      categoryId: selectedCategory?._id || null,
    });
  };

  return (
    <div
      className={`
        ${
          isMobileMenu
            ? "flex flex-col w-full gap-3"
            : "flex items-center gap-2 border border-gray-100 px-4  rounded-lg"
        }
      `}
    >
      {/* Satılık / Kiralık - Animated Switch */}
      <div
        className={`relative flex rounded-md bg-gray-50 p-1 ${
          isMobileMenu ? "w-full" : "mr-2"
        }`}
      >
        {/* Moving background */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#362C75] rounded transition-transform duration-300 ease-in-out ${
            listingType === "For Sale" ? "translate-x-0" : "translate-x-full"
          }`}
        />

        {/* Buttons */}
        <button
          className={`relative z-10 py-1.5 text-sm font-medium transition-colors duration-300 cursor-pointer rounded-lg flex-1 min-w-[100px] flex items-center justify-center h-[36px] w-[132px] ${
            listingType === "For Sale" ? "text-white" : "text-gray-700"
          }`}
          onClick={() => setListingType("For Sale")}
        >
          {t("forSale")}
        </button>
        <button
          className={`relative z-10 py-1.5 text-sm font-medium transition-colors duration-300 cursor-pointer rounded-lg flex-1 min-w-[100px] flex items-center justify-center h-[36px] w-[132px] ${
            listingType === "For Rent" ? "text-white" : "text-gray-700"
          }`}
          onClick={() => setListingType("For Rent")}
        >
          {t("forRent")}
        </button>
      </div>

      {/* Konum */}
      <LocationSelect
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        isMobileMenu={isMobileMenu}
        filterOptions={filterOptions}
        searchRadius={searchRadius}
        setSearchRadius={setSearchRadius}
      />

      <div className="bg-[#D9D9D9] w-[1px] h-[24px]"></div>

      {/* Emlak Tipi */}
      <PropertyType
        selectedPropertyType={selectedPropertyType}
        setSelectedPropertyType={setSelectedPropertyType}
        filterOptions={filterOptions}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="bg-[#D9D9D9] w-[1px] h-[24px]"></div>

      {/* Kategori */}
      <CategorySelect
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filterOptions={filterOptions}
        selectedPropertyType={selectedPropertyType}
        setSelectedPropertyType={setSelectedPropertyType}
      />

      {/* Search Button */}
      <button
        className={`bg-[#5E5691] text-white flex items-center justify-center
          text-center px-6 py-1.5 rounded-md text-sm font-medium cursor-pointer h-[36px] w-[80px] ${
            isMobileMenu ? "w-full" : ""
          }`}
        onClick={onApplyFilters}
      >
        {filterT("search")}
      </button>
    </div>
  );
}
