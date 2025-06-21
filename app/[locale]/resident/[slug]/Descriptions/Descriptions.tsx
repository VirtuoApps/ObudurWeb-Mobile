"use client";

import { LocalizedText } from "../page";
import React from "react";
import { useHotelData } from "../hotelContext";
import { useTranslations } from "next-intl";

export default function Descriptions() {
  const t = useTranslations("residentMenu");

  const { hotelData, locale } = useHotelData();
  const currentLocale = locale as keyof LocalizedText;

  return (
    <div id="descriptions-section" className="max-w-5xl mx-auto">
      <p className="font-bold text-[#362C75] text-2xl">{t("descriptions")}</p>

      <div className="flex md:flex-row flex-col mt-8 gap-6">
        <div className="w-full">
          <p className="text-[#262626] text-base wrap-break-word whitespace-pre-line">
            {hotelData.hotelDetails.description[currentLocale]}
          </p>
        </div>
      </div>
    </div>
  );
}
