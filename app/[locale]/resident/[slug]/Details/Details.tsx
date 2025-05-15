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

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {/* First Column */}
        <div className="flex flex-col gap-4 sm:border-r">
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              {t("projectArea")}:
            </span>
            <span className="font-semibold text-[#0F0F0F]">
              {hotelData.hotelDetails.projectArea} m2
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              {t("area")}:
            </span>
            <span className="font-semibold text-[#0F0F0F]">
              {hotelData.hotelDetails.totalSize} m2
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              {t("constructionYear")}:
            </span>
            <span className="font-semibold text-[#0F0F0F]">
              {hotelData.hotelDetails.buildYear}
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              {t("architect")}:
            </span>
            <span className="font-semibold text-[#0F0F0F]">Barry Allen</span>
            {/* TODO */}
          </div>
        </div>

        {/* Second Column */}
        <div className="flex flex-col gap-4 sm:border-r">
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              {t("kitchen")}:
            </span>
            <span className="font-semibold text-[#0F0F0F]">
              {hotelData.hotelDetails.kitchenType[currentLocale]}
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              {t("bedrooms")}:
            </span>
            <span className="font-semibold text-[#0F0F0F]">
              {hotelData.hotelDetails.roomCount}
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              {t("bathrooms")}:
            </span>
            <span className="font-semibold text-[#0F0F0F]">
              {hotelData.hotelDetails.bathroomCount}
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              {t("balconies")}:
            </span>
            <span className="font-semibold text-[#0F0F0F]">
              {hotelData.hotelDetails.balconyCount}
            </span>
          </div>
        </div>

        {/* Third Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              {t("floor")}:
            </span>
            <span className="font-semibold text-[#0F0F0F]">
              {hotelData.hotelDetails.floorType[currentLocale]}
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              {t("propertyType")}:
            </span>
            <span className="font-semibold text-[#0F0F0F]">
              {hotelData.hotelDetails.housingType[currentLocale]}
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              {t("entrance")}:
            </span>
            <span className="font-semibold text-[#0F0F0F]">
              {hotelData.hotelDetails.entranceType[currentLocale]}
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              {t("listingType")}:
            </span>
            <span className="font-semibold text-[#0F0F0F]">
              {hotelData.hotelDetails.listingType[currentLocale]}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
