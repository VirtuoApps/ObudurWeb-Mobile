"use client";

import React from "react";
import { SavedFilter } from "../../api/savedFilters";

interface FilterBoxProps {
  filter: SavedFilter;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export default function FilterBox({
  filter,
  onUpdate,
  onDelete,
}: FilterBoxProps) {
  const [siteNotifications, setSiteNotifications] = React.useState(
    filter.enableNotifications
  );
  const [emailNotifications, setEmailNotifications] = React.useState(
    filter.enableMailNotifications
  );

  // Format the date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("tr-TR", options) + "'te kaydedildi";
  };

  // Build category text
  const getCategoryText = () => {
    const parts = [];
    if (filter.listingType) parts.push(filter.listingType);
    if (filter.state) parts.push(filter.state);
    if (filter.propertyType) parts.push(filter.propertyType);
    return parts.join(", ") || "-";
  };

  // Build location text
  const getLocationText = () => {
    if (filter.selectedLocation) {
      return filter.selectedLocation.name;
    }
    return "-";
  };

  // Build filters text
  const getFiltersText = () => {
    const filters = [];

    // Room selection
    if (filter.roomAsText) filters.push(filter.roomAsText);

    // Area
    if (filter.minProjectArea || filter.maxProjectArea) {
      if (filter.minProjectArea && filter.maxProjectArea) {
        filters.push(`${filter.minProjectArea}-${filter.maxProjectArea} m²`);
      } else if (filter.minProjectArea) {
        filters.push(`Min ${filter.minProjectArea} m²`);
      } else if (filter.maxProjectArea) {
        filters.push(`Max ${filter.maxProjectArea} m²`);
      }
    }

    // Price
    if (filter.minPrice || filter.maxPrice) {
      if (filter.minPrice && filter.maxPrice) {
        filters.push(
          `${filter.minPrice.toLocaleString(
            "tr-TR"
          )}-${filter.maxPrice.toLocaleString("tr-TR")} TL`
        );
      } else if (filter.minPrice) {
        filters.push(`Min ${filter.minPrice.toLocaleString("tr-TR")} TL`);
      } else if (filter.maxPrice) {
        filters.push(`Max ${filter.maxPrice.toLocaleString("tr-TR")} TL`);
      }
    }

    // Features
    if (filter.selectedFeatures && filter.selectedFeatures.length > 0) {
      const featureNames = filter.selectedFeatures
        .slice(0, 3)
        .map((f) => f.name);
      filters.push(...featureNames);

      if (filter.selectedFeatures.length > 3) {
        filters.push(`+${filter.selectedFeatures.length - 3} Filtre daha`);
      }
    }

    // Feature IDs count
    const featureCount =
      (filter.interiorFeatureIds?.length || 0) +
      (filter.exteriorFeatureIds?.length || 0) +
      (filter.accessibilityFeatureIds?.length || 0) +
      (filter.faceFeatureIds?.length || 0) +
      (filter.locationFeatureIds?.length || 0);

    if (featureCount > 0 && filter.selectedFeatures.length === 0) {
      filters.push(`${featureCount} özellik seçili`);
    }

    return filters.join(", ") || "-";
  };

  return (
    <div className="bg-white rounded-4xl shadow-sm w-full">
      {/* Header Section */}
      <div className="flex flex-row items-center justify-between w-full pb-6 border-b border-[#F0F0F0] mb-6 p-6">
        <h2 className="text-[#262626] font-bold text-base leading-[140%] tracking-normal align-middle">
          {filter.filterName}
        </h2>
        <p className="text-[#8C8C8C] font-normal text-base leading-[140%] tracking-normal align-middle mt-1">
          {formatDate(filter.createdAt)}
        </p>
      </div>

      {/* Details Section */}
      <div className="space-y-2 pb-6 py-0 p-6 border-b border-[#F0F0F0]">
        <div className="flex">
          <span className="text-[#262626] font-bold text-sm leading-[140%] tracking-normal align-middle min-w-[80px]">
            Kategori:
          </span>
          <span className="text-gray-700 font-normal text-sm leading-[140%] tracking-normal align-middle">
            {getCategoryText()}
          </span>
        </div>

        <div className="flex">
          <span className="text-[#262626] font-bold text-sm leading-[140%] tracking-normal align-middle min-w-[80px]">
            Konum:
          </span>
          <span className="text-gray-700 font-normal text-sm leading-[140%] tracking-normal align-middle">
            {getLocationText()}
          </span>
        </div>

        <div className="flex">
          <span className="text-[#262626] font-bold text-sm leading-[140%] tracking-normal align-middle min-w-[80px]">
            Filtreler:
          </span>
          <span className="text-gray-700 font-normal text-sm leading-[140%] tracking-normal align-middle">
            {getFiltersText()}
          </span>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-4 mb-8 p-6 border-b border-[#F0F0F0]">
        <div className="flex items-center ">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={siteNotifications}
              onChange={() => setSiteNotifications(!siteNotifications)}
              className="sr-only"
            />
            {siteNotifications ? (
              <svg
                width="42"
                height="24"
                viewBox="0 0 42 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
                width="42"
                height="24"
                viewBox="0 0 42 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
          <span className="text-[#262626] font-medium text-base leading-[140%] tracking-normal align-middle ml-4">
            Site içi bildirimler almak istiyorum
          </span>
        </div>

        <div className="flex items-center ">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
              className="sr-only"
            />
            {emailNotifications ? (
              <svg
                width="42"
                height="24"
                viewBox="0 0 42 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
                width="42"
                height="24"
                viewBox="0 0 42 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
          <span className="text-[#262626] font-medium text-base leading-[140%] tracking-normal align-middle ml-4">
            E-Posta bildirimleri almak istiyorum
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 p-6 pt-0">
        <button
          className="flex-1 bg-[#5E5691] text-white font-medium text-base leading-[140%] tracking-normal align-middle rounded-2xl px-6 py-4 flex items-center justify-center gap-2 hover:bg-[#504682] transition-colors max-w-[263px]"
          style={{ height: "56px" }}
        >
          Sonuçları Görüntüle ({filter.resultCount || 0})
          <img src="/chevron-right.png" className="w-6 h-6" />
        </button>

        <button
          onClick={onUpdate}
          className="px-6 py-4 text-gray-700 font-medium text-base leading-[140%] tracking-normal align-middle border border-[#BFBFBF] rounded-2xl hover:bg-gray-50 transition-colors ml-auto"
          style={{ width: "110px", height: "56px" }}
        >
          Düzenle
        </button>

        <button
          onClick={onDelete}
          className="px-6 py-4 bg-[#F24853] text-white font-medium text-base leading-[140%] tracking-normal align-middle rounded-2xl hover:bg-[#E03843] transition-colors"
          style={{ width: "66px", height: "56px" }}
        >
          Sil
        </button>
      </div>
    </div>
  );
}
