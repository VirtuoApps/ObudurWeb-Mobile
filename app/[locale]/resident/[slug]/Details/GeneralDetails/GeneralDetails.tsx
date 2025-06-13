"use client";

import { LocalizedText } from "../../page";
import React from "react";
import { useHotelData } from "../../hotelContext";
import { useTranslations } from "next-intl";

export default function GeneralDetails() {
  const t = useTranslations("details");

  const { hotelData, locale } = useHotelData();

  const currentLocale = locale as keyof LocalizedText;

  return (
    <section id="details-section" className="max-w-5xl mx-auto mt-12">
      <div className="header">
        <h2 className="font-semibold tracking-tight text-[#31286A] text-3xl md:text-2xl">
          {t("title")}
        </h2>
        <p className="max-w-2xl mt-2 leading-relaxed text-sm md:text-base text-gray-500">
          {t("description")}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 md:gap-8 gap-4 lg:gap-12">
        {/* First Column */}
        <div className="flex flex-col md:gap-4 gap-2 sm:border-r">
          {hotelData.hotelDetails.projectArea ? (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("projectArea")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.projectArea} m2
              </span>
            </div>
          ) : null}
          {hotelData.hotelDetails.totalSize ? (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("area")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.totalSize} m2
              </span>
            </div>
          ) : null}
          {hotelData.hotelDetails.buildYear ? (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("constructionYear")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.buildYear}
              </span>
            </div>
          ) : null}
          {hotelData.hotelDetails.architect ? (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("architect")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.architect}
              </span>
            </div>
          ) : null}

          {hotelData.hotelDetails?.floorType ? (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("floor")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails?.floorType?.[currentLocale]}
              </span>
            </div>
          ) : null}
          {hotelData.hotelDetails.entranceType ? (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("entrance")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.entranceType[currentLocale]}
              </span>
            </div>
          ) : null}
        </div>

        {/* Second Column */}
        <div className="flex flex-col md:gap-4 gap-2 sm:border-r">
          {hotelData.hotelDetails.kitchenType &&
          hotelData.hotelDetails.kitchenType[currentLocale] ? (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("kitchen")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.kitchenType[currentLocale]}
              </span>
            </div>
          ) : null}
          {hotelData.hotelDetails.roomCount ? (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("bedrooms")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.roomCount}
              </span>
            </div>
          ) : null}
          {hotelData.hotelDetails.bathroomCount ? (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("bathrooms")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.bathroomCount}
              </span>
            </div>
          ) : null}
          {hotelData.hotelDetails.balconyCount ? (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("balconies")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.balconyCount}
              </span>
            </div>
          ) : null}
          {hotelData.hotelDetails.housingType ? (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("propertyType")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.housingType[currentLocale]}
              </span>
            </div>
          ) : null}
          {hotelData.hotelDetails.listingType ? (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("listingType")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.listingType[currentLocale]}
              </span>
            </div>
          ) : null}
        </div>

        {/* Third Column */}
        <div className="hidden md:flex sm:flex-col flex-row flex-wrap md:gap-4 gap-2">
          {hotelData.hotelDetails?.floorType ? (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("floor")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails?.floorType?.[currentLocale]}
              </span>
            </div>
          ) : null}
          {hotelData.hotelDetails.housingType ? (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("propertyType")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.housingType[currentLocale]}
              </span>
            </div>
          ) : null}
          {hotelData.hotelDetails.entranceType ? (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("entrance")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.entranceType[currentLocale]}
              </span>
            </div>
          ) : null}
          {hotelData.hotelDetails.listingType ? (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("listingType")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.listingType[currentLocale]}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
