"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { HotelResponse } from "./page";

// Create a context with hotel data and locale
interface HotelContextType {
  hotelData: HotelResponse;
  locale: string;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

// Provider component that wraps the parts of your app that need the hotel data
export function HotelDataProvider({
  children,
  hotelData,
  locale,
}: {
  children: ReactNode;
  hotelData: HotelResponse;
  locale: string;
}) {
  return (
    <HotelContext.Provider value={{ hotelData, locale }}>
      {children}
    </HotelContext.Provider>
  );
}

// Custom hook to use the hotel context
export function useHotelData() {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error("useHotelData must be used within a HotelDataProvider");
  }
  return context;
}
