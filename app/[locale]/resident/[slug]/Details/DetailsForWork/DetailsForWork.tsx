"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useHotelData } from "../../hotelContext";
import { LocalizedText } from "../../page";

export default function DetailsForWork() {
  const t = useTranslations("details");

  const { hotelData, locale } = useHotelData();

  const currentLocale = locale as keyof LocalizedText;

  const yesNo = {
    yes: currentLocale === "tr" ? "Evet" : "Yes",
    no: currentLocale === "tr" ? "Hayır" : "No",
  };

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

      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-12">
        {/* First Column */}
        <div className="flex flex-col md:gap-4 gap-2 sm:border-r">
          {/* Kimden */}
          {hotelData.hotelDetails.source ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("source", { default: "Kimden" })}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.source[currentLocale]}
              </span>
            </div>
          ) : null}

          {/* Kat Sayısı */}
          {hotelData.hotelDetails.floorCount !== undefined &&
          hotelData.hotelDetails.floorCount !== null ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("floorCount", { default: "Kat Sayısı" })}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.floorCount}
              </span>
            </div>
          ) : null}

          {/* Bina Yaşı */}
          {hotelData.hotelDetails.buildingAge !== undefined &&
          hotelData.hotelDetails.buildingAge !== null ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("buildingAge", { default: "Bina Yaşı" })}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.buildingAge}
              </span>
            </div>
          ) : null}
        </div>

        {/* Second Column */}
        <div className="flex flex-col md:gap-4 gap-2 sm:border-r">
          {/* Kullanım Durumu */}
          {hotelData.hotelDetails.usageStatus ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("usageStatus", { default: "Kullanım Durumu" })}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.usageStatus[currentLocale]}
              </span>
            </div>
          ) : null}

          {/* Bölüm/Oda Sayısı */}
          {hotelData.hotelDetails.roomCount !== undefined &&
          hotelData.hotelDetails.roomCount !== null ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("roomCount", { default: "Bölüm/Oda Sayısı" })}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.roomCount}
              </span>
            </div>
          ) : null}

          {/* Isıtma */}
          {hotelData.hotelDetails.heatingType ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("heatingType", { default: "Isıtma" })}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.heatingType[currentLocale]}
              </span>
            </div>
          ) : null}
        </div>

        {/* Third Column */}
        <div className="flex flex-col md:gap-4 gap-2">
          {/* M2 */}
          {hotelData.hotelDetails.projectArea ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                M2:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.projectArea} m2
              </span>
            </div>
          ) : null}

          {/* Takaslı */}
          {hotelData.hotelDetails.exchangeable !== undefined &&
          hotelData.hotelDetails.exchangeable !== null ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("exchangeable", { default: "Takaslı" })}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {hotelData.hotelDetails.exchangeable ? yesNo.yes : yesNo.no}
              </span>
            </div>
          ) : null}

          {/* Aidat */}
          {hotelData.hotelDetails.dues ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-gray-600 sm:text-base text-xs">
                {t("dues", { default: "Aidat" })}:
              </span>
              <span className="font-semibold text-[#0F0F0F] sm:text-base text-xs">
                {Array.isArray(hotelData.hotelDetails.dues)
                  ? `${hotelData.hotelDetails.dues[0]?.amount || ""}₺`
                  : hotelData.hotelDetails.dues}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
