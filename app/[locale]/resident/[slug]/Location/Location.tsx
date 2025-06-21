"use client";

import {
  FiActivity,
  FiAirplay,
  FiBook,
  FiBriefcase,
  FiCoffee,
  FiCreditCard,
  FiDroplet,
  FiFilm,
  FiHeart,
  FiHome,
  FiMapPin,
  FiNavigation2,
  FiShoppingBag,
  FiShoppingCart,
  FiSmile,
  FiTruck,
  FiUmbrella,
} from "react-icons/fi";
import { GoogleMap, Marker } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

import { IconType } from "react-icons";
import { LocalizedText } from "../page";
import { useGoogleMaps } from "../../../../contexts/GoogleMapsContext";
import { useHotelData } from "../hotelContext";
import { useTranslations } from "next-intl";

interface DistanceItem {
  icon: IconType;
  label: string;
  value: string;
}

export default function Location() {
  const t = useTranslations("location");
  const commonT = useTranslations("common");

  const { hotelData, locale } = useHotelData();

  const currentLocale = locale as keyof LocalizedText;

  const center = {
    lat: hotelData.hotelDetails.location.coordinates[1],
    lng: hotelData.hotelDetails.location.coordinates[0],
  };

  console.log({
    center,
  });

  const containerStyle = {
    width: "100%",
    height: "500px",
  };

  const { isLoaded } = useGoogleMaps();

  return (
    <section
      id="location-section"
      className="max-w-5xl mx-auto my-[24px] md:my-[72px]"
    >
      <h2 className="text-[#31286A] font-semibold tracking-tight text-3xl md:text-2xl">
        {t("title")}
      </h2>
      <p className="mt-2 max-w-lg text-sm md:text-base leading-relaxed text-gray-500">
        {t("description")}
      </p>

      {/* Map */}
      <div className="relative mt-10 h-[320px] w-full rounded-lg overflow-hidden">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            <Marker position={center} />
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">{commonT("loadingMap")}</p>
          </div>
        )}
      </div>

      {/* Distances */}
      {hotelData.populatedData.distances.length > 0 && (
        <>
          <h3 className="mt-14 mb-6 text-lg font-semibold text-gray-900">
            {t("distancesTitle")}
          </h3>
          <ul role="list" className="flex flex-wrap gap-5 md:gap-8">
            {hotelData.populatedData.distances.map((distance) => (
              <li
                key={distance._id}
                className="flex items-center gap-2 text-[#595959] min-w-0"
              >
                <img
                  className="w-6 h-6 flex-shrink-0"
                  src={distance.iconUrl}
                  alt={distance.name[currentLocale]}
                />
                <span className="text-[#595959] text-sm md:text-[14px] font-medium truncate">
                  {distance.name[currentLocale]}{" "}
                  <span className="text-gray-500 font-normal">
                    {distance.value % 1 === 0
                      ? distance.value.toString() + " "
                      : distance.value.toFixed(1) + " "}
                    km
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
