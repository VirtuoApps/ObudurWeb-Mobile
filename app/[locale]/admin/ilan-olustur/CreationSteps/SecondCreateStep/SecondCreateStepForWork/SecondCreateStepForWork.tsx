import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import { useListingForm } from "../../CreationSteps";
import { XCircleIcon } from "@heroicons/react/24/solid";
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
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select option",
  openUpward = false,
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
  const [selectedDuesCurrency, setSelectedDuesCurrency] =
    useState<string>("TRY");

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

  // Handle dues change for a specific currency
  const handleDuesChange = (currency: string, amount: string) => {
    // Only allow numbers and decimal point
    const numericValue = amount.replace(/[^0-9.]/g, "");
    // Prevent multiple decimal points
    const parts = numericValue.split(".");
    const validValue =
      parts.length > 2
        ? parts[0] + "." + parts.slice(1).join("")
        : numericValue;

    const numericAmount = validValue === "" ? 0 : parseFloat(validValue);

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

  // Get dues for a specific currency
  const getDuesForCurrency = (currency: string): number => {
    if (!dues) return 0;
    const currencyDues = dues.find((d) => d.currency === currency);
    return currencyDues ? currencyDues.amount : 0;
  };

  // Heating type options
  const heatingTypeOptions = [
    { value: "none", label: "Yok" },
    { value: "stove", label: "Soba" },
    { value: "naturalGasStove", label: "Doğalgaz Sobası" },
    { value: "floorHeater", label: "Kat Kaloriferi" },
    { value: "naturalGasBoiler", label: "Doğalgaz (kombi)" },
    { value: "central", label: "Merkezi" },
    { value: "airConditioning", label: "Klima" },
    { value: "solarEnergy", label: "Güneş Enerjisi" },
  ];

  // Source options
  const sourceOptions = [
    { value: "fromOwner", label: "Sahibinden" },
    { value: "fromRealEstate", label: "Emlak Ofisinden" },
    { value: "fromConstruction", label: "İnşaat Firmasından" },
  ];

  // Usage status options
  const usageStatusOptions = [
    { value: "empty", label: "Boş" },
    { value: "tenantOccupied", label: "Kiracılı" },
    { value: "ownerOccupied", label: "Mülk Sahibi" },
  ];

  // Building age options
  const buildingAgeOptions = [
    { value: 0, label: "0" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 15, label: "15" },
    { value: 20, label: "20+" },
  ];

  // Boolean options
  const booleanOptions = [
    { value: "true", label: "Evet" },
    { value: "false", label: "Hayır" },
  ];

  const roomCountOptions = [
    { value: 0, label: "0" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "5+" },
  ];

  const floorCountOptions = [
    { value: 0, label: "0" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 11, label: "10+" },
  ];

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
      newErrors.push("Lütfen metrekare değerini girin");
    }

    // Validate room counts for real estate (may not apply to land)
    if (!roomCount && roomCount !== 0) {
      newErrors.push("Lütfen bölüm / oda sayısını seçin");
    }

    if (!floorCount && floorCount !== 0) {
      newErrors.push("Lütfen kat sayısını seçin");
    }

    if (!buildingAge && buildingAge !== 0) {
      newErrors.push("Lütfen bina yaşını seçin");
    }

    if (!heatingType || heatingType.tr === "" || heatingType.en === "") {
      newErrors.push("Lütfen ısıtma tipini seçin");
    }

    if (!source || source.tr === "" || source.en === "") {
      newErrors.push("Lütfen kimden bilgisini seçin");
    }

    if (!usageStatus || !usageStatus.get("tr") || !usageStatus.get("en")) {
      newErrors.push("Lütfen kullanım durumunu seçin");
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
          {/* Left Info Panel */}
          <div className="w-full md:w-[30%] mb-8 md:mb-0 md:pr-6 flex flex-col">
            <h1 className="text-2xl font-extrabold leading-tight text-[#362C75]">
              İş yerinin özelliklerini belirtin.
            </h1>
            <div className="mt-4 text-base text-[#595959] font-medium">
              <p className="leading-[140%]">
                Bu adımda, iş yerinin temel özelliklerini, fiyatını ve diğer
                önemli detayları girebilirsiniz. Bu bilgilerin doğruluğu,
                potansiyel alıcı veya kiracıların ilgisini çekmek için
                kritiktir.
              </p>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="w-full md:w-[70%] md:pl-6 h-[67vh] 2xl:h-[73vh] overflow-auto border-l border-[#F0F0F0]">
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

            {/* Metrekare - Bölüm / Oda Sayısı */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-1/2">
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
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                  placeholder="m²"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="roomCount"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Bölüm / Oda Sayısı
                </label>
                <CustomSelect
                  options={roomCountOptions}
                  value={roomCount || 0}
                  onChange={(value) => setRoomCount(parseInt(value))}
                  placeholder="Seçiniz"
                />
              </div>
            </div>

            {/* Kat Sayısı - Bina Yaşı */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="floorCount"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Kat Sayısı
                </label>
                <CustomSelect
                  options={floorCountOptions}
                  value={floorCount || 0}
                  onChange={(value) => setFloorCount(parseInt(value))}
                  placeholder="Seçiniz"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="buildingAge"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Bina Yaşı
                </label>
                <CustomSelect
                  options={buildingAgeOptions}
                  value={buildingAge || 0}
                  onChange={(value) => setBuildingAge(parseInt(value))}
                  placeholder="Seçiniz"
                />
              </div>
            </div>

            {/* Isıtma - Kimden */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="heatingType"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Isıtma
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
                  placeholder="Seçiniz"
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
                            : selected.value === "fromRealEstate"
                            ? "From Real Estate Office"
                            : selected.value === "fromConstruction"
                            ? "From Construction Company"
                            : "",
                      });
                    }
                  }}
                  placeholder="Seçiniz"
                />
              </div>
            </div>

            {/* Takaslı - Krediye Uygunluk */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="creditEligible"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Krediye Uygunluk
                </label>
                <CustomSelect
                  options={booleanOptions}
                  value={creditEligible ? "true" : "false"}
                  onChange={(value) => setCreditEligible(value === "true")}
                  placeholder="Seçiniz"
                />
              </div>
            </div>

            {/* Kullanım Durumu - Aidat */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="usageStatus"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Kullanım Durumu
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
                  placeholder="Seçiniz"
                  openUpward={true}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label className="font-semibold block mb-2 text-[#262626]">
                  Aidat
                </label>
                <div className="flex gap-2">
                  <div className="w-24">
                    <CustomSelect
                      options={[
                        { value: "TRY", label: "TRY" },
                        { value: "USD", label: "USD" },
                      ]}
                      value={selectedDuesCurrency}
                      onChange={(value) => setSelectedDuesCurrency(value)}
                      placeholder="TRY"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={getDuesForCurrency(selectedDuesCurrency) || ""}
                      onChange={(e) =>
                        handleDuesChange(selectedDuesCurrency, e.target.value)
                      }
                      className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                      placeholder="Fiyat yazın"
                    />
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
