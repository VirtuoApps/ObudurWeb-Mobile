"use client";

import { Feature, LocalizedText } from "../page";

import AreaIcon from "@/app/svgIcons/AreaIcon";
import BedIcon from "@/app/svgIcons/BedIcon";
import React from "react";
import { formatAddress } from "@/app/utils/addressFormatter";
import { infrastructureFeatures } from "@/app/utils/infrastructureFeatures";
import { useHotelData } from "../hotelContext";
import { useTranslations } from "next-intl";
import { views } from "@/app/utils/views";

interface FeatureIconProps {
  icon: React.ReactNode;
  label: string;
}

const FeatureIcon: React.FC<FeatureIconProps> = ({ icon, label }) => {
  return (
    <div className="flex flex-col items-center juce gap-1">
      <div className="text-gray-600">{icon}</div>
      <span className="text-xs sm:text-sm text-gray-600 text-center">
        {label}
      </span>
    </div>
  );
};

// Custom SVG icons
const VillaIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 21V8.5L12 4L21 8.5V21M4.5 12.5V19.5H9V12.5H4.5ZM10.5 12.5V19.5H13.5V12.5H10.5ZM15 12.5V19.5H19.5V12.5H15Z"
      stroke="#595959"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NewIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3V12M12 12V21M12 12H21M12 12H3"
      stroke="#595959"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const DesignIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 21L3 3M21 21V3M21 12H3M7 7.5H9M7 16.5H9M15 7.5H17M15 16.5H17"
      stroke="#595959"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const ParkingIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="6"
      width="18"
      height="12"
      rx="1"
      stroke="#595959"
      strokeWidth="1.2"
    />
    <path
      d="M7 10H10.5C11.3284 10 12 10.6716 12 11.5V11.5C12 12.3284 11.3284 13 10.5 13H7V10Z"
      stroke="#595959"
      strokeWidth="1.2"
    />
    <circle cx="6" cy="18" r="1" fill="#595959" />
    <circle cx="18" cy="18" r="1" fill="#595959" />
  </svg>
);

const PoolIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 19.4C5.66667 15.8 9.33333 15.8 12 17.5C14.6667 19.2 18.3333 18.6667 21 17.5"
      stroke="#595959"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M3 15.9C5.66667 12.3 9.33333 12.3 12 14C14.6667 15.7 18.3333 15.1667 21 14"
      stroke="#595959"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M3 12.4C5.66667 8.8 9.33333 8.8 12 10.5C14.6667 12.2 18.3333 11.6667 21 10.5"
      stroke="#595959"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M7 5V19.5"
      stroke="#595959"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M17 5V19.5"
      stroke="#595959"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <circle cx="7" cy="6" r="1.5" stroke="#595959" strokeWidth="1.2" />
    <circle cx="17" cy="6" r="1.5" stroke="#595959" strokeWidth="1.2" />
  </svg>
);

const SeaViewIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 12C2 12 5.5 7 12 7C18.5 7 22 12 22 12C22 12 18.5 17 12 17C5.5 17 2 12 2 12Z"
      stroke="#595959"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="3" stroke="#595959" strokeWidth="1.2" />
    <path
      d="M3 5L5 7"
      stroke="#595959"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M21 5L19 7"
      stroke="#595959"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const BathIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.5 12.5H20.5"
      stroke="#595959"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M5.5 12.5V10C5.5 8.11438 5.5 7.17157 6.08579 6.58579C6.67157 6 7.61438 6 9.5 6H10.5C12.3856 6 13.3284 6 13.9142 6.58579C14.5 7.17157 14.5 8.11438 14.5 10V12.5"
      stroke="#595959"
      strokeWidth="1.2"
    />
    <path
      d="M4.5 12.5V15.5C4.5 18.5 6.5 20.5 9.5 20.5H15C18 20.5 20 18.5 20 15.5V12.5"
      stroke="#595959"
      strokeWidth="1.2"
    />
    <path
      d="M10 10H14"
      stroke="#595959"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 21C16.9706 17 20 13.4183 20 10C20 6.13401 16.4183 3 12 3C7.58172 3 4 6.13401 4 10C4 13.4183 7.02944 17 12 21Z"
      stroke="#595959"
      strokeWidth="1.2"
    />
    <circle cx="12" cy="10" r="3" stroke="#595959" strokeWidth="1.2" />
  </svg>
);

export default function GeneralInfo() {
  const t = useTranslations("generalInfo");
  const propertyT = useTranslations("propertyTypes");
  const { hotelData, locale } = useHotelData();

  // Get current locale data
  const currentLocale = locale as keyof LocalizedText;

  // Extract hotel details
  const {
    title,
    price,
    no,
    address,
    roomAsText,
    totalSize,
    roomCount,
    bathroomCount,
    projectArea,
    entranceType,
  } = hotelData.hotelDetails;

  // Get general features for the icons
  const generalFeatures = hotelData.populatedData.generalFeatures;

  const quickFilters = hotelData.populatedData.quickFilters;

  // Prepare feature data for icon row
  const infrastructureData: Feature[] =
    (hotelData as any).infrastructureFeatureIds
      ?.map((id: string) => {
        const feature = (infrastructureFeatures as any)[id];
        if (!feature) return null;
        return {
          _id: id,
          name: { tr: feature.tr, en: feature.en },
          iconUrl: feature.image,
        } as Feature;
      })
      .filter((f: Feature | null): f is Feature => f !== null) || [];

  const viewData: Feature[] =
    (hotelData as any).viewIds
      ?.map((id: string) => {
        const view = (views as any)[id];
        if (!view) return null;
        return {
          _id: id,
          name: { tr: view.tr, en: view.en },
          iconUrl: view.image,
        } as Feature;
      })
      .filter((v: Feature | null): v is Feature => v !== null) || [];

  let iconsToDisplay: Feature[] =
    entranceType.tr === "Arsa"
      ? [...infrastructureData, ...viewData].slice(0, 6)
      : quickFilters.slice(0, 6);

  const insideFeatures = hotelData.populatedData.insideFeatures;

  const outsideFeatures = hotelData.populatedData.outsideFeatures;

  const allFeatures = [...insideFeatures, ...outsideFeatures];

  if (iconsToDisplay.length < 6) {
    iconsToDisplay = [
      ...iconsToDisplay,
      ...allFeatures.slice(0, 6 - iconsToDisplay.length),
    ];
  }

  //Remove the duplicates in iconsToDisplay
  iconsToDisplay = iconsToDisplay.filter(
    (feature, index, self) =>
      index === self.findIndex((t) => t._id === feature._id)
  );

  // Format price with currency
  const mainPrice = price[0]?.amount || 0;
  const currency = price[0]?.currency || "USD";
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(mainPrice);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-0 font-sans mb-0 md:mb-6">
      {/* Title and Price Section */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-row-reverse sm:flex-row  justify-between sm:items-start gap-3 sm:gap-0">
          <h1 className="md:text-4xl text-base   md:font-medium font-bold text-[#262626] order-2 sm:order-1 sm:max-w-2xl">
            {title[currentLocale]}
          </h1>

          <div className="text-left sm:text-right order-1 sm:order-2 flex justify-between sm:block items-center">
            <div className="text-gray-500 text-xs sm:text-sm hidden md:block">
              {t("listingNumber", { id: no.toString() })}
            </div>
            <div className="text-[#362C75] md:text-2xl sm:text-3xl font-bold">
              {formattedPrice}
            </div>
          </div>
        </div>

        <div className=" items-center gap-2 text-[#8C8C8C] text-sm sm:text-base flex md:hidden mt-4">
          <img src="/location-icon-v4.png" alt="location" className="w-4 h-4" />
          <span className="truncate">
            {formatAddress({
              street: hotelData.hotelDetails.address,
              buildingNo: hotelData.hotelDetails.buildingNo,
              apartmentNo: hotelData.hotelDetails.apartmentNo,
              city: hotelData.hotelDetails.city,
              state: hotelData.hotelDetails.state,
              postalCode: hotelData.hotelDetails.postalCode,
              country: hotelData.hotelDetails.country,
            })}
          </span>
        </div>
      </div>

      {/* Separator Line */}
      {iconsToDisplay.length >= 6 && (
        <div className="border-b border-gray-200 my-3 sm:my-6"></div>
      )}

      {/* Features Icons Row - Scrollable on mobile */}
      {iconsToDisplay.length >= 6 && (
        <div className="flex overflow-x-auto py-3 sm:py-4 justify-between no-scrollbar">
          <div
            className={`flex ${
              entranceType.tr === "Arsa" ? "gap-12" : "justify-between gap-4"
            }  min-w-full`}
          >
            {iconsToDisplay.map((feature, index) => (
              <FeatureIcon
                key={feature._id + index}
                icon={
                  <img
                    src={feature.iconUrl}
                    alt={feature.name[currentLocale]}
                    className="w-6 h-6"
                  />
                }
                label={feature.name[currentLocale]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Separator Line */}
      <div className="border-b border-gray-200 my-3 sm:my-6"></div>

      {/* Details Section */}
      {entranceType.tr !== "Arsa" && entranceType.tr !== "İş Yeri" && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-2">
          <div className="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar justify-between sm:justify-start">
            <div className="flex items-center gap-2 text-[#262626] whitespace-nowrap">
              <BedIcon />
              <span>{roomAsText}</span>
            </div>
            <div className="flex items-center gap-2 text-[#262626] border-r  pr-4 border-l border-[#D9D9D9] pl-4 whitespace-nowrap w-[33%] sm:w-auto flex items-center justify-center">
              <BathIcon />
              <span>{bathroomCount}</span>
            </div>
            <div className="flex items-center gap-2 text-[#262626] whitespace-nowrap">
              <AreaIcon />
              <span>{totalSize}m²</span>
            </div>
          </div>
          <div className=" items-center gap-2 text-[#262626] text-sm sm:text-base hidden md:flex">
            <LocationIcon />
            <span className="truncate">
              {formatAddress({
                street: hotelData.hotelDetails.address,
                buildingNo: hotelData.hotelDetails.buildingNo,
                apartmentNo: hotelData.hotelDetails.apartmentNo,
                city: hotelData.hotelDetails.city,
                state: hotelData.hotelDetails.state,
                postalCode: hotelData.hotelDetails.postalCode,
                country: hotelData.hotelDetails.country,
              })}
            </span>
          </div>
        </div>
      )}

      {(entranceType.tr === "Arsa" || entranceType.tr === "İş Yeri") && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-2">
          <div className="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar justify-between sm:justify-start">
            <div className="flex items-center gap-2 text-[#262626] whitespace-nowrap">
              <img src="/m2-icon.png" alt="area" className="w-6 h-6" />
              <span>{projectArea}m²</span>
            </div>

            <div className="flex items-center gap-2 text-[#262626] whitespace-nowrap">
              <img src="/area.png" alt="price" className="w-6 h-6" />
              <span>
                {(price[0]?.amount / projectArea)
                  .toFixed(2)
                  .split(".")
                  .join(",")}{" "}
                ₺/m²
              </span>
            </div>
          </div>
          <div className=" items-center gap-2 text-[#262626] text-sm sm:text-base hidden md:flex">
            <LocationIcon />
            <span className="truncate">
              {formatAddress({
                street: hotelData.hotelDetails.address,
                buildingNo: hotelData.hotelDetails.buildingNo,
                apartmentNo: hotelData.hotelDetails.apartmentNo,
                city: hotelData.hotelDetails.city,
                state: hotelData.hotelDetails.state,
                postalCode: hotelData.hotelDetails.postalCode,
                country: hotelData.hotelDetails.country,
              })}
            </span>
          </div>
        </div>
      )}

      <div className="border-b border-gray-200 my-3 sm:my-6"></div>
    </div>
  );
}
