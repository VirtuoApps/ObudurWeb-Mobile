import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import { useListingForm } from "../CreationSteps";
import { XCircleIcon } from "@heroicons/react/24/solid";
import GoBackButton from "../../GoBackButton/GoBackButton";

// Custom Select component that matches the design
interface SelectOption {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(
    (option) => option.value.toString() === value.toString()
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="w-full h-12 rounded-lg border border-[#E2E2E2] bg-white px-4 flex items-center justify-between text-[#262626] focus:outline-none focus:border-[#5D568D] hover:border-[#5D568D] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate text-left">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {isOpen ? (
          <img
            src="/chevron-down.png"
            className="w-[24px] h-[24px] rotate-180 flex-shrink-0"
          />
        ) : (
          <img
            src="/chevron-down.png"
            className="w-[24px] h-[24px] flex-shrink-0"
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 z-10 mt-1 w-full origin-top-right rounded-lg bg-white shadow-lg border border-[#E2E2E2]">
          <div className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className="px-4 py-3 hover:bg-[#F5F5F5] cursor-pointer text-[#262626] transition-colors"
                onClick={() => {
                  onChange(option.value.toString());
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function SecondCreateStep() {
  const [errors, setErrors] = useState<string[]>([]);

  // Use context for form state and navigation
  const {
    price,
    setPrice,
    projectArea,
    setProjectArea,
    totalSize,
    setTotalSize,
    roomCount,
    setRoomCount,
    bathroomCount,
    setBathroomCount,
    bedRoomCount,
    setBedRoomCount,
    floorCount,
    setFloorCount,
    buildYear,
    setBuildYear,
    kitchenType,
    setKitchenType,
    setCurrentStep,
  } = useListingForm();

  // Handle amount change for a specific currency
  const handlePriceChange = (currency: string, amount: string) => {
    // Only allow numbers and decimal point
    const numericValue = amount.replace(/[^0-9.]/g, "");
    // Prevent multiple decimal points
    const parts = numericValue.split(".");
    const validValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    const numericAmount = validValue === "" ? 0 : parseFloat(validValue);

    setPrice((prevPrice) => {
      // Check if this currency already exists
      const existingCurrencyIndex = prevPrice?.findIndex(
        (p) => p.currency === currency
      );

      if (existingCurrencyIndex !== undefined && existingCurrencyIndex >= 0) {
        // Update existing currency
        const updatedPrice = [...(prevPrice || [])];
        updatedPrice[existingCurrencyIndex] = {
          ...updatedPrice[existingCurrencyIndex],
          amount: numericAmount,
        };
        return updatedPrice;
      } else {
        // Add new currency
        return [
          ...(prevPrice || []),
          { currency: currency, amount: numericAmount },
        ];
      }
    });
  };

  // Get price for a specific currency
  const getPriceForCurrency = (currency: string): number => {
    if (!price) return 0;
    const currencyPrice = price.find((p) => p.currency === currency);
    return currencyPrice ? currencyPrice.amount : 0;
  };

  // Kitchen type options
  const kitchenTypeOptions = [
    { value: "americanKitchen", label: "Amerikan Mutfak" },
    { value: "separateKitchen", label: "Ayrı Mutfak" },
    { value: "openKitchen", label: "Açık Mutfak" },
    { value: "islandKitchen", label: "Ada Mutfak" },
    { value: "cornerKitchen", label: "Köşe Mutfak" },
  ];

  // Generate options for number-based selects
  const generateNumberOptions = (min: number, max: number): SelectOption[] => {
    const options: SelectOption[] = [];
    for (let i = min; i <= max; i++) {
      options.push({ value: i, label: i.toString() });
    }
    return options;
  };

  // Validate all required fields
  const validateFields = () => {
    const newErrors: string[] = [];

    // Check if prices for all currencies are provided
    const usdPrice = price?.find((p) => p.currency === "USD");
    const tryPrice = price?.find((p) => p.currency === "TRY");

    if (!usdPrice || usdPrice.amount <= 0) {
      newErrors.push("Lütfen USD para biriminde fiyat belirtin");
    }

    if (!tryPrice || tryPrice.amount <= 0) {
      newErrors.push("Lütfen TRY para biriminde fiyat belirtin");
    }

    // Check area fields
    if (!projectArea || projectArea <= 0) {
      newErrors.push("Lütfen brüt metrekare değerini girin");
    }

    if (!totalSize || totalSize <= 0) {
      newErrors.push("Lütfen net metrekare değerini girin");
    }

    // Validate room counts for real estate (may not apply to land)
    if (!roomCount && roomCount !== 0) {
      newErrors.push("Lütfen oda sayısını seçin");
    }

    if (!bathroomCount && bathroomCount !== 0) {
      newErrors.push("Lütfen banyo sayısını seçin");
    }

    if (!bedRoomCount && bedRoomCount !== 0) {
      newErrors.push("Lütfen yatak odası sayısını seçin");
    }

    if (!floorCount && floorCount !== 0) {
      newErrors.push("Lütfen kat sayısını seçin");
    }

    if (!buildYear) {
      newErrors.push("Lütfen yapım yılını giriniz");
    }

    if (!kitchenType || kitchenType.tr === "" || kitchenType.en === "") {
      newErrors.push("Lütfen mutfak tipini seçin");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle form submission to next step
  const handleContinue = () => {
    // Clear previous errors
    setErrors([]);

    // Validate all fields
    const isValid = validateFields();

    if (isValid) {
      // Log current form data
      console.log({
        price,
        projectArea,
        totalSize,
        roomCount,
        bathroomCount,
        bedRoomCount,
        floorCount,
        buildYear,
        kitchenType,
      });

      // Move to the next step
      setCurrentStep(3);
    } else {
      // Scroll to top to see errors
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle going back to previous step
  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-[#ECEBF4] flex justify-center items-start p-4">
      <div className="w-full max-w-[1200px] rounded-2xl shadow-lg bg-white">
        <div className="flex flex-col md:flex-row p-10">
          {/* Left Info Panel - 30% width on desktop */}
          <div className="w-full md:w-[30%] mb-8 md:mb-0 md:pr-6 flex flex-col">
            <h1 className="text-2xl font-extrabold leading-tight text-[#362C75]">
              İlan detaylarını girin.
            </h1>
            <div className="mt-4 space-y-2 text-gray-500">
              <p>
                Bu bölümde ilanınızın detaylarını belirleyerek alıcıların
                ilanınıza daha fazla ilgi göstermesini sağlayabilirsiniz. Doğru
                bilgiler ilanınızın görünürlüğünü ve ilgi düzeyini artıracaktır.
              </p>
            </div>
            <GoBackButton handleBack={handleBack} step={2} totalSteps={5} />
          </div>

          {/* Right Form Panel - 70% width on desktop */}
          <div className="w-full md:w-[70%] md:pl-6">
            {/* Errors display */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <XCircleIcon
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Lütfen aşağıdaki hataları düzeltin:
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Price Section */}
            <div className="mb-6">
              <h2 className="font-semibold mb-4 text-[#262626]">Fiyat</h2>

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="w-full sm:w-1/2">
                  <label className="font-medium block mb-2 text-[#262626]">
                    Fiyat (TRY)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#262626] font-medium">
                      ₺
                    </span>
                    <input
                      type="text"
                      value={getPriceForCurrency("TRY") || ""}
                      onChange={(e) => handlePriceChange("TRY", e.target.value)}
                      className="w-full h-12 rounded-lg border border-gray-300 pl-8 pr-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                      placeholder="Fiyat yazın"
                    />
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label className="font-medium block mb-2 text-[#262626]">
                    Fiyat (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#262626] font-medium">
                      $
                    </span>
                    <input
                      type="text"
                      value={getPriceForCurrency("USD") || ""}
                      onChange={(e) => handlePriceChange("USD", e.target.value)}
                      className="w-full h-12 rounded-lg border border-gray-300 pl-8 pr-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                      placeholder="Fiyat yazın"
                    />
                  </div>
                </div>
              </div>

              {/* <div className="text-xs text-gray-500">
                <p>Her iki para biriminde fiyat belirtmeniz gerekmektedir.</p>
                <div className="mt-1 text-sm">
                  {price?.map((p) => (
                    <span
                      key={p.currency}
                      className={`inline-block mr-3 ${
                        p.amount > 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {p.currency === "TRY" ? "TL" : p.currency}:{" "}
                      {p.amount > 0 ? `✓ (${p.amount})` : "✗"}
                    </span>
                  ))}
                </div>
              </div> */}
            </div>

            {/* Areas - Side by side */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="projectArea"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Metrekare (Brüt)
                </label>
                <input
                  type="text"
                  id="projectArea"
                  value={projectArea || ""}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
                    const parts = numericValue.split(".");
                    const validValue =
                      parts.length > 2
                        ? parts[0] + "." + parts.slice(1).join("")
                        : numericValue;
                    setProjectArea(parseFloat(validValue) || 0);
                  }}
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                  placeholder="Brüt m²"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="totalSize"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Metrekare (Net)
                </label>
                <input
                  type="text"
                  id="totalSize"
                  value={totalSize || ""}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
                    const parts = numericValue.split(".");
                    const validValue =
                      parts.length > 2
                        ? parts[0] + "." + parts.slice(1).join("")
                        : numericValue;
                    setTotalSize(parseFloat(validValue) || 0);
                  }}
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                  placeholder="Net m²"
                />
              </div>
            </div>

            {/* Room and Bathroom Counts - Side by side */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="roomCount"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Oda Sayısı
                </label>
                <CustomSelect
                  options={generateNumberOptions(0, 10)}
                  value={roomCount || 0}
                  onChange={(value) => setRoomCount(parseInt(value))}
                  placeholder="Seçiniz"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="bathroomCount"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Banyo Sayısı
                </label>
                <CustomSelect
                  options={generateNumberOptions(0, 5)}
                  value={bathroomCount || 0}
                  onChange={(value) => setBathroomCount(parseInt(value))}
                  placeholder="Seçiniz"
                />
              </div>
            </div>

            {/* Bedroom and Floor Counts */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="bedRoomCount"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Yatak Odası Sayısı
                </label>
                <CustomSelect
                  options={generateNumberOptions(0, 5)}
                  value={bedRoomCount || 0}
                  onChange={(value) => setBedRoomCount(parseInt(value))}
                  placeholder="Seçiniz"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="floorCount"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Kat Sayısı
                </label>
                <CustomSelect
                  options={generateNumberOptions(0, 5)}
                  value={floorCount || 0}
                  onChange={(value) => setFloorCount(parseInt(value))}
                  placeholder="Seçiniz"
                />
              </div>
            </div>

            {/* Build Year */}
            <div className="mb-6">
              <label
                htmlFor="buildYear"
                className="font-semibold block mb-2 text-[#262626]"
              >
                Yapım Yılı
              </label>
              <input
                type="text"
                id="buildYear"
                value={buildYear || ""}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/[^0-9]/g, "");
                  setBuildYear(
                    numericValue === "" ? 0 : parseInt(numericValue)
                  );
                }}
                className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                placeholder="Yapım yılı"
              />
            </div>

            {/* Kitchen Type */}
            <div className="mb-6">
              <label
                htmlFor="kitchenType"
                className="font-semibold block mb-2 text-[#262626]"
              >
                Mutfak Tipi
              </label>
              <CustomSelect
                options={kitchenTypeOptions}
                value={
                  kitchenType?.tr
                    ? kitchenTypeOptions.find(
                        (option) => option.label === kitchenType.tr
                      )?.value || ""
                    : ""
                }
                onChange={(value) => {
                  const selected = kitchenTypeOptions.find(
                    (option) => option.value === value
                  );
                  if (selected) {
                    setKitchenType({
                      tr: selected.label,
                      en:
                        selected.value === "americanKitchen"
                          ? "American Kitchen"
                          : selected.value === "separateKitchen"
                          ? "Separate Kitchen"
                          : selected.value === "openKitchen"
                          ? "Open Kitchen"
                          : selected.value === "islandKitchen"
                          ? "Island Kitchen"
                          : selected.value === "cornerKitchen"
                          ? "Corner Kitchen"
                          : "",
                    });
                  }
                }}
                placeholder="Seçiniz"
              />
            </div>

            {/* Step navigation buttons */}
            <div className="mt-10 flex flex-col sm:flex-row justify-end items-center">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full sm:w-auto bg-[#6656AD] hover:bg-[#5349a0] text-white font-semibold px-8 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition"
              >
                Devam Et
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
