import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import { formatInputPrice, parseInputPrice } from "@/app/utils/priceFormatter";

import GoBackButton from "../../../GoBackButton/GoBackButton";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useListingForm } from "../../CreationSteps";

// Custom Select component that matches the design
interface SelectOption {
  value: string | number | boolean | null;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  openUpward?: boolean;
  hasError?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select option",
  openUpward = false,
  hasError = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  console.log({
    value,
  });

  const selectedOption = options.find(
    (option) => option.value?.toString() === value?.toString()
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
        className={`w-full h-12 rounded-lg border bg-white px-4 flex items-center justify-between text-[#262626] focus:outline-none transition-colors ${
          hasError
            ? "border-[#EF1A28] focus:border-[#EF1A28]"
            : "border-[#E2E2E2] focus:border-[#5D568D] hover:border-[#5D568D]"
        }`}
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
        <div
          className={`absolute left-0 z-10 w-full rounded-lg bg-white shadow-lg border border-[#E2E2E2] ${
            openUpward
              ? "bottom-full mb-1 origin-bottom-right"
              : "mt-1 origin-top-right"
          }`}
        >
          <div className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value?.toString() || ""}
                className="px-4 py-3 hover:bg-[#F5F5F5] cursor-pointer text-[#262626] transition-colors"
                onClick={() => {
                  onChange(option.value?.toString() || "");
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

export default function SecondCreateStepForLand() {
  const [errors, setErrors] = useState<string[]>([]);
  const [errorFields, setErrorFields] = useState<Set<string>>(new Set());
  const formPanelRef = useRef<HTMLDivElement>(null);

  // Use context for form state and navigation
  const {
    price,
    setPrice,
    projectArea,
    setProjectArea,
    exchangeable,
    setExchangeable,
    creditEligible,
    setCreditEligible,
    source,
    setSource,
    setCurrentStep,
    generalFeatures,
    setGeneralFeatures,
    zoningStatus,
    setZoningStatus,
    deedStatus,
    setDeedStatus,
  } = useListingForm();

  // Handle amount change for a specific currency with formatting
  const handlePriceChange = (currency: string, inputValue: string) => {
    // Parse the input value to get numeric amount
    const numericAmount = parseInputPrice(inputValue, currency);

    setPrice((prevPrice: any) => {
      // Check if this currency already exists
      const existingCurrencyIndex = prevPrice?.findIndex(
        (p: any) => p.currency === currency
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

  // Get formatted price for display in input field
  const getPriceForCurrency = (currency: string): string => {
    if (!price) return "";
    const currencyPrice = price.find((p: any) => p.currency === currency);
    if (!currencyPrice || currencyPrice.amount === 0) return "";
    return formatInputPrice(currencyPrice.amount, currency);
  };

  const generalFeaturesOptions = [
    { value: "partitioned", label: "İfrazlı", en: "Partitioned" },
    { value: "parceled", label: "Parselli", en: "Parceled" },
    { value: "withProject", label: "Projeli", en: "With Project" },
    { value: "cornerParcel", label: "Köşe Parsel", en: "Corner Parcel" },
  ];

  const creditEligibleOptions = [
    { value: true, label: "Evet" },
    { value: false, label: "Hayır" },
    { value: null, label: "Bilinmiyor" },
  ];

  const sourceOptions = [
    { value: "fromOwner", label: "Sahibinden" },
    { value: "fromRealEstate", label: "Emlak Ofisinden" },
  ];

  const zoningStatusOptions = [
    { value: "island", label: "Ada", en: "Island" },
    { value: "a-legend", label: "A-Lejantlı", en: "A-Legend" },
    { value: "land", label: "Arazi", en: "Land" },
    { value: "vineyard-garden", label: "Bağ & Bahçe", en: "Vineyard & Garden" },
    {
      value: "warehouse-depot",
      label: "Depo & Antrepo",
      en: "Warehouse & Depot",
    },
    { value: "education", label: "Eğitim", en: "Education" },
    {
      value: "energy-storage",
      label: "Enerji Depolama",
      en: "Energy Storage",
    },
    { value: "residential", label: "Konut", en: "Residential" },
    { value: "miscellaneous", label: "Muhtelif", en: "Miscellaneous" },
    { value: "private-use", label: "Özel Kullanım", en: "Private Use" },
    { value: "health", label: "Sağlık", en: "Health" },
    { value: "industrial", label: "Sanayi", en: "Industry" },
    { value: "greenhouse", label: "Sera", en: "Greenhouse" },
    { value: "protected-area", label: "Sit Alanı", en: "Protected Area" },
    { value: "sports-area", label: "Spor Alanı", en: "Sports Area" },
    { value: "field", label: "Tarla", en: "Field" },
    { value: "field-vineyard", label: "Tarla + Bağ", en: "Field + Vineyard" },
    { value: "commercial", label: "Ticari", en: "Commercial" },
    {
      value: "commercial-residential",
      label: "Ticari + Konut",
      en: "Commercial + Residential",
    },
    { value: "mass-housing", label: "Toplu Konut", en: "Mass Housing" },
    { value: "tourism", label: "Turizm", en: "Tourism" },
    {
      value: "tourism-residential",
      label: "Turizm + Konut",
      en: "Tourism + Residential",
    },
    {
      value: "tourism-commercial",
      label: "Turizm + Ticari",
      en: "Tourism + Commercial",
    },
    { value: "villa", label: "Villa", en: "Villa" },
    { value: "olive-grove", label: "Zeytinlik", en: "Olive Grove" },
  ];

  const deedStatusOptions = [
    { value: "shared-title", label: "Hisseli Tapu", en: "Shared Title Deed" },
    {
      value: "independent-title",
      label: "Müstakil Tapulu",
      en: "Independent Title Deed",
    },
    { value: "allocation-deed", label: "Tahsis Tapu", en: "Allocation Deed" },
    { value: "possession-deed", label: "Zilliyet Tapu", en: "Possession Deed" },
    {
      value: "cooperative-share",
      label: "Kooperatif Hisseli Tapu",
      en: "Cooperative Share Title",
    },
    {
      value: "foreign-title",
      label: "Yurt Dışı Tapulu",
      en: "Foreign Title Deed",
    },
    { value: "no-deed", label: "Tapu Kaydı Yok", en: "No Title Deed Record" },
  ];

  const booleanOptions = [
    { value: "true", label: "Evet" },
    { value: "false", label: "Hayır" },
  ];

  // Helper function to get error styling for fields
  const getFieldErrorClass = (fieldName: string): string => {
    return errorFields.has(fieldName)
      ? "border-[#EF1A28] focus:border-[#EF1A28] focus:ring-[#EF1A28]/40"
      : "border-gray-300 focus:border-[#6656AD] focus:ring-[#6656AD]/40";
  };

  // Validate all required fields
  const validateFields = () => {
    const newErrors: string[] = [];
    const newErrorFields = new Set<string>();

    // Check if prices for all currencies are provided
    const usdPrice = price?.find((p: any) => p.currency === "USD");
    const tryPrice = price?.find((p: any) => p.currency === "TRY");

    if (!usdPrice || usdPrice.amount <= 0) {
      newErrors.push("Lütfen USD para biriminde fiyat belirtin");
      newErrorFields.add("price-usd");
    }

    if (!tryPrice || tryPrice.amount <= 0) {
      newErrors.push("Lütfen TRY para biriminde fiyat belirtin");
      newErrorFields.add("price-try");
    }

    // Check area fields
    if (!projectArea || projectArea <= 0) {
      newErrors.push("Lütfen metrekare değerini girin");
      newErrorFields.add("projectArea");
    }

    if (
      !generalFeatures ||
      !generalFeatures.get("tr") ||
      !generalFeatures.get("en")
    ) {
      newErrors.push("Lütfen genel özellikleri seçin");
      newErrorFields.add("generalFeatures");
    }

    if (typeof creditEligible === "undefined") {
      newErrors.push("Lütfen krediye uygunluk durumunu seçin");
      newErrorFields.add("creditEligible");
    }

    if (!source || source.tr === "" || source.en === "") {
      newErrors.push("Lütfen kimden bilgisini seçin");
      newErrorFields.add("source");
    }

    if (!zoningStatus || !zoningStatus.get("tr") || !zoningStatus.get("en")) {
      newErrors.push("Lütfen imar durumunu seçin");
      newErrorFields.add("zoningStatus");
    }

    if (!deedStatus || !deedStatus.get("tr") || !deedStatus.get("en")) {
      newErrors.push("Lütfen tapu durumunu seçin");
      newErrorFields.add("deedStatus");
    }

    setErrors(newErrors);
    setErrorFields(newErrorFields);
    return newErrors.length === 0;
  };

  // Handle form submission to next step
  const handleContinue = () => {
    // Clear previous errors
    setErrors([]);
    setErrorFields(new Set());

    // Validate all fields
    const isValid = validateFields();

    if (isValid) {
      // Log current form data

      // Move to the next step
      setCurrentStep(3);
    } else {
      // Scroll form panel to top to see errors
      if (formPanelRef.current) {
        formPanelRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
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
          {/* Left Info Panel */}
          <div className="w-full md:w-[30%] mb-8 md:mb-0 md:pr-6 flex flex-col">
            <h1 className="text-2xl font-extrabold leading-tight text-[#362C75]">
              Arsa özelliklerini belirtin.
            </h1>
            <div className="mt-4 text-base text-[#595959] font-medium">
              <p className="leading-[140%]">
                Bu adımda, arsanın temel özelliklerini, fiyatını ve imar durumu
                gibi diğer önemli detayları girebilirsiniz. Bu bilgilerin
                doğruluğu, potansiyel alıcıların ilgisini çekmek için kritiktir.
              </p>
            </div>
          </div>

          {/* Right Form Panel */}
          <div ref={formPanelRef} className="w-full md:w-[70%] md:pl-6 h-auto md:h-[67vh]  2xl:h-[73vh] overflow-auto border-none md:border-l md:border-[#F0F0F0]">
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

            {/* Price */}
            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-[#262626] text-2xl">
                Fiyat
              </h2>
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
                      className={`w-full h-12 rounded-lg border pl-8 pr-4 placeholder-gray-400 focus:outline-none focus:ring-2 text-[#262626] ${getFieldErrorClass("price-try")}`}
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
                      className={`w-full h-12 rounded-lg border pl-8 pr-4 placeholder-gray-400 focus:outline-none focus:ring-2 text-[#262626] ${getFieldErrorClass("price-usd")}`}
                      placeholder="Fiyat yazın"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Areas */}
            <div className="mb-6">
              <label
                htmlFor="projectArea"
                className="font-semibold block mb-2 text-[#262626]"
              >
                Metrekare
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
                className={`w-full h-12 rounded-lg border px-4 placeholder-gray-400 focus:outline-none focus:ring-2 text-[#262626] ${getFieldErrorClass("projectArea")}`}
                placeholder="m²"
              />
            </div>
            {/* Krediye Uygunluk - Kimden */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="creditEligible"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Krediye Uygunluk
                </label>
                <CustomSelect
                  options={creditEligibleOptions}
                  value={creditEligible}
                  onChange={(value) => setCreditEligible(value)}
                  placeholder="Seçiniz"
                  hasError={errorFields.has("creditEligible")}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="source"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Kimden
                </label>
                <CustomSelect
                  options={sourceOptions}
                  value={
                    source?.tr
                      ? sourceOptions.find(
                          (option) => option.label === source.tr
                        )?.value || ""
                      : ""
                  }
                  onChange={(value) => {
                    const selected = sourceOptions.find(
                      (option) => option.value === value
                    );
                    if (selected) {
                      setSource({
                        tr: selected.label,
                        en:
                          selected.value === "fromOwner"
                            ? "From Owner"
                            : "From Real Estate Office",
                      });
                    }
                  }}
                  placeholder="Seçiniz"
                  hasError={errorFields.has("source")}
                />
              </div>
            </div>

            {/* İmar Durumu - Tapu Durumu */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="zoningStatus"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  İmar Durumu
                </label>
                <CustomSelect
                  options={zoningStatusOptions}
                  value={
                    zoningStatus?.get("tr")
                      ? zoningStatusOptions.find(
                          (option) => option.label === zoningStatus.get("tr")
                        )?.value || ""
                      : ""
                  }
                  onChange={(value) => {
                    const selected = zoningStatusOptions.find(
                      (option) => option.value === value
                    );
                    if (selected) {
                      const newMap = new Map<string, string>();
                      newMap.set("tr", selected.label);
                      newMap.set("en", selected.en);
                      setZoningStatus(newMap);
                    }
                  }}
                  placeholder="Seçiniz"
                  hasError={errorFields.has("zoningStatus")}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="deedStatus"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Tapu Durumu
                </label>
                <CustomSelect
                  options={deedStatusOptions}
                  value={
                    deedStatus?.get("tr")
                      ? deedStatusOptions.find(
                          (option) => option.label === deedStatus.get("tr")
                        )?.value || ""
                      : ""
                  }
                  onChange={(value) => {
                    const selected = deedStatusOptions.find(
                      (option) => option.value === value
                    );
                    if (selected) {
                      const newMap = new Map<string, string>();
                      newMap.set("tr", selected.label);
                      newMap.set("en", selected.en);
                      setDeedStatus(newMap);
                    }
                  }}
                  placeholder="Seçiniz"
                  hasError={errorFields.has("deedStatus")}
                />
              </div>
            </div>

            {/* Genel Özellikler - Takaslı */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="generalFeatures"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Genel Özellikler
                </label>
                <CustomSelect
                  options={generalFeaturesOptions}
                  value={
                    generalFeatures?.get("tr")
                      ? generalFeaturesOptions.find(
                          (option) => option.label === generalFeatures.get("tr")
                        )?.value || ""
                      : ""
                  }
                  onChange={(value) => {
                    const selected = generalFeaturesOptions.find(
                      (option) => option.value === value
                    );
                    if (selected) {
                      const newMap = new Map<string, string>();
                      newMap.set("tr", selected.label);
                      newMap.set("en", selected.en);
                      setGeneralFeatures(newMap);
                    }
                  }}
                  placeholder="Seçiniz"
                  openUpward={true}
                  hasError={errorFields.has("generalFeatures")}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="exchangeable"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Takaslı
                </label>
                <CustomSelect
                  options={booleanOptions}
                  value={exchangeable ? "true" : "false"}
                  onChange={(value) => setExchangeable(value === "true")}
                  placeholder="Seçiniz"
                  openUpward={true}
                />
              </div>
            </div>
          </div>
        </div>
        <div className=" flex flex-col sm:flex-row justify-between items-center p-6">
          <GoBackButton handleBack={handleBack} step={2} totalSteps={6} />
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
  );
}
