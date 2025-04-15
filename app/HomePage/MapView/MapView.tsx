"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Dummy data for markers
const locations = [
  { lat: 36.85, lng: 30.8, label: "$1.42m" },
  { lat: 36.86, lng: 30.81, label: "$1.42m" },
  { lat: 36.87, lng: 30.82, label: "$1.42m" },
];

// Component to update map view on window resize
function MapUpdater() {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  return null;
}

const createPriceIcon = (price: string) =>
  L.divIcon({
    className: "price-marker",
    html: `<div class="marker-label">${price}</div>`,
    iconSize: [80, 30],
    iconAnchor: [40, 15],
  });

export default function MapView() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[calc(100vh-100px)] bg-gray-100 flex items-center justify-center">
        Loading map...
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh)]">
      <MapContainer
        center={[36.86, 30.8]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {locations.map((loc, index) => (
          <Marker
            key={index}
            position={[loc.lat, loc.lng]}
            icon={createPriceIcon(loc.label)}
          >
            <Popup>
              <div className="text-center font-semibold text-black">
                {loc.label}
              </div>
            </Popup>
          </Marker>
        ))}

        <MapUpdater />
      </MapContainer>
    </div>
  );
}
