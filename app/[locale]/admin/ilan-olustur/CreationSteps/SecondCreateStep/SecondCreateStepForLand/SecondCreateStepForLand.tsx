import { ChevronRightIcon, XCircleIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import { formatInputPrice, parseInputPrice } from "@/app/utils/priceFormatter";
import { useLocale, useTranslations } from "next-intl";

import { useListingForm } from "../../CreationSteps";
import GoBackButton from "../../../GoBackButton/GoBackButton";

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
  const t = useTranslations("adminCreation.step2_land");
  const locale = useLocale();

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
    {
      value: "partitioned",
      tr: "İfrazlı",
      en: "Partitioned",
    },
    { value: "parceled", tr: "Parselli", en: "Parceled" },
    {
      value: "withProject",
      tr: "Projeli",
      en: "With Project",
    },
    {
      value: "cornerParcel",
      tr: "Köşe Parsel",
      en: "Corner Parcel",
    },
  ];

  const creditEligibleOptions = [
    { value: true, tr: "Evet", en: "Yes" },
    { value: false, tr: "Hayır", en: "No" },
  ];

  const sourceOptions = [
    {
      value: "fromOwner",
      tr: "Sahibinden",
      en: "From Owner",
    },
    {
      value: "fromRealEstate",
      tr: "Emlak Ofisinden",
      en: "From Real Estate Office",
    },
  ];

  const zoningStatusOptions = [
    { value: "island", tr: "Ada", en: "Island" },
    { value: "a-legend", tr: "A-Lejantlı", en: "A-Legend" },
    { value: "land", tr: "Arazi", en: "Land" },
    {
      value: "vineyard-garden",
      tr: "Bağ & Bahçe",
      en: "Vineyard & Garden",
    },
    {
      value: "warehouse-depot",
      tr: "Depo & Antrepo",
      en: "Warehouse & Depot",
    },
    { value: "education", tr: "Eğitim", en: "Education" },
    {
      value: "energy-storage",
      tr: "Enerji Depolama",
      en: "Energy Storage",
    },
    { value: "residential", tr: "Konut", en: "Residential" },
    { value: "miscellaneous", tr: "Muhtelif", en: "Miscellaneous" },
    { value: "private-use", tr: "Özel Kullanım", en: "Private Use" },
    { value: "health", tr: "Sağlık", en: "Health" },
    { value: "industrial", tr: "Sanayi", en: "Industry" },
    { value: "greenhouse", tr: "Sera", en: "Greenhouse" },
    {
      value: "protected-area",
      tr: "Sit Alanı",
      en: "Protected Area",
    },
    { value: "sports-area", tr: "Spor Alanı", en: "Sports Area" },
    { value: "field", tr: "Tarla", en: "Field" },
    {
      value: "field-vineyard",
      tr: "Tarla + Bağ",
      en: "Field + Vineyard",
    },
    { value: "commercial", tr: "Ticari", en: "Commercial" },
    {
      value: "commercial-residential",
      tr: "Ticari + Konut",
      en: "Commercial + Residential",
    },
    { value: "mass-housing", tr: "Toplu Konut", en: "Mass Housing" },
    { value: "tourism", tr: "Turizm", en: "Tourism" },
    {
      value: "tourism-residential",
      tr: "Turizm + Konut",
      en: "Tourism + Residential",
    },
    {
      value: "tourism-commercial",
      tr: "Turizm + Ticari",
      en: "Tourism + Commercial",
    },
    { value: "villa", tr: "Villa", en: "Villa" },
    { value: "olive-grove", tr: "Zeytinlik", en: "Olive Grove" },
  ];

  const deedStatusOptions = [
    {
      value: "shared-title",
      tr: "Hisseli Tapu",
      en: "Shared Title Deed",
    },
    {
      value: "independent-title",
      tr: "Müstakil Tapulu",
      en: "Independent Title Deed",
    },
    {
      value: "allocation-deed",
      tr: "Tahsis Tapu",
      en: "Allocation Deed",
    },
    {
      value: "possession-deed",
      tr: "Zilliyet Tapu",
      en: "Possession Deed",
    },
    {
      value: "cooperative-share",
      tr: "Kooperatif Hisseli Tapu",
      en: "Cooperative Share Title",
    },
    {
      value: "foreign-title",
      tr: "Yurt Dışı Tapulu",
      en: "Foreign Title Deed",
    },
    {
      value: "no-deed",
      tr: "Tapu Kaydı Yok",
      en: "No Title Deed Record",
    },
  ];

  const booleanOptions = [
    { value: "true", tr: "Evet", en: "Yes" },
    { value: "false", tr: "Hayır", en: "No" },
  ];

  const localizedCreditEligibleOptions = creditEligibleOptions.map(
    (option) => ({
      value: option.value,
      label: String(option[locale as keyof typeof option]),
    })
  );
  const localizedSourceOptions = sourceOptions.map((option) => ({
    value: option.value,
    label: String(option[locale as keyof typeof option]),
  }));
  const localizedZoningStatusOptions = zoningStatusOptions.map((option) => ({
    value: option.value,
    label: String(option[locale as keyof typeof option]),
  }));
  const localizedDeedStatusOptions = deedStatusOptions.map((option) => ({
    value: option.value,
    label: String(option[locale as keyof typeof option]),
  }));
  const localizedGeneralFeaturesOptions = generalFeaturesOptions.map(
    (option) => ({
      value: option.value,
      label: String(option[locale as keyof typeof option]),
    })
  );
  const localizedBooleanOptions = booleanOptions.map((option) => ({
    value: option.value,
    label: String(option[locale as keyof typeof option]),
  }));

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

    if (
      !generalFeatures ||
      !generalFeatures.get("tr") ||
      !generalFeatures.get("en")
    ) {
      newErrors.push(t("validation.generalFeatures"));
      newErrorFields.add("generalFeatures");
    }

    if (typeof creditEligible === "string" && creditEligible === "") {
      newErrors.push(t("validation.creditEligible"));
      newErrorFields.add("creditEligible");
    }

    if (!source || source.tr === "" || source.en === "") {
      newErrors.push(t("validation.source"));
      newErrorFields.add("source");
    }

    if (!zoningStatus || !zoningStatus.get("tr") || !zoningStatus.get("en")) {
      newErrors.push(t("validation.zoningStatus"));
      newErrorFields.add("zoningStatus");
    }

    if (!deedStatus || !deedStatus.get("tr") || !deedStatus.get("en")) {
      newErrors.push(t("validation.deedStatus"));
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
      <div className="w-full max-w-[1200px] rounded-2xl shadow-lg bg-white h-full">
        <div className="flex flex-col md:flex-row h-full md:h-[67vh]  2xl:h-[76vh]">
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
                          className={`w-full h-12 rounded-lg border pl-8 pr-4 placeholder-gray-400 focus:outline-none focus:ring-2 text-[#262626] ${getFieldErrorClass(
                            "price-usd"
                          )}`}
                          placeholder={t("pricePlaceholder")}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Areas */}
                <div className="mb-6">
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
                    className={`w-full h-[56px] rounded-[16px] border px-4 placeholder-gray-400 focus:outline-none focus:ring-2 text-[#262626] text-[14px] ${getFieldErrorClass(
                      "projectArea"
                    )}`}
                    placeholder={t("areaPlaceholder")}
                  />
                </div>
                {/* Krediye Uygunluk - Kimden */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="creditEligible"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("creditEligible")}
                    </label>
                    <CustomSelect
                      options={localizedCreditEligibleOptions}
                      value={creditEligible}
                      onChange={(value) => setCreditEligible(value)}
                      placeholder={t("selectPlaceholder")}
                      hasError={errorFields.has("creditEligible")}
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="source"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("source")}
                    </label>
                    <CustomSelect
                      options={localizedSourceOptions}
                      value={
                        source?.tr
                          ? sourceOptions.find(
                              (option) => option.tr === source.tr
                            )?.value || ""
                          : ""
                      }
                      onChange={(value) => {
                        const selected = sourceOptions.find(
                          (option) => option.value === value
                        );
                        if (selected) {
                          setSource({
                            tr: selected.tr,
                            en: selected.en,
                          });
                        }
                      }}
                      placeholder={t("selectPlaceholder")}
                      hasError={errorFields.has("source")}
                    />
                  </div>
                </div>

                {/* İmar Durumu - Tapu Durumu */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="zoningStatus"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("zoningStatus")}
                    </label>
                    <CustomSelect
                      options={localizedZoningStatusOptions}
                      value={
                        zoningStatus?.get("tr")
                          ? zoningStatusOptions.find(
                              (option) => option.tr === zoningStatus.get("tr")
                            )?.value || ""
                          : ""
                      }
                      onChange={(value) => {
                        const selected = zoningStatusOptions.find(
                          (option) => option.value === value
                        );
                        if (selected) {
                          const newMap = new Map<string, string>();
                          newMap.set("tr", selected.tr);
                          newMap.set("en", selected.en);
                          setZoningStatus(newMap);
                        }
                      }}
                      placeholder={t("selectPlaceholder")}
                      hasError={errorFields.has("zoningStatus")}
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="deedStatus"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("deedStatus")}
                    </label>
                    <CustomSelect
                      options={localizedDeedStatusOptions}
                      value={
                        deedStatus?.get("tr")
                          ? deedStatusOptions.find(
                              (option) => option.tr === deedStatus.get("tr")
                            )?.value || ""
                          : ""
                      }
                      onChange={(value) => {
                        const selected = deedStatusOptions.find(
                          (option) => option.value === value
                        );
                        if (selected) {
                          const newMap = new Map<string, string>();
                          newMap.set("tr", selected.tr);
                          newMap.set("en", selected.en);
                          setDeedStatus(newMap);
                        }
                      }}
                      placeholder={t("selectPlaceholder")}
                      hasError={errorFields.has("deedStatus")}
                    />
                  </div>
                </div>

                {/* Genel Özellikler - Takaslı */}
                <div className="flex flex-col sm:flex-row gap-4 pb-6">
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="generalFeatures"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("generalFeatures")}
                    </label>
                    <CustomSelect
                      options={localizedGeneralFeaturesOptions}
                      value={
                        generalFeatures?.get("tr")
                          ? generalFeaturesOptions.find(
                              (option) =>
                                option.tr === generalFeatures.get("tr")
                            )?.value || ""
                          : ""
                      }
                      onChange={(value) => {
                        const selected = generalFeaturesOptions.find(
                          (option) => option.value === value
                        );
                        if (selected) {
                          const newMap = new Map<string, string>();
                          newMap.set("tr", selected.tr);
                          newMap.set("en", selected.en);
                          setGeneralFeatures(newMap);
                        }
                      }}
                      placeholder={t("selectPlaceholder")}
                      openUpward={true}
                      hasError={errorFields.has("generalFeatures")}
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="exchangeable"
                      className="font-bold block mb-2 text-[#262626] text-[16px]"
                    >
                      {t("exchangeable")}
                    </label>
                    <CustomSelect
                      options={localizedBooleanOptions}
                      value={exchangeable ? "true" : "false"}
                      onChange={(value) => setExchangeable(value === "true")}
                      placeholder={t("selectPlaceholder")}
                      openUpward={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Footer */}
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
