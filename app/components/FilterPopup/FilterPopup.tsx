"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { RiWifiFill } from "react-icons/ri";
import { AiFillSafetyCertificate, AiOutlineFire } from "react-icons/ai";
import { BsTv, BsFillHouseFill } from "react-icons/bs";
import { ImSpoonKnife } from "react-icons/im";
import {
  FaTemperatureHigh,
  FaWarehouse,
  FaSwimmingPool,
  FaParking,
} from "react-icons/fa";
import {
  GiWashingMachine,
  GiClothes,
  GiGardeningShears,
  GiGate,
} from "react-icons/gi";
import {
  MdKitchen,
  MdWindow,
  MdFireplace,
  MdSecurity,
  MdBalcony,
  MdElevator,
} from "react-icons/md";
import { TbAirConditioning } from "react-icons/tb";
import { IoSchool, IoRestaurantOutline } from "react-icons/io5";
import { BiTrain, BiStore, BiHealth } from "react-icons/bi";
import { currencyOptions } from "../LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";
import { FilterOptions } from "@/types/filter-options.type";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  ChevronDownIcon as ChevronDownSolidIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/outline";
import { TagIcon } from "@heroicons/react/24/outline";

type FilterPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  listingType: "For Sale" | "For Rent";
  setListingType: (listingType: "For Sale" | "For Rent") => void;
  filterOptions: FilterOptions;
  selectedLocation: any;
  setSelectedLocation: (selectedLocation: any) => void;
  selectedPropertyType?: any | null;
  setSelectedPropertyType?: (propertyType: any) => void;
  selectedCategory?: any | null;
  setSelectedCategory?: (category: any) => void;
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
  selectedFeatures: any[];
  setSelectedFeatures: React.Dispatch<React.SetStateAction<any[]>>;
  selectedExteriorFeatures: any[];
  setSelectedExteriorFeatures: React.Dispatch<React.SetStateAction<any[]>>;
  currencyCode: string;
  setCurrencyCode: React.Dispatch<React.SetStateAction<string>>;
  interiorFeatures: any[];
  setInteriorFeatures: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function FilterPopup({
  isOpen,
  onClose,
  listingType,
  setListingType,
  filterOptions,
  selectedLocation,
  setSelectedLocation,
  selectedPropertyType,
  setSelectedPropertyType,
  selectedCategory,
  setSelectedCategory,
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
}: FilterPopupProps) {
  const t = useTranslations("filter");
  const listingTypeTranslations = useTranslations("listingType");

  const locale = useLocale();

  const locations = filterOptions.state.map((state) => ({
    name: (state as any)[locale],
    description: `${(state.cityOfTheState as any)[locale]}/${
      (state.countryOfTheState as any)[locale]
    }`,
    href: "#",
  }));

  const incrementValue = (
    setValue: React.Dispatch<React.SetStateAction<number | "">>,
    currentValue: number | ""
  ) => {
    setValue(currentValue === "" ? 1 : Number(currentValue) + 1);
  };

  const decrementValue = (
    setValue: React.Dispatch<React.SetStateAction<number | "">>,
    currentValue: number | ""
  ) => {
    if (currentValue === "" || Number(currentValue) <= 0) return;
    setValue(Number(currentValue) - 1);
  };

  const toggleFeature = (feature: any) => {
    setInteriorFeatures((prev: any[]) =>
      prev.some((f: any) => f._id === feature._id)
        ? prev.filter((f: any) => f._id !== feature._id)
        : [...prev, feature]
    );
  };

  const toggleExteriorFeature = (feature: any) => {
    setSelectedExteriorFeatures((prev: any[]) =>
      prev.some((f: any) => f._id === feature._id)
        ? prev.filter((f: any) => f._id !== feature._id)
        : [...prev, feature]
    );
  };

  const resetFeatures = () => {
    setInteriorFeatures([]);
  };

  const resetExteriorFeatures = () => {
    setSelectedExteriorFeatures([]);
  };

  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      const currency = currencyOptions.find(
        (option) => option.code === savedCurrency
      );
      if (currency?.symbol && currency.symbol !== currencyCode) {
        setCurrencyCode(currency.symbol);
      }
    }
  }, [currencyCode, setCurrencyCode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0"
        onClick={onClose}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto max-h-[90vh] flex flex-col">
        {/* Header - Fixed at top */}
        <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-700">{t("title")}</h2>
            <button
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={onClose}
            >
              <XMarkIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6 pt-3">
          <div className={`flex rounded-md  w-full `}>
            <button
              className={`px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer rounded-2xl w-1/2 ${
                listingType === "For Sale"
                  ? "bg-[#362C75] text-white"
                  : "bg-gray-50 text-gray-700"
              }`}
              onClick={() => setListingType("For Sale")}
            >
              {listingTypeTranslations("forSale")}
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer rounded-2xl w-1/2 ${
                listingType === "For Rent"
                  ? "bg-[#362C75] text-white"
                  : "bg-gray-50 text-gray-700"
              }`}
              onClick={() => setListingType("For Rent")}
            >
              {listingTypeTranslations("forRent")}
            </button>
          </div>

          {/* Location Section */}
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                {t("location") || "Location"}
              </h3>
              <button
                className="text-sm text-purple-600 hover:underline cursor-pointer"
                onClick={() => setSelectedLocation(null)}
              >
                {t("reset")}
              </button>
            </div>
            <div className="mt-3">
              <Popover className="relative w-full">
                {({ open }) => {
                  const [isOpen, setIsOpen] = useState(false);
                  const [searchQuery, setSearchQuery] = useState("");
                  const [showSearch, setShowSearch] = useState(true);
                  const buttonRef = useRef<HTMLButtonElement>(null);

                  useEffect(() => {
                    if (open !== isOpen) {
                      setIsOpen(open);
                    }
                  }, [open, isOpen]);

                  useEffect(() => {
                    if (!isOpen) {
                      setSearchQuery("");
                    }
                    if (isOpen && !showSearch) {
                      setShowSearch(true);
                    }
                  }, [isOpen, showSearch]);

                  const filteredLocations = locations.filter(
                    (location) =>
                      location.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      location.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  );

                  const handleLocationSelect = (location: any) => {
                    setSelectedLocation(location);
                    setShowSearch(false);
                    setIsOpen(false);
                    buttonRef.current?.click();
                  };

                  return (
                    <>
                      <PopoverButton
                        ref={buttonRef}
                        className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700"
                      >
                        <div className="flex items-center flex-1">
                          {isOpen && showSearch ? (
                            <>
                              <MagnifyingGlassIcon className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
                              <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={
                                  t("selectLocation") || "Search location"
                                }
                                className="outline-none w-full bg-transparent"
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                              />
                            </>
                          ) : (
                            <>
                              <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span className="truncate">
                                {selectedLocation
                                  ? `${selectedLocation.name}`
                                  : t("selectLocation") || "Select Location"}
                              </span>
                            </>
                          )}
                        </div>
                        <ChevronDownSolidIcon
                          className="h-5 w-5 text-gray-400 ml-2"
                          aria-hidden="true"
                        />
                      </PopoverButton>

                      <PopoverPanel className="absolute z-20 mt-2 w-full max-w-md py-1 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
                        <div className="w-full overflow-hidden rounded-xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
                          <div className="p-4">
                            {filteredLocations.length > 0 ? (
                              filteredLocations.map((location) => (
                                <div
                                  key={location.name}
                                  className="group relative flex gap-x-6 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                                  onClick={() => handleLocationSelect(location)}
                                >
                                  <div className="mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                    <MapPinIcon
                                      className="h-5 w-5 text-gray-600 group-hover:text-indigo-600"
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900">
                                      {location.name}
                                    </div>
                                    <p className="mt-1 text-gray-600">
                                      {location.description}
                                    </p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 text-center text-gray-500">
                                {t("notFound") || "No locations found"}
                              </div>
                            )}
                          </div>
                        </div>
                      </PopoverPanel>
                    </>
                  );
                }}
              </Popover>
            </div>
          </div>

          {/* Property Type Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                {t("estateType") || "Emlak Tipi"}
              </h3>
              <button
                className="text-sm text-purple-600 hover:underline cursor-pointer"
                onClick={() =>
                  setSelectedPropertyType && setSelectedPropertyType(null)
                }
              >
                {t("reset")}
              </button>
            </div>
            <div className="mt-3">
              <Popover className="relative w-full">
                {({ open }) => {
                  const [isOpen, setIsOpen] = useState(false);
                  const buttonRef = useRef<HTMLButtonElement>(null);

                  useEffect(() => {
                    if (open !== isOpen) {
                      setIsOpen(open);
                    }
                  }, [open, isOpen]);

                  const propertyTypes = filterOptions.housingType.map(
                    (propertyType) => ({
                      name: (propertyType as any)[locale],
                      href: "#",
                    })
                  );

                  const handlePropertyTypeSelect = (propertyType: any) => {
                    setSelectedPropertyType &&
                      setSelectedPropertyType(propertyType);
                    setIsOpen(false);
                    buttonRef.current?.click();
                  };

                  return (
                    <>
                      <PopoverButton
                        ref={buttonRef}
                        className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700"
                      >
                        <div className="flex items-center">
                          <HomeIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {selectedPropertyType
                              ? selectedPropertyType.name
                              : t("selectEstateType") || "Select Property Type"}
                          </span>
                        </div>
                        <ChevronDownSolidIcon
                          className="h-5 w-5 text-gray-400 ml-2"
                          aria-hidden="true"
                        />
                      </PopoverButton>

                      <PopoverPanel className="absolute z-20 mt-2 w-full max-w-md py-1 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
                        <div className="w-full overflow-hidden rounded-xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
                          <div className="p-4">
                            {propertyTypes.map((propertyType) => (
                              <div
                                key={propertyType.name}
                                className="group relative flex items-center gap-x-6 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                                onClick={() =>
                                  handlePropertyTypeSelect(propertyType)
                                }
                              >
                                <div className="mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                  <HomeIcon
                                    className="h-5 w-5 text-gray-600 group-hover:text-indigo-600"
                                    aria-hidden="true"
                                  />
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {propertyType.name}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverPanel>
                    </>
                  );
                }}
              </Popover>
            </div>
          </div>

          {/* Category Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                {t("category") || "Kategori"}
              </h3>
              <button
                className="text-sm text-purple-600 hover:underline cursor-pointer"
                onClick={() => setSelectedCategory && setSelectedCategory(null)}
              >
                {t("reset")}
              </button>
            </div>
            <div className="mt-3">
              <Popover className="relative w-full">
                {({ open }) => {
                  const [isOpen, setIsOpen] = useState(false);
                  const buttonRef = useRef<HTMLButtonElement>(null);

                  useEffect(() => {
                    if (open !== isOpen) {
                      setIsOpen(open);
                    }
                  }, [open, isOpen]);

                  const categories = filterOptions.roomAsText.map(
                    (category) => ({
                      name: category,
                      href: "#",
                    })
                  );

                  const handleCategorySelect = (category: any) => {
                    setSelectedCategory && setSelectedCategory(category);
                    setIsOpen(false);
                    buttonRef.current?.click();
                  };

                  return (
                    <>
                      <PopoverButton
                        ref={buttonRef}
                        className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700"
                      >
                        <div className="flex items-center">
                          <TagIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {selectedCategory
                              ? selectedCategory.name
                              : t("selectCategory") || "Select Category"}
                          </span>
                        </div>
                        <ChevronDownSolidIcon
                          className="h-5 w-5 text-gray-400 ml-2"
                          aria-hidden="true"
                        />
                      </PopoverButton>

                      <PopoverPanel className="absolute z-20 mt-2 w-full max-w-md py-1 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
                        <div className="w-full overflow-hidden rounded-xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
                          <div className="p-4">
                            {categories.map((category) => (
                              <div
                                key={category.name}
                                className="group relative flex items-center gap-x-6 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleCategorySelect(category)}
                              >
                                <div className="mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                  <TagIcon
                                    className="h-5 w-5 text-gray-600 group-hover:text-indigo-600"
                                    aria-hidden="true"
                                  />
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {category.name}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverPanel>
                    </>
                  );
                }}
              </Popover>
            </div>
          </div>

          {/* Price Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                {t("priceLabel")} ({currencyCode})
              </h3>
              <button
                className="text-sm text-purple-600 hover:underline cursor-pointer"
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                }}
              >
                {t("reset")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="relative flex items-center">
                <input
                  value={minPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || !isNaN(Number(value))) {
                      setMinPrice(value === "" ? "" : Number(value));
                    }
                  }}
                  placeholder={t("minValue")}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="absolute right-2 flex flex-col">
                  <button
                    onClick={() => incrementValue(setMinPrice, minPrice)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronUpIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => decrementValue(setMinPrice, minPrice)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="relative flex items-center">
                <input
                  value={maxPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || !isNaN(Number(value))) {
                      setMaxPrice(value === "" ? "" : Number(value));
                    }
                  }}
                  placeholder={t("maxValue")}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="absolute right-2 flex flex-col">
                  <button
                    onClick={() => incrementValue(setMaxPrice, maxPrice)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronUpIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => decrementValue(setMaxPrice, maxPrice)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Room Count Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                {t("rooms")}
              </h3>
              <button
                className="text-sm text-purple-600 hover:underline cursor-pointer"
                onClick={() => setRoomCount("")}
              >
                {t("reset")}
              </button>
            </div>
            <div className="mt-3">
              <Popover className="relative w-full">
                {({ open }) => {
                  const [isOpen, setIsOpen] = useState(false);
                  const buttonRef = useRef<HTMLButtonElement>(null);

                  useEffect(() => {
                    if (open !== isOpen) {
                      setIsOpen(open);
                    }
                  }, [open, isOpen]);

                  const roomOptions = filterOptions.roomCount.map((room) => ({
                    name: room,
                    href: "#",
                  }));

                  const handleRoomSelect = (room: any) => {
                    setRoomCount(room.name);
                    setIsOpen(false);
                    buttonRef.current?.click();
                  };

                  return (
                    <>
                      <PopoverButton
                        ref={buttonRef}
                        className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700"
                      >
                        <div className="flex items-center">
                          <HomeIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {roomCount
                              ? roomCount
                              : t("roomsSelect") || "Select Room Count"}
                          </span>
                        </div>
                        <ChevronDownSolidIcon
                          className="h-5 w-5 text-gray-400 ml-2"
                          aria-hidden="true"
                        />
                      </PopoverButton>

                      <PopoverPanel className="absolute z-20 mt-2 w-full max-w-md py-1 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
                        <div className="w-full overflow-hidden rounded-xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
                          <div className="p-4">
                            {roomOptions.map((room) => (
                              <div
                                key={room.name}
                                className="group relative flex items-center gap-x-6 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleRoomSelect(room)}
                              >
                                <div className="mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                  <HomeIcon
                                    className="h-5 w-5 text-gray-600 group-hover:text-indigo-600"
                                    aria-hidden="true"
                                  />
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {room.name}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverPanel>
                    </>
                  );
                }}
              </Popover>
            </div>
          </div>

          {/* Bathroom Count Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                {t("bathrooms") || "Bathrooms"}
              </h3>
              <button
                className="text-sm text-purple-600 hover:underline cursor-pointer"
                onClick={() => setBathroomCount("")}
              >
                {t("reset")}
              </button>
            </div>
            <div className="mt-3">
              <Popover className="relative w-full">
                {({ open }) => {
                  const [isOpen, setIsOpen] = useState(false);
                  const buttonRef = useRef<HTMLButtonElement>(null);

                  useEffect(() => {
                    if (open !== isOpen) {
                      setIsOpen(open);
                    }
                  }, [open, isOpen]);

                  const bathroomOptions = filterOptions.bathroomCount.map(
                    (bathroom: number) => ({
                      name: bathroom.toString(),
                      href: "#",
                    })
                  );

                  const handleBathroomSelect = (bathroom: {
                    name: string;
                    href: string;
                  }) => {
                    setBathroomCount(bathroom.name);
                    setIsOpen(false);
                    buttonRef.current?.click();
                  };

                  return (
                    <>
                      <PopoverButton
                        ref={buttonRef}
                        className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700"
                      >
                        <div className="flex items-center">
                          <HomeIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {bathroomCount
                              ? bathroomCount
                              : t("bathroomsSelect") || "Select Bathroom Count"}
                          </span>
                        </div>
                        <ChevronDownSolidIcon
                          className="h-5 w-5 text-gray-400 ml-2"
                          aria-hidden="true"
                        />
                      </PopoverButton>

                      <PopoverPanel className="absolute z-20 mt-2 w-full max-w-md py-1 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
                        <div className="w-full overflow-hidden rounded-xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
                          <div className="p-4">
                            {bathroomOptions.map((bathroom) => (
                              <div
                                key={bathroom.name}
                                className="group relative flex items-center gap-x-6 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleBathroomSelect(bathroom)}
                              >
                                <div className="mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                  <HomeIcon
                                    className="h-5 w-5 text-gray-600 group-hover:text-indigo-600"
                                    aria-hidden="true"
                                  />
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {bathroom.name}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverPanel>
                    </>
                  );
                }}
              </Popover>
            </div>
          </div>

          {/* Area Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                {t("area")}
              </h3>
              <button
                className="text-sm text-purple-600 hover:underline cursor-pointer"
                onClick={() => {
                  setMinArea("");
                  setMaxArea("");
                }}
              >
                {t("reset")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="relative flex items-center">
                <input
                  value={minArea}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || !isNaN(Number(value))) {
                      setMinArea(value === "" ? "" : Number(value));
                    }
                  }}
                  placeholder={t("minValue")}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="absolute right-2 flex flex-col">
                  <button
                    onClick={() => incrementValue(setMinArea, minArea)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronUpIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => decrementValue(setMinArea, minArea)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="relative flex items-center">
                <input
                  value={maxArea}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || !isNaN(Number(value))) {
                      setMaxArea(value === "" ? "" : Number(value));
                    }
                  }}
                  placeholder={t("maxValue")}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="absolute right-2 flex flex-col">
                  <button
                    onClick={() => incrementValue(setMaxArea, maxArea)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronUpIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => decrementValue(setMaxArea, maxArea)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interior Features Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                {t("interiorFeatures")}
              </h3>
              <button
                className="text-sm text-purple-600 hover:underline cursor-pointer"
                onClick={resetFeatures}
              >
                {t("reset")}
              </button>
            </div>
            <div className="mt-3 overflow-y-auto max-h-48">
              <div className="flex flex-wrap gap-2 ">
                {filterOptions.interiorFeatures.map((feature) => {
                  const isSelected = interiorFeatures.find(
                    (f: any) => f._id === feature._id
                  );

                  return (
                    <button
                      key={feature._id}
                      onClick={() => toggleFeature(feature)}
                      className={`inline-flex items-center ${
                        isSelected
                          ? "bg-purple-100 border-purple-300 text-purple-700"
                          : "bg-white border-gray-100 text-gray-600"
                      } border rounded-full px-3 py-1 text-xs font-medium  cursor-pointer`}
                    >
                      <img src={feature.iconUrl} className="w-4 h-4 mr-2" />
                      {feature.name.tr}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Exterior Features Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                {t("exteriorFeatures") || "Dış Özellikler"}
              </h3>
              <button
                className="text-sm text-purple-600 hover:underline cursor-pointer"
                onClick={resetExteriorFeatures}
              >
                {t("reset")}
              </button>
            </div>
            <div className="mt-3 overflow-y-auto max-h-48">
              <div className="flex flex-wrap gap-2">
                {filterOptions.outsideFeatures.map((feature) => {
                  const isSelected = selectedExteriorFeatures.find(
                    (f: any) => f._id === feature._id
                  );

                  return (
                    <button
                      key={feature._id}
                      onClick={() => toggleExteriorFeature(feature)}
                      className={`inline-flex items-center ${
                        isSelected
                          ? "bg-purple-100 border-purple-300 text-purple-700"
                          : "bg-white border-gray-100 text-gray-600"
                      } border rounded-full px-3 py-1 text-xs font-medium cursor-pointer`}
                    >
                      <img src={feature.iconUrl} className="w-4 h-4 mr-2" />
                      {feature.name.tr}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Location Features Section */}

          {/* Add some bottom padding to prevent content from hiding behind the fixed footer */}
          <div className="pb-20"></div>
        </div>

        {/* Footer Buttons - Fixed at bottom */}
        <div className="sticky bottom-0 left-0 right-0 bg-white z-10 p-6 border-t border-gray-100 rounded-b-2xl">
          <div className="grid grid-cols-2 gap-4">
            <button
              className="w-full py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              onClick={() => {
                setMinPrice("");
                setMaxPrice("");
                setMinArea("");
                setMaxArea("");
                setRoomCount("");
                setBathroomCount("");
                setInteriorFeatures([]);
                setSelectedExteriorFeatures([]);
                setSelectedLocation(null);
                setSelectedPropertyType && setSelectedPropertyType(null);
                setSelectedCategory && setSelectedCategory(null);

                setFilters({
                  listingType: null,
                  state: null,
                  propertyType: null,
                  roomAsText: null,
                });

                onClose && onClose();
              }}
            >
              {t("clearAll")}
            </button>
            <button
              onClick={() => {
                setFilters({
                  listingType: listingType,
                  state: selectedLocation?.name || null,
                  propertyType: selectedPropertyType?.name || null,
                  roomAsText: selectedCategory?.name || null,
                  roomCount: roomCount,
                  bathroomCount: bathroomCount,
                  minProjectArea: minArea,
                  maxProjectArea: maxArea,
                  interiorFeatureIds: interiorFeatures.map((f: any) => f._id),
                  exteriorFeatureIds: selectedExteriorFeatures.map(
                    (f: any) => f._id
                  ),
                });
                onClose && onClose();
              }}
              className="w-full py-3 text-sm font-medium text-white bg-[#5E5691] rounded-lg cursor-pointer"
            >
              {t("apply")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
