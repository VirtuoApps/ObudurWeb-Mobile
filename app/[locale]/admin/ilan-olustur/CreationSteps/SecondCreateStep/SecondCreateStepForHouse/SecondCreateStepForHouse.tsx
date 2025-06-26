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

export default function SecondCreateStepForHouse() {
  const t = useTranslations("adminCreation.step2_house");
  const [errors, setErrors] = useState<string[]>([]);
  const [errorFields, setErrorFields] = useState<Set<string>>(new Set());
  const [selectedDuesCurrency, setSelectedDuesCurrency] =
    useState<string>("TRY");
  const formPanelRef = useRef<HTMLDivElement>(null);

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
    exchangeable,
    setExchangeable,
    creditEligible,
    setCreditEligible,
    buildingAge,
    setBuildingAge,
    isFurnished,
    setIsFurnished,
    dues,
    setDues,
    usageStatus,
    setUsageStatus,
    deedStatus,
    setDeedStatus,
    heatingType,
    setHeatingType,
    source,
    setSource,
    floorPosition,
    setFloorPosition,
    setCurrentStep,
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

  // Kitchen type options
  const kitchenTypeOptions = [
    {
      value: "americanKitchen",
      label: t("options.kitchenTypes.americanKitchen"),
    },
    {
      value: "separateKitchen",
      label: t("options.kitchenTypes.separateKitchen"),
    },
    { value: "openKitchen", label: t("options.kitchenTypes.openKitchen") },
    { value: "islandKitchen", label: t("options.kitchenTypes.islandKitchen") },
    { value: "cornerKitchen", label: t("options.kitchenTypes.cornerKitchen") },
  ];

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

  // Deed status options
  const deedStatusOptions = [
    { value: "condominium", label: t("options.deedStatuses.condominium") },
    { value: "floorEasement", label: t("options.deedStatuses.floorEasement") },
    { value: "sharedDeed", label: t("options.deedStatuses.sharedDeed") },
    { value: "detachedDeed", label: t("options.deedStatuses.detachedDeed") },
    { value: "landDeed", label: t("options.deedStatuses.landDeed") },
    {
      value: "cooperativeShare",
      label: t("options.deedStatuses.cooperativeShare"),
    },
    {
      value: "usufructRight",
      label: t("options.deedStatuses.usufructRight"),
    },
    { value: "foreignDeed", label: t("options.deedStatuses.foreignDeed") },
    { value: "noDeedRecord", label: t("options.deedStatuses.noDeedRecord") },
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

  // Generate options for number-based selects
  const generateNumberOptions = (min: number, max: number): SelectOption[] => {
    const options: SelectOption[] = [];
    for (let i = min; i <= max; i++) {
      options.push({ value: i, label: i.toString() });
    }
    return options;
  };

  const generateRoomCountOptions = (): SelectOption[] => {
    return [
      { value: 9999999, label: t("options.roomCounts.studio") },
      { value: 1, label: t("options.roomCounts.1+1") },
      { value: 2, label: t("options.roomCounts.2+1") },
      { value: 3, label: t("options.roomCounts.3+1") },
      { value: 4, label: t("options.roomCounts.4+1") },
      { value: 5, label: t("options.roomCounts.5+1") },
      { value: 6, label: t("options.roomCounts.6+1") },
      { value: 7, label: t("options.roomCounts.7+1") },
      { value: 8, label: t("options.roomCounts.8+1") },
      { value: 9, label: t("options.roomCounts.9+1") },
      { value: 10, label: t("options.roomCounts.10+") },
    ];
  };

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
      newErrors.push(t("validation.grossArea"));
      newErrorFields.add("projectArea");
    }

    if (!totalSize || totalSize <= 0) {
      newErrors.push(t("validation.netArea"));
      newErrorFields.add("totalSize");
    }

    // Validate room counts for real estate (may not apply to land)
    if ((!roomCount && roomCount !== 0) || roomCount < 0) {
      newErrors.push(t("validation.roomCount"));
      newErrorFields.add("roomCount");
    }

    if ((!bathroomCount && bathroomCount !== 0) || bathroomCount < 0) {
      newErrors.push(t("validation.bathroomCount"));
      newErrorFields.add("bathroomCount");
    }

    if ((!bedRoomCount && bedRoomCount !== 0) || bedRoomCount < 0) {
      newErrors.push(t("validation.balconyCount"));
      newErrorFields.add("bedRoomCount");
    }

    if (!floorCount || floorCount <= 0) {
      newErrors.push(t("validation.floorCount"));
      newErrorFields.add("floorCount");
    }

    if (!kitchenType || kitchenType.tr === "" || kitchenType.en === "") {
      newErrors.push(t("validation.kitchenType"));
      newErrorFields.add("kitchenType");
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

    if (!deedStatus || !deedStatus.get("tr") || !deedStatus.get("en")) {
      newErrors.push(t("validation.deedStatus"));
      newErrorFields.add("deedStatus");
    }

    if (!floorPosition || floorPosition.tr === "" || floorPosition.en === "") {
      newErrors.push(t("validation.floorPosition"));
      newErrorFields.add("floorPosition");
    }

    setErrors(newErrors);
    setErrorFields(newErrorFields);
    return newErrors.length === 0;
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
      // Scroll to top to see errors - handle both mobile and desktop
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

  return (
    <div className=" bg-[#ECEBF4] flex justify-center items-start p-4 py-6">
      <div className="w-full max-w-[1200px] rounded-2xl shadow-lg bg-white h-full">
        <div className="flex flex-col md:flex-row h-full md:h-[85vh]  2xl:h-[88vh]">
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
            <GoBackButton handleBack={handleBack} step={2} totalSteps={6} />
          </div>

          {/* Right Form Panel */}
          <div className="flex-1 h-full flex flex-col">
            <div className="p-6 flex-1 overflow-auto md:border-l border-[#F0F0F0]">
              <div ref={formPanelRef} className="h-full">
                {/* Errors display */}
                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 m-0 mb-6">
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
                      <label className="block mb-2 text-[#262626] text-[16px] font-bold">
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
                      <label className="block mb-2 text-[#262626] text-[16px] font-bold">
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

                {/* Metrekare (Brüt) - Metrekare (Net) - Oda Sayısı */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="w-full lg:w-1/3">
                    <label
                      htmlFor="projectArea"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("grossArea")}
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
                      className={`w-full h-[56px] rounded-[16px] border px-4 placeholder-gray-400 focus:outline-none focus:ring-2 text-[#262626] text-[14px] ${getFieldErrorClass(
                        "projectArea"
                      )}`}
                      placeholder={t("areaPlaceholder")}
                    />
                  </div>
                  <div className="w-full lg:w-1/3">
                    <label
                      htmlFor="totalSize"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("netArea")}
                    </label>
                    <input
                      type="text"
                      id="totalSize"
                      value={totalSize || ""}
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
                        setTotalSize(parseFloat(validValue) || 0);
                      }}
                      className={`w-full h-[56px] rounded-[16px] border px-4 placeholder-gray-400 focus:outline-none focus:ring-2 text-[#262626] text-[14px] ${getFieldErrorClass(
                        "totalSize"
                      )}`}
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
                      options={generateRoomCountOptions()}
                      value={roomCount || 0}
                      onChange={(value) => setRoomCount(parseInt(value))}
                      placeholder={t("selectPlaceholder")}
                      hasError={errorFields.has("roomCount")}
                    />
                  </div>
                </div>

                {/* Banyo Sayısı - Kat Sayısı - Bulunduğu Kat */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="w-full lg:w-1/3">
                    <label
                      htmlFor="bathroomCount"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("bathroomCount")}
                    </label>
                    <CustomSelect
                      options={generateNumberOptions(1, 5)}
                      value={bathroomCount || 0}
                      onChange={(value) => setBathroomCount(parseInt(value))}
                      placeholder={t("selectOption")}
                      hasError={errorFields.has("bathroomCount")}
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
                      options={generateNumberOptions(1, 20)}
                      value={floorCount}
                      onChange={(value) => setFloorCount(parseInt(value))}
                      placeholder={t("selectOption")}
                      hasError={errorFields.has("floorCount")}
                    />
                  </div>
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
                      placeholder={t("selectOption")}
                      hasError={errorFields.has("floorPosition")}
                    />
                  </div>
                </div>

                {/* Balkon Sayısı - Mutfak Tipi - Isıtma */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="w-full lg:w-1/3">
                    <label
                      htmlFor="bedRoomCount"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("balconyCount")}
                    </label>
                    <CustomSelect
                      options={generateNumberOptions(0, 5)}
                      value={bedRoomCount || 0}
                      onChange={(value) => setBedRoomCount(parseInt(value))}
                      placeholder={t("selectOption")}
                      hasError={errorFields.has("bedRoomCount")}
                    />
                  </div>
                  <div className="w-full lg:w-1/3">
                    <label
                      htmlFor="kitchenType"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("kitchenType")}
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
                      placeholder={t("selectOption")}
                      hasError={errorFields.has("kitchenType")}
                    />
                  </div>
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
                                : selected.value === "underfloorHeating"
                                ? "Underfloor Heating"
                                : "",
                          });
                        }
                      }}
                      placeholder={t("selectOption")}
                      hasError={errorFields.has("heatingType")}
                    />
                  </div>
                </div>

                {/* Kimden - Takaslı - Eşyalı */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
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
                      placeholder={t("selectOption")}
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
                      value={exchangeable ? "true" : "false"}
                      onChange={(value) => setExchangeable(value === "true")}
                      placeholder={t("selectOption")}
                    />
                  </div>
                  <div className="w-full lg:w-1/3">
                    <label
                      htmlFor="isFurnished"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("furnished")}
                    </label>
                    <CustomSelect
                      options={booleanOptions}
                      value={isFurnished ? "true" : "false"}
                      onChange={(value) => setIsFurnished(value === "true")}
                      placeholder={t("selectOption")}
                    />
                  </div>
                </div>

                {/* Krediye Uygunluk - Bina Yaşı - Aidat */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="w-full lg:w-1/3">
                    <label
                      htmlFor="creditEligible"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("creditEligible")}
                    </label>
                    <CustomSelect
                      options={booleanOptions}
                      value={creditEligible ? "true" : "false"}
                      onChange={(value) => setCreditEligible(value as any)}
                      placeholder={t("selectOption")}
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
                      onChange={(value) => setBuildingAge(parseInt(value))}
                      placeholder={t("selectOption")}
                      hasError={errorFields.has("buildingAge")}
                    />
                  </div>
                  <div className="w-full lg:w-1/3">
                    <label className="font-bold block mb-2 text-[#262626] text-[16px]">
                      {t("dues")}
                    </label>
                    <div className="flex gap-2">
                      <div className="w-20">
                        <CustomSelect
                          options={[
                            { value: "TRY", label: "₺" },
                            { value: "USD", label: "$" },
                          ]}
                          value={selectedDuesCurrency}
                          onChange={(value) => setSelectedDuesCurrency(value)}
                          placeholder="₺"
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
                          className="w-full h-[56px] rounded-[16px] border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626] text-[14px]"
                          placeholder={t("pricePlaceholder")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kullanım Durumu - Tapu Durumu - Krediye Uygunluk */}
                <div className="flex flex-col lg:flex-row gap-4 pb-6">
                  <div className="w-full lg:w-1/2">
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
                      placeholder={t("selectOption")}
                      hasError={errorFields.has("usageStatus")}
                      openUpward={true}
                    />
                  </div>
                  <div className="w-full lg:w-1/2">
                    <label
                      htmlFor="deedStatus"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("deedStatus")}
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
                          const deedMap = new Map<string, string>();
                          deedMap.set("tr", selected.label);
                          deedMap.set(
                            "en",
                            selected.value === "condominium"
                              ? "Condominium"
                              : selected.value === "floorEasement"
                              ? "Floor Easement"
                              : selected.value === "sharedDeed"
                              ? "Shared Deed"
                              : selected.value === "detachedDeed"
                              ? "Detached Deed"
                              : selected.value === "landDeed"
                              ? "Land Deed"
                              : selected.value === "cooperativeShare"
                              ? "Cooperative Share Deed"
                              : selected.value === "usufructRight"
                              ? "Usufruct Right"
                              : selected.value === "foreignDeed"
                              ? "Foreign Deed"
                              : selected.value === "noDeedRecord"
                              ? "No Deed Record"
                              : ""
                          );
                          setDeedStatus(deedMap);
                        }
                      }}
                      placeholder={t("selectOption")}
                      hasError={errorFields.has("deedStatus")}
                      openUpward={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className=" flex flex-col sm:flex-row justify-end items-center p-6 border-t md:border-l border-[#F0F0F0]">
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
      </div>
    </div>
  );
}
