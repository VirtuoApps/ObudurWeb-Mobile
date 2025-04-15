import { useState, useEffect, useRef } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";

export const locations = [
  { name: "Sarımsaklı Plajı", description: "Ayvalık/Balıkesir", href: "#" },
  { name: "Kırıkkale", description: "Kırıkkale/Kırıkkale", href: "#" },
];

type LocationSelectProps = {
  selectedLocation: (typeof locations)[0] | null;
  setSelectedLocation: (location: (typeof locations)[0]) => void;
};

export default function LocationSelect({
  selectedLocation,
  setSelectedLocation,
}: LocationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(true);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: (typeof locations)[0]) => {
    setSelectedLocation(location);
    setShowSearch(false);
    setIsOpen(false);
    // Close the popover programmatically
    buttonRef.current?.click();
  };

  useEffect(() => {
    // When popover closes, reset search query
    if (!isOpen) {
      setSearchQuery("");
    }
    // When popover opens after a selection has been made
    if (isOpen && !showSearch) {
      // Next time show search
      setShowSearch(true);
    }
  }, [isOpen, showSearch]);

  return (
    <Popover className="relative">
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
              className="flex items-center text-gray-700 px-3 py-1.5 text-sm w-[150px] cursor-pointer"
            >
              {isOpen && showSearch ? (
                <div className="flex items-center w-full">
                  <MagnifyingGlassIcon className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Konum ara..."
                    className="outline-none w-full"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {selectedLocation
                      ? `${selectedLocation.name} (${selectedLocation.description})`
                      : "Konum"}
                  </span>
                </>
              )}
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute left-1/2 z-10 mt-2 flex w-screen max-w-xs -translate-x-1/2 px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
            >
              <div className="w-full max-w-md flex-auto overflow-hidden rounded-xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((location) => (
                      <div
                        key={location.name}
                        className="group relative flex gap-x-6 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleLocationSelect(location)}
                      >
                        <div className="mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                          <MapPinIcon
                            className="h-5 w-5 text-gray-600 group-hover:text-indigo-600"
                            aria-hidden="true"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {location.name}
                          </div>
                          <p className="mt-1 text-gray-600">
                            {location.description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">
                      Sonuç bulunamadı
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
