import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Circle,
  useJsApiLoader,
} from "@react-google-maps/api";
import HomeDetailsPopup from "./HomeDetailsPopup/HomeDetailsPopup";
import { useRouter } from "@/app/utils/router";
import { Hotel } from "@/types/hotel.type";
import ResidentBox from "../ListView/ResidentBox/ResidentBox";
import { formatAddress } from "@/app/utils/addressFormatter";
import { getLocalizedText } from "../ListView/ListView";

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)",
};

// Currency symbols mapping
const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  TRY: "₺",
  RUB: "₽",
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
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA64Bc3Y55vRFuugh8jxMon9ySYur4SvXY",
  });

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

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

  // Calculate the center based on the average of all coordinates
  const center = useMemo(() => {
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
  }, [hotels]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMapInstance(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMapInstance(null);
  }, []);

  useEffect(() => {
    if (mapInstance) {
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
        mapInstance.setZoom(14); // Default overview zoom for all hotels
      }
    }
  }, [mapInstance, hotels, center, totalHotelsCount]);

  if (!isLoaded) return <div>Loading...</div>;

  // Helper function to get display price in the selected currency
  const getDisplayPrice = (hotel: Hotel) => {
    if (!hotel.price || hotel.price.length === 0) return "";

    // Find price in selected currency
    const selectedPrice = hotel.price.find(
      (p) => p.currency === selectedCurrency
    );

    // If selected currency is not available, use USD or the first available price
    const usdPrice = hotel.price.find((p) => p.currency === "USD");
    const price = selectedPrice || usdPrice || hotel.price[0];

    const symbol = currencySymbols[price.currency] || price.currency;

    // Format the price with the appropriate currency symbol
    return price.currency === "USD" || price.currency === "RUB"
      ? `${symbol}${price.amount}`
      : `${price.amount}${symbol}`;
  };

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
      onLoad={onLoad}
      onUnmount={onUnmount}
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

        return (
          <Marker
            key={hotel._id || index}
            position={position}
            label={{
              text: getDisplayPrice(hotel),
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
            onClick={() => {
              // router.push(`/resident/${hotel.slug}`);
              // Alternative: show info window
              setSelectedHotel(hotel);
            }}
          />
        );
      })}

      {/* Show search radius circle if location is selected */}
      {/* TODO: For showing search radius circle, we need to add a new endpoint to the backend to get the search radius circle */}
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

      {selectedHotel && selectedHotel.location && (
        <InfoWindow
          position={{
            lat: selectedHotel.location.coordinates[1],
            lng: selectedHotel.location.coordinates[0],
          }}
          onCloseClick={() => setSelectedHotel(null)}
        >
          <ResidentBox
            key={selectedHotel._id}
            hotelId={selectedHotel._id}
            slug={selectedHotel.slug}
            type={getLocalizedText(selectedHotel.listingType, "en")}
            isOptinable={false}
            residentTypeName={getLocalizedText(selectedHotel.housingType, "en")}
            title={getLocalizedText(selectedHotel.title, "en")}
            price={getDisplayPrice(selectedHotel)}
            bedCount={selectedHotel.bedRoomCount.toString()}
            floorCount={"2"}
            area={`${selectedHotel.projectArea}m2`}
            locationText={formatAddress(selectedHotel, "en ")}
            image={selectedHotel.images[0]}
            images={selectedHotel.images}
            isFavorite={false}
            roomAsText={selectedHotel.roomAsText}
          />
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
