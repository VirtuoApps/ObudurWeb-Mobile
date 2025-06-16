import React, { useState, useRef } from "react";

import CategorySelect from "./CategorySelect/CategorySelect";
import { FilterOptions } from "@/types/filter-options.type";
import { FilterType } from "@/types/filter.type";
import LocationSelect from "./LocationSelect/LocationSelect";
import PropertyType from "./PropertyType/PropertyType";
import { useTranslations } from "next-intl";

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
  const propertyTypeRef = useRef<any>(null);

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

  // Emlak Tipi sıfırlanınca Kategori'yi de sıfırla
  const handlePropertyTypeSelect = (propertyType: any) => {
    setSelectedPropertyType(propertyType);
    if (!propertyType) {
      setSelectedCategory(null);
    }
  };

  // Kategoriye tıklanınca Emlak Tipi seçili değilse önce onu aç
  const handleCategoryButtonClick = () => {
    if (!selectedPropertyType && propertyTypeRef.current) {
      propertyTypeRef.current.openPopover?.();
    }
  };

  return (
    <div
      className={`
        ${
          isMobileMenu
            ? "flex flex-col w-full gap-3"
            : "flex items-center gap-2 border border-gray-100 px-[10px] rounded-lg min-w-0"
        }
      `}
    >
      {/* <div
        className={`relative flex rounded-md bg-gray-50 p-1 ${
          isMobileMenu ? "w-full" : "mr-2"
        }`}
      >
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#362C75] rounded transition-transform duration-300 ease-in-out ${
            listingType === "For Sale" ? "translate-x-0" : "translate-x-full"
          }`}
        />

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
      </div> */}
      
<div
  className={`relative flex rounded-md bg-gray-100 p-1 h-[36px] items-center shrink-0 ${
    isMobileMenu ? "w-full" : ""
  }`}
>
  {/* Sliding Background */}
  <div
    className={`absolute w-[calc(50%-4px)] bg-[#362C75] rounded-md transition-all duration-500 ease-in-out shadow-md h-[32px] ${
      listingType === "For Sale" ? "translate-x-0" : "translate-x-full"
    }`}
  />

  {/* For Sale Toggle Button */}
  <button
    className={`relative z-10 py-2 px-4 text-sm font-medium transition-all duration-500 ease-in-out cursor-pointer rounded-md flex-1 min-w-[60px] flex items-center justify-center ${
      listingType === "For Sale" 
        ? "text-white" 
        : "text-gray-600 hover:text-gray-800"
    }`}
    onClick={() => setListingType("For Sale")}
    aria-pressed={listingType === "For Sale"}
    role="switch"
  >
    <span className="transition-all duration-200 ease-in-out relative z-10">
      {t("forSale")}
    </span>
  </button>
  
  {/* For Rent Toggle Button */}
  <button
    className={`relative z-10 py-2 px-4 text-sm font-medium transition-all duration-500 ease-in-out cursor-pointer rounded-md flex-1 min-w-[60px] flex items-center justify-center ${
      listingType === "For Rent" 
        ? "text-white" 
        : "text-gray-600 hover:text-gray-800"
    }`}
    onClick={() => setListingType("For Rent")}
    aria-pressed={listingType === "For Rent"}
    role="switch"
  >
    <span className="transition-all duration-200 ease-in-out relative z-10">
      {t("forRent")}
    </span>
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

      <div className="bg-[#D9D9D9] w-[1px] h-[24px] flex-shrink-0"></div>

      {/* Emlak Tipi */}
      <PropertyType
        ref={propertyTypeRef}
        selectedPropertyType={selectedPropertyType}
        setSelectedPropertyType={handlePropertyTypeSelect}
        filterOptions={filterOptions}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="bg-[#D9D9D9] w-[1px] h-[24px] flex-shrink-0"></div>

      {/* Kategori */}
      <div onClick={handleCategoryButtonClick} style={{ width: '100%' }}>
        <CategorySelect
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filterOptions={filterOptions}
          selectedPropertyType={selectedPropertyType}
          setSelectedPropertyType={setSelectedPropertyType}
        />
      </div>

      {/* Search Button */}
      <button
        className={`bg-[#5E5691] text-white flex items-center justify-center shrink-0
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
