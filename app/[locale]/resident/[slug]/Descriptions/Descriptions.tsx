"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useHotelData } from "../hotelContext";
import { LocalizedText } from "../page";

export default function Descriptions() {
  const t = useTranslations("residentMenu");

  const { hotelData, locale } = useHotelData();
  const currentLocale = locale as keyof LocalizedText;

  return (
    <div id="descriptions-section" className="max-w-5xl mx-auto p-4 mt-12">
      <p className="font-bold text-[#362C75] text-2xl">{t("descriptions")}</p>

      <div className="flex md:flex-row flex-col mt-8 gap-6">
        <div className="md:w-1/2 w-full">
          <p className="text-[#262626] text-base">
            {hotelData.hotelDetails.description[currentLocale]}
          </p>
        </div>
      </div>
    </div>
  );
}
