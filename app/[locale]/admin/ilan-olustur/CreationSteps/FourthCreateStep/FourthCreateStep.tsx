import React, { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useListingForm } from "../CreationSteps";
import axiosInstance from "@/axios";
import {
  XCircleIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import GoBackButton from "../../GoBackButton/GoBackButton";
import { CustomSelect } from "../SecondCreateStep/SecondCreateStep";

interface Feature {
  _id: string;
  name: {
    tr: string;
    en: string;
  };
  iconUrl: string;
  featureType: "general" | "inside" | "outside";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface DistanceType {
  _id: string;
  name: {
    tr: string;
    en: string;
  };
  iconUrl: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Language {
  _id: string;
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
}

// Orientation options
const orientationOptions = [
  { value: "west", label: "Batı", icon: "/west.png" },
  { value: "east", label: "Doğu", icon: "/east.png" },
  { value: "south", label: "Güney", icon: "/south.png" },
  { value: "north", label: "Kuzey", icon: "/north.png" },
];

export default function FourthCreateStep() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [distanceTypes, setDistanceTypes] = useState<DistanceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("tr");
  const [languages, setLanguages] = useState<Language[]>([]);

  // Use context from the form
  const {
    featureIds,
    setFeatureIds,
    distances,
    setDistances,
    newDistanceTypeId,
    setNewDistanceTypeId,
    newDistanceValue,
    setNewDistanceValue,
    editingDistanceId,
    setEditingDistanceId,
    editingDistanceValue,
    setEditingDistanceValue,
    orientation,
    setOrientation,
    setCurrentStep,
  } = useListingForm();

  // Fetch available languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const response = await axiosInstance.get(
          `${baseUrl}/admin/languages/all-options`
        );
        setLanguages(response.data);

        // Set default language from response
        const defaultLang = response.data.find(
          (lang: Language) => lang.isDefault
        );
        if (defaultLang) {
          setSelectedLanguage(defaultLang.code);
        }
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  // Fetch available features
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setIsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const response = await axiosInstance.get(
          `${baseUrl}/admin/features/all-options`
        );
        setFeatures(response.data);
      } catch (error) {
        console.error("Error fetching features:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  // Fetch distance types
  useEffect(() => {
    const fetchDistanceTypes = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const response = await axiosInstance.get(
          `${baseUrl}/admin/distance-types/all-options`
        );
        setDistanceTypes(response.data);
      } catch (error) {
        console.error("Error fetching distance types:", error);
      }
    };

    fetchDistanceTypes();
  }, []);

  // Toggle feature selection
  const toggleFeature = (featureId: string) => {
    if (featureIds.includes(featureId)) {
      setFeatureIds(featureIds.filter((id: string) => id !== featureId));
    } else {
      setFeatureIds([...featureIds, featureId]);
    }
  };

  // Handle orientation selection
  const handleOrientationChange = (value: string) => {
    setOrientation(value);
  };

  // Add new distance
  const addDistance = () => {
    if (newDistanceTypeId && newDistanceValue) {
      const value = parseFloat(newDistanceValue);
      if (!isNaN(value) && value > 0) {
        // Check if this type already exists
        const exists = distances.some((d) => d.typeId === newDistanceTypeId);

        if (!exists) {
          setDistances([...distances, { typeId: newDistanceTypeId, value }]);
          setNewDistanceTypeId("");
          setNewDistanceValue("");
        } else {
          setErrors(["Bu uzaklık tipi zaten eklenmiş"]);
        }
      } else {
        setErrors(["Lütfen geçerli bir uzaklık değeri girin"]);
      }
    } else {
      setErrors(["Lütfen uzaklık tipi ve değeri girin"]);
    }
  };

  // Remove a distance
  const removeDistance = (typeId: string) => {
    setDistances(distances.filter((d) => d.typeId !== typeId));
  };

  // Start editing a distance
  const startEditingDistance = (typeId: string, currentValue: number) => {
    setEditingDistanceId(typeId);
    setEditingDistanceValue(currentValue.toString());
  };

  // Cancel editing a distance
  const cancelEditingDistance = () => {
    setEditingDistanceId(null);
    setEditingDistanceValue("");
  };

  // Save edited distance
  const saveEditedDistance = () => {
    if (editingDistanceId) {
      const value = parseFloat(editingDistanceValue);
      if (!isNaN(value) && value > 0) {
        setDistances(
          distances.map((d) =>
            d.typeId === editingDistanceId ? { ...d, value } : d
          )
        );
        setEditingDistanceId(null);
        setEditingDistanceValue("");
      } else {
        setErrors(["Lütfen geçerli bir uzaklık değeri girin"]);
      }
    }
  };

  // Get distance type name by ID
  const getDistanceTypeName = (typeId: string): string => {
    const type = distanceTypes.find((dt) => dt._id === typeId);
    return type
      ? type.name[selectedLanguage as keyof typeof type.name] ||
          type.name.tr ||
          type.name.en
      : "";
  };

  // Get distance type unit by ID
  const getDistanceTypeUnit = (typeId: string): string => {
    const type = distanceTypes.find((dt) => dt._id === typeId);
    return type ? type.unit : "km";
  };

  // Group features by type
  const generalFeatures = features.filter((f) => f.featureType === "general");
  const insideFeatures = features.filter((f) => f.featureType === "inside");
  const outsideFeatures = features.filter((f) => f.featureType === "outside");

  // Validate fields
  const validateFields = () => {
    const newErrors: string[] = [];

    // Optional: Check if at least one feature is selected
    if (featureIds.length === 0) {
      newErrors.push("En az bir özellik seçmelisiniz");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle form submission
  const handleContinue = () => {
    // Clear previous errors
    setErrors([]);

    // Validate fields
    const isValid = validateFields();

    if (isValid) {
      // Log current form data
      console.log({
        featureIds,
        distances,
        orientation,
      });

      // Move to the next step
      setCurrentStep(5);
    } else {
      // Scroll to top to see errors
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Feature item component
  const FeatureItem = ({ feature }: { feature: Feature }) => {
    const isSelected = featureIds.includes(feature._id);
    const langKey = selectedLanguage as keyof typeof feature.name;

    return (
      <button
        type="button"
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition border  cursor-pointer ${
          isSelected
            ? "bg-[#EBEAF180] border-[0.5px] border-[#362C75] text-[#362C75]"
            : "bg-transparent border-gray-300 text-gray-700 transition-all duration-300 hover:bg-[#F5F5F5] hover:border-[#595959]"
        }`}
        onClick={() => toggleFeature(feature._id)}
      >
        {feature.iconUrl && (
          <div className="w-5 h-5 relative">
            <Image
              src={feature.iconUrl}
              alt={feature.name[langKey] || ""}
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
        )}
        {feature.name[langKey] || feature.name.en || feature.name.tr}
      </button>
    );
  };

  // Feature section component
  const FeatureSection = ({
    title,
    features,
  }: {
    title: string;
    features: Feature[];
  }) => {
    return (
      <div className="mt-6">
        <h2 className="font-semibold mb-2 text-[#262626]">{title}</h2>
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <FeatureItem key={feature._id} feature={feature} />
          ))}
        </div>
      </div>
    );
  };

  const handleBack = () => {
    setCurrentStep(3);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ECEBF4] flex justify-center items-start p-4">
      <div className="w-full max-w-[1200px] rounded-2xl shadow-lg bg-white">
        <div className="flex flex-col md:flex-row p-10">
          {/* Left Info Panel - 30% width on desktop */}
          <div className="w-full md:w-[30%] mb-8 md:mb-0 md:pr-6 flex flex-col">
            <h1 className="text-2xl font-extrabold leading-tight text-[#362C75]">
              İlan özelliklerini belirleyin.
            </h1>
            <div className="mt-4 space-y-2 text-gray-500">
              <p>Bu bölümde ilanınızın özelliklerini seçerek</p>
              <p>alıcıların ilan detaylarını daha kolay</p>
              <p>görmesini sağlayabilirsiniz. Doğru özellik</p>
              <p>seçimi ilanınızın değerini artıracaktır.</p>
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
            <GoBackButton handleBack={handleBack} step={4} totalSteps={5} />
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

            {/* Orientation (Cephe) Section */}
            <div className="mb-8">
              <h2 className="font-semibold mb-4 text-[#262626] text-xl">
                Cephe
              </h2>
              <div className="flex flex-wrap gap-4">
                {orientationOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition border cursor-pointer ${
                      orientation === option.value
                        ? "bg-[#EBEAF180] border-[0.5px] border-[#362C75] text-[#362C75] "
                        : "bg-transparent border-gray-300 text-gray-700 transition-all duration-300 hover:bg-[#F5F5F5] hover:border-[#595959]"
                    }`}
                    onClick={() => handleOrientationChange(option.value)}
                  >
                    <Image
                      src={option.icon}
                      alt={option.label}
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                    <span className="font-medium ml-2">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* General Features */}
            <FeatureSection
              title="Genel Özellikler"
              features={generalFeatures}
            />

            {/* Interior Features */}
            <FeatureSection title="İç Özellikler" features={insideFeatures} />

            {/* Exterior Features */}
            <FeatureSection title="Dış Özellikler" features={outsideFeatures} />

            {/* Distances Section */}
            <div className="mt-8">
              <h2 className="font-semibold mb-3 text-[#262626]">Uzaklıklar</h2>

              {/* Add new distance form */}
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="w-full md:w-[45%]">
                  <CustomSelect
                    options={distanceTypes.map((type) => ({
                      value: type._id,
                      label:
                        type.name[selectedLanguage as keyof typeof type.name] ||
                        type.name.tr ||
                        type.name.en,
                    }))}
                    value={newDistanceTypeId}
                    onChange={(value) => setNewDistanceTypeId(value)}
                    placeholder="Uzaklık tipi seçin"
                  />
                </div>
                <div className="w-full md:w-[25%]">
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg placeholder:text-gray-400 text-gray-700"
                      placeholder="Uzaklık"
                      value={newDistanceValue}
                      onChange={(e) => setNewDistanceValue(e.target.value)}
                    />
                    <span className="absolute right-3 top-2.5 text-gray-500">
                      km
                    </span>
                  </div>
                </div>
                <div className="w-full md:w-auto">
                  <button
                    type="button"
                    onClick={addDistance}
                    className="h-10 px-4 bg-[#6656AD] text-white rounded-lg flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Ekle
                  </button>
                </div>
              </div>

              {/* Current distances */}
              {distances.length > 0 && (
                <div className="mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-gray-700">
                      Eklenen Uzaklıklar
                    </h3>
                    <div className="space-y-2">
                      {distances.map((distance) => (
                        <div
                          key={distance.typeId}
                          className="flex items-center justify-between py-2 px-3 bg-white rounded-md border border-gray-200 text-gray-700"
                        >
                          <div className="flex items-center gap-2">
                            {distanceTypes.find(
                              (dt) => dt._id === distance.typeId
                            )?.iconUrl && (
                              <div className="w-5 h-5 relative">
                                <Image
                                  src={
                                    distanceTypes.find(
                                      (dt) => dt._id === distance.typeId
                                    )?.iconUrl || ""
                                  }
                                  alt={getDistanceTypeName(distance.typeId)}
                                  width={20}
                                  height={20}
                                  className="object-contain"
                                />
                              </div>
                            )}
                            <span>{getDistanceTypeName(distance.typeId)}</span>
                          </div>
                          <div className="flex items-center">
                            {editingDistanceId === distance.typeId ? (
                              <>
                                <div className="relative mr-2">
                                  <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    className="w-20 h-8 px-3 border border-gray-300 rounded-lg placeholder:text-gray-400 text-gray-700"
                                    value={editingDistanceValue}
                                    onChange={(e) =>
                                      setEditingDistanceValue(e.target.value)
                                    }
                                  />
                                  <span className="absolute right-3 top-1.5 text-gray-500 text-sm">
                                    {getDistanceTypeUnit(distance.typeId)}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={saveEditedDistance}
                                  className="text-green-500 mr-1"
                                >
                                  <CheckIcon className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEditingDistance}
                                  className="text-gray-500 mr-1"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="mr-6">
                                  {distance.value}{" "}
                                  {getDistanceTypeUnit(distance.typeId)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    startEditingDistance(
                                      distance.typeId,
                                      distance.value
                                    )
                                  }
                                  className="text-blue-500 mr-2"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => removeDistance(distance.typeId)}
                              className="text-red-500"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
