import React, { useEffect, useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useListingForm, MultilangText } from "../CreationSteps";
import axiosInstance from "@/axios";
import { XCircleIcon } from "@heroicons/react/24/solid";

interface Language {
  _id: string;
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
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
}

export default function FirstCreateStep() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [categories, setCategories] = useState<PropertyType[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

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

  // Fetch available languages, property types, and categories
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

        // Set default language from response
        const defaultLang = languagesResponse.data.find(
          (lang: Language) => lang.isDefault
        );
        if (defaultLang) {
          setSelectedLanguage(defaultLang.code);
        }

        // Fetch property types (for "Emlak Tipi Seçin" section)
        const propertyTypesResponse = await axiosInstance.get(
          `${baseUrl}/admin/hotel-types/all-options`
        );
        setPropertyTypes(propertyTypesResponse.data);

        // Fetch categories (for "Kategori Seçin" section)
        const categoriesResponse = await axiosInstance.get(
          `${baseUrl}/admin/hotel-categories/all-options`
        );
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Validate all required fields
  const validateFields = () => {
    const newErrors: string[] = [];

    // Check if listing type is selected
    if (!listingType || Object.keys(listingType).length === 0) {
      newErrors.push("Lütfen ilan tipini seçin (Satılık veya Kiralık)");
    }

    // Check if entrance type is selected
    if (!entranceType || Object.keys(entranceType).length === 0) {
      newErrors.push("Lütfen emlak tipini seçin");
    }

    // Check if housing type is selected
    if (!housingType || Object.keys(housingType).length === 0) {
      newErrors.push("Lütfen kategori seçin");
    }

    // Check titles in both languages
    if (!title?.tr || title.tr.trim() === "") {
      newErrors.push("İlan başlığını (Türkçe) dilinde doldurun");
    }

    if (!title?.en || title.en.trim() === "") {
      newErrors.push("İlan başlığını (English) dilinde doldurun");
    }

    // Check descriptions in both languages
    if (!description?.tr || description.tr.trim() === "") {
      newErrors.push("İlan açıklamasını (Türkçe) dilinde doldurun");
    }

    if (!description?.en || description.en.trim() === "") {
      newErrors.push("İlan açıklamasını (English) dilinde doldurun");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle form submission
  const handleContinue = () => {
    // Clear previous errors
    setErrors([]);

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
      // Scroll to top to see errors
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle language-specific input changes for text fields only
  const handleLanguageSpecificChange = (field: string, value: string) => {
    switch (field) {
      case "title":
        setTitle((prev) => ({
          ...prev,
          [selectedLanguage]: value,
        }));
        break;
      case "description":
        setDescription((prev) => ({
          ...prev,
          [selectedLanguage]: value,
        }));
        break;
      default:
        break;
    }
  };

  // Get current language value for a field
  const getLanguageValue = (field: MultilangText | undefined): string => {
    if (!field) return "";
    return field[selectedLanguage] || "";
  };

  // Helper to get field class name based on error state
  const getFieldClassName = (fieldType: "title" | "description"): string => {
    const baseClasses =
      fieldType === "title"
        ? "w-full h-12 rounded-lg border "
        : "w-full min-h-[112px] resize-y rounded-lg border ";

    const hasError = errors.some((e) => {
      if (fieldType === "title") {
        return (
          e.includes("başlığını") &&
          e.includes(selectedLanguage === "en" ? "English" : "Türkçe")
        );
      } else {
        return (
          e.includes("açıklamasını") &&
          e.includes(selectedLanguage === "en" ? "English" : "Türkçe")
        );
      }
    });

    return hasError
      ? baseClasses +
          "border-red-300 px-4 " +
          (fieldType === "description" ? "py-3 " : "") +
          "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 text-[#262626]"
      : baseClasses +
          "border-gray-300 px-4 " +
          (fieldType === "description" ? "py-3 " : "") +
          "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Mapping of predefined translations for selection options
  const optionTranslations = {
    listingType: {
      Satılık: { tr: "Satılık", en: "For Sale" },
      Kiralık: { tr: "Kiralık", en: "For Rent" },
    },
  };

  return (
    <div className="min-h-screen bg-[#ECEBF4] flex justify-center items-start p-4">
      <div className="w-full max-w-[1200px] rounded-2xl shadow-lg bg-white">
        <div className="flex flex-col md:flex-row p-10">
          {/* Left Info Panel - 30% width on desktop */}
          <div className="w-full md:w-[30%] mb-8 md:mb-0 md:pr-6 flex flex-col">
            <h1 className="text-2xl font-extrabold leading-tight text-[#362C75]">
              İlan kategorilerini belirleyin.
            </h1>
            <div className="mt-4 space-y-2 text-gray-500">
              <p>Bu bölümde ilan kategorilerinizi belirleyerek</p>
              <p>alıcıların ilanınızı daha kolay bulmasını</p>
              <p>sağlayabilirsiniz. Doğru kategori seçimi</p>
              <p>ilanınızın görünürlüğünü artıracaktır.</p>
            </div>
            <div className="mt-6">
              <div className="flex gap-2 flex-wrap">
                {languages.map((language) => (
                  <button
                    key={language._id}
                    type="button"
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full transition border border-[#6656AD] text-[#6656AD] ${
                      selectedLanguage === language.code
                        ? "bg-[#EBEAF1] "
                        : "bg-transparent "
                    }`}
                    onClick={() => setSelectedLanguage(language.code)}
                  >
                    {language.nativeName}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-600 mb-4 sm:mb-0 mt-auto">
              Adım 1 / 5
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

            {/* Language Selector - Only for text inputs */}

            {/* Sale or Rent */}
            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-[#262626]">
                Satılık mı, kiralık mı?
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full transition font-medium cursor-pointer  ${
                    listingType && listingType.tr === "Satılık"
                      ? "bg-[#EBEAF180] border-[0.5px]  border-[#362C75] text-[#362C75]"
                      : "bg-transparent border border-[#6656AD] text-[#595959] transition-all duration-300 hover:bg-[#F5F5F5] hover:border-[#595959]"
                  }`}
                  onClick={() =>
                    setListingType(optionTranslations.listingType["Satılık"])
                  }
                >
                  Satılık
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full transition font-medium cursor-pointer  ${
                    listingType && listingType.tr === "Kiralık"
                      ? "bg-[#EBEAF180] border-[0.5px]  border-[#362C75] text-[#362C75]"
                      : "bg-transparent border border-[#6656AD] text-[#595959] transition-all duration-300 hover:bg-[#F5F5F5] hover:border-[#595959]"
                  }`}
                  onClick={() =>
                    setListingType(optionTranslations.listingType["Kiralık"])
                  }
                >
                  Kiralık
                </button>
              </div>
            </div>

            {/* Property Type */}
            <div className="mt-6">
              <h2 className="font-semibold mb-2 text-[#262626]">
                Emlak Tipi Seçin
              </h2>
              <div className="flex gap-2">
                {propertyTypes.map((type) => (
                  <button
                    key={type._id}
                    type="button"
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full transition font-medium cursor-pointer ${
                      entranceType && entranceType.tr === type.name.tr
                        ? "bg-[#EBEAF180] border-[0.5px] border-[#362C75] text-[#362C75]"
                        : "bg-transparent border border-[#6656AD] text-[#595959] transition-all duration-300 hover:bg-[#F5F5F5] hover:border-[#595959]"
                    }`}
                    onClick={() =>
                      setEntranceType({
                        tr: type.name.tr,
                        en: type.name.en,
                      })
                    }
                  >
                    {selectedLanguage === "tr" ? type.name.tr : type.name.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="mt-6">
              <h2 className="font-semibold mb-2 text-[#262626]">
                Kategori Seçin
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full transition font-medium cursor-pointer ${
                      housingType && housingType.tr === cat.name.tr
                        ? "bg-[#EBEAF180] border-[0.5px] border-[#362C75] text-[#362C75]"
                        : "bg-transparent border border-[#6656AD] text-[#595959] transition-all duration-300 hover:bg-[#F5F5F5] hover:border-[#595959]"
                    }`}
                    onClick={() =>
                      setHousingType({
                        tr: cat.name.tr,
                        en: cat.name.en,
                      })
                    }
                  >
                    {selectedLanguage === "tr" ? cat.name.tr : cat.name.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Listing Title */}
            <div className="mt-8">
              <label
                htmlFor="title"
                className="font-semibold block mb-2 text-[#262626]"
              >
                İlan Başlığı{" "}
                {selectedLanguage === "en" ? "(English)" : "(Türkçe)"}
              </label>
              <input
                type="text"
                id="title"
                value={getLanguageValue(title)}
                onChange={(e) =>
                  handleLanguageSpecificChange("title", e.target.value)
                }
                className={getFieldClassName("title")}
                placeholder={
                  selectedLanguage === "en"
                    ? "Enter a title for your listing"
                    : "İlanınız için bir başlık girin"
                }
              />
            </div>

            {/* Description */}
            <div className="mt-6">
              <label
                htmlFor="description"
                className="font-semibold block mb-2 text-[#262626]"
              >
                Açıklama {selectedLanguage === "en" ? "(English)" : "(Türkçe)"}
              </label>
              <textarea
                id="description"
                value={getLanguageValue(description)}
                onChange={(e) =>
                  handleLanguageSpecificChange("description", e.target.value)
                }
                className={getFieldClassName("description")}
                placeholder={
                  selectedLanguage === "en"
                    ? "Provide detailed information about your listing"
                    : "İlanınız hakkında detaylı bilgi verin"
                }
              />
            </div>

            {/* Step counter and continue button */}
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
