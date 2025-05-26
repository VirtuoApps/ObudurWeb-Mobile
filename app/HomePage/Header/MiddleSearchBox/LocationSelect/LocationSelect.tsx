import { useState, useEffect, useRef } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useTranslations, useLocale } from "next-intl";
import { FilterOptions } from "@/types/filter-options.type";

type LocationSelectProps = {
  selectedLocation: any[0] | null;
  setSelectedLocation: (location: any[0]) => void;
  isMobileMenu?: boolean;
  filterOptions: FilterOptions;
};

interface PlaceSuggestion {
  description: string;
  placeId: string;
}

export default function LocationSelect({
  selectedLocation,
  setSelectedLocation,
  isMobileMenu = false,
  filterOptions,
}: LocationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState(false);
  const locale = useLocale();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
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
              className={`flex items-center text-gray-700 px-3 py-1.5 text-sm cursor-pointer outline-none ${
                isMobileMenu
                  ? "w-full border rounded-md border-gray-200 justify-between"
                  : "w-[150px]"
              }`}
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
                  </>
                )}
              </div>

              <img
                src="/chevron-down.png"
                className={`w-[24px] h-[24px] ml-auto ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className={`absolute z-20 mt-2 w-screen max-w-xs px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in ${
                isMobileMenu ? "left-0" : "left-1/2 -translate-x-1/2"
              }`}
            >
              <div className="w-full max-w-[250px] flex-auto overflow-hidden rounded-[16px] bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  {isSearching && (
                    <div className="p-3 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mx-auto"></div>
                      <span className="ml-2">Searching...</span>
                    </div>
                  )}

                  {!isSearching && searchResults.length > 0
                    ? searchResults.map((location, index) => (
                        <div
                          key={location.place_id || `${location.name}-${index}`}
                          className="group relative flex gap-x-6 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleLocationSelect(location)}
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 flex items-center">
                              {location.name}
                            </div>
                            <p className="mt-1 text-gray-600">
                              {location.description}
                            </p>
                          </div>
                        </div>
                      ))
                    : !searchQuery &&
                      !isSearching && (
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
