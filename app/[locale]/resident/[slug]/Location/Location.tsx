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
import { formatAddress } from "../../../../utils/addressFormatter";
import DirectionMapIcon from "../../../../svgIcons/direction_map";

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

  const containerStyle = {
    width: "100%",
    height: "500px",
  };

  const { isLoaded } = useGoogleMaps();

  // Yol tarifi için Google Maps URL'sini oluştur
  const getDirectionsUrl = () => {
    const destinationLat = hotelData.hotelDetails.location.coordinates[1];
    const destinationLng = hotelData.hotelDetails.location.coordinates[0];
    
    // Google Maps yol tarifi URL'si
    return `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLng}`;
  };

  const handleDirectionsClick = () => {
    window.open(getDirectionsUrl(), '_blank');
  };

  // Format the address using the utility function
  const formattedAddress = formatAddress({
    street: hotelData.hotelDetails.street,
    buildingNo: hotelData.hotelDetails.buildingNo,
    apartmentNo: hotelData.hotelDetails.apartmentNo,
    city: hotelData.hotelDetails.city,
    state: hotelData.hotelDetails.state,
    neighborhood: hotelData.hotelDetails.neighborhood,
    postalCode: hotelData.hotelDetails.postalCode,
    country: hotelData.hotelDetails.country,
  }, locale);

  return (
    <section
      id="location-section"
      className="w-full my-8 md:my-16"
    >
      {/* Title */}
      <h2 className="font-semibold text-[#31286A] text-2xl md:text-3xl leading-tight tracking-tight mb-2">
        {t("title")}
      </h2>
      <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-8">
        {t("description")}
      </p>

      {/* Map */}
      <div className="relative mt-4 h-[320px] w-full rounded-lg overflow-hidden">
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

      {/* Address & Button Row - 32px spacing from map */}
      <div className="mt-8 flex flex-row items-center justify-between min-h-[40px] gap-8">
        <div className="flex flex-col justify-center">
          <span className="text-lg font-semibold text-gray-900 mb-0">{t("addressTitle")}</span>
          <span className="text-[14px] leading-[1.4] text-[#595959] font-normal mt-0">{formattedAddress}</span>
        </div>
        <button
          onClick={handleDirectionsClick}
          className="flex items-center gap-2 bg-[#5E5691] hover:bg-[#4b437a] text-white px-4 md:px-6 h-[40px] rounded-[8px] text-sm md:text-base font-medium transition-colors duration-200 whitespace-nowrap min-w-0 max-w-full overflow-hidden"
          style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }}
        >
          <DirectionMapIcon width={20} height={20} className="w-5 h-5 flex-shrink-0" stroke="#FCFCFC" />
          <span className="truncate block">{t("getDirections")}</span>
        </button>
      </div>

      {/* Distances */}
      {hotelData.populatedData.distances.length > 0 && (
        <>
           {/* 32px spacing between address and distances */}
           <div className="mt-8" />
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