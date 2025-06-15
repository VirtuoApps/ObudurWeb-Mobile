import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface ListingTypePopupProps {
  isOpen: boolean;
  onClose: () => void;
  listingType: "For Sale" | "For Rent";
  setListingType: (listingType: "For Sale" | "For Rent") => void;
}

export default function ListingTypePopup({
  isOpen,
  onClose,
  listingType,
  setListingType,
}: ListingTypePopupProps) {
  // Early return if popup is not open – avoids rendering & event listeners
  if (!isOpen) return null;

  const t = useTranslations("listingType");

  // Local selected state so the change only applies when the user confirms
  const [selectedType, setSelectedType] = useState<"For Sale" | "For Rent">(
    listingType
  );

  // Drag to close state
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY === null) return;
    const deltaY = e.touches[0].clientY - touchStartY;
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (translateY > 100) {
      // If dragged down enough, close the popup
      onClose();
    }
    // Reset position
    setTranslateY(0);
    setTouchStartY(null);
  };

  // Keep local state in sync if the parent listingType changes while popup is open
  useEffect(() => {
    setSelectedType(listingType);
  }, [listingType]);

  const handleUpdate = () => {
    setListingType(selectedType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Bottom sheet */}
      <div
        className="relative w-full max-w-md bg-white rounded-t-2xl p-6 pb-8 shadow-xl"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: touchStartY ? "none" : "transform 0.3s ease-out",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <span className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-gray-300 rounded-full" />

        {/* Options */}
        <div className="">
          <label
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-colors duration-200 cursor-pointer ${
              selectedType === "For Sale"
                ? "border-[#362C75] bg-[#F5F3FF]"
                : "border-gray-200"
            }`}
            onClick={() => setSelectedType("For Sale")}
          >
            {/* Radio Icon */}
            {selectedType === "For Sale" ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="15"
                  height="15"
                  rx="7.5"
                  stroke="#362C75"
                />
                <circle cx="8" cy="8" r="5" fill="#362C75" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="15"
                  height="15"
                  rx="7.5"
                  stroke="#BFBFBF"
                />
              </svg>
            )}
            <span className="text-base font-medium text-[#262626]">
              {t("forSale") || "Satılık"}
            </span>
          </label>

          <label
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-colors duration-200 cursor-pointer mt-2 ${
              selectedType === "For Rent"
                ? "border-[#362C75] bg-[#F5F3FF]"
                : "border-gray-200"
            }`}
            onClick={() => setSelectedType("For Rent")}
          >
            {/* Radio Icon */}
            {selectedType === "For Rent" ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="15"
                  height="15"
                  rx="7.5"
                  stroke="#362C75"
                />
                <circle cx="8" cy="8" r="5" fill="#362C75" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="15"
                  height="15"
                  rx="7.5"
                  stroke="#BFBFBF"
                />
              </svg>
            )}
            <span className="text-base font-medium text-[#262626]">
              {t("forRent") || "Kiralık"}
            </span>
          </label>
        </div>

        {/* Confirm button */}
        <button
          className="mt-6 w-full bg-[#5E5691] text-white h-[54px] rounded-2xl font-semibold text-center"
          onClick={handleUpdate}
        >
          {"Güncelle"}
        </button>
      </div>
    </div>
  );
}
