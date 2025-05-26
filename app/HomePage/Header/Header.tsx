"use client";

import React, { useState } from "react";
import Image from "next/image";
import MiddleSearchBox from "./MiddleSearchBox/MiddlesearchBox";
import AuthBox from "./AuthBox/AuthBox";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { FaBars } from "react-icons/fa";
import { FilterType } from "@/types/filter.type";
import { FilterOptions } from "@/types/filter-options.type";

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
}) {
  const t = useTranslations("header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative border-b shadow-sm py-4 bg-white h-[80px] w-full px-0 md:px-0">
      <div className=" mx-auto flex flex-wrap items-center justify-between px-12">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/obudur-logo.png"
            alt="oBudur Logo"
            width={120}
            height={40}
            priority
          />
        </div>

        {/* Center Navigation - Hidden on mobile, shown on md and larger */}
        <div className="hidden md:flex md:flex-1 md:justify-center md:px-4 lg:px-8 ">
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

        {/* Right Side Items for Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <AuthBox />
          <LanguageSwitcher />
        </div>

        {/* Hamburger Menu Button for Mobile */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            <FaBars className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[80px] left-0 right-0 bg-white shadow-lg z-50 p-4 border-t">
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
