import { MultilangText, useListingForm } from "../CreationSteps";
import React, { useEffect, useRef, useState } from "react";

import { ChevronRightIcon } from "@heroicons/react/24/solid";
import GeneralSelect from "@/app/components/GeneralSelect/GeneralSelect";
import { XCircleIcon } from "@heroicons/react/24/solid";
import axiosInstance from "@/axios";

interface Language {
  _id: string;
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
}

interface Category {
  _id: string;
  name: {
    tr: string;
    en: string;
  };
  hotelTypeId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PropertyType {
  _id: string;
  name: {
    tr: string;
    en: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  categories: Category[];
}

export default function FirstCreateStep() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [errorFields, setErrorFields] = useState<Set<string>>(new Set());
  const formPanelRef = useRef<HTMLDivElement>(null);

  // Use context instead of local state
  const {
    listingType,
    setListingType,
    entranceType,
    setEntranceType,
    housingType,
    setHousingType,
    title,
    setTitle,
    description,
    setDescription,
    setCurrentStep,
  } = useListingForm();

  // Fetch available languages and property types with categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

        // Fetch languages
        const languagesResponse = await axiosInstance.get(
          `${baseUrl}/admin/languages/all-options`
        );
        setLanguages(languagesResponse.data);

        // Fetch property types with their categories
        const propertyTypesResponse = await axiosInstance.get(
          `${baseUrl}/admin/hotel-types/all-options`
        );
        setPropertyTypes(propertyTypesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get all categories from all property types
  const getAllCategories = (): Category[] => {
    return propertyTypes.flatMap((type) => type.categories || []);
  };

  // Get categories for the selected property type
  const getFilteredCategories = (): Category[] => {
    if (!entranceType) {
      return getAllCategories();
    }

    const selectedPropertyType = propertyTypes.find(
      (type) =>
        type.name.tr === entranceType.tr && type.name.en === entranceType.en
    );

    return selectedPropertyType?.categories || [];
  };

  // Handle property type selection
  const handlePropertyTypeSelect = (type: PropertyType) => {
    setEntranceType({
      tr: type.name.tr,
      en: type.name.en,
    });

    // Clear housing type if it's not in the new property type's categories
    if (housingType) {
      const isValidCategory = type.categories.some(
        (cat) =>
          cat.name.tr === housingType.tr && cat.name.en === housingType.en
      );
      if (!isValidCategory) {
        setHousingType(null);
      }
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: Category) => {
    setHousingType({
      tr: category.name.tr,
      en: category.name.en,
    });

    // Auto-select the property type for this category if not already selected
    const categoryPropertyType = propertyTypes.find(
      (type) => type._id === category.hotelTypeId
    );

    if (categoryPropertyType) {
      if (
        !entranceType ||
        entranceType.tr !== categoryPropertyType.name.tr ||
        entranceType.en !== categoryPropertyType.name.en
      ) {
        setEntranceType({
          tr: categoryPropertyType.name.tr,
          en: categoryPropertyType.name.en,
        });
      }
    }
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

    // Check if listing type is selected
    if (!listingType || Object.keys(listingType).length === 0) {
      newErrors.push("Lütfen ilan tipini seçin (Satılık veya Kiralık)");
      newErrorFields.add("listingType");
    }

    // Check if entrance type is selected
    if (!entranceType || Object.keys(entranceType).length === 0) {
      newErrors.push("Lütfen emlak tipini seçin");
      newErrorFields.add("entranceType");
    }

    // Check if housing type is selected
    if (!housingType || Object.keys(housingType).length === 0) {
      newErrors.push("Lütfen kategori seçin");
      newErrorFields.add("housingType");
    }

    // Check titles in both languages
    if (!title?.tr || title.tr.trim() === "") {
      newErrors.push("İlan başlığını (Türkçe) dilinde doldurun");
      newErrorFields.add("title-tr");
    }

    if (!title?.en || title.en.trim() === "") {
      newErrors.push("İlan başlığını (English) dilinde doldurun");
      newErrorFields.add("title-en");
    }

    // Check descriptions in both languages
    if (!description?.tr || description.tr.trim() === "") {
      newErrors.push("İlan açıklamasını (Türkçe) dilinde doldurun");
      newErrorFields.add("description-tr");
    }

    if (!description?.en || description.en.trim() === "") {
      newErrors.push("İlan açıklamasını (English) dilinde doldurun");
      newErrorFields.add("description-en");
    }

    setErrors(newErrors);
    setErrorFields(newErrorFields);
    return newErrors.length === 0;
  };

  // Handle form submission
  const handleContinue = () => {
    // Clear previous errors
    setErrors([]);
    setErrorFields(new Set());

    // Validate all fields
    const isValid = validateFields();

    if (isValid) {
      // Log current form data
      console.log({
        listingType,
        entranceType,
        housingType,
        title,
        description,
      });

      // Move to the next step
      setCurrentStep(2);
    } else {
      // Scroll form panel to top to see errors
      if (formPanelRef.current) {
        formPanelRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Helper to get field class name based on error state
  const getFieldClassName = (
    fieldType: "title" | "description",
    language: "tr" | "en"
  ): string => {
    const baseClasses =
      fieldType === "title"
        ? "w-full h-12 rounded-lg border "
        : "w-full min-h-[112px] resize-y rounded-lg border ";

    const fieldKey = `${fieldType}-${language}`;
    const hasError = errorFields.has(fieldKey);

    return hasError
      ? baseClasses +
          "border-[#EF1A28] px-4 " +
          (fieldType === "description" ? "py-3 " : "") +
          "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EF1A28]/40 text-[#262626]"
      : baseClasses +
          "border-gray-300 px-4 " +
          (fieldType === "description" ? "py-3 " : "") +
          "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]";
  };

  // Mapping of predefined translations for selection options
  const optionTranslations = {
    listingType: {
      Satılık: { tr: "Satılık", en: "For Sale" },
      Kiralık: { tr: "Kiralık", en: "For Rent" },
    },
  };

  // Dropdown için options hazırlama
  const listingTypeOptions = [
    { name: "Satılık", value: { tr: "Satılık", en: "For Sale" } },
    { name: "Kiralık", value: { tr: "Kiralık", en: "For Rent" } },
  ];

  const propertyTypeOptions = propertyTypes.map((type) => ({
    name: type.name.tr,
    value: type,
  }));

  const filteredCategoryOptions = entranceType
    ? (propertyTypes.find((type) => type.name.tr === entranceType.tr)?.categories || []).map((cat) => ({
        name: cat.name.tr,
        value: cat,
      }))
    : [];

  return (
    <div className="min-h-screen bg-[#ECEBF4] flex justify-center items-start p-4">
      <div className="w-full max-w-[1200px] rounded-2xl shadow-lg bg-white">
        <div className="flex flex-col md:flex-row p-10">
          {/* Left Info Panel - 30% width on desktop */}
          <div className="w-full md:w-[30%] mb-8 md:mb-0 md:pr-6 flex flex-col ">
            <h1 className="text-2xl font-extrabold leading-tight text-[#362C75]">
              İlan kategorilerini belirleyin.
            </h1>
            <div className="mt-4 text-base  text-[#595959] font-medium">
              <p className="leading-[140%]">
                İlan vereceğiniz mülkün kategorilerini belirtin.
                <br />
                <br />
                İlan Başlığı ve İlan Açıklaması için farklı dillerde yapacağınız
                girişler ilanın anlaşılırlığını artıracaktır gibi bir açıklama
                metni.
              </p>
            </div>
          </div>

          {/* Right Form Panel - 70% width on desktop */}
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

            {/* Sale or Rent - Dropdown, Property Type - Dropdown, Category - Dropdown: Tek satırda yan yana */}
            <div className="mb-6">
              <h2 className="font-semibold mb-4 text-[#262626] text-2xl">
                İlan Kategorileri
              </h2>
              <div className="flex flex-col md:flex-row gap-4 w-full">
                {/* İlan Tipi */}
                <div className="flex-1 min-w-[180px]">
                  <span className="block font-semibold mb-2 text-[#262626] text-base">İlan Tipi</span>
                  <GeneralSelect
                    selectedItem={listingType ? { name: listingType.tr, value: listingType } : null}
                    onSelect={(item) => {
                      setListingType(item.value);
                      setEntranceType(null);
                      setHousingType(null);
                    }}
                    options={listingTypeOptions}
                    defaultText="İlan Tipi Seçin"
                    extraClassName={`w-full text-[#595959] bg-white border ${errorFields.has("listingType") ? "border-[#EF1A28]" : "border-[#E0E0E0]"}`}
                    maxHeight="200"
                    customTextColor={true}
                  />
                </div>
                {/* Emlak Tipi */}
                <div className="flex-1 min-w-[180px]">
                  <span className="block font-semibold mb-2 text-[#262626] text-base">Emlak Tipi</span>
                  <GeneralSelect
                    selectedItem={entranceType ? { name: entranceType.tr, value: entranceType } : null}
                    onSelect={(item) => {
                      handlePropertyTypeSelect(item.value);
                    }}
                    options={listingType ? propertyTypeOptions : []}
                    defaultText={listingType ? "Emlak Tipi Seçin" : "Önce ilan tipi seçin"}
                    extraClassName={`w-full text-[#595959] bg-white border ${errorFields.has("entranceType") ? "border-[#EF1A28]" : "border-[#E0E0E0]"}`}
                    maxHeight="200"
                    customTextColor={true}
                  />
                </div>
                {/* Kategori */}
                <div className="flex-1 min-w-[180px]">
                  <span className="block font-semibold mb-2 text-[#262626] text-base">Kategori</span>
                  <GeneralSelect
                    selectedItem={housingType ? { name: housingType.tr, value: housingType } : null}
                    onSelect={(item) => {
                      handleCategorySelect(item.value);
                    }}
                    options={entranceType ? filteredCategoryOptions : []}
                    defaultText={entranceType ? "Kategori Seçin" : "Önce emlak tipi seçin"}
                    extraClassName={`w-full text-[#595959] bg-white border ${errorFields.has("housingType") ? "border-[#EF1A28]" : "border-[#E0E0E0]"}`}
                    maxHeight="200"
                    customTextColor={true}
                  />
                </div>
              </div>
            </div>

            {/* Listing Title */}
            <div className="mt-8 space-y-6">
              {/* Turkish Title */}

              <h2 className="font-semibold mb-2 text-[#262626] text-2xl">
                İlan Başlığı ve Açıklaması
              </h2>
              <div>
                <h3 className="font-semibold text-base mb-4 text-[#262626]">
                  Türkçe{" "}
                  <span className="text-[#595959] text-base font-normal">
                    Zorunlu
                  </span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      id="title-tr"
                      value={title?.tr || ""}
                      onChange={(e) =>
                        setTitle((prev) => ({
                          ...prev,
                          tr: e.target.value,
                        }))
                      }
                      className={getFieldClassName("title", "tr")}
                      placeholder=" İlan Başlığı"
                    />
                  </div>

                  <div>
                    <textarea
                      id="description-tr"
                      value={description?.tr || ""}
                      onChange={(e) =>
                        setDescription((prev) => ({
                          ...prev,
                          tr: e.target.value,
                        }))
                      }
                      className={getFieldClassName("description", "tr")}
                      placeholder="  İlan Açıklaması"
                    />
                  </div>
                </div>
              </div>

              {/* English Title */}
              <div>
                <h3 className="font-semibold text-base mb-4 text-[#262626]">
                  English{" "}
                  <span className="text-[#595959] text-base font-normal">
                    Zorunlu
                  </span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      id="title-en"
                      value={title?.en || ""}
                      onChange={(e) =>
                        setTitle((prev) => ({
                          ...prev,
                          en: e.target.value,
                        }))
                      }
                      className={getFieldClassName("title", "en")}
                      placeholder="Title"
                    />
                  </div>

                  <div>
                    <textarea
                      id="description-en"
                      value={description?.en || ""}
                      onChange={(e) =>
                        setDescription((prev) => ({
                          ...prev,
                          en: e.target.value,
                        }))
                      }
                      className={getFieldClassName("description", "en")}
                      placeholder="Description"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step counter and continue button */}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-between items-center p-6 border-t border-[#F0F0F0]">
          <span className="text-sm text-gray-600 mt-4 sm:mt-0">
            Adım 1 / 6
          </span>
          <div className="flex flex-col-reverse sm:flex-row gap-4 mt-4 sm:mt-0">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-600 font-semibold px-8 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition border border-gray-300"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="w-full sm:w-auto bg-[#6656AD] hover:bg-[#5349a0] text-white font-semibold px-8 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition"
            >
              Devam Et
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
