"use client";

import { LocalizedText } from "../../page";
import React from "react";
import { useHotelData } from "../../hotelContext";
import { useTranslations } from "next-intl";

export default function DetailsForLand() {
  const t = useTranslations("details");

  const { hotelData, locale } = useHotelData();

  const currentLocale = locale as keyof LocalizedText;

  const yesNo = {
    yes: currentLocale === "tr" ? "Evet" : "Yes",
    no: currentLocale === "tr" ? "Hayır" : "No",
  };

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

      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-12">
        {/* First Column */}
        <div className="flex flex-col md:gap-3 gap-2 sm:border-r">
          {hotelData.hotelDetails.source ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-[#595959] sm:text-[14px] text-xs">
                {t("source", { default: "Kimden" })}:
              </span>
              <span className="font-bold text-[#0F0F0F] sm:text-[14px] text-xs">
                {hotelData.hotelDetails.source[currentLocale]}
              </span>
            </div>
          ) : null}

          {hotelData.hotelDetails.housingType ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-[#595959] sm:text-[14px] text-xs">
                {t("landType", { default: "Arsa Tipi" })}:
              </span>
              <span className="font-bold text-[#0F0F0F] sm:text-[14px] text-xs">
                {hotelData.hotelDetails.housingType[currentLocale]}
              </span>
            </div>
          ) : null}

          {hotelData.hotelDetails.listingType ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-[#595959] sm:text-[14px] text-xs">
                {t("listingType", { default: "İlan Türü" })}:
              </span>
              <span className="font-bold text-[#0F0F0F] sm:text-[14px] text-xs">
                {hotelData.hotelDetails.listingType[currentLocale]}
              </span>
            </div>
          ) : null}

          {hotelData.hotelDetails.creditEligible !== undefined &&
          hotelData.hotelDetails.creditEligible !== null ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-[#595959] sm:text-[14px] text-xs">
                {t("creditEligible", { default: "Krediye Uygun" })}:
              </span>
              <span className="font-bold text-[#0F0F0F] sm:text-[14px] text-xs">
                {hotelData.hotelDetails.creditEligible ? yesNo.yes : yesNo.no}
              </span>
            </div>
          ) : null}
        </div>

        {/* Second Column */}
        <div className="flex flex-col md:gap-3 gap-2 md:border-r">
          {hotelData.hotelDetails.generalFeatures ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-[#595959] sm:text-[14px] text-xs">
                {t("generalFeatures", { default: "Genel Özellikler" })}:
              </span>
              <span className="font-bold text-[#0F0F0F] sm:text-[14px] text-xs">
                {hotelData.hotelDetails.generalFeatures[currentLocale]}
              </span>
            </div>
          ) : null}

          {hotelData.hotelDetails.deedStatus ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-[#595959] sm:text-[14px] text-xs">
                {t("deedStatus", { default: "Tapu Durumu" })}:
              </span>
              <span className="font-bold text-[#0F0F0F] sm:text-[14px] text-xs">
                {hotelData.hotelDetails.deedStatus[currentLocale]}
              </span>
            </div>
          ) : null}

          {hotelData.hotelDetails.zoningStatus ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-[#595959] sm:text-[14px] text-xs">
                {t("zoningStatus", { default: "İmar Durumu" })}:
              </span>
              <span className="font-bold text-[#0F0F0F] sm:text-[14px] text-xs">
                {hotelData.hotelDetails.zoningStatus[currentLocale]}
              </span>
            </div>
          ) : null}
          {hotelData.hotelDetails.projectArea ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-[#595959] sm:text-[14px] text-xs">
                M2:
              </span>
              <span className="font-bold text-[#0F0F0F] sm:text-[14px] text-xs">
                {hotelData.hotelDetails.projectArea} m2
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col md:gap-4 gap-2">
          {hotelData.hotelDetails.adaNo ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-[#595959] sm:text-[14px] text-xs">
                {t("adaNo", { default: "Ada No" })}:
              </span>
              <span className="font-bold text-[#0F0F0F] sm:text-[14px] text-xs">
                {hotelData.hotelDetails.adaNo}
              </span>
            </div>
          ) : null}

          {hotelData.hotelDetails.parselNo ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-[#595959] sm:text-[14px] text-xs">
                {t("parselNo", { default: "Parsel No" })}:
              </span>
              <span className="font-bold text-[#0F0F0F] sm:text-[14px] text-xs">
                {hotelData.hotelDetails.parselNo}
              </span>
            </div>
          ) : null}

          {hotelData.hotelDetails.exchangeable !== undefined &&
          hotelData.hotelDetails.exchangeable !== null ? (
            <div className="flex items-baseline">
              <span className="sm:w-40 shrink-0 font-medium text-[#595959] sm:text-[14px] text-xs">
                {t("exchangeable", { default: "Takaslı" })}:
              </span>
              <span className="font-bold text-[#0F0F0F] sm:text-[14px] text-xs">
                {hotelData.hotelDetails.exchangeable ? yesNo.yes : yesNo.no}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
