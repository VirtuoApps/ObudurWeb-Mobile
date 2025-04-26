"use client";

import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { IconType } from "react-icons";
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

interface DistanceItem {
  icon: IconType;
  label: string;
  value: string;
}

const distances: DistanceItem[] = [
  { icon: FiNavigation2, label: "Tramvay", value: "0,42 km" },
  { icon: FiAirplay, label: "Havaalanı", value: "0,42 km" },
  { icon: FiUmbrella, label: "Plaj", value: "0,42 km" },
  { icon: FiTruck, label: "Taksi Durağı", value: "0,42 km" },
  { icon: FiBook, label: "Okul", value: "0,42 km" },
  { icon: FiCreditCard, label: "Banka / ATM", value: "0,42 km" },
  { icon: FiShoppingCart, label: "Market", value: "0,42 km" },
  { icon: FiShoppingBag, label: "Alış Veriş Merkezi", value: "0,42 km" },
  { icon: FiMapPin, label: "Milli Park", value: "0,42 km" },
  { icon: FiFilm, label: "Sinema", value: "0,42 km" },
  { icon: FiSmile, label: "Eğlence Merkezi", value: "0,42 km" },
  { icon: FiDroplet, label: "Benzinlik", value: "0,42 km" },
  { icon: FiCoffee, label: "Restoranlar", value: "0,42 km" },
  { icon: FiActivity, label: "Spor Salonu", value: "0,42 km" },
  { icon: FiHeart, label: "Eczane", value: "0,42 km" },
  { icon: FiBriefcase, label: "İş Merkezi", value: "0,42 km" },
  { icon: FiHome, label: "Hastane", value: "0,42 km" },
];

export default function Location() {
  const center = { lat: 40.982, lng: 29.126 };
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
    <section className="max-w-5xl mx-auto p-4 mt-12">
      <h2 className="text-[#31286A] font-semibold tracking-tight text-3xl md:text-4xl">
        Lokasyon
      </h2>
      <p className="mt-2 max-w-lg text-sm md:text-base leading-relaxed text-gray-500">
        Konutun harita üzerindeki konumu, çevresindeki temel yaşam alanlarına,
        tarihi ve/veya popüler noktalara olan mesafeleri.
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
                text: "Konut",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
              }}
              icon={markerIcon}
            />
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Loading map...</p>
          </div>
        )}
      </div>

      {/* Distances */}
      <h3 className="mt-14 mb-6 text-lg font-semibold text-gray-900">
        Uzaklıklar
      </h3>
      <ul role="list" className="flex flex-wrap gap-y-5">
        {distances.map(({ icon: Icon, label, value }) => (
          <li
            key={label}
            className="flex items-center gap-3 w-1/2 md:w-1/3 lg:w-1/5 pr-4"
          >
            <Icon className="w-5 h-5 shrink-0 text-[#675CA8] stroke-[1.5]" />
            <span className="text-gray-700 font-medium text-sm">
              {label} <span className="text-gray-500 font-normal">{value}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
