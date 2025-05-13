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
}

export default function MiddleSearchBox({
  isMobileMenu = false,
  setFilters,
  filterOptions,
}: MiddleSearchBoxProps) {
  const t = useTranslations("listingType");
  const filterT = useTranslations("filter");
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState<any | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [listingType, setListingType] = useState<"For Sale" | "For Rent">(
    "For Sale"
  );

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
            : "flex items-center gap-2 border border-gray-100 px-4 py-2 rounded-lg"
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
      />

      {/* Emlak Tipi */}
      <PropertyType
        selectedPropertyType={selectedPropertyType}
        setSelectedPropertyType={setSelectedPropertyType}
        filterOptions={filterOptions}
      />

      {/* Kategori */}
      <CategorySelect
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        filterOptions={filterOptions}
      />

      {/* Search Button */}
      <button
        className={`bg-[#5E5691] text-white px-6 py-1.5 rounded-md text-sm font-medium ${
          isMobileMenu ? "w-full" : ""
        }`}
        onClick={onApplyFilters}
      >
        {filterT("search")}
      </button>
    </div>
  );
}
