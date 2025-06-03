import React, { useState } from "react";

interface SortAndSaveFilteringProps {
  sortOption: "ascending" | "descending" | null;
  setSortOption: React.Dispatch<
    React.SetStateAction<"ascending" | "descending" | null>
  >;
  totalHotelsCount: number;
  setIsSaveFilterPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCurrentFilterExist: boolean;
}

export default function SortAndSaveFiltering({
  sortOption,
  setSortOption,
  totalHotelsCount,
  setIsSaveFilterPopupOpen,
  isCurrentFilterExist,
}: SortAndSaveFilteringProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSortSelection = (option: "ascending" | "descending") => {
    setSortOption(option);
    setIsOpen(false);
  };

  return (
    <div className=" justify-between items-center mb-8 px-5 hidden lg:flex">
      <p className="text-sm text-gray-800">
        Arama kriterlerinize uygun <b>{totalHotelsCount}</b> adet ilan bulundu.
      </p>

      <div className="flex flex-row items-center gap-2">
        {isCurrentFilterExist && (
          <button
            onClick={() => setIsSaveFilterPopupOpen(true)}
            className="border bg-transparent rounded-xl px-5 py-3 cursor-pointer"
          >
            <p className="text-sm text-[#5E5691] font-semibold">
              Aramayı Kaydet
            </p>
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="border bg-transparent flex flex-row items-center justify-between rounded-xl px-5 py-3 cursor-pointer min-w-[240px]"
          >
            <p className="text-sm text-gray-500 font-semibold mr-12">
              {sortOption === "ascending"
                ? "Artan Fiyat"
                : sortOption === "descending"
                ? "Azalan Fiyat"
                : "Sırala"}
            </p>
            <img
              src="/chevron-down.png"
              className={`w-6 h-6 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              alt="arrow-down"
            />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg z-10">
              <div
                className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 font-semibold"
                onClick={() => handleSortSelection("ascending")}
              >
                <p className="text-sm">Artan Fiyat</p>
              </div>
              <div
                className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 font-semibold"
                onClick={() => handleSortSelection("descending")}
              >
                <p className="text-sm">Azalan Fiyat</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
