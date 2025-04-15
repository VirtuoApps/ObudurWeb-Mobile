import React, { useState } from "react";
import LocationSelect, { locations } from "./LocationSelect/LocationSelect";

export default function MiddleSearchBox() {
  const [selectedLocation, setSelectedLocation] = useState<
    (typeof locations)[0] | null
  >(null);

  return (
    <div className="flex items-center gap-2 border border-gray-100 px-4 py-2 rounded-lg">
      {/* Satılık / Kiralık */}
      <div className="flex rounded-md overflow-hidden mr-2">
        <button className="bg-[#362C75] text-white px-4 py-1.5 text-sm font-medium">
          Satılık
        </button>
        <button className="bg-gray-50 text-gray-700 px-4 py-1.5 text-sm font-medium">
          Kiralık
        </button>
      </div>

      {/* Konum */}
      <LocationSelect
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />

      {/* Emlak Tipi */}
      <div className="relative">
        <button className="flex items-center justify-between text-gray-700 px-3 py-1.5 text-sm min-w-[120px]">
          <span>Emlak Tipi</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Kategori */}
      <div className="relative">
        <button className="flex items-center justify-between text-gray-700  px-3 py-1.5 text-sm min-w-[120px]">
          <span>Kategori</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Search Button */}
      <button className="bg-[#5E5691] text-white px-6 py-1.5 rounded-md text-sm font-medium">
        Ara
      </button>
    </div>
  );
}
