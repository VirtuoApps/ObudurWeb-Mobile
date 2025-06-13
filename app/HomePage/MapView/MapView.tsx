import { Circle, GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import HomeDetailsPopup from "./HomeDetailsPopup/HomeDetailsPopup";
import { Hotel } from "@/types/hotel.type";
import ResidentBox from "../ListView/ResidentBox/ResidentBox";
import { formatAddress } from "@/app/utils/addressFormatter";
import { getDisplayPrice } from "@/app/utils/priceFormatter";
import { getLocalizedText } from "../ListView/ListView";
import { useGoogleMaps } from "../../contexts/GoogleMapsContext";
import { useRouter } from "@/app/utils/router";

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)",
};

export default function GoogleMapView({
  hotels,
  totalHotelsCount,
  selectedLocation,
  searchRadius,
}: {
  hotels: Hotel[];
  totalHotelsCount: number;
  selectedLocation?: any;
  searchRadius?: number;
}) {
  const { isLoaded } = useGoogleMaps();

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [hideSelectedHotel, setHideSelectedHotel] = useState(false);
  const [initialCenter, setInitialCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const router = useRouter();

  // Get selected currency from localStorage
  useEffect(() => {
    const storedCurrency = localStorage.getItem("selectedCurrency");
    if (storedCurrency) {
      setSelectedCurrency(storedCurrency);
    }

    // Setup listener for currency changes
    const handleStorageChange = () => {
      const currency = localStorage.getItem("selectedCurrency");
      if (currency && currency !== selectedCurrency) {
        setSelectedCurrency(currency);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [selectedCurrency]);

  useEffect(() => {
    // Set Antalya as the center on initial load if no location is selected
    if (!selectedLocation && !initialCenter) {
      setInitialCenter({ lat: 36.855, lng: 30.805 });
    }
  }, [selectedLocation, initialCenter]);

  // Calculate the center based on selectedLocation first, then average of all coordinates
  const center = useMemo(() => {
    if (
      selectedHotel &&
      selectedHotel.location &&
      selectedHotel.location.coordinates &&
      selectedHotel.location.coordinates.length === 2
    ) {
      return {
        lat: selectedHotel.location.coordinates[1] + 0.003, // Balanced offset for centering
        lng: selectedHotel.location.coordinates[0],
      };
    }

    // If selectedLocation is provided, use it as center
    if (
      selectedLocation &&
      selectedLocation.coordinates &&
      selectedLocation.coordinates.length === 2
    ) {
      return {
        lat: selectedLocation.coordinates[1],
        lng: selectedLocation.coordinates[0],
      };
    }

    if (initialCenter) {
      return initialCenter;
    }

    if (!hotels || hotels.length === 0) {
      return { lat: 36.855, lng: 30.805 }; // Default center if no hotels
    }

    const validHotels = hotels.filter(
      (hotel) =>
        hotel.location &&
        hotel.location.coordinates &&
        hotel.location.coordinates.length === 2
    );

    if (validHotels.length === 0) {
      return { lat: 36.855, lng: 30.805 }; // Default center if no valid coordinates
    }

    // Calculate average of coordinates
    // Note: hotel.location.coordinates is [longitude, latitude]
    const sum = validHotels.reduce(
      (acc, hotel) => {
        return {
          lat: acc.lat + hotel.location.coordinates[1],
          lng: acc.lng + hotel.location.coordinates[0],
        };
      },
      { lat: 0, lng: 0 }
    );

    return {
      lat: sum.lat / validHotels.length,
      lng: sum.lng / validHotels.length,
    };
  }, [hotels, selectedLocation, selectedHotel, initialCenter]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMapInstance(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMapInstance(null);
  }, []);

  useEffect(() => {
    if (mapInstance) {
      // If selectedLocation is provided, center on it with appropriate zoom

      if (
        selectedLocation &&
        selectedLocation.coordinates &&
        selectedLocation.coordinates.length === 2
      ) {
        const position = {
          lat: selectedLocation.coordinates[1],
          lng: selectedLocation.coordinates[0],
        };
        mapInstance.setCenter(position);
        mapInstance.setZoom(13); // Good zoom level for selected location
        return;
      }

      const validHotels = hotels.filter(
        (hotel) =>
          hotel.location &&
          hotel.location.coordinates &&
          hotel.location.coordinates.length === 2
      );

      // Only apply dynamic zoom/fit if the number of hotels has changed due to filtering
      if (hotels.length !== totalHotelsCount) {
        if (validHotels.length === 0) {
          mapInstance.setCenter(center); // center is default { lat: 36.855, lng: 30.805 } when hotels is empty
          mapInstance.setZoom(6);
        } else if (validHotels.length === 1) {
          const hotel = validHotels[0];
          const position = {
            lat: hotel.location.coordinates[1],
            lng: hotel.location.coordinates[0],
          };
          mapInstance.setCenter(position);
          mapInstance.setZoom(15);
        } else {
          const bounds = new window.google.maps.LatLngBounds();
          validHotels.forEach((hotel) => {
            bounds.extend(
              new window.google.maps.LatLng(
                hotel.location.coordinates[1],
                hotel.location.coordinates[0]
              )
            );
          });
          mapInstance.fitBounds(bounds);
        }
      } else {
        // No effective filter, or all hotels are shown. Use default view.
        mapInstance.setCenter(center); // 'center' is already calculated based on all 'hotels'
        mapInstance.setZoom(11); // Default overview zoom for all hotels
      }
    }
  }, [mapInstance, hotels, center, totalHotelsCount, selectedLocation]);

  useEffect(() => {
    if (
      mapInstance &&
      selectedHotel &&
      selectedHotel.location &&
      !hideSelectedHotel
    ) {
      // When a hotel is selected, pan to it with an offset to avoid top bar overlap
      const position = {
        lat: selectedHotel.location.coordinates[1] + 0.004, // Balanced offset to avoid top bar but stay close to marker
        lng: selectedHotel.location.coordinates[0],
      };

      // Use smooth pan animation without zoom changes
      // This provides consistent, gentle movement for all hotel selections
      mapInstance.panTo(position);

      // Only set zoom once if it's too low, without animation
      // const currentZoom = mapInstance.getZoom();
      // if (currentZoom !== undefined && currentZoom < 14) {
      //   setTimeout(() => {
      //     mapInstance.setZoom(15);
      //   }, 300); // Delay zoom until pan is complete
      // }
    }
  }, [selectedHotel, mapInstance, hideSelectedHotel]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={11}
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
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={() => setHideSelectedHotel(true)}
    >
      {hotels.map((hotel, index) => {
        if (
          !hotel.location ||
          !hotel.location.coordinates ||
          hotel.location.coordinates.length !== 2
        ) {
          return null;
        }

        // Note: GeoJSON format is [longitude, latitude]
        const position = {
          lat: hotel.location.coordinates[1],
          lng: hotel.location.coordinates[0],
        };

        // Check if this hotel is selected
        const isSelected =
          selectedHotel &&
          selectedHotel._id === hotel._id &&
          !hideSelectedHotel;

        return (
          <Marker
            key={hotel._id || index}
            position={position}
            label={{
              text: getDisplayPrice(hotel.price, selectedCurrency),
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              fontFamily: "var(--font-kumbh-sans), sans-serif",
            }}
            icon={{
              // Draw a 200 x 50 rectangle with rounded corners (12px radius)
              path: "M12,0 L188,0 Q200,0 200,12 L200,38 Q200,50 188,50 L12,50 Q0,50 0,38 L0,12 Q0,0 12,0 Z",
              fillColor: isSelected ? "#171231" : "#5E5691",
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
            onClick={() => {
              // router.push(`/resident/${hotel.slug}`);
              // Alternative: show info window
              setHideSelectedHotel(false);
              setSelectedHotel(hotel);
            }}
          />
        );
      })}

      {/* Show search radius circle if location is selected */}
      {/* {selectedLocation && selectedLocation.coordinates && searchRadius && (
        <>
          <Circle
            center={{
              lat: selectedLocation.coordinates[1],
              lng: selectedLocation.coordinates[0],
            }}
            radius={searchRadius * 1000} // Convert km to meters
            options={{
              fillColor: "#5E5691",
              fillOpacity: 0.1,
              strokeColor: "#5E5691",
              strokeOpacity: 0.3,
              strokeWeight: 2,
            }}
          />
          <Marker
            position={{
              lat: selectedLocation.coordinates[1],
              lng: selectedLocation.coordinates[0],
            }}
            icon={{
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#5E5691" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(24, 24),
              anchor: new window.google.maps.Point(12, 12),
            }}
          />
        </>
      )} */}

      {selectedHotel && selectedHotel.location && !hideSelectedHotel && (
        <InfoWindow
          position={{
            lat: selectedHotel.location.coordinates[1] + 0.001, // Minimal offset to keep InfoWindow close to marker
            lng: selectedHotel.location.coordinates[0],
          }}
          onCloseClick={() => setSelectedHotel(null)}
          options={{
            disableAutoPan: false,
            pixelOffset: new window.google.maps.Size(0, 4), // Balanced offset - not too far from marker
            maxWidth: 356,
          }}
        >
          <div
            className="max-w-[356px] p-0 m-0"
            style={{
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              border: "none",
              padding: "0",
              margin: "0",
            }}
          >
            <ResidentBox
              key={selectedHotel._id}
              hotelId={selectedHotel._id}
              slug={selectedHotel.slug}
              type={getLocalizedText(selectedHotel.listingType, "en")}
              isOptinable={false}
              residentTypeName={getLocalizedText(
                selectedHotel.housingType,
                "en"
              )}
              title={getLocalizedText(selectedHotel.title, "en")}
              price={getDisplayPrice(selectedHotel.price, selectedCurrency)}
              bedCount={selectedHotel.bedRoomCount.toString()}
              floorCount={"2"}
              area={`${selectedHotel.projectArea}m2`}
              locationText={formatAddress(selectedHotel, "en ")}
              image={selectedHotel.images[0]}
              images={selectedHotel.images}
              isFavorite={false}
              roomAsText={selectedHotel.roomAsText}
              roomCount={selectedHotel.roomCount || 0}
              entranceType={selectedHotel.entranceType}
              priceAsNumber={selectedHotel.price[0].amount}
              areaAsNumber={+selectedHotel.projectArea}
            />
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
