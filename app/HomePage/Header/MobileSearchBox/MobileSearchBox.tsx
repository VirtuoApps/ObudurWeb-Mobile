import React, { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import ListingTypePopup from "@/app/components/ListingTypePopup/ListingTypePopup";

interface PlaceSuggestion {
  description: string;
  placeId: string;
}

interface LocationWithCoordinates {
  name: string;
  description: string;
  href: string;
  place_id: string;
  coordinates?: [number, number]; // [longitude, latitude]
}

type MobileSearchBoxProps = {
  selectedLocation?: LocationWithCoordinates | null;
  setSelectedLocation?: (location: LocationWithCoordinates) => void;
  listingType: "For Sale" | "For Rent";
  setListingType: (listingType: "For Sale" | "For Rent") => void;
  setIsFilterPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MobileSearchBox({
  selectedLocation,
  setSelectedLocation,
  listingType,
  setListingType,
  setIsFilterPopupOpen,
}: MobileSearchBoxProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingCoordinates, setIsFetchingCoordinates] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const locale = useLocale();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isListingTypePopupOpen, setIsListingTypePopupOpen] = useState(false);

  const t = useTranslations("locations");

  // Fetch suggestions as user types - similar to LocationSelect.tsx
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce the search request
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/places/autocomplete?input=${encodeURIComponent(
            searchQuery
          )}&language=${locale}`
        );

        const data = await response.json();

        if (data.status === "OK" && data.predictions) {
          const newSuggestions = data.predictions.map((prediction: any) => ({
            description: prediction.description,
            placeId: prediction.place_id,
          }));
          setSuggestions(newSuggestions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", JSON.stringify(error));
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms delay to reduce API calls

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, locale]);

  // Convert suggestions to the expected format
  const searchResults = suggestions.map((suggestion) => ({
    name: suggestion.description.split(",")[0], // Get main part of description
    description: suggestion.description.split(",").slice(1).join(",").trim(), // Get secondary part
    href: "#",
    place_id: suggestion.placeId,
  }));

  // Fetch coordinates for selected location
  const fetchLocationCoordinates = async (
    placeId: string
  ): Promise<[number, number] | null> => {
    try {
      setIsFetchingCoordinates(true);
      const response = await fetch(
        `/api/places/details?place_id=${encodeURIComponent(
          placeId
        )}&language=${locale}`
      );

      const data = await response.json();

      console.log("Place details API response:", data); // Debug log

      if (data.status === "OK" && data.result?.geometry?.location) {
        const { lat, lng } = data.result.geometry.location;
        console.log("Coordinates found:", { lat, lng }); // Debug log
        return [lng, lat]; // Return as [longitude, latitude] to match GeoJSON format
      }

      console.error(
        "Failed to get coordinates:",
        data.status,
        data.error_message
      ); // Better error logging
      return null;
    } catch (error) {
      console.error("Error fetching location coordinates:", error);
      return null;
    } finally {
      setIsFetchingCoordinates(false);
    }
  };

  const handleLocationSelect = async (location: any) => {
    // Fetch coordinates for the selected location
    const coordinates = await fetchLocationCoordinates(location.place_id);

    // Create location object with coordinates
    const locationWithCoordinates: LocationWithCoordinates = {
      ...location,
      coordinates,
    };

    if (setSelectedLocation) {
      setSelectedLocation(locationWithCoordinates);
    }

    setSearchQuery(location.name);
    setShowSuggestions(false);
    setIsFocused(false);
    setSuggestions([]);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setIsFocused(false);
        setSuggestions([]);
      }
    };

    // Use both mousedown and click events for better coverage
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="flex flex-row items-center bg-[#F5F5F5] rounded-2xl pr-3 pl-4 h-[56px]"
        onClick={() => {
          setIsFilterPopupOpen(true);
        }}
      >
        <p
          className="text-sm text-[#5E5691] font-bold shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            setIsListingTypePopupOpen(true);
          }}
        >
          {listingType === "For Sale" ? "Satılık" : "Kiralık"}
        </p>

        <div className="flex-1 bg-transparent outline-none text-[#8C8C8C] text-sm pl-4 pr-3 min-w-0">
          <p className="truncate">Konum, Kategori, Fiyat...</p>
        </div>

        {/* <input
          className="flex-1 bg-transparent outline-none placeholder:text-[#8C8C8C] text-gray-700 text-sm pl-4 pr-3"
          placeholder="Konum, Kategori, Fiyat..."
          onClick={() => {
            setIsFilterPopupOpen(true);
          }}
          // value=""
          // onChange={(e) => setSearchQuery(e.target.value)}
          // onFocus={() => setIsFocused(true)}
          // onBlur={(e) => {
          //   // Don't close immediately if clicking on a suggestion
          //   setTimeout(() => {
          //     if (!containerRef.current?.contains(document.activeElement)) {
          //       setIsFocused(false);
          //       setShowSuggestions(false);
          //       setSuggestions([]);
          //     }
          //   }, 150);
          // }}
        /> */}

        <img
          src="/header-search-icon.png"
          alt="search"
          className="w-[14px] h-[14px] mr-4 shrink-0"
        />
      </div>

      {/* Suggestions Dropdown */}
      {(showSuggestions || (isFocused && searchQuery.length >= 3)) && (
        <div className="absolute z-30 mt-2 w-full">
          <div className="w-full overflow-hidden rounded-[16px] border border-[#D9D9D9] bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
            <div className="">
              {(isSearching || isFetchingCoordinates) && (
                <div className="p-3 text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    <span className="ml-2">
                      {isSearching ? "Searching..." : "Getting location..."}
                    </span>
                  </div>
                </div>
              )}

              {!isSearching &&
              !isFetchingCoordinates &&
              searchResults.length > 0
                ? searchResults.map((location, index) => (
                    <div
                      key={location.place_id || `${location.name}-${index}`}
                      className="group relative flex gap-x-6 rounded-lg p-4 py-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleLocationSelect(location)}
                      onMouseDown={(e) => {
                        // Prevent the input onBlur from closing the dropdown before click
                        e.preventDefault();
                      }}
                    >
                      <div className="flex-1">
                        <div className="font-normal text-[#595959] flex items-center">
                          {location.name}
                        </div>
                        {location.description && (
                          <div className="text-xs text-gray-400 mt-1">
                            {location.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                : !searchQuery &&
                  isFocused &&
                  !isSearching &&
                  !isFetchingCoordinates && (
                    <div className="p-3 text-center text-gray-500">
                      {t("searchLocation")}
                    </div>
                  )}

              {searchQuery.length >= 3 &&
                !isSearching &&
                !isFetchingCoordinates &&
                searchResults.length === 0 && (
                  <div className="p-3 text-center text-gray-500">
                    No results found
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Render listing type popup */}
      <ListingTypePopup
        isOpen={isListingTypePopupOpen}
        onClose={() => setIsListingTypePopupOpen(false)}
        listingType={listingType}
        setListingType={setListingType}
      />
    </div>
  );
}
