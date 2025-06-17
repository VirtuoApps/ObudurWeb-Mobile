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
import { generateRoomCountOptions } from "@/app/[locale]/admin/ilan-olustur/CreationSteps/SecondCreateStep/SecondCreateStep";

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
    neighborhood,
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

  let formattedPrice = "";
  if (currency === "TRY") {
    formattedPrice = `${mainPrice.toLocaleString("tr-TR")} ₺`;
  } else {
    formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(mainPrice);
  }

  return (
    <div className="max-w-5xl mx-auto font-sans">
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
              neighborhood: hotelData.hotelDetails.neighborhood,
              postalCode: hotelData.hotelDetails.postalCode,
              country: hotelData.hotelDetails.country,
            })}
          </span>
        </div>
      </div>

      {/* Separator Line */}
      {iconsToDisplay.length >= 6 && (
        <div className="border-b border-gray-200 mt-3 sm:mt-6"></div>
      )}

      {/* Features Icons Row - Scrollable on mobile */}
      {iconsToDisplay.length >= 6 && (
        <div className="flex overflow-x-auto mt-6 justify-between no-scrollbar">
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
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 11.0909V2H2V11.0909M22 11.0909H17.4545M22 11.0909V22H11.0909M11.0909 22H2V11.0909M11.0909 22V20.1818M11.0909 11.0909H12.9091M11.0909 11.0909H8.36364M11.0909 11.0909V15.6364M2 11.0909H3.81818"
                  stroke="#262626"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>
                {
                  generateRoomCountOptions().find(
                    (option) => option.value === roomCount
                  )?.label
                }
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#262626] border-r  pr-4 border-l border-[#D9D9D9] pl-4 whitespace-nowrap w-[33%] sm:w-auto flex items-center justify-center">
              <svg
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_14835_6955)">
                  <path
                    d="M20 10.1336C20 9.64469 19.8333 9.23357 19.5 8.90024C19.1667 8.56691 18.7556 8.40024 18.2667 8.40024H3.13333V3.00024C3.13333 2.5558 3.28889 2.17802 3.6 1.86691C3.82222 1.64469 4.07778 1.51135 4.36667 1.46691C4.65556 1.42246 4.95556 1.44468 5.26667 1.53358C4.86667 2.1558 4.71111 2.84469 4.8 3.60024C4.88889 4.3558 5.2 5.00024 5.73333 5.53358L5.86667 5.73357C6 5.82246 6.14444 5.86691 6.3 5.86691C6.45556 5.86691 6.57778 5.82246 6.66667 5.73357L10.4667 1.93357C10.6 1.80024 10.6667 1.6558 10.6667 1.50024C10.6667 1.34469 10.6 1.20024 10.4667 1.06691L10.3333 0.933575C9.75556 0.355797 9.05556 0.0446854 8.23333 0.000240326C7.41111 -0.0442028 6.68889 0.178019 6.06667 0.666908C5.53333 0.355797 4.95556 0.233574 4.33333 0.300241C3.71111 0.366907 3.17778 0.622463 2.73333 1.06691C2.2 1.60024 1.93333 2.24469 1.93333 3.00024V8.40024H1.73333C1.24444 8.40024 0.833333 8.56691 0.5 8.90024C0.166667 9.23357 0 9.64469 0 10.1336C0 10.5336 0.111111 10.878 0.333333 11.1669C0.555556 11.4558 0.822222 11.6669 1.13333 11.8002V13.0669C1.13333 14.1336 1.42222 15.1114 2 16.0002C2.57778 16.8891 3.31111 17.578 4.2 18.0669L3.66667 19.1336C3.57778 19.3114 3.56667 19.4669 3.63333 19.6002C3.7 19.7336 3.8 19.8447 3.93333 19.9336C4.06667 20.0225 4.21111 20.0336 4.36667 19.9669C4.52222 19.9002 4.64444 19.8002 4.73333 19.6669L5.33333 18.4669C5.77778 18.5558 6.24444 18.6002 6.73333 18.6002H13.2667C13.7556 18.6002 14.2222 18.5558 14.6667 18.4669L15.2667 19.6669C15.3556 19.8002 15.4778 19.9002 15.6333 19.9669C15.7889 20.0336 15.9333 20.0225 16.0667 19.9336C16.2 19.8447 16.3 19.7336 16.3667 19.6002C16.4333 19.4669 16.4222 19.3114 16.3333 19.1336L15.8 18.0669C16.6889 17.578 17.4222 16.8891 18 16.0002C18.5778 15.1114 18.8667 14.1336 18.8667 13.0669V11.8002C19.1778 11.6669 19.4444 11.4558 19.6667 11.1669C19.8889 10.878 20 10.5336 20 10.1336ZM9.2 1.53358L6.33333 4.46691C6.02222 4.02246 5.88889 3.5558 5.93333 3.06691C5.97778 2.57802 6.17778 2.1558 6.53333 1.80024C6.88889 1.44468 7.32222 1.24469 7.83333 1.20024C8.34445 1.1558 8.8 1.26691 9.2 1.53358ZM1.73333 9.60024H18.2667C18.4 9.60024 18.5222 9.6558 18.6333 9.76691C18.7444 9.87802 18.8 10.0114 18.8 10.1669C18.8 10.3225 18.7444 10.4558 18.6333 10.5669C18.5222 10.678 18.4 10.7336 18.2667 10.7336H1.73333C1.6 10.7336 1.47778 10.678 1.36667 10.5669C1.25556 10.4558 1.2 10.3225 1.2 10.1669C1.2 10.0114 1.25556 9.87802 1.36667 9.76691C1.47778 9.6558 1.6 9.60024 1.73333 9.60024ZM17.6667 13.0669C17.6667 13.8669 17.4667 14.6002 17.0667 15.2669C16.6667 15.9336 16.1333 16.4669 15.4667 16.8669C14.8 17.2669 14.0667 17.4669 13.2667 17.4669H6.73333C5.93333 17.4669 5.2 17.2669 4.53333 16.8669C3.86667 16.4669 3.33333 15.9336 2.93333 15.2669C2.53333 14.6002 2.33333 13.8669 2.33333 13.0669V11.9336H17.6667V13.0669ZM8.46667 5.93357C8.46667 6.11135 8.52222 6.2558 8.63333 6.36691C8.74444 6.47802 8.87778 6.53358 9.03333 6.53358C9.18889 6.53358 9.32222 6.47802 9.43333 6.36691C9.54445 6.2558 9.6 6.11135 9.6 5.93357C9.6 5.7558 9.54445 5.61135 9.43333 5.50024C9.32222 5.38913 9.18889 5.33357 9.03333 5.33357C8.87778 5.33357 8.74444 5.38913 8.63333 5.50024C8.52222 5.61135 8.46667 5.7558 8.46667 5.93357ZM10.1333 4.26691C10.1333 4.44469 10.1889 4.58913 10.3 4.70024C10.4111 4.81135 10.5444 4.86691 10.7 4.86691C10.8556 4.86691 10.9889 4.81135 11.1 4.70024C11.2111 4.58913 11.2667 4.44469 11.2667 4.26691C11.2667 4.08913 11.2111 3.94468 11.1 3.83357C10.9889 3.72246 10.8556 3.66691 10.7 3.66691C10.5444 3.66691 10.4111 3.72246 10.3 3.83357C10.1889 3.94468 10.1333 4.08913 10.1333 4.26691ZM10.5333 6.33357C10.5333 6.46691 10.5889 6.60024 10.7 6.73357C10.8111 6.86691 10.9444 6.93357 11.1 6.93357C11.2556 6.93357 11.3889 6.86691 11.5 6.73357C11.6111 6.60024 11.6667 6.4558 11.6667 6.30024C11.6667 6.14469 11.6111 6.01135 11.5 5.90024C11.3889 5.78913 11.2556 5.73357 11.1 5.73357C10.9444 5.73357 10.8111 5.78913 10.7 5.90024C10.5889 6.01135 10.5333 6.1558 10.5333 6.33357Z"
                    fill="#262626"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_14835_6955">
                    <rect
                      width={20}
                      height={20}
                      fill="white"
                      transform="matrix(1 0 0 -1 0 20)"
                    />
                  </clipPath>
                </defs>
              </svg>

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
                neighborhood: hotelData.hotelDetails.neighborhood,
                postalCode: hotelData.hotelDetails.postalCode,
                country: hotelData.hotelDetails.country,
              })}
            </span>
          </div>
        </div>
      )}

      {entranceType.tr === "Arsa" && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-2">
          <div className="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar justify-between sm:justify-start">
            <div className="flex items-center gap-2 text-[#262626] whitespace-nowrap">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 4H10M14 4H16M20 8V10M20 14V16M16 20H14M10 20H8M4 16V14M4 10V8M5 20C5 20.5523 4.55228 21 4 21C3.44772 21 3 20.5523 3 20C3 19.4477 3.44772 19 4 19C4.55228 19 5 19.4477 5 20ZM5 4C5 4.55228 4.55228 5 4 5C3.44772 5 3 4.55228 3 4C3 3.44772 3.44772 3 4 3C4.55228 3 5 3.44772 5 4ZM21 4C21 4.55228 20.5523 5 20 5C19.4477 5 19 4.55228 19 4C19 3.44772 19.4477 3 20 3C20.5523 3 21 3.44772 21 4ZM21 20C21 20.5523 20.5523 21 20 21C19.4477 21 19 20.5523 19 20C19 19.4477 19.4477 19 20 19C20.5523 19 21 19.4477 21 20Z"
                  stroke="#262626"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>{projectArea}m²</span>
            </div>

            <div className="flex items-center gap-2 text-[#262626] whitespace-nowrap">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 4H10M14 4H16M20 8V10M20 14V16M16 20H14M10 20H8M4 16V14M4 10V8M9.84244 9.72727C10.2461 8.15888 11.6697 7 13.3639 7C15.3721 7 17 8.62806 17 10.6364C17 12.2375 15.9653 13.597 14.528 14.0824M5 20C5 20.5523 4.55228 21 4 21C3.44772 21 3 20.5523 3 20C3 19.4477 3.44772 19 4 19C4.55228 19 5 19.4477 5 20ZM5 4C5 4.55228 4.55228 5 4 5C3.44772 5 3 4.55228 3 4C3 3.44772 3.44772 3 4 3C4.55228 3 5 3.44772 5 4ZM21 4C21 4.55228 20.5523 5 20 5C19.4477 5 19 4.55228 19 4C19 3.44772 19.4477 3 20 3C20.5523 3 21 3.44772 21 4ZM21 20C21 20.5523 20.5523 21 20 21C19.4477 21 19 20.5523 19 20C19 19.4477 19.4477 19 20 19C20.5523 19 21 19.4477 21 20ZM14.2721 13.3636C14.2721 15.3719 12.6442 17 10.6361 17C8.62792 17 7 15.3719 7 13.3636C7 11.3553 8.62792 9.72727 10.6361 9.72727C12.6442 9.72727 14.2721 11.3553 14.2721 13.3636Z"
                  stroke="#262626"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>
                {Math.round(price[0]?.amount / projectArea).toLocaleString(
                  "tr-TR"
                )}{" "}
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
                neighborhood: hotelData.hotelDetails.neighborhood,
                postalCode: hotelData.hotelDetails.postalCode,
                country: hotelData.hotelDetails.country,
              })}
            </span>
          </div>
        </div>
      )}

      {entranceType.tr === "İş Yeri" && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-2">
          <div className="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar justify-between sm:justify-start">
            <div className="flex items-center gap-2 text-[#262626] whitespace-nowrap">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 11.0909V2H2V11.0909M22 11.0909H17.4545M22 11.0909V22H11.0909M11.0909 22H2V11.0909M11.0909 22V20.1818M11.0909 11.0909H12.9091M11.0909 11.0909H8.36364M11.0909 11.0909V15.6364M2 11.0909H3.81818"
                  stroke="#262626"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>{roomCount} Bölüm</span>
            </div>

            <div className="flex items-center gap-2 text-[#262626] whitespace-nowrap">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 4H10M14 4H16M20 8V10M20 14V16M16 20H14M10 20H8M4 16V14M4 10V8M5 20C5 20.5523 4.55228 21 4 21C3.44772 21 3 20.5523 3 20C3 19.4477 3.44772 19 4 19C4.55228 19 5 19.4477 5 20ZM5 4C5 4.55228 4.55228 5 4 5C3.44772 5 3 4.55228 3 4C3 3.44772 3.44772 3 4 3C4.55228 3 5 3.44772 5 4ZM21 4C21 4.55228 20.5523 5 20 5C19.4477 5 19 4.55228 19 4C19 3.44772 19.4477 3 20 3C20.5523 3 21 3.44772 21 4ZM21 20C21 20.5523 20.5523 21 20 21C19.4477 21 19 20.5523 19 20C19 19.4477 19.4477 19 20 19C20.5523 19 21 19.4477 21 20Z"
                  stroke="#262626"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>{projectArea}m²</span>
            </div>

            <div className="flex items-center gap-2 text-[#262626] whitespace-nowrap">
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 4H10M14 4H16M20 8V10M20 14V16M16 20H14M10 20H8M4 16V14M4 10V8M9.84244 9.72727C10.2461 8.15888 11.6697 7 13.3639 7C15.3721 7 17 8.62806 17 10.6364C17 12.2375 15.9653 13.597 14.528 14.0824M5 20C5 20.5523 4.55228 21 4 21C3.44772 21 3 20.5523 3 20C3 19.4477 3.44772 19 4 19C4.55228 19 5 19.4477 5 20ZM5 4C5 4.55228 4.55228 5 4 5C3.44772 5 3 4.55228 3 4C3 3.44772 3.44772 3 4 3C4.55228 3 5 3.44772 5 4ZM21 4C21 4.55228 20.5523 5 20 5C19.4477 5 19 4.55228 19 4C19 3.44772 19.4477 3 20 3C20.5523 3 21 3.44772 21 4ZM21 20C21 20.5523 20.5523 21 20 21C19.4477 21 19 20.5523 19 20C19 19.4477 19.4477 19 20 19C20.5523 19 21 19.4477 21 20ZM14.2721 13.3636C14.2721 15.3719 12.6442 17 10.6361 17C8.62792 17 7 15.3719 7 13.3636C7 11.3553 8.62792 9.72727 10.6361 9.72727C12.6442 9.72727 14.2721 11.3553 14.2721 13.3636Z"
                  stroke="#262626"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>
                {Math.round(price[0]?.amount / projectArea).toLocaleString(
                  "tr-TR"
                )}{" "}
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
                neighborhood: hotelData.hotelDetails.neighborhood,
                postalCode: hotelData.hotelDetails.postalCode,
                country: hotelData.hotelDetails.country,
              })}
            </span>
          </div>
        </div>
      )}

      <div className="border-b border-gray-200 mt-3 sm:mt-6"></div>
    </div>
  );
}
