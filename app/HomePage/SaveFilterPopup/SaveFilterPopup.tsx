import React, { useState } from "react";
import axiosInstance from "@/axios";
import { FilterType } from "@/types/filter.type";
import { Feature } from "@/types/feature.type";
import { useTranslations } from "next-intl";

interface SaveFilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    searchName: string;
    inAppNotifications: boolean;
    emailNotifications: boolean;
  }) => void;
  // Filter props
  filters: FilterType | null;
  listingType: "For Sale" | "For Rent";
  selectedLocation: any | null;
  selectedPropertyType: any | null;
  selectedCategory: any | null;
  minPrice: number | "";
  maxPrice: number | "";
  minArea: number | "";
  maxArea: number | "";
  roomCount: string;
  bathroomCount: string;
  selectedFeatures: Feature[];
  interiorFeatures: any[];
  selectedExteriorFeatures: any[];
  selectedAccessibilityFeatures: any[];
  selectedFaceFeatures: any[];
  resultCount: number;
}

export default function SaveFilterPopup({
  isOpen,
  onClose,
  onSave,
  filters,
  listingType,
  selectedLocation,
  selectedPropertyType,
  selectedCategory,
  minPrice,
  maxPrice,
  minArea,
  maxArea,
  roomCount,
  bathroomCount,
  selectedFeatures,
  interiorFeatures,
  selectedExteriorFeatures,
  selectedAccessibilityFeatures,
  selectedFaceFeatures,
  resultCount,
}: SaveFilterPopupProps) {
  const [searchName, setSearchName] = useState("");
  const t = useTranslations("filtering");
  const [inAppNotifications, setInAppNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = async () => {
    if (!searchName.trim()) return;

    setIsLoading(true);
    try {
      // Prepare the data according to CreateSavedFilterDto
      const filterData = {
        filterName: searchName,
        enableNotifications: inAppNotifications,
        enableMailNotifications: emailNotifications,
        listingType: listingType || null,
        state: filters?.state || null,
        propertyType:
          selectedPropertyType?.name || filters?.propertyType || null,
        propertyTypeId: selectedPropertyType?._id || null,
        roomAsText: filters?.roomAsText || null,
        categoryId: selectedCategory?._id || null,
        minPrice:
          minPrice !== "" ? Number(minPrice) : filters?.minPrice || null,
        maxPrice:
          maxPrice !== "" ? Number(maxPrice) : filters?.maxPrice || null,
        roomCount:
          roomCount !== "" ? Number(roomCount) : filters?.roomCount || null,
        bathroomCount:
          bathroomCount !== ""
            ? Number(bathroomCount)
            : filters?.bathroomCount || null,
        minProjectArea:
          minArea !== "" ? Number(minArea) : filters?.minProjectArea || null,
        maxProjectArea:
          maxArea !== "" ? Number(maxArea) : filters?.maxProjectArea || null,
        interiorFeatureIds:
          interiorFeatures.map((f) => f._id).length > 0
            ? interiorFeatures.map((f) => f._id)
            : filters?.interiorFeatureIds || null,
        exteriorFeatureIds:
          selectedExteriorFeatures.map((f) => f._id).length > 0
            ? selectedExteriorFeatures.map((f) => f._id)
            : filters?.exteriorFeatureIds || null,
        accessibilityFeatureIds:
          selectedAccessibilityFeatures.map((f) => f._id).length > 0
            ? selectedAccessibilityFeatures.map((f) => f._id)
            : filters?.accessibilityFeatureIds || null,
        faceFeatureIds:
          selectedFaceFeatures.map((f) => f._id).length > 0
            ? selectedFaceFeatures.map((f) => f._id)
            : filters?.faceFeatureIds || null,
        locationFeatureIds: null,
        isNewSelected: filters?.isNewSelected || null,
        isOnePlusOneSelected: filters?.isOnePlusOneSelected || null,
        isTwoPlusOneSelected: filters?.isTwoPlusOneSelected || null,
        isThreePlusOneSelected: filters?.isThreePlusOneSelected || null,
        selectedFeatures:
          selectedFeatures.length > 0
            ? selectedFeatures.map((feature) => ({
                _id: feature._id,
                name:
                  typeof feature.name === "string"
                    ? feature.name
                    : feature.name.tr || feature.name.en || "",
                iconUrl: feature.iconUrl || "",
                featureType: feature.featureType,
                createdAt: feature.createdAt || new Date().toISOString(),
                updatedAt: feature.updatedAt || new Date().toISOString(),
                __v: feature.__v || 0,
              }))
            : undefined,
        selectedLocation,
        resultCount,
      };

      // Remove null values to send only set filters
      const cleanedData = Object.entries(filterData).reduce(
        (acc, [key, value]) => {
          if (
            value !== null &&
            value !== undefined &&
            (Array.isArray(value) ? value.length > 0 : true)
          ) {
            acc[key] = value;
          }
          return acc;
        },
        {} as any
      );

      // Send POST request to save filter
      const response = await axiosInstance.post("/saved-filters/", cleanedData);

      if (response.data) {
        onSave({
          searchName,
          inAppNotifications,
          emailNotifications,
        });

        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Error saving filter:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePopup = () => {
    // Reset form
    setSearchName("");
    setInAppNotifications(false);
    setEmailNotifications(false);
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0  flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="bg-white rounded-3xl w-[416px] py-6 px-4 relative">
        {isSuccess ? (
          // Success view
          <>
            <div className="flex justify-between items-start mb-10">
              <h2 className="text-2xl font-bold text-[#262626]">
                {t("saved")}
              </h2>
              <button
                onClick={handleClosePopup}
                className="w-6 h-6 flex items-center justify-center cursor-pointer "
              >
                <img
                  src="/popup-close-icon.png"
                  alt="close"
                  className="w-6 h-6"
                />
              </button>
            </div>

            <div className=" space-y-2">
              <h2 className="text-[#262626] font-kumbh font-bold text-base leading-[140%] tracking-[0%] align-start">
                {t("saveSuccess.title")}
              </h2>
              <p className="text-[#595959] font-kumbh font-medium text-base leading-[140%] tracking-[0%] align-start">
                {t("saveSuccess.description")}
              </p>

              <button
                onClick={handleClosePopup}
                className="mt-8 py-4 px-16 rounded-2xl w-full text-white font-medium 
                         transition-colors cursor-pointer"
                style={{
                  backgroundColor: "#5E5691",
                }}
              >
                {t("close")}
              </button>
            </div>
          </>
        ) : (
          // Form view
          <>
            {/* Header */}
            <div className="px-4">
              <div className="flex justify-between items-start mb-10">
                <h2 className="text-2xl font-bold text-[#262626]">
                  {t("saveSearch")}
                </h2>
                <button
                  onClick={handleClosePopup}
                  className="w-6 h-6 flex items-center justify-center cursor-pointer "
                >
                  <img
                    src="/popup-close-icon.png"
                    alt="close"
                    className="w-6 h-6"
                  />
                </button>
              </div>

              {/* Search Name Section */}
              <div className="mb-10">
                <label className="block text-lg font-bold text-[#262626] mb-1">
                  {t("searchName")}
                </label>
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder={t("searchNamePlaceholder")}
                  className="w-full px-6 py-4 bg-[#FCFCFC] border border-[#D9D9D9] rounded-2xl 
                         text-[#8C8C8C] placeholder-[#8C8C8C] focus:outline-none focus:border-[#262626]
                         focus:text-[#262626] transition-colors"
                />
              </div>
            </div>
            {/* Notifications Section */}
            {/* <div className="mb-12">
              <h3 className="text-lg font-bold text-[#262626]">Bildirimler</h3>
              <p className="text-[#595959] text-sm mb-4 leading-relaxed">
                Arama kriterlerinize uygun yeni ilanları hemen öğrenmek için
                bildirimleri açabilirsiniz.
              </p>

              <div className="space-y-2">
                <label className="flex items-center cursor-pointer border border-[#F0F0F0] rounded-2xl p-4">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={inAppNotifications}
                      onChange={(e) => setInAppNotifications(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-colors ${
                        inAppNotifications
                          ? "border-[#262626] bg-[#262626]"
                          : "border-[#BFBFBF] bg-white"
                      }`}
                    >
                      {inAppNotifications && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="ml-4 text-[#595959] text-base">
                    Site içi bildirimler
                  </span>
                </label>

                <label className="flex items-center cursor-pointer border border-[#F0F0F0] rounded-2xl p-4">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-colors ${
                        emailNotifications
                          ? "border-[#262626] bg-[#262626]"
                          : "border-[#BFBFBF] bg-white"
                      }`}
                    >
                      {emailNotifications && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="ml-4 text-[#595959] text-base">
                    E-Posta bildirimleri
                  </span>
                </label>
              </div>
            </div> */}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleClosePopup}
                disabled={isLoading}
                className="flex-1 py-4 px-6 border-2 border-[#BFBFBF] rounded-2xl  h-[54px]
                         text-[#262626] font-medium hover:bg-gray-50 transition-colors cursor-pointer
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSave}
                disabled={!searchName || isLoading}
                className={`flex-1 py-4 px-6 rounded-2xl font-medium transition-colors cursor-pointer h-[54px] ${
                  searchName && !isLoading
                    ? "bg-[#5E5691] text-[#FCFCFC] hover:bg-[#5E5691]"
                    : "bg-[#F0F0F0] text-[#8C8C8C] cursor-not-allowed"
                }`}
              >
                {isLoading ? t("saving") : t("save")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
