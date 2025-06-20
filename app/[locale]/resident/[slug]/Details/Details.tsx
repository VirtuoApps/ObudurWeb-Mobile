"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useHotelData } from "../hotelContext";
import { LocalizedText } from "../page";
import GeneralDetails from "./GeneralDetails/GeneralDetails";
import DetailsForLand from "./DetailsForLand/DetailsForLand";
import DetailsForWork from "./DetailsForWork/DetailsForWork";

export default function Details() {
  const t = useTranslations("details");

  const { hotelData, locale } = useHotelData();

  const currentLocale = locale as keyof LocalizedText;

  if (hotelData.hotelDetails.entranceType?.tr === "İş Yeri") {
    return <DetailsForWork />;
  }

  if (hotelData.hotelDetails.entranceType?.tr === "Arsa") {
    return <DetailsForLand />;
  }

  return <GeneralDetails />;
}
