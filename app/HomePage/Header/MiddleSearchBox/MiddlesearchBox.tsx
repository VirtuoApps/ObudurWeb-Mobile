import React, { useState } from "react";
import LocationSelect, { locations } from "./LocationSelect/LocationSelect";
import PropertyType, { propertyTypes } from "./PropertyType/PropertyType";
import CategorySelect, { categories } from "./CategorySelect/CategorySelect";
import { useTranslations } from "next-intl";

interface MiddleSearchBoxProps {
  isMobileMenu?: boolean;
}

export default function MiddleSearchBox({
  isMobileMenu = false,
}: MiddleSearchBoxProps) {
  const t = useTranslations("listingType");
  const filterT = useTranslations("filter");
  const [selectedLocation, setSelectedLocation] = useState<
    (typeof locations)[0] | null
  >(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState<
    (typeof propertyTypes)[0] | null
  >(null);
  const [selectedCategory, setSelectedCategory] = useState<
    (typeof categories)[0] | null
  >(null);
  const [listingType, setListingType] = useState<"forSale" | "forRent">(
    "forSale"
  );

  console.log(isMobileMenu);

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
            listingType === "forSale"
              ? "bg-[#362C75] text-white"
              : "bg-gray-50 text-gray-700"
          }`}
          onClick={() => setListingType("forSale")}
        >
          {t("forSale")}
        </button>
        <button
          className={`px-4 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer rounded-md w-[100px] ${
            listingType === "forRent"
              ? "bg-[#362C75] text-white"
              : "bg-gray-50 text-gray-700"
          }`}
          onClick={() => setListingType("forRent")}
        >
          {t("forRent")}
        </button>
      </div>

      {/* Konum */}
      <LocationSelect
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        isMobileMenu={isMobileMenu}
      />

      {/* Emlak Tipi */}
      <PropertyType
        selectedPropertyType={selectedPropertyType}
        setSelectedPropertyType={setSelectedPropertyType}
      />

      {/* Kategori */}
      <CategorySelect
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Search Button */}
      <button
        className={`bg-[#5E5691] text-white px-6 py-1.5 rounded-md text-sm font-medium ${
          isMobileMenu ? "w-full" : ""
        }`}
      >
        {filterT("search")}
      </button>
    </div>
  );
}
