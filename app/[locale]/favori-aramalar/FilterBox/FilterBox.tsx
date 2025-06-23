"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SavedFilter } from "../../api/savedFilters";
import FilterEditPopup from "../FilterEditPopup/FilterEditPopup";
import { FilterOptions } from "@/types/filter-options.type";
import { Hotel } from "@/types/hotel.type";
import { Feature } from "@/types/feature.type";
import axiosInstance from "@/axios";
import { useLocale, useTranslations } from "next-intl";

interface FilterBoxProps {
  filter: SavedFilter;
  onUpdate?: () => void;
  onDelete?: () => void;
  filterOptions: FilterOptions;
  hotels: Hotel[];
  selectedCurrency: string;
  searchRadius: number;
  allQuickFilters: Feature[];
}

export default function FilterBox({
  filter,
  onUpdate,
  onDelete,
  filterOptions,
  hotels,
  selectedCurrency,
  searchRadius,
  allQuickFilters,
}: FilterBoxProps) {
  const router = useRouter();
  const [siteNotifications, setSiteNotifications] = useState(
    filter.enableNotifications
  );
  const [emailNotifications, setEmailNotifications] = useState(
    filter.enableMailNotifications
  );
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const selectedLanguage = useLocale();
  const t = useTranslations("savedSearchesPage");
  const tFilterBox = useTranslations("savedSearchesPage.filterBox");
  const tAdmin = useTranslations("adminInterface");

  // Format the date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return tFilterBox("oneDayAgo");
    return tFilterBox("daysAgo", { diffDays });
  };

  // Build category text
  const getCategoryText = () => {
    const categoryText = filter.categoryId
      ? tFilterBox("category")
      : tFilterBox("all");
    const propertyText = filter.propertyType || tFilterBox("all");
    return `${propertyText} - ${categoryText}`;
  };

  // Build location text
  const getLocationText = () => {
    return filter.selectedLocation?.name || tFilterBox("allLocations");
  };

  // Build filters text
  const getFiltersText = () => {
    const activeFilters: string[] = [];

    // Selected features
    if (filter.selectedFeatures?.length > 0) {
      filter.selectedFeatures.forEach((feature: any) => {
        const quickFilter = allQuickFilters.find(
          (qf) => qf._id === feature._id
        );
        if (quickFilter) {
          activeFilters.push(quickFilter.name[selectedLanguage as "tr" | "en"]);
        }
      });
    }

    // Price range
    if (filter.minPrice || filter.maxPrice) {
      const min = filter.minPrice || 0;
      const max = filter.maxPrice || "∞";
      activeFilters.push(tFilterBox("priceRange", { min, max }));
    }

    // Area range
    if (filter.minProjectArea || filter.maxProjectArea) {
      const min = filter.minProjectArea || 0;
      const max = filter.maxProjectArea || "∞";
      activeFilters.push(tFilterBox("areaRange", { min, max }));
    }

    // Room count
    if (filter.roomCount) {
      activeFilters.push(tFilterBox("roomCount", { count: filter.roomCount }));
    }

    // Bathroom count
    if (filter.bathroomCount) {
      activeFilters.push(
        tFilterBox("bathroomCount", { count: filter.bathroomCount })
      );
    }

    // Feature IDs count
    let featureCount = 0;
    if (filter.interiorFeatureIds?.length)
      featureCount += filter.interiorFeatureIds.length;
    if (filter.exteriorFeatureIds?.length)
      featureCount += filter.exteriorFeatureIds.length;
    if (filter.accessibilityFeatureIds?.length)
      featureCount += filter.accessibilityFeatureIds.length;
    if (filter.faceFeatureIds?.length)
      featureCount += filter.faceFeatureIds.length;
    if (filter.locationFeatureIds?.length)
      featureCount += filter.locationFeatureIds.length;

    if (featureCount > 0) {
      activeFilters.push(tFilterBox("plusFeatures", { count: featureCount }));
    }

    return activeFilters.length > 0
      ? activeFilters.join(", ")
      : tFilterBox("noFilter");
  };

  const handleViewResults = () => {
    router.push(`/?filterId=${filter._id}`);
  };

  const handleEditClick = () => {
    setIsEditPopupOpen(true);
  };

  const handleEditUpdate = () => {
    setIsEditPopupOpen(false);
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteFilter = async () => {
    setDeleteLoading(true);
    try {
      const response = await axiosInstance.delete(
        `/saved-filters/mine/${filter._id}`
      );

      if (response.status === 200) {
        setDeleteModalOpen(false);
        if (onDelete) {
          onDelete();
        }
      } else {
        console.error("Filter silme hatası");
      }
    } catch (error) {
      console.error("Filter silme hatası:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-4xl shadow-sm w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full pb-4 sm:pb-6 border-b border-[#F0F0F0] mb-4 sm:mb-6 p-4 sm:p-6 gap-2 sm:gap-0">
          <h2 className="text-[#262626] font-bold text-sm sm:text-base leading-[140%] tracking-normal">
            {filter.filterName}
          </h2>
          <p className="text-[#8C8C8C] font-normal text-xs sm:text-sm lg:text-base leading-[140%] tracking-normal">
            {formatDate(filter.createdAt)}
          </p>
        </div>

        {/* Details Section */}
        <div className="space-y-3 sm:space-y-2 pb-4 sm:pb-6 py-0 p-4 sm:p-6 border-b border-[#F0F0F0]">
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-0">
            <span className="text-[#262626] font-bold text-xs sm:text-sm leading-[140%] tracking-normal sm:min-w-[80px]">
              {tFilterBox("category")}:
            </span>
            <span className="text-gray-700 font-normal text-xs sm:text-sm leading-[140%] tracking-normal">
              {getCategoryText()}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-1 sm:gap-0">
            <span className="text-[#262626] font-bold text-xs sm:text-sm leading-[140%] tracking-normal sm:min-w-[80px]">
              {tFilterBox("location")}:
            </span>
            <span className="text-gray-700 font-normal text-xs sm:text-sm leading-[140%] tracking-normal">
              {getLocationText()}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-1 sm:gap-0">
            <span className="text-[#262626] font-bold text-xs sm:text-sm leading-[140%] tracking-normal sm:min-w-[80px]">
              {t("filters")}:
            </span>
            <span className="text-gray-700 font-normal text-xs sm:text-sm leading-[140%] tracking-normal">
              {getFiltersText()}
            </span>
          </div>
        </div>

        {/* Notification Preferences */}
        {/* <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 p-4 sm:p-6 border-b border-[#F0F0F0]">
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={siteNotifications}
                onChange={() => setSiteNotifications(!siteNotifications)}
                className="sr-only"
              />
              {siteNotifications ? (
                <svg
                  width="38"
                  height="22"
                  viewBox="0 0 42 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sm:w-[42px] sm:h-[24px]"
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="41"
                    height="23"
                    rx="8.5"
                    fill="#1EB173"
                    stroke="#F5F5F5"
                  />
                  <rect
                    x="19"
                    y="3"
                    width="20"
                    height="18"
                    rx="6"
                    fill="#FCFCFC"
                  />
                </svg>
              ) : (
                <svg
                  width="38"
                  height="22"
                  viewBox="0 0 42 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sm:w-[42px] sm:h-[24px]"
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="41"
                    height="23"
                    rx="8.5"
                    fill="#BFBFBF"
                    stroke="#F5F5F5"
                  />
                  <rect
                    x="3"
                    y="3"
                    width="20"
                    height="18"
                    rx="6"
                    fill="#FCFCFC"
                  />
                </svg>
              )}
            </label>
            <span className="text-[#262626] font-medium text-xs sm:text-sm lg:text-base leading-[140%] tracking-normal ml-3 sm:ml-4">
              Site içi bildirimler almak istiyorum
            </span>
          </div>

          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
                className="sr-only"
              />
              {emailNotifications ? (
                <svg
                  width="38"
                  height="22"
                  viewBox="0 0 42 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sm:w-[42px] sm:h-[24px]"
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="41"
                    height="23"
                    rx="8.5"
                    fill="#1EB173"
                    stroke="#F5F5F5"
                  />
                  <rect
                    x="19"
                    y="3"
                    width="20"
                    height="18"
                    rx="6"
                    fill="#FCFCFC"
                  />
                </svg>
              ) : (
                <svg
                  width="38"
                  height="22"
                  viewBox="0 0 42 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sm:w-[42px] sm:h-[24px]"
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="41"
                    height="23"
                    rx="8.5"
                    fill="#BFBFBF"
                    stroke="#F5F5F5"
                  />
                  <rect
                    x="3"
                    y="3"
                    width="20"
                    height="18"
                    rx="6"
                    fill="#FCFCFC"
                  />
                </svg>
              )}
            </label>
            <span className="text-[#262626] font-medium text-xs sm:text-sm lg:text-base leading-[140%] tracking-normal ml-3 sm:ml-4">
              E-Posta bildirimleri almak istiyorum
            </span>
          </div>
        </div> */}

        {/* Action Buttons */}
        <div className="flex flex-row gap-3 sm:gap-4 p-4 sm:p-6 pt-0 sm:justify-between">
          <button
            onClick={handleViewResults}
            className="hidden sm:flex flex-1 bg-[#5E5691] text-white font-medium text-sm sm:text-base leading-[140%] tracking-normal rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 items-center justify-center gap-2 hover:bg-[#504682] transition-colors sm:max-w-[263px] order-1 h-12 sm:h-14"
          >
            {tFilterBox("viewResults", { count: filter.resultCount || 0 })}
            <img src="/chevron-right.png" className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={handleViewResults}
            className="flex sm:hidden flex-1 bg-[#5E5691] text-white font-medium text-sm sm:text-base leading-[140%] tracking-normal rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 items-center justify-center gap-2 hover:bg-[#504682] transition-colors sm:max-w-[263px] order-1 h-12 sm:h-14"
          >
            {tFilterBox("results", { count: filter.resultCount || 0 })}
            <img src="/chevron-right.png" className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="flex gap-3 sm:gap-4 order-2 sm:order-2">
            <button
              onClick={handleEditClick}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 text-gray-700 font-medium text-sm sm:text-base leading-[140%] tracking-normal border border-[#BFBFBF] rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-colors sm:ml-auto h-12 sm:h-14 sm:w-[110px]"
            >
              {tFilterBox("edit")}
            </button>

            <button
              onClick={handleDeleteClick}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 bg-[#F24853] text-white font-medium text-sm sm:text-base leading-[140%] tracking-normal rounded-xl sm:rounded-2xl hover:bg-[#E03843] transition-colors h-12 sm:h-14 sm:w-[66px]"
            >
              {tFilterBox("delete")}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="bg-[#FCFCFC] p-6 max-w-md w-full rounded-3xl relative">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-bold  text-[#262626]">
                {tFilterBox("deleteSearchTitle")}
              </h3>

              <button
                className="cursor-pointer"
                onClick={() => setDeleteModalOpen(false)}
              >
                <img src="/close-button-ani.png" className="w-6 h-6" />
              </button>
            </div>
            <p className="mb-16 text-[#595959] font-bold text-base ">
              {tFilterBox("deleteSearchConfirm")}
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-2 border border-[#BFBFBF] text-[#262626] hover:bg-gray-100 transition w-1/2 rounded-2xl h-[54px]"
                onClick={() => {
                  setDeleteModalOpen(false);
                }}
                disabled={deleteLoading}
              >
                {tFilterBox("cancel")}
              </button>
              <button
                className="px-4 py-2 bg-[#F24853] text-white rounded-2xl hover:bg-red-700 transition w-1/2 h-[54px]"
                onClick={handleDeleteFilter}
                disabled={deleteLoading}
              >
                {deleteLoading ? tAdmin("loading") : tAdmin("delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Edit Popup */}
      <FilterEditPopup
        isOpen={isEditPopupOpen}
        onClose={() => setIsEditPopupOpen(false)}
        filter={filter}
        onUpdate={handleEditUpdate}
        filterOptions={filterOptions}
        hotels={hotels}
        selectedCurrency={selectedCurrency}
        searchRadius={searchRadius}
        allQuickFilters={allQuickFilters}
      />
    </>
  );
}
