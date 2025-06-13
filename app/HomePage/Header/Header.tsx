"use client";

import React, { useState } from "react";

import AuthBox from "./AuthBox/AuthBox";
import { FaBars } from "react-icons/fa";
import { FilterOptions } from "@/types/filter-options.type";
import { FilterType } from "@/types/filter.type";
import Image from "next/image";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import MiddleSearchBox from "./MiddleSearchBox/MiddlesearchBox";
import MobileSearchBox from "./MobileSearchBox/MobileSearchBox";
import { useAppSelector } from "@/app/store/hooks";
import { useTranslations } from "next-intl";

export default function Header({
  setFilters,
  filterOptions,
  selectedLocation,
  selectedPropertyType,
  selectedCategory,
  listingType,
  setListingType,
  setSelectedPropertyType,
  setSelectedCategory,
  setSelectedLocation,
  searchRadius,
  setSearchRadius,
  setIsFilterPopupOpen,
}: {
  setFilters: (filters: FilterType) => void;
  filterOptions: FilterOptions;
  selectedLocation: any | null;
  selectedPropertyType: any | null;
  selectedCategory: any | null;
  listingType: "For Sale" | "For Rent";
  setListingType: (listingType: "For Sale" | "For Rent") => void;
  setSelectedPropertyType: (propertyType: any) => void;
  setSelectedCategory: (category: any) => void;
  setSelectedLocation: (location: any) => void;
  searchRadius?: number;
  setSearchRadius?: (radius: number) => void;
  setIsFilterPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const t = useTranslations("header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user } = useAppSelector((state) => state.user);

  return (
    <header className="relative border-none lg:border-solid lg:border-b lg:border-[#F0F0F0] py-4 bg-white h-[72px] lg:h-[96px] w-full px-0 xl:px-0 flex">
      <div className="w-full flex items-center justify-between px-4 sm:px-6 gap-3">
        {/* Logo */}
        <div className="xl:flex hidden items-center">
          <Image
            src="/obudur-logo.png"
            alt="oBudur Logo"
            width={144}
            height={32}
            priority
          />
        </div>

        <div className="xl:hidden flex items-center">
          <Image
            src="/obudur-icon.png"
            alt="oBudur Logo"
            width={28}
            height={28}
            priority
          />
        </div>

        {/* Center Navigation - Hidden on mobile, shown on md and larger */}
        <div className="hidden xl:flex flex-1 justify-center px-4">
          <MiddleSearchBox
            setFilters={setFilters}
            filterOptions={filterOptions}
            selectedLocation={selectedLocation}
            selectedPropertyType={selectedPropertyType}
            selectedCategory={selectedCategory}
            listingType={listingType}
            setListingType={setListingType}
            setSelectedPropertyType={setSelectedPropertyType}
            setSelectedCategory={setSelectedCategory}
            setSelectedLocation={setSelectedLocation}
            searchRadius={searchRadius}
            setSearchRadius={setSearchRadius}
          />
        </div>

        <div className="xl:hidden flex-1 items-center">
          <MobileSearchBox
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            listingType={listingType}
            setListingType={setListingType}
            setIsFilterPopupOpen={setIsFilterPopupOpen}
          />
        </div>

        {/* Right Side Items for Desktop */}
        <div className="hidden xl:flex items-center gap-3">
          <AuthBox />
          <LanguageSwitcher />
        </div>

        {/* Hamburger Menu Button for Mobile */}
        <div className="flex items-center xl:hidden">
          <AuthBox />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="xl:hidden absolute top-[80px] left-0 right-0 bg-white shadow-lg z-50 p-4 border-t">
          <div className="mb-4">
            <MiddleSearchBox
              setFilters={setFilters}
              isMobileMenu={true}
              filterOptions={filterOptions}
              selectedLocation={selectedLocation}
              selectedPropertyType={selectedPropertyType}
              selectedCategory={selectedCategory}
              listingType={listingType}
              setListingType={setListingType}
              setSelectedLocation={setSelectedLocation}
              setSelectedPropertyType={setSelectedPropertyType}
              setSelectedCategory={setSelectedCategory}
              searchRadius={searchRadius}
              setSearchRadius={setSearchRadius}
            />
          </div>
          <div className="flex flex-row justify-between gap-4">
            <AuthBox />
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
