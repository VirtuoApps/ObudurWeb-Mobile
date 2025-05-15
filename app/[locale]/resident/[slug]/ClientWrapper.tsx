"use client";

import React from "react";
import { HotelDataProvider } from "./hotelContext";
import { HotelResponse } from "./page";

export default function ClientWrapper({
  children,
  hotelData,
  locale,
}: {
  children: React.ReactNode;
  hotelData: HotelResponse;
  locale: string;
}) {
  return (
    <HotelDataProvider hotelData={hotelData} locale={locale}>
      {children}
    </HotelDataProvider>
  );
}
