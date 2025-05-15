"use client";

import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { IconType } from "react-icons";
import { useTranslations } from "next-intl";
import {
  FiNavigation2,
  FiAirplay,
  FiUmbrella,
  FiTruck,
  FiBook,
  FiCreditCard,
  FiShoppingCart,
  FiShoppingBag,
  FiMapPin,
  FiFilm,
  FiSmile,
  FiDroplet,
  FiCoffee,
  FiActivity,
  FiHeart,
  FiBriefcase,
  FiHome,
} from "react-icons/fi";
import { useHotelData } from "../hotelContext";
import { LocalizedText } from "../page";
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
    lat: hotelData.hotelDetails.location.coordinates[0],
    lng: hotelData.hotelDetails.location.coordinates[1],
  };
  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA64Bc3Y55vRFuugh8jxMon9ySYur4SvXY",
  });

  const [markerIcon, setMarkerIcon] = useState<any>(null);

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      setMarkerIcon({
        path: "M12,0 L188,0 Q200,0 200,12 L200,38 Q200,50 188,50 L12,50 Q0,50 0,38 L0,12 Q0,0 12,0 Z",
        fillColor: "#5E5691",
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 0.4,
        anchor: new window.google.maps.Point(100, 25),
        labelOrigin: new window.google.maps.Point(100, 25),
      });
    }
  }, [isLoaded]);

  return (
    <section id="location-section" className="max-w-5xl mx-auto p-4 mt-12">
      <h2 className="text-[#31286A] font-semibold tracking-tight text-3xl md:text-4xl">
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
            zoom={15}
            options={{
              disableDefaultUI: true,
              zoomControl: false,
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
              ],
            }}
          >
            <Marker
              position={center}
              label={{
                text: t("property"),
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
              }}
              icon={markerIcon}
            />
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">{commonT("loadingMap")}</p>
          </div>
        )}
      </div>

      {/* Distances */}
      <h3 className="mt-14 mb-6 text-lg font-semibold text-gray-900">
        {t("distancesTitle")}
      </h3>
      <ul role="list" className="flex flex-wrap justify-between  gap-y-5">
        {hotelData.populatedData.distances.map((distance) => (
          <li
            key={distance._id}
            className="flex items-center gap-3 w-1/2 md:w-1/3 lg:w-1/5 pr-4 sm:min-w-[220px]"
          >
            <img
              className="w-6 h-6"
              src={distance.iconUrl}
              alt={distance.name[currentLocale]}
            />
            <span className="text-gray-700 font-medium text-sm">
              {distance.name[currentLocale]}{" "}
              <span className="text-gray-500 font-normal">
                {distance.value} km
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
