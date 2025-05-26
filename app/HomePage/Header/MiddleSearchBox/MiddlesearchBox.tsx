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
      roomAsText: selectedCategory?.name || null,
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
      {/* Satılık / Kiralık */}
      <div className={`flex rounded-md  ${isMobileMenu ? "w-full" : "mr-2"}`}>
        <button
          className={`px-4 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer rounded-md w-[100px] ${
            listingType === "For Sale"
              ? "bg-[#362C75] text-white"
              : "bg-gray-50 text-gray-700"
          }`}
          onClick={() => setListingType("For Sale")}
        >
          {t("forSale")}
        </button>
        <button
          className={`px-4 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer rounded-md w-[100px] ${
            listingType === "For Rent"
              ? "bg-[#362C75] text-white"
              : "bg-gray-50 text-gray-700"
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

      <div className="bg-[#F5F5F5] w-[1px] h-[24px]"></div>

      {/* Emlak Tipi */}
      <PropertyType
        selectedPropertyType={selectedPropertyType}
        setSelectedPropertyType={setSelectedPropertyType}
        filterOptions={filterOptions}
      />

      <div className="bg-[#F5F5F5] w-[1px] h-[24px]"></div>

      {/* Kategori */}
      <CategorySelect
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filterOptions={filterOptions}
      />

      {/* Search Button */}
      <button
        className={`bg-[#5E5691] text-white px-6 py-1.5 rounded-md text-sm font-medium cursor-pointer ${
          isMobileMenu ? "w-full" : ""
        }`}
        onClick={onApplyFilters}
      >
        {filterT("search")}
      </button>
    </div>
  );
}
