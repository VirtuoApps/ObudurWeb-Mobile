import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import HomeDetailsPopup from "./HomeDetailsPopup/HomeDetailsPopup";

type Property = {
  lat: number;
  lng: number;
  price: string;
};

const properties: Property[] = [
  { lat: 36.851, lng: 30.789, price: "$1.42m" },
  { lat: 36.853, lng: 30.801, price: "$1.42m" },
  { lat: 36.857, lng: 30.808, price: "$1.42m" },
  { lat: 36.86, lng: 30.818, price: "$1.42m" },
];

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 155px)",
};

const center = {
  lat: 36.855,
  lng: 30.805,
};

export default function GoogleMapView() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA64Bc3Y55vRFuugh8jxMon9ySYur4SvXY",
  });

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      options={{
        // Turn off default UI if you want a cleaner map;
        // or leave on certain controls like zoomControl if desired
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
      {properties.map((property, index) => (
        <Marker
          key={index}
          position={{ lat: property.lat, lng: property.lng }}
          label={{
            text: property.price,
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
          }}
          icon={{
            // Draw a 200 x 50 rectangle with rounded corners (12px radius)
            path: "M12,0 L188,0 Q200,0 200,12 L200,38 Q200,50 188,50 L12,50 Q0,50 0,38 L0,12 Q0,0 12,0 Z",
            fillColor: "#5E5691",
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 0.4,
            // 'anchor' is the point of the icon which will be placed at the
            // marker's position (lat/lng). (100,25) = center of a 200x50 rect.
            anchor: new window.google.maps.Point(100, 25),
            // Where the label text is drawn relative to the top-left corner
            // of the path. Setting it to the center coordinates helps center it.
            labelOrigin: new window.google.maps.Point(100, 25),
          }}
          onClick={() => setSelectedProperty(property)}
        />
      ))}

      {selectedProperty && (
        <InfoWindow
          position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
          onCloseClick={() => setSelectedProperty(null)}
        >
          <HomeDetailsPopup selectedProperty={selectedProperty} />
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
