import { MultilangText, useListingForm } from "../CreationSteps";
import React, { useEffect, useRef, useState } from "react";

import { ChevronRightIcon } from "@heroicons/react/24/solid";
import GeneralSelect from "@/app/components/GeneralSelect/GeneralSelect";
import { XCircleIcon } from "@heroicons/react/24/solid";
import axiosInstance from "@/axios";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("adminCreation.step1");

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
    if (!type) {
      setEntranceType(null);
      return;
    }

    setEntranceType({
      tr: type?.name.tr,
      en: type?.name.en,
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
    if (!category) {
      setHousingType(null);
      return;
    }

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
      newErrors.push(t("validationErrors.listingTypeRequired"));
      newErrorFields.add("listingType");
    }

    // Check if entrance type is selected
    if (!entranceType || Object.keys(entranceType).length === 0) {
      newErrors.push(t("validationErrors.propertyTypeRequired"));
      newErrorFields.add("entranceType");
    }

    // Check if housing type is selected
    if (!housingType || Object.keys(housingType).length === 0) {
      newErrors.push(t("validationErrors.categoryRequired"));
      newErrorFields.add("housingType");
    }

    // Check titles in both languages
    if (!title?.tr || title.tr.trim() === "") {
      newErrors.push(t("validationErrors.titleTurkishRequired"));
      newErrorFields.add("title-tr");
    }

    if (title?.tr.trim().length > 80) {
      newErrors.push("İlan başlığı (Türkçe) 80 karakterden fazla olamaz");
      newErrorFields.add("title-tr");
    }

    if (!title?.en || title.en.trim() === "") {
      newErrors.push(t("validationErrors.titleEnglishRequired"));
      newErrorFields.add("title-en");
    }

    if (title?.en.trim().length > 80) {
      newErrors.push("İlan başlığı (English) 80 karakterden fazla olamaz");
      newErrorFields.add("title-en");
    }

    // Check descriptions in both languages
    if (!description?.tr || description.tr.trim() === "") {
      newErrors.push(t("validationErrors.descriptionTurkishRequired"));
      newErrorFields.add("description-tr");
    }

    if (!description?.en || description.en.trim() === "") {
      newErrors.push(t("validationErrors.descriptionEnglishRequired"));
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
    ? (
        propertyTypes.find((type) => type.name.tr === entranceType.tr)
          ?.categories || []
      ).map((cat) => ({
        name: cat.name.tr,
        value: cat,
      }))
    : [];

  return (
    <div className="bg-[#ECEBF4] flex justify-center items-start p-4 py-6 ">
      <div className="w-full max-w-[1200px] rounded-2xl shadow-lg bg-white h-full">
        <div className="flex flex-col md:flex-row h-[inherit] md:h-[83vh]  2xl:h-[86vh]">
          {/* Left Info Panel - 30% width on desktop */}
          <div className="w-full md:w-[30%] mb-8 md:mb-0 md:p-6 hidden flex-col md:flex justify-between">
            <div className="">
              <h1 className="text-2xl font-extrabold leading-tight text-[#362C75]">
                {t("title")}
              </h1>
              <div className="mt-4 text-base  text-[#595959] font-medium">
                <p className="leading-[140%]">
                  {t("subtitle")}
                  <br />
                  <br />
                  {t("description")}
                </p>
              </div>
            </div>

            <span className="text-sm text-gray-600 mt-4 sm:mt-0">
              {t("stepCounter", { current: 1, total: 6 })}
            </span>
          </div>

          {/* Right Form Panel - 70% width on desktop */}
          <div ref={formPanelRef} className="flex-1 h-full flex flex-col">
            {/* Errors display */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 m-6 mb-0">
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

            <div className="p-6 flex-1 overflow-auto md:border-l border-[#F0F0F0]">
              {/* Sale or Rent - Dropdown, Property Type - Dropdown, Category - Dropdown: Tek satırda yan yana */}
              <div className="mb-6">
                <h2 className="mb-4 text-[#262626] text-2xl font-bold">
                  {t("categoriesTitle")}
                </h2>
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                  {/* İlan Tipi */}
                  <div className="flex-1 min-w-[180px]">
                    <span className="block font-semibold mb-2 text-[#262626] text-base">
                      {t("listingType")}
                    </span>
                    <GeneralSelect
                      selectedItem={
                        listingType
                          ? { name: listingType.tr, value: listingType }
                          : null
                      }
                      onSelect={(item) => {
                        setListingType(item?.value ?? null);
                      }}
                      options={listingTypeOptions}
                      defaultText={t("selectListingType")}
                      extraClassName={`h-[56px] rounded-[16px] w-full text-[#595959] bg-white border ${
                        errorFields.has("listingType")
                          ? "border-[#EF1A28]"
                          : "border-[#E0E0E0]"
                      }`}
                      maxHeight="200"
                      customTextColor={true}
                    />
                  </div>
                  {/* Emlak Tipi */}
                  <div className="flex-1 min-w-[180px]">
                    <span className="block font-semibold mb-2 text-[#262626] text-base">
                      {t("propertyType")}
                    </span>
                    <GeneralSelect
                      selectedItem={
                        entranceType
                          ? { name: entranceType.tr, value: entranceType }
                          : null
                      }
                      onSelect={(item) => {
                        handlePropertyTypeSelect(item?.value ?? null);
                        setHousingType(null); // Reset housing type when property type changes
                      }}
                      options={propertyTypeOptions}
                      defaultText={t("selectPropertyType")}
                      extraClassName={`h-[56px] rounded-[16px] w-full text-[#595959] bg-white border ${
                        errorFields.has("entranceType")
                          ? "border-[#EF1A28]"
                          : "border-[#E0E0E0]"
                      }`}
                      maxHeight="200"
                      customTextColor={true}
                    />
                  </div>
                  {/* Kategori */}
                  <div className="flex-1 min-w-[180px]">
                    <span className="block font-semibold mb-2 text-[#262626] text-base">
                      {t("category")}
                    </span>
                    <GeneralSelect
                      selectedItem={
                        housingType
                          ? { name: housingType.tr, value: housingType }
                          : null
                      }
                      onSelect={(item) => {
                        handleCategorySelect(item?.value ?? null);
                      }}
                      options={entranceType ? filteredCategoryOptions : []}
                      defaultText={t("selectCategory")}
                      extraClassName={`h-[56px] !rounded-[16px] w-full text-[#595959] bg-white border ${
                        entranceType ? "text-[#262626]" : "text-[#8c8c8c]"
                      } ${housingType ? "hover:text-[#595959]" : ""} ${
                        errorFields.has("housingType")
                          ? "border-[#EF1A28]"
                          : "border-[#E0E0E0]"
                      }`}
                      maxHeight="200"
                      customTextColor={true}
                      disabled={!entranceType} // Disable if no property type selected
                    />
                  </div>
                </div>
              </div>

              {/* Listing Title */}
              <div className="mt-6 space-y-6">
                {/* Turkish Title */}

                <h2 className="font-bold mb-4 text-[#262626] text-2xl">
                  {t("titleAndDescription")}
                </h2>
                <div>
                  <h3 className="font-semibold text-base mb-4 text-[#262626]">
                    {t("turkish")}{" "}
                    <span className="text-[#595959] text-base font-normal">
                      {t("required")}
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
                        className={`${getFieldClassName(
                          "title",
                          "tr"
                        )} h-[56px] !rounded-[16px] text-[14px]`}
                        placeholder={t("titlePlaceholder")}
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
                        className={`${getFieldClassName(
                          "description",
                          "tr"
                        )} !rounded-[16px] text-[14px]`}
                        placeholder={t("descriptionPlaceholder")}
                      />
                    </div>
                  </div>
                </div>

                {/* English Title */}
                <div>
                  <h3 className="font-semibold text-base mb-4 text-[#262626]">
                    {t("english")}{" "}
                    <span className="text-[#595959] text-base font-normal">
                      {t("required")}
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
                        className={`${getFieldClassName(
                          "title",
                          "en"
                        )} h-[56px] !rounded-[16px] text-[14px]`}
                        placeholder={t("titleEnglishPlaceholder")}
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
                        className={`${getFieldClassName(
                          "description",
                          "en"
                        )} !rounded-[16px] text-[14px]`}
                        placeholder={t("descriptionEnglishPlaceholder")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step counter and continue button */}
            <div className="flex flex-col-reverse sm:flex-row items-center border-t md:border-l border-[#F0F0F0] p-6 justify-end">
              <div className="flex flex-row gap-4 sm:mt-0 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-600 font-semibold px-0 sm:px-8 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition border border-gray-300"
                >
                  {t("cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="cursor-pointer w-full sm:w-auto bg-[#5E5691] hover:bg-[#5349a0] text-white font-semibold px-0 sm:px-8 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition"
                >
                  {t("continue")}
                  <ChevronRightIcon className="w-5 h-5 hidden sm:block" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
