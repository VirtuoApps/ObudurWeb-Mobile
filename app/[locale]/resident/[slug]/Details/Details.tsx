"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useHotelData } from "../hotelContext";
import { LocalizedText } from "../page";

export default function Details() {
  const t = useTranslations("details");

  const { hotelData, locale } = useHotelData();

  const currentLocale = locale as keyof LocalizedText;

  return (
    <section id="details-section" className="max-w-5xl mx-auto p-4 mt-12">
      <div className="header">
        <h2 className="font-semibold tracking-tight text-[#31286A] text-3xl md:text-4xl">
          {t("title")}
        </h2>
        <p className="max-w-2xl mt-2 leading-relaxed text-sm md:text-base text-gray-500">
          {t("description")}
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 md:gap-8 gap-4 lg:gap-12">
        {/* First Column */}
        <div className="flex flex-col md:gap-4 gap-2 sm:border-r">
          <div className="flex items-baseline">
            <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
              {t("projectArea")}:
            </span>
            <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
              {hotelData.hotelDetails.projectArea} m2
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
              {t("area")}:
            </span>
            <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
              {hotelData.hotelDetails.totalSize} m2
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
              {t("constructionYear")}:
            </span>
            <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
              {hotelData.hotelDetails.buildYear}
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
              {t("architect")}:
            </span>
            <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
              Barry Allen
            </span>
            {/* TODO */}
          </div>

          {hotelData.hotelDetails?.floorType && (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("floor")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails?.floorType?.[currentLocale]}
              </span>
            </div>
          )}
          <div className="flex items-baseline">
            <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
              {t("entrance")}:
            </span>
            <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
              {hotelData.hotelDetails.entranceType[currentLocale]}
            </span>
          </div>
        </div>

        {/* Second Column */}
        <div className="flex flex-col md:gap-4 gap-2 sm:border-r">
          <div className="flex items-baseline">
            <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
              {t("kitchen")}:
            </span>
            <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
              {hotelData.hotelDetails.kitchenType[currentLocale]}
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
              {t("bedrooms")}:
            </span>
            <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
              {hotelData.hotelDetails.roomCount}
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
              {t("bathrooms")}:
            </span>
            <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
              {hotelData.hotelDetails.bathroomCount}
            </span>
          </div>
          {hotelData.hotelDetails.balconyCount && (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("balconies")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.balconyCount}
              </span>
            </div>
          )}
          <div className="flex items-baseline">
            <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
              {t("propertyType")}:
            </span>
            <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
              {hotelData.hotelDetails.housingType[currentLocale]}
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
              {t("listingType")}:
            </span>
            <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
              {hotelData.hotelDetails.listingType[currentLocale]}
            </span>
          </div>
        </div>

        {/* Third Column */}
        <div className="hidden md:flex sm:flex-col flex-row flex-wrap md:gap-4 gap-2">
          {hotelData.hotelDetails?.floorType && (
            <div className="flex items-baseline">
              <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("floor")}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails?.floorType?.[currentLocale]}
              </span>
            </div>
          )}
          <div className="flex items-baseline">
            <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
              {t("propertyType")}:
            </span>
            <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
              {hotelData.hotelDetails.housingType[currentLocale]}
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
              {t("entrance")}:
            </span>
            <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
              {hotelData.hotelDetails.entranceType[currentLocale]}
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="sm:w-32 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
              {t("listingType")}:
            </span>
            <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
              {hotelData.hotelDetails.listingType[currentLocale]}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
