import { ChevronRightIcon, XCircleIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import { formatInputPrice, parseInputPrice } from "@/app/utils/priceFormatter";

import { useListingForm } from "../../CreationSteps";
import { useTranslations } from "next-intl";
import GoBackButton from "../../../GoBackButton/GoBackButton";

// Custom Select component that matches the design
interface SelectOption {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
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
        className={`w-full h-[56px] rounded-[16px] border bg-white px-4 flex items-center justify-between text-[#262626] focus:outline-none transition-colors cursor-pointer text-[14px] ${
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

export default function SecondCreateStepForWork() {
  const [errors, setErrors] = useState<string[]>([]);
  const [errorFields, setErrorFields] = useState<Set<string>>(new Set());
  const [selectedDuesCurrency, setSelectedDuesCurrency] =
    useState<string>("TRY");
  const formPanelRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("adminCreation.step2_work");

  // Use context for form state and navigation
  const {
    price,
    setPrice,
    projectArea,
    setProjectArea,
    roomCount,
    setRoomCount,
    floorCount,
    setFloorCount,
    exchangeable,
    setExchangeable,
    creditEligible,
    setCreditEligible,
    buildingAge,
    setBuildingAge,
    dues,
    setDues,
    usageStatus,
    setUsageStatus,
    heatingType,
    setHeatingType,
    source,
    setSource,
    setCurrentStep,
    floorPosition,
    setFloorPosition,
  } = useListingForm();

  // Handle amount change for a specific currency with formatting
  const handlePriceChange = (currency: string, inputValue: string) => {
    // Parse the input value to get numeric amount
    const numericAmount = parseInputPrice(inputValue, currency);

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

  // Get formatted price for display in input field
  const getPriceForCurrency = (currency: string): string => {
    if (!price) return "";
    const currencyPrice = price.find((p) => p.currency === currency);
    if (!currencyPrice || currencyPrice.amount === 0) return "";
    return formatInputPrice(currencyPrice.amount, currency);
  };

  // Handle dues change for a specific currency with formatting
  const handleDuesChange = (currency: string, inputValue: string) => {
    // Parse the input value to get numeric amount
    const numericAmount = parseInputPrice(inputValue, currency);

    setDues((prevDues) => {
      // Check if this currency already exists
      const existingCurrencyIndex = prevDues?.findIndex(
        (d) => d.currency === currency
      );

      if (existingCurrencyIndex !== undefined && existingCurrencyIndex >= 0) {
        // Update existing currency
        const updatedDues = [...(prevDues || [])];
        updatedDues[existingCurrencyIndex] = {
          ...updatedDues[existingCurrencyIndex],
          amount: numericAmount,
        };
        return updatedDues;
      } else {
        // Add new currency
        return [
          ...(prevDues || []),
          { currency: currency, amount: numericAmount },
        ];
      }
    });
  };

  // Get formatted dues for display in input field
  const getDuesForCurrency = (currency: string): string => {
    if (!dues) return "";
    const currencyDues = dues.find((d) => d.currency === currency);
    if (!currencyDues || currencyDues.amount === 0) return "";
    return formatInputPrice(currencyDues.amount, currency);
  };

  // Heating type options
  const heatingTypeOptions = [
    { value: "none", label: t("options.heatingTypes.none") },
    { value: "stove", label: t("options.heatingTypes.stove") },
    {
      value: "naturalGasStove",
      label: t("options.heatingTypes.naturalGasStove"),
    },
    { value: "floorHeater", label: t("options.heatingTypes.floorHeater") },
    {
      value: "underfloorHeating",
      label: t("options.heatingTypes.underfloorHeating"),
    },
    {
      value: "naturalGasBoiler",
      label: t("options.heatingTypes.naturalGasBoiler"),
    },
    { value: "central", label: t("options.heatingTypes.central") },
    {
      value: "airConditioning",
      label: t("options.heatingTypes.airConditioning"),
    },
    { value: "solarEnergy", label: t("options.heatingTypes.solarEnergy") },
  ];

  // Source options
  const sourceOptions = [
    { value: "fromOwner", label: t("options.sources.fromOwner") },
    { value: "fromRealEstate", label: t("options.sources.fromRealEstate") },
    {
      value: "fromConstruction",
      label: t("options.sources.fromConstruction"),
    },
  ];

  // Usage status options
  const usageStatusOptions = [
    { value: "empty", label: t("options.usageStatuses.empty") },
    {
      value: "tenantOccupied",
      label: t("options.usageStatuses.tenantOccupied"),
    },
    {
      value: "ownerOccupied",
      label: t("options.usageStatuses.ownerOccupied"),
    },
  ];

  // Building age options
  const buildingAgeOptions = [
    { value: 0, label: t("options.buildingAges.0") },
    { value: 1, label: t("options.buildingAges.1") },
    { value: 2, label: t("options.buildingAges.2") },
    { value: 3, label: t("options.buildingAges.3") },
    { value: 4, label: t("options.buildingAges.4") },
    { value: 5, label: t("options.buildingAges.5") },
    { value: 10, label: t("options.buildingAges.10") },
    { value: 15, label: t("options.buildingAges.15") },
    { value: 20, label: t("options.buildingAges.20+") },
  ];

  // Boolean options
  const booleanOptions = [
    { value: "true", label: t("options.booleans.true") },
    { value: "false", label: t("options.booleans.false") },
  ];

  const roomCountOptions = [
    { value: 1, label: t("options.roomCounts.1") },
    { value: 2, label: t("options.roomCounts.2") },
    { value: 3, label: t("options.roomCounts.3") },
    { value: 4, label: t("options.roomCounts.4") },
    { value: 5, label: t("options.roomCounts.5") },
    { value: 6, label: t("options.roomCounts.5+") },
  ];

  const floorCountOptions = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
    { value: 10, label: "10" },
    { value: 11, label: "11" },
    { value: 12, label: "12" },
    { value: 13, label: "13" },
    { value: 14, label: "14" },
    { value: 15, label: "15" },
    { value: 16, label: "16" },
    { value: 17, label: "17" },
    { value: 18, label: "18" },
    { value: 19, label: "19" },
    { value: 20, label: "20" },
  ];

  // Floor position options
  const floorPositionOptions = [
    {
      tr: t("options.floorPositions.level4Basement"),
      en: "Level 4 Basement",
    },
    {
      tr: t("options.floorPositions.level3Basement"),
      en: "Level 3 Basement",
    },
    {
      tr: t("options.floorPositions.level2Basement"),
      en: "Level 2 Basement",
    },
    {
      tr: t("options.floorPositions.level1Basement"),
      en: "Level 1 Basement",
    },
    { tr: t("options.floorPositions.groundFloor"), en: "Ground Floor" },
    { tr: t("options.floorPositions.basementFloor"), en: "Basement Floor" },
    { tr: t("options.floorPositions.gardenFloor"), en: "Garden Floor" },
    { tr: t("options.floorPositions.entrance"), en: "Entrance" },
    { tr: t("options.floorPositions.highEntrance"), en: "High Entrance" },
    { tr: t("options.floorPositions.roofFloor"), en: "Roof Floor" },
    { tr: t("options.floorPositions.1"), en: "1" },
    { tr: t("options.floorPositions.2"), en: "2" },
    { tr: t("options.floorPositions.3"), en: "3" },
    { tr: t("options.floorPositions.4"), en: "4" },
    { tr: t("options.floorPositions.5"), en: "5" },
    { tr: t("options.floorPositions.6"), en: "6" },
    { tr: t("options.floorPositions.7"), en: "7" },
    { tr: t("options.floorPositions.8"), en: "8" },
    { tr: t("options.floorPositions.9"), en: "9" },
    { tr: t("options.floorPositions.10"), en: "10" },
    { tr: t("options.floorPositions.11"), en: "11" },
    { tr: t("options.floorPositions.12"), en: "12" },
    { tr: t("options.floorPositions.13"), en: "13" },
    { tr: t("options.floorPositions.14"), en: "14" },
    { tr: t("options.floorPositions.15"), en: "15" },
    { tr: t("options.floorPositions.16"), en: "16" },
    { tr: t("options.floorPositions.17"), en: "17" },
    { tr: t("options.floorPositions.18"), en: "18" },
    { tr: t("options.floorPositions.19"), en: "19" },
    { tr: t("options.floorPositions.20+"), en: "20+" },
  ];

  // Helper function to get error styling for fields
  const getFieldErrorClass = (fieldName: string): string => {
    return errorFields.has(fieldName)
      ? "border-[#EF1A28] focus:border-[#EF1A28] focus:ring-[#EF1A28]/40"
      : "border-gray-300 focus:border-[#6656AD] focus:ring-[#6656AD]/40";
  };

  // Helper function to get error styling for selects
  const getSelectErrorClass = (fieldName: string): string => {
    return errorFields.has(fieldName)
      ? "border-[#EF1A28] focus:border-[#EF1A28]"
      : "border-[#E2E2E2] focus:border-[#5D568D] hover:border-[#5D568D]";
  };

  // Validate all required fields
  const validateFields = () => {
    const newErrors: string[] = [];
    const newErrorFields = new Set<string>();

    // Check if prices for all currencies are provided
    const usdPrice = price?.find((p) => p.currency === "USD");
    const tryPrice = price?.find((p) => p.currency === "TRY");

    if (!usdPrice || usdPrice.amount <= 0) {
      newErrors.push(t("validation.priceUSD"));
      newErrorFields.add("price-usd");
    }

    if (!tryPrice || tryPrice.amount <= 0) {
      newErrors.push(t("validation.priceTRY"));
      newErrorFields.add("price-try");
    }

    // Check area fields
    if (!projectArea || projectArea <= 0) {
      newErrors.push(t("validation.area"));
      newErrorFields.add("projectArea");
    }

    // Validate room counts for real estate (may not apply to land)
    if (!roomCount || roomCount < 0) {
      newErrors.push(t("validation.roomCount"));
      newErrorFields.add("roomCount");
    }

    if (!floorCount || floorCount <= 0) {
      newErrors.push(t("validation.floorCount"));
      newErrorFields.add("floorCount");
    }

    if ((!buildingAge && buildingAge !== 0) || buildingAge < 0) {
      newErrors.push(t("validation.buildingAge"));
      newErrorFields.add("buildingAge");
    }

    if (!heatingType || heatingType.tr === "" || heatingType.en === "") {
      newErrors.push(t("validation.heatingType"));
      newErrorFields.add("heatingType");
    }

    if (!source || source.tr === "" || source.en === "") {
      newErrors.push(t("validation.source"));
      newErrorFields.add("source");
    }

    if (!usageStatus || !usageStatus.get("tr") || !usageStatus.get("en")) {
      newErrors.push(t("validation.usageStatus"));
      newErrorFields.add("usageStatus");
    }

    if (!floorPosition || floorPosition.tr === "" || floorPosition.en === "") {
      newErrors.push(t("validation.floorPosition"));
      newErrorFields.add("floorPosition");
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
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (formPanelRef.current) {
        formPanelRef.current.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Handle going back to previous step
  const handleBack = () => {
    setCurrentStep(1);
  };

  // Add scroll reset effect when component mounts
  useEffect(() => {
    const scrollToTop = () => {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (formPanelRef.current) {
        formPanelRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    scrollToTop();
  }, []);

  return (
    <div className=" bg-[#ECEBF4] flex justify-center items-start p-4 py-6">
      <div className="w-full max-w-[1200px] rounded-2xl shadow-lg bg-white h-full ">
        <div className="flex flex-col md:flex-row h-full md:h-[73vh]  2xl:h-[76vh]">
          {/* Left Info Panel */}
          <div className="w-full md:w-[30%] md:p-6 hidden flex-col md:flex justify-between">
            <div>
              <h1 className="text-2xl font-extrabold leading-tight text-[#362C75]">
                {t("title")}
              </h1>
              <div className="mt-4 text-base text-[#595959] font-medium">
                <p className="leading-[140%]">{t("description")}</p>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="flex-1 h-full flex flex-col">
            <div className="p-6 flex-1 overflow-auto md:border-l border-[#F0F0F0]">
              <div ref={formPanelRef} className="h-full">
                {/* Errors display */}
                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 m-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <XCircleIcon
                          className="h-5 w-5 text-red-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          {t("fixErrors")}
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
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="w-full sm:w-1/2">
                      <label className="font-bold block mb-2 text-[#262626] text-[16px]">
                        {t("priceTRY")}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#262626] font-medium text-[14px]">
                          ₺
                        </span>
                        <input
                          type="text"
                          value={getPriceForCurrency("TRY") || ""}
                          onChange={(e) =>
                            handlePriceChange("TRY", e.target.value)
                          }
                          className={`w-full h-[56px] rounded-[16px] border pl-8 pr-4 placeholder-gray-400 focus:outline-none focus:ring-2 text-[#262626] text-[14px] ${getFieldErrorClass(
                            "price-try"
                          )}`}
                          placeholder={t("pricePlaceholder")}
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label className="font-bold block mb-2 text-[#262626] text-[16px]">
                        {t("priceUSD")}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#262626] font-medium text-[14px]">
                          $
                        </span>
                        <input
                          type="text"
                          value={getPriceForCurrency("USD") || ""}
                          onChange={(e) =>
                            handlePriceChange("USD", e.target.value)
                          }
                          className={`w-full h-[56px] rounded-[16px] border pl-8 pr-4 placeholder-gray-400 focus:outline-none focus:ring-2 text-[#262626] text-[14px] ${getFieldErrorClass(
                            "price-usd"
                          )}`}
                          placeholder={t("pricePlaceholder")}
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

                {/* Metrekare - Bölüm / Oda Sayısı - Kat Sayısı */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="w-full lg:w-1/3">
                    <label
                      htmlFor="projectArea"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("area")}
                    </label>
                    <input
                      type="text"
                      id="projectArea"
                      value={projectArea || ""}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(
                          /[^0-9.]/g,
                          ""
                        );
                        const parts = numericValue.split(".");
                        const validValue =
                          parts.length > 2
                            ? parts[0] + "." + parts.slice(1).join("")
                            : numericValue;
                        setProjectArea(parseFloat(validValue) || 0);
                      }}
                      className="w-full h-[56px] rounded-[16px] border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626] text-[14px]"
                      placeholder={t("areaPlaceholder")}
                    />
                  </div>
                  <div className="w-full lg:w-1/3">
                    <label
                      htmlFor="roomCount"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("roomCount")}
                    </label>
                    <CustomSelect
                      options={roomCountOptions}
                      value={roomCount || 0}
                      onChange={(value) =>
                        setRoomCount(parseInt(value.toString()))
                      }
                      placeholder={t("selectPlaceholder")}
                      hasError={errorFields.has("roomCount")}
                    />
                  </div>
                  <div className="w-full lg:w-1/3">
                    <label
                      htmlFor="floorCount"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("floorCount")}
                    </label>
                    <CustomSelect
                      options={floorCountOptions}
                      value={floorCount || 0}
                      onChange={(value) =>
                        setFloorCount(parseInt(value.toString()))
                      }
                      placeholder={t("selectPlaceholder")}
                      hasError={errorFields.has("floorCount")}
                    />
                  </div>
                </div>

                {/* Bulunduğu Kat - Kimden - Takaslı */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="w-full lg:w-1/3">
                    <label
                      htmlFor="floorPosition"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("floorPosition")}
                    </label>
                    <CustomSelect
                      options={floorPositionOptions.map((option) => ({
                        value: option.tr,
                        label: option.tr,
                      }))}
                      value={floorPosition?.tr || ""}
                      onChange={(value) => {
                        const selected = floorPositionOptions.find(
                          (option) => option.tr === value
                        );
                        if (selected) {
                          setFloorPosition({
                            tr: selected.tr,
                            en: selected.en,
                          });
                        }
                      }}
                      placeholder={t("selectPlaceholder")}
                      hasError={errorFields.has("floorPosition")}
                    />
                  </div>
                  <div className="w-full lg:w-1/3">
                    <label
                      htmlFor="source"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("source")}
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
                                : selected.value === "fromRealEstate"
                                ? "From Real Estate Office"
                                : selected.value === "fromConstruction"
                                ? "From Construction Company"
                                : "",
                          });
                        }
                      }}
                      placeholder={t("selectPlaceholder")}
                      hasError={errorFields.has("source")}
                    />
                  </div>
                  <div className="w-full lg:w-1/3">
                    <label
                      htmlFor="exchangeable"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("exchangeable")}
                    </label>
                    <CustomSelect
                      options={booleanOptions}
                      value={exchangeable ? true : false}
                      onChange={(value) => setExchangeable(value as any)}
                      placeholder={t("selectPlaceholder")}
                    />
                  </div>
                </div>

                {/* Isıtma - Kullanım Durumu - Bina Yaşı */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="w-full lg:w-1/3">
                    <label
                      htmlFor="heatingType"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("heating")}
                    </label>
                    <CustomSelect
                      options={heatingTypeOptions}
                      value={
                        heatingType?.tr
                          ? heatingTypeOptions.find(
                              (option) => option.label === heatingType.tr
                            )?.value || ""
                          : ""
                      }
                      onChange={(value) => {
                        const selected = heatingTypeOptions.find(
                          (option) => option.value === value
                        );
                        if (selected) {
                          setHeatingType({
                            tr: selected.label,
                            en:
                              selected.value === "none"
                                ? "None"
                                : selected.value === "stove"
                                ? "Stove"
                                : selected.value === "naturalGasStove"
                                ? "Natural Gas Stove"
                                : selected.value === "floorHeater"
                                ? "Floor Heater"
                                : selected.value === "naturalGasBoiler"
                                ? "Natural Gas (Boiler)"
                                : selected.value === "central"
                                ? "Central"
                                : selected.value === "airConditioning"
                                ? "Air Conditioning"
                                : selected.value === "solarEnergy"
                                ? "Solar Energy"
                                : "",
                          });
                        }
                      }}
                      placeholder={t("selectPlaceholder")}
                      hasError={errorFields.has("heatingType")}
                    />
                  </div>
                  <div className="w-full lg:w-1/3">
                    <label
                      htmlFor="usageStatus"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("usageStatus")}
                    </label>
                    <CustomSelect
                      options={usageStatusOptions}
                      value={
                        usageStatus?.get("tr")
                          ? usageStatusOptions.find(
                              (option) => option.label === usageStatus.get("tr")
                            )?.value || ""
                          : ""
                      }
                      onChange={(value) => {
                        const selected = usageStatusOptions.find(
                          (option) => option.value === value
                        );
                        if (selected) {
                          const usageMap = new Map<string, string>();
                          usageMap.set("tr", selected.label);
                          usageMap.set(
                            "en",
                            selected.value === "empty"
                              ? "Empty"
                              : selected.value === "tenantOccupied"
                              ? "Tenant Occupied"
                              : selected.value === "ownerOccupied"
                              ? "Owner Occupied"
                              : ""
                          );
                          setUsageStatus(usageMap);
                        }
                      }}
                      placeholder={t("selectPlaceholder")}
                      hasError={errorFields.has("usageStatus")}
                    />
                  </div>
                  <div className="w-full lg:w-1/3">
                    <label
                      htmlFor="buildingAge"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("buildingAge")}
                    </label>
                    <CustomSelect
                      options={buildingAgeOptions}
                      value={buildingAge || 0}
                      onChange={(value) =>
                        setBuildingAge(parseInt(value.toString()))
                      }
                      placeholder={t("selectPlaceholder")}
                      hasError={errorFields.has("buildingAge")}
                    />
                  </div>
                </div>

                {/* Krediye Uygunluk - Aidat */}
                <div className="flex flex-col lg:flex-row gap-4 pb-6">
                  <div className="w-full lg:w-1/2">
                    <label
                      htmlFor="creditEligible"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("creditEligible")}
                    </label>
                    <CustomSelect
                      options={booleanOptions}
                      value={creditEligible ? true : false}
                      onChange={(value) => setCreditEligible(value as any)}
                      placeholder={t("selectPlaceholder")}
                      openUpward={true}
                    />
                  </div>
                  <div className="w-full lg:w-1/2">
                    <label className="font-bold block mb-2 text-[#262626] text-[16px]">
                      {t("dues")}
                    </label>
                    <div className="flex gap-2">
                      <div className="w-24">
                        <CustomSelect
                          options={[
                            { value: "TRY", label: "TRY" },
                            { value: "USD", label: "USD" },
                          ]}
                          value={selectedDuesCurrency}
                          onChange={(value) =>
                            setSelectedDuesCurrency(value as string)
                          }
                          placeholder="TRY"
                          openUpward={true}
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={getDuesForCurrency(selectedDuesCurrency) || ""}
                          onChange={(e) =>
                            handleDuesChange(
                              selectedDuesCurrency,
                              e.target.value
                            )
                          }
                          className="w-full h-[56px] rounded-[16px] border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                          placeholder={t("pricePlaceholder")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" flex flex-col sm:flex-row justify-between items-center p-6">
          <GoBackButton handleBack={handleBack} step={2} totalSteps={6} />
          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto bg-[#5E5691] hover:bg-[#5349a0] text-white font-semibold px-8 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition"
          >
            {t("continue")}
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
