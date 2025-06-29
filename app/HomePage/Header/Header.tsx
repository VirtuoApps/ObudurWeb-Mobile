"use client";

import { ArrowLeftIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AuthBox from "./AuthBox/AuthBox";
import { FaBars } from "react-icons/fa";
import { FilterOptions } from "@/types/filter-options.type";
import { FilterType } from "@/types/filter.type";
import Image from "next/image";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import MiddleSearchBox from "./MiddleSearchBox/MiddlesearchBox";
import MobileSearchBox from "./MobileSearchBox/MobileSearchBox";
import { setIsFilterApplied } from "@/app/store/favoritesSlice";
import { useAppSelector } from "@/app/store/hooks";
import { useDeviceDetection } from "@/app/store/useDeviceDetection";
import { useScrollDirection } from "../../hooks/useScrollDirection";
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
  setShowIsPersonalInformationFormPopup,
  resetFilters,
  disableMapListButton = false,
  setDisableMapListButton = () => {},
  setIsAuthMenuOpen = () => {},
  currentView,
  setIsSaveFilterSheetOpen,
  isSaveFilterSheetOpen,
  isSheetOpen,
  setIsSheetOpen,
  activeFiltersCount = 0,
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
  setShowIsPersonalInformationFormPopup: (show: boolean) => void;
  resetFilters?: any;
  disableMapListButton?: boolean;
  setDisableMapListButton?: (isOpen: boolean) => void;
  setIsAuthMenuOpen?: (isOpen: boolean) => void;
  currentView?: "map" | "list";
  setIsSaveFilterSheetOpen?: (isOpen: boolean) => void;
  isSaveFilterSheetOpen?: boolean;
  isSheetOpen?: boolean;
  setIsSheetOpen?: (isOpen: boolean) => void;
  activeFiltersCount?: number;
}) {
  const dispatch = useDispatch();
  const t = useTranslations("header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isFilterApplied = useSelector(
    (state: any) => state.favorites.isFilterApplied
  );
  const { user } = useAppSelector((state) => state.user);
  const isMobile = useSelector((state: any) => state.favorites.isMobile);
  const { scrollDirection, isScrolled } = useScrollDirection();
  useDeviceDetection();

  const filteringT = useTranslations("filtering");

  if (isFilterApplied && isMobile) {
    return (
      <>
        <header
          className={`${
            isFilterApplied ? "applied" : "not-applied"
          } relative border-none lg:border-solid lg:border-b lg:border-[#F0F0F0] py-0 lg:py-4 bg-white h-[72px] lg:h-[96px] w-full px-0 xl:px-0 ${
            isMobile ? "sticky top-0 z-40" : ""
          } z-50`}
        >
          <div className="w-full flex items-center px-4 sm:px-6 gap-3 z-50 py-3">
            <div className="xl:hidden flex items-center shrink-0 w-[32px]">
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  dispatch(setIsFilterApplied(false));
                }}
                className="bg-white hover:bg-gray-50 text-[#262626] w-[32px] h-[32px] font-semibold  inline-flex items-center justify-center gap-2 transition hover:border-[#6656AD] cursor-pointer rounded-[16px]"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="xl:hidden flex items-center justify-center flex-1 min-w-0">
              <Image
                src="/obudur-logo.png"
                alt="oBudur Logo"
                width={108}
                height={24}
                priority
              />
            </div>

            <div className="flex items-center xl:hidden shrink-0 z-50">
              <AuthBox
                disableMapListButton={disableMapListButton}
                setDisableMapListButton={setDisableMapListButton}
                setIsAuthMenuOpen={setIsAuthMenuOpen}
              />
            </div>
          </div>

          <div
            className={`bg-white flex flex-row transition-all duration-350 ease-in-out   mx-auto  lg:rounded-2xl border-y border-[#F0F0F0] `}
          >
            <div className="flex w-full h-[56px]">
              <button
                onClick={() => setIsFilterPopupOpen(true)}
                className="cursor-pointer grow shrink basis-0 text-[14px] font-medium text-[#595959] border-r border-[#F0F0F0]"
              >
                {filteringT("filters", { count: activeFiltersCount })}
              </button>
              <button
                onClick={() => setIsSaveFilterSheetOpen?.(true)}
                className="cursor-pointer grow shrink basis-0 text-[14px] font-medium text-[#595959]"
              >
                {filteringT("saveSearch")}
              </button>
              {currentView !== "map" && (
                <button
                  onClick={() => {
                    setIsSheetOpen?.(true);
                  }}
                  className="cursor-pointer grow shrink basis-0 text-[14px] font-medium text-[#595959] border-l border-[#F0F0F0]"
                >
                  <p className="text-sm text-gray-500 font-semibold">
                    {filteringT("sort")}
                  </p>
                </button>
              )}
            </div>
          </div>
        </header>
      </>
    );
  }

  return (
    <header
      className={`relative border-none lg:border-solid lg:border-b lg:border-[#F0F0F0] py-4 bg-white h-[72px] lg:h-[96px] w-full px-0 xl:px-0 flex ${
        isMobile ? "sticky top-0 z-40" : ""
      } z-50`}
    >
      <div className="w-full flex items-center px-4 sm:px-6 gap-3 z-50">
        {/* Logo - Sabit genişlik */}
        <div className="md:flex hidden items-center shrink-0 w-[144px]">
          <Image
            src="/obudur-logo.png"
            alt="oBudur Logo"
            width={144}
            height={32}
            priority
          />
        </div>

        <div className="md:hidden flex items-center shrink-0 w-[28px]">
          <Image
            src="/obudur-icon.png"
            alt="oBudur Logo"
            width={28}
            height={28}
            className="w-[28px] h-[32px] md:w-[28px] md:h-[28px]"
            priority
          />
        </div>

        {/* Center Navigation - Search alanı dinamik genişlik */}
        <div className="hidden xl:flex flex-1 justify-center min-w-0">
          <div className="w-full max-w-[max-content]">
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
        </div>

        <div className="xl:hidden flex-1 min-w-0 mx-3">
          <MobileSearchBox
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            listingType={listingType}
            setListingType={setListingType}
            setIsFilterPopupOpen={setIsFilterPopupOpen}
          />
        </div>

        {/* Right Side Items - Sabit genişlik */}
        <div className="hidden xl:flex items-center gap-3 shrink-0">
          <AuthBox
            setShowIsPersonalInformationFormPopup={
              setShowIsPersonalInformationFormPopup
            }
            disableMapListButton={disableMapListButton}
            setDisableMapListButton={setDisableMapListButton}
          />
          <LanguageSwitcher />
        </div>

        {/* Mobile Right Side - Sabit genişlik */}
        <div className="flex items-center xl:hidden shrink-0 z-50">
          <AuthBox
            disableMapListButton={disableMapListButton}
            setDisableMapListButton={setDisableMapListButton}
          />
          <div className="hidden lg:flex ml-2">
            <LanguageSwitcher />
          </div>
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
          <div className="flex flex-row justify-between gap-4 z-50">
            <AuthBox
              disableMapListButton={disableMapListButton}
              setDisableMapListButton={setDisableMapListButton}
            />
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
