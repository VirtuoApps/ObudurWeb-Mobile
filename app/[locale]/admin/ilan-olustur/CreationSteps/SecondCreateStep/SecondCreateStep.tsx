import React, { useState } from "react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { useListingForm } from "../CreationSteps";
import { XCircleIcon } from "@heroicons/react/24/solid";

export default function SecondCreateStep() {
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("TRY");

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

  // Handle amount change for the selected currency
  const handlePriceChange = (amount: string) => {
    const numericAmount = amount === "" ? 0 : parseFloat(amount);

    setPrice((prevPrice) => {
      // Check if this currency already exists
      const existingCurrencyIndex = prevPrice?.findIndex(
        (p) => p.currency === selectedCurrency
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
          { currency: selectedCurrency, amount: numericAmount },
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

  // Handle currency change
  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
  };

  // Currency options
  const currencyOptions = [
    { value: "TRY", label: "TL" },
    { value: "USD", label: "USD" },
  ];

  // Kitchen type options
  const kitchenTypeOptions = [
    { value: "americanKitchen", tr: "Amerikan Mutfak", en: "American Kitchen" },
    { value: "separateKitchen", tr: "Ayrı Mutfak", en: "Separate Kitchen" },
    { value: "openKitchen", tr: "Açık Mutfak", en: "Open Kitchen" },
    { value: "islandKitchen", tr: "Ada Mutfak", en: "Island Kitchen" },
    { value: "cornerKitchen", tr: "Köşe Mutfak", en: "Corner Kitchen" },
  ];

  // Generate options for select inputs
  const generateOptions = (min: number, max: number) => {
    const options = [];
    for (let i = min; i <= max; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
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
    <div className="min-h-screen bg-[#ECEBF4] flex items-center justify-center p-4">
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
            <span className="text-sm text-gray-600 mb-4 sm:mb-0 mt-auto">
              Adım 2 / 5
            </span>
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

              <div className="flex flex-row gap-4 mb-6">
                <div className="relative w-[100px]">
                  <div className="relative">
                    <select
                      value={selectedCurrency}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                      className="w-full h-12 appearance-none rounded-lg border border-gray-300 bg-white px-4 pr-8 text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40"
                    >
                      {currencyOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDownIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="number"
                      value={getPriceForCurrency(selectedCurrency) || ""}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                      placeholder="Fiyat girin"
                      min="0"
                    />
                    <div className="absolute inset-y-0 right-2 flex flex-col items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          const currentPrice =
                            getPriceForCurrency(selectedCurrency) || 0;
                          handlePriceChange((currentPrice + 1).toString());
                        }}
                        className="text-gray-500 h-6 w-6 flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const currentPrice =
                            getPriceForCurrency(selectedCurrency) || 0;
                          if (currentPrice > 0) {
                            handlePriceChange((currentPrice - 1).toString());
                          }
                        }}
                        className="text-gray-500 h-6 w-6 flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
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
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500">
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
              </div>
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
                  type="number"
                  id="projectArea"
                  value={projectArea || ""}
                  onChange={(e) =>
                    setProjectArea(parseFloat(e.target.value) || 0)
                  }
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                  placeholder="Brüt m²"
                  min="0"
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
                  type="number"
                  id="totalSize"
                  value={totalSize || ""}
                  onChange={(e) =>
                    setTotalSize(parseFloat(e.target.value) || 0)
                  }
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                  placeholder="Net m²"
                  min="0"
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
                <select
                  id="roomCount"
                  value={roomCount || 0}
                  onChange={(e) => setRoomCount(parseInt(e.target.value))}
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                >
                  {generateOptions(0, 10)}
                </select>
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="bathroomCount"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Banyo Sayısı
                </label>
                <select
                  id="bathroomCount"
                  value={bathroomCount || 0}
                  onChange={(e) => setBathroomCount(parseInt(e.target.value))}
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                >
                  {generateOptions(0, 5)}
                </select>
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
                <select
                  id="bedRoomCount"
                  value={bedRoomCount || 0}
                  onChange={(e) => setBedRoomCount(parseInt(e.target.value))}
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                >
                  {generateOptions(0, 5)}
                </select>
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="floorCount"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Kat Sayısı
                </label>
                <select
                  id="floorCount"
                  value={floorCount || 0}
                  onChange={(e) => setFloorCount(parseInt(e.target.value))}
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                >
                  {generateOptions(0, 5)}
                </select>
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
                type="number"
                id="buildYear"
                value={buildYear || ""}
                onChange={(e) => setBuildYear(parseInt(e.target.value) || 0)}
                className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                placeholder="Yapım yılı"
                min="1900"
                max={new Date().getFullYear()}
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
              <select
                id="kitchenType"
                value={
                  kitchenType?.tr
                    ? kitchenTypeOptions.find(
                        (option) => option.tr === kitchenType.tr
                      )?.value
                    : ""
                }
                onChange={(e) => {
                  const selected = kitchenTypeOptions.find(
                    (option) => option.value === e.target.value
                  );
                  if (selected) {
                    setKitchenType({
                      tr: selected.tr,
                      en: selected.en,
                    });
                  }
                }}
                className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
              >
                <option value="">Seçiniz</option>
                {kitchenTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.tr}
                  </option>
                ))}
              </select>
            </div>

            {/* Step navigation buttons */}
            <div className="mt-10 flex flex-col sm:flex-row justify-between items-center">
              <button
                type="button"
                onClick={handleBack}
                className="w-full mb-4 sm:mb-0 sm:w-auto bg-white hover:bg-gray-50 text-[#6656AD] font-semibold px-8 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition border border-[#6656AD]"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                Geri
              </button>

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
