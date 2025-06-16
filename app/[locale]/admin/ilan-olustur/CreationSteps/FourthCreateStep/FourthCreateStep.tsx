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
import { infrastructureFeatures } from "../../../../../utils/infrastructureFeatures";
import { views } from "../../../../../utils/views";

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

interface OrientationOption {
  _id: string;
  name: {
    tr: string;
    en: string;
  };
  iconUrl: string;
  featureType: "face";
  isQuickFilter: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function FourthCreateStep() {
  const formPanelRef = useRef<HTMLDivElement>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [distanceTypes, setDistanceTypes] = useState<DistanceType[]>([]);
  const [orientationOptions, setOrientationOptions] = useState<
    OrientationOption[]
  >([]);
  const [elderlyDisabledFeatures, setElderlyDisabledFeatures] = useState<
    Feature[]
  >([]);
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
    faces,
    setFaces,
    setCurrentStep,
    infrastructureFeatureIds,
    setInfrastructureFeatureIds,
    viewIds,
    setViewIds,
    entranceType,
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

  // Fetch orientation options (face features)
  useEffect(() => {
    const fetchOrientationOptions = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const response = await axiosInstance.get(`${baseUrl}/features/face`);
        setOrientationOptions(response.data);
      } catch (error) {
        console.error("Error fetching orientation options:", error);
      }
    };

    fetchOrientationOptions();
  }, []);

  // Fetch elderly and disabled features
  useEffect(() => {
    const fetchElderlyDisabledFeatures = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const response = await axiosInstance.get(
          `${baseUrl}/features/for-olds-and-disabled`
        );
        setElderlyDisabledFeatures(response.data);
      } catch (error) {
        console.error("Error fetching elderly and disabled features:", error);
      }
    };

    fetchElderlyDisabledFeatures();
  }, []);

  // Toggle feature selection
  const toggleFeature = (featureId: string) => {
    if (featureIds.includes(featureId)) {
      setFeatureIds(featureIds.filter((id: string) => id !== featureId));
    } else {
      setFeatureIds([...featureIds, featureId]);
    }
  };

  const toggleInfrastructureFeature = (featureId: string) => {
    if (infrastructureFeatureIds.includes(featureId)) {
      setInfrastructureFeatureIds(
        infrastructureFeatureIds.filter((id: string) => id !== featureId)
      );
    } else {
      setInfrastructureFeatureIds([...infrastructureFeatureIds, featureId]);
    }
  };

  const toggleView = (viewId: string) => {
    if (viewIds.includes(viewId)) {
      setViewIds(viewIds.filter((id) => id !== viewId));
    } else {
      setViewIds([...viewIds, viewId]);
    }
  };

  // Toggle face selection
  const toggleFace = (faceId: string) => {
    setFaces((prevFaces) =>
      prevFaces.includes(faceId)
        ? prevFaces.filter((id) => id !== faceId)
        : [...prevFaces, faceId]
    );
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
    if (featureIds.length === 0 && entranceType?.tr !== "Arsa") {
      newErrors.push("En az bir özellik seçmelisiniz");
    }

    return newErrors;
  };

  // Handle form submission
  const handleContinue = () => {
    const validationErrors = validateFields();
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      // Log current form data
      console.log({
        featureIds,
        distances,
        faces,
      });

      // Move to the next step
      setCurrentStep(5);
    } else {
      // Scroll form panel to top to see errors
      if (formPanelRef.current) {
        formPanelRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
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

  return (
    <div className="min-h-screen bg-[#ECEBF4] flex justify-center items-start p-4">
      <div className="w-full max-w-[1200px] rounded-2xl shadow-lg bg-white">
        <div className="flex flex-col md:flex-row p-10">
          {/* Left Info Panel */}
          <div className="w-full md:w-[30%] mb-8 md:mb-0 md:pr-6 flex flex-col">
            <h1 className="text-2xl font-extrabold leading-tight text-[#362C75]">
              İlanın özelliklerini ve çevresel bilgilerini ekleyin.
            </h1>
            <div className="mt-4 text-base text-[#595959] font-medium">
              <p className="leading-[140%]">
                Bu adımda, mülkünüzün sahip olduğu iç, dış ve genel özellikleri,
                manzarayı, cepheyi ve çevresindeki önemli noktalara olan
                uzaklıkları belirtebilirsiniz. Detaylı bilgi, ilanı daha çekici
                kılar.
              </p>
            </div>
          </div>

          {/* Right Form Panel */}
          <div ref={formPanelRef} className="w-full md:w-[70%] md:pl-6 h-auto md:h-[67vh]  2xl:h-[73vh] overflow-auto border-l border-[#F0F0F0]">
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

            <div className="space-y-8">
              {/* Orientation (Cephe) */}
              {entranceType?.tr !== "Arsa" && (
                <div>
                  <h2 className="font-semibold mb-4 text-[#262626] text-xl">
                    Cephe
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {orientationOptions.map((option) => (
                      <button
                        key={option._id}
                        type="button"
                        className={`inline-flex items-center  px-4 py-2 rounded-full transition border cursor-pointer ${
                          faces.includes(option._id)
                            ? "bg-[#EBEAF180] border-[0.5px] border-[#362C75] text-[#362C75] "
                            : "bg-transparent border-gray-300 text-gray-700 transition-all duration-300 hover:bg-[#F5F5F5] hover:border-[#595959]"
                        }`}
                        onClick={() => toggleFace(option._id)}
                      >
                        <Image
                          src={option.iconUrl}
                          alt={
                            option.name[
                              selectedLanguage as keyof typeof option.name
                            ] || ""
                          }
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                        <span className="font-medium ml-2">
                          {option.name[
                            selectedLanguage as keyof typeof option.name
                          ] || ""}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* General Features */}
              {/* {entranceType?.tr !== "Arsa" && (
                <FeatureSection
                  title="Genel Özellikler"
                  features={generalFeatures}
                />
              )} */}

              {/* Interior Features */}
              {entranceType?.tr !== "Arsa" && (
                <FeatureSection
                  title="İç Özellikler"
                  features={insideFeatures}
                />
              )}

              {/* Exterior Features */}
              {entranceType?.tr !== "Arsa" && (
                <FeatureSection
                  title="Dış Özellikler"
                  features={outsideFeatures}
                />
              )}

              {/* Elderly and Disabled Features */}
              {entranceType?.tr !== "Arsa" && (
                <FeatureSection
                  title="Engelliye ve Yaşlıya Yönelik Özellikler"
                  features={elderlyDisabledFeatures}
                />
              )}

              {/* Infrastructure Features */}
              {entranceType?.tr === "Arsa" && (
                <>
                  {" "}
                  <div className="mt-6">
                    <h2 className="font-semibold mb-2 text-[#262626]">
                      Altyapı Özellikleri
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(infrastructureFeatures).map(
                        ([key, feature]) => {
                          const isSelected =
                            infrastructureFeatureIds.includes(key);
                          const displayName =
                            selectedLanguage === "en" ? feature.en : feature.tr;
                          return (
                            <button
                              key={key}
                              type="button"
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition border  cursor-pointer ${
                                isSelected
                                  ? "bg-[#EBEAF180] border-[0.5px] border-[#362C75] text-[#362C75]"
                                  : "bg-transparent border-gray-300 text-gray-700 transition-all duration-300 hover:bg-[#F5F5F5] hover:border-[#595959]"
                              }`}
                              onClick={() => toggleInfrastructureFeature(key)}
                            >
                              {feature.image && (
                                <div className="w-5 h-5 relative">
                                  <Image
                                    src={feature.image}
                                    alt={displayName}
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                  />
                                </div>
                              )}
                              {displayName}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                  {/* View (Manzara) Section */}
                  <div className="mt-8">
                    <h2 className="font-semibold mb-2 text-[#262626]">
                      Manzara
                    </h2>
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(views).map(([key, view]) => {
                        const isSelected = viewIds.includes(key);
                        const displayName =
                          selectedLanguage === "en" ? view.en : view.tr;
                        return (
                          <button
                            key={key}
                            type="button"
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition border  cursor-pointer ${
                              isSelected
                                ? "bg-[#EBEAF180] border-[0.5px] border-[#362C75] text-[#362C75]"
                                : "bg-transparent border-gray-300 text-gray-700 transition-all duration-300 hover:bg-[#F5F5F5] hover:border-[#595959]"
                            }`}
                            onClick={() => toggleView(key)}
                          >
                            <Image
                              src={view.image}
                              alt={displayName}
                              width={20}
                              height={20}
                              className="object-contain"
                            />
                            <span className="font-medium ml-2">
                              {displayName}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Distances */}
              <div>
                <h2 className="text-xl font-bold text-[#181818] mb-2">
                  Lokasyon Özellikleri
                </h2>
                <p className="text-sm text-[#6C6C6C] mb-6">
                  Gayrimenkulün merkezi lokasyonlara olan uzaklığını belirtin.
                </p>

                {/* Add new distance form */}
                <div className="space-y-4 mb-6">
                  {distanceTypes.filter(
                    (type) => !distances.some((d) => d.typeId === type._id)
                  ).length > 0 ? (
                    <>
                      <div className="w-full">
                        <CustomSelect
                          options={distanceTypes
                            .filter(
                              (type) =>
                                !distances.some((d) => d.typeId === type._id)
                            )
                            .map((type) => ({
                              value: type._id,
                              label:
                                type.name[
                                  selectedLanguage as keyof typeof type.name
                                ] ||
                                type.name.tr ||
                                type.name.en,
                            }))}
                          value={newDistanceTypeId}
                          onChange={(value) => setNewDistanceTypeId(value)}
                          placeholder="Uzaklık Tipi"
                        />
                      </div>
                      <div className="w-full">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          className="w-full h-12 px-4 border border-[#E2E2E2] rounded-lg placeholder:text-gray-400 text-gray-700 focus:outline-none focus:border-[#5D568D]"
                          placeholder="Lokasyona olan uzaklığı yazın (Km)"
                          value={newDistanceValue}
                          onChange={(e) => setNewDistanceValue(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addDistance}
                        className="px-6 py-2 bg-[#5D568D] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#4A4570] transition-colors cursor-pointer"
                      >
                        <PlusIcon className="h-5 w-5" />
                        Ekle
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p>Tüm lokasyon tipleri eklenmiştir.</p>
                    </div>
                  )}
                </div>

                {/* Separator line */}
                <div className="border-t border-[#E2E2E2] mb-6"></div>

                {/* Current distances as chips */}
                {distances.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {distances.map((distance) => (
                      <div
                        key={distance.typeId}
                        className="flex items-center gap-3 h-10 px-4 border-[0.5px] border-[#362C75] rounded-[20px] bg-[#EBEAF180]"
                      >
                        {/* Icon */}
                        {distanceTypes.find((dt) => dt._id === distance.typeId)
                          ?.iconUrl && (
                          <div className="w-6 h-6 relative flex-shrink-0">
                            <Image
                              src={
                                distanceTypes.find(
                                  (dt) => dt._id === distance.typeId
                                )?.iconUrl || ""
                              }
                              alt={getDistanceTypeName(distance.typeId)}
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          </div>
                        )}

                        {/* Location name */}
                        <span className="text-sm font-medium text-[#362C75]">
                          {getDistanceTypeName(distance.typeId)}
                        </span>

                        {/* Distance value */}
                        <span className="text-sm text-[#8C8C8C]">
                          {distance.value}{" "}
                          {getDistanceTypeUnit(distance.typeId)}
                        </span>

                        {/* Close button */}
                        <button
                          type="button"
                          onClick={() => removeDistance(distance.typeId)}
                          className="text-[#333] hover:text-red-500 transition-colors ml-1 cursor-pointer"
                        >
                          <img src="/x-03.png" alt="x" className="w-6 h-6" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className=" flex flex-col sm:flex-row justify-between items-center p-6">
          <GoBackButton handleBack={handleBack} step={4} totalSteps={6} />
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
