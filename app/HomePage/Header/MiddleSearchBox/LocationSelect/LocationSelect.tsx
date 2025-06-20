import { useState, useEffect, useRef } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { MapPinIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations, useLocale } from "next-intl";
import { FilterOptions } from "@/types/filter-options.type";

type LocationSelectProps = {
  selectedLocation: any[0] | null;
  setSelectedLocation: (location: any[0]) => void;
  isMobileMenu?: boolean;
  filterOptions: FilterOptions;
  searchRadius?: number; // Search radius in kilometers
  setSearchRadius?: (radius: number) => void;
};

interface PlaceSuggestion {
  description: string;
  placeId: string;
}

interface LocationWithDetails {
  name: string;
  description: string;
  href: string;
  place_id: string;
  coordinates?: [number, number]; // [longitude, latitude]
  types?: string[];
  address_components?: any[];
}

export default function LocationSelect({
  selectedLocation,
  setSelectedLocation,
  isMobileMenu = false,
  filterOptions,
  searchRadius,
  setSearchRadius,
}: LocationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingCoordinates, setIsFetchingCoordinates] = useState(false);
  const locale = useLocale();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const t = useTranslations("locations");

  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fetch suggestions as user types - similar to ThirdCreateStep.tsx
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

        console.log("Autocomplete API response:", data); // Debug log

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
  const searchResults = suggestions.map((suggestion) => {
    const parts = suggestion.description.split(",");
    const name = parts[0].trim(); // Get main part of description
    const description = parts.slice(1).join(",").trim(); // Get secondary part (province, country etc.)

    return {
      name,
      description,
      href: "#",
      place_id: suggestion.placeId,
    };
  });

  // Fetch coordinates for selected location
  const fetchLocationDetails = async (placeId: string): Promise<any | null> => {
    try {
      setIsFetchingCoordinates(true);
      const response = await fetch(
        `/api/places/details?place_id=${encodeURIComponent(
          placeId
        )}&language=${locale}`
      );

      const data = await response.json();

      console.log("Place details API response:", data); // Debug log

      if (data.status === "OK" && data.result) {
        return data.result;
      }

      console.error(
        "Failed to get place details:",
        data.status,
        data.error_message
      ); // Better error logging
      return null;
    } catch (error) {
      console.error("Error fetching location details:", error);
      return null;
    } finally {
      setIsFetchingCoordinates(false);
    }
  };

  const handleLocationSelect = async (location: any) => {
    // Fetch coordinates for the selected location
    const details = await fetchLocationDetails(location.place_id);

    if (details) {
      const locationWithDetails: LocationWithDetails = {
        ...location,
        coordinates:
          details.geometry?.location && details.geometry.location.lat
            ? [details.geometry.location.lng, details.geometry.location.lat]
            : undefined,
        types: details.types,
        address_components: details.address_components,
      };
      setSelectedLocation(locationWithDetails);
    }

    setShowSearch(false);
    setIsOpen(false);
    setSuggestions([]);
    setShowSuggestions(false);
    // Close the popover programmatically
    buttonRef.current?.click();
  };

  useEffect(() => {
    // When popover closes, reset search query and suggestions
    if (!isOpen) {
      setSearchQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
    // When popover opens after a selection has been made
    if (isOpen && !showSearch) {
      // Next time show search
      setShowSearch(true);
    }
  }, [isOpen, showSearch]);

  return (
    <Popover className="relative w-full">
      {({ open }) => {
        useEffect(() => {
          if (open !== isOpen) {
            setIsOpen(open);
          }
        }, [open, isOpen]);

        return (
          <>
            <PopoverButton
              ref={buttonRef}
              className={`flex items-center text-[#8c8c8c] hover:text-[#595959] transition-all duration-200 px-3 py-1.5 text-sm cursor-pointer outline-none ${
                isMobileMenu
                  ? "w-full border rounded-md border-gray-200 justify-between"
                  : "w-[150px] shrink-0"
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                className={`flex items-center ${isMobileMenu ? "flex-1" : ""}`}
              >
                {isOpen && showSearch ? (
                  <>
                    <MagnifyingGlassIcon className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t("searchLocation")}
                      className="outline-none w-full bg-transparent"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        // Prevent space from closing the popover
                        if (e.key === " ") {
                          e.preventDefault();
                          // Manually add space to the input value
                          const input = e.target as HTMLInputElement;
                          const start = input.selectionStart || 0;
                          const end = input.selectionEnd || 0;
                          const newValue =
                            searchQuery.slice(0, start) +
                            " " +
                            searchQuery.slice(end);
                          setSearchQuery(newValue);
                          // Set cursor position after the space
                          setTimeout(() => {
                            input.setSelectionRange(start + 1, start + 1);
                          }, 0);
                        }
                      }}
                      onKeyUp={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  </>
                ) : (
                  <>
                    <img
                      src="/marker-02.png"
                      className="w-[20px] h-[20px] mr-1"
                    />
                    <span className="truncate">
                      {selectedLocation
                        ? `${selectedLocation.name}`
                        : t("location")}
                    </span>
                    {selectedLocation && !isMobileMenu && isHovered && (
                      <button
                        type="button"
                        className="ml-2 p-1 rounded hover:bg-gray-100 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLocation(null);
                        }}
                        tabIndex={-1}
                      >
                        <XMarkIcon className="w-4 h-4 text-[#8C8C8C]" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </PopoverButton>

            <PopoverPanel
              transition
              className={`absolute z-50 mt-2 w-screen max-w-2xl px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in ${
                isMobileMenu ? "left-0" : "-left-5"
              }`}
            >
              <div className="w-full max-w-[450px] flex-auto overflow-hidden rounded-[16px] border border-[#D9D9D9] bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
                <div className="">
                  {(isSearching || isFetchingCoordinates) && (
                    <div className="p-3 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mx-auto"></div>
                      <span className="ml-2">
                        {isSearching ? "Searching..." : "Getting location..."}
                      </span>
                    </div>
                  )}

                  {/* Show radius selector if location is selected */}
                  {/* {selectedLocation && setSearchRadius && (
                    <div className="mb-4 p-3 border-b border-gray-200">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Search Radius
                      </div>
                      <div className="flex gap-2">
                        {[10, 25, 50, 100].map((radius) => (
                          <button
                            key={radius}
                            onClick={() => setSearchRadius(radius)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                              searchRadius === radius
                                ? "bg-[#5E5691] text-white border-[#5E5691]"
                                : "bg-white text-gray-600 border-gray-300 hover:border-[#5E5691]"
                            }`}
                          >
                            {radius}km
                          </button>
                        ))}
                      </div>
                    </div>
                  )} */}

                  {!isSearching &&
                  !isFetchingCoordinates &&
                  searchResults.length > 0
                    ? searchResults.map((location, index) => (
                        <div
                          key={location.place_id || `${location.name}-${index}`}
                          className="group relative flex gap-x-6 rounded-lg p-4 py-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleLocationSelect(location)}
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
                      !isSearching &&
                      !isFetchingCoordinates && (
                        <div className="p-3 text-center text-gray-500">
                          {t("searchLocation")}
                        </div>
                      )}
                </div>
              </div>
            </PopoverPanel>
          </>
        );
      }}
    </Popover>
  );
}
