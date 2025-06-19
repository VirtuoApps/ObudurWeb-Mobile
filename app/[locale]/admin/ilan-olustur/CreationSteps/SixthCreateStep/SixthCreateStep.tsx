import React, { useState, useRef, useEffect } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useListingForm } from "../CreationSteps";
import axiosInstance from "@/axios";
import { useRouter } from "@/app/utils/router";
import GoBackButton from "../../GoBackButton/GoBackButton";

// Predefined document types
const DOCUMENT_TYPES = [
  { tr: "Kat Planı", en: "Floor Plan" },
  { tr: "Teklif Formu", en: "Offer Form" },
];

export default function SixthCreateStep() {
  const router = useRouter();
  const {
    setCurrentStep,
    images,
    setImages,
    video,
    setVideo,
    documents,
    setDocuments,
    // Get all the necessary data from context
    title,
    description,
    listingType,
    entranceType,
    housingType,
    price,
    projectArea,
    totalSize,
    roomCount,
    bathroomCount,
    bedRoomCount,
    floorCount,
    buildYear,
    kitchenType,
    exchangeable,
    creditEligible,
    buildingAge,
    isFurnished,
    dues,
    usageStatus,
    deedStatus,
    generalFeatures,
    zoningStatus,
    heatingType,
    source,
    faces,
    country,
    city,
    state,
    neighborhood,
    street,
    buildingNo,
    apartmentNo,
    postalCode,
    coordinates,
    featureIds,
    distances,
    // Get update mode details
    isUpdate,
    hotelId,
    infrastructureFeatureIds,
    viewIds,
    parselNo,
    adaNo,
    floorPosition,
  } = useListingForm();

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [documentLinks, setDocumentLinks] = useState<{ [key: string]: string }>(
    {}
  );
  const [uploadingDocs, setUploadingDocs] = useState<{
    [key: string]: boolean;
  }>({});
  const [dragActive, setDragActive] = useState<{ [key: string]: boolean }>({});
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const formPanelRef = useRef<HTMLDivElement>(null);

  // Initialize document links from existing documents
  useEffect(() => {
    if (isUpdate && documents.length > 0) {
      const links: { [key: string]: string } = {};
      documents.forEach((doc: any) => {
        const docKey = `${doc.name.tr}_${doc.name.en}`;
        links[docKey] = doc.file;
      });
      setDocumentLinks(links);
    }
  }, [isUpdate, documents]);

  // Upload a single document
  const uploadDocument = async (
    file: File,
    docType: (typeof DOCUMENT_TYPES)[0]
  ) => {
    try {
      const docKey = `${docType.tr}_${docType.en}`;
      setUploadingDocs((prev) => ({ ...prev, [docKey]: true }));

      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(`/file-system/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update documents array
      const newDocument = {
        name: { tr: docType.tr, en: docType.en },
        file: response.data.location,
      };

      setDocuments((prev: any) => {
        const filtered = prev.filter(
          (doc: any) => doc.name.tr !== docType.tr || doc.name.en !== docType.en
        );
        return [...filtered, newDocument];
      });

      setDocumentLinks((prev) => ({
        ...prev,
        [docKey]: response.data.location,
      }));
      setUploadingDocs((prev) => ({ ...prev, [docKey]: false }));

      return response.data.location;
    } catch (error) {
      console.error("Document upload error:", error);
      setUploadingDocs((prev) => ({
        ...prev,
        [`${docType.tr}_${docType.en}`]: false,
      }));
      setErrors((prev) => [
        ...prev,
        `${docType.tr} yüklenemedi. Lütfen tekrar deneyin.`,
      ]);
      return null;
    }
  };

  // Handle document file selection
  const handleDocumentSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    docType: (typeof DOCUMENT_TYPES)[0]
  ) => {
    if (!event.target.files || !event.target.files[0]) return;

    const file = event.target.files[0];
    await uploadDocument(file, docType);
  };

  // Handle document link input
  const handleDocumentLink = (
    docType: (typeof DOCUMENT_TYPES)[0],
    link: string
  ) => {
    const docKey = `${docType.tr}_${docType.en}`;
    setDocumentLinks((prev) => ({ ...prev, [docKey]: link }));

    if (link.trim()) {
      const newDocument = {
        name: { tr: docType.tr, en: docType.en },
        file: link,
      };

      setDocuments((prev: any) => {
        const filtered = prev.filter(
          (doc: any) => doc.name.tr !== docType.tr || doc.name.en !== docType.en
        );
        return [...filtered, newDocument];
      });
    } else {
      // Remove document if link is empty
      setDocuments((prev: any) =>
        prev.filter(
          (doc: any) => doc.name.tr !== docType.tr || doc.name.en !== docType.en
        )
      );
    }
  };

  // Remove uploaded document
  const removeDocument = (docType: (typeof DOCUMENT_TYPES)[0]) => {
    const docKey = `${docType.tr}_${docType.en}`;
    setDocumentLinks((prev) => {
      const newLinks = { ...prev };
      delete newLinks[docKey];
      return newLinks;
    });

    setDocuments((prev: any) =>
      prev.filter(
        (doc: any) => doc.name.tr !== docType.tr || doc.name.en !== docType.en
      )
    );
  };

  // Check if document is a link (URL)
  const isDocumentLink = (docType: (typeof DOCUMENT_TYPES)[0]) => {
    const docKey = `${docType.tr}_${docType.en}`;
    const link = documentLinks[docKey];
    return link && (link.startsWith("http://") || link.startsWith("https://"));
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent, docKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [docKey]: true }));
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [docKey]: false }));
    }
  };

  // Handle drop event
  const handleDrop = async (
    e: React.DragEvent,
    docType: (typeof DOCUMENT_TYPES)[0]
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const docKey = `${docType.tr}_${docType.en}`;
    setDragActive((prev) => ({ ...prev, [docKey]: false }));

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await uploadDocument(file, docType);
    }
  };

  // Submit hotel creation or update
  const submitHotelCreation = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Map data from context to DTO format
      const hotelData = {
        title,
        description,
        listingType,
        entranceType,
        housingType,
        price: price.map((p: any) => ({
          amount: p.amount,
          currency: p.currency,
        })),
        projectArea,
        totalSize,
        roomCount,
        bathroomCount,
        bedRoomCount,
        floorCount,
        buildYear,
        kitchenType,
        exchangeable:
          typeof exchangeable === "string"
            ? exchangeable === "true"
              ? true
              : false
            : exchangeable,
        creditEligible:
          creditEligible === "true"
            ? true
            : creditEligible === "false"
            ? false
            : null,
        buildingAge,
        isFurnished,
        dues,
        usageStatus: Object.fromEntries(usageStatus),
        deedStatus: Object.fromEntries(deedStatus),
        generalFeatures: Object.fromEntries(generalFeatures),
        zoningStatus: Object.fromEntries(zoningStatus),
        heatingType,
        source,
        faces: faces,
        country,
        city,
        state,
        neighborhood: {
          tr: neighborhood.tr,
          en: neighborhood.en,
        },
        street: {
          tr: street.tr,
          en: street.en,
        },
        buildingNo,
        apartmentNo,
        postalCode,
        location: {
          type: "Point",
          coordinates: coordinates,
        },
        featureIds,
        infrastructureFeatureIds,
        viewIds,
        distances: distances.map((d: any) => ({
          typeId: d.typeId,
          value: d.value,
        })),
        images,
        // Add video if available
        ...(video && { video }),
        // Add documents
        documents,
        adaNo,
        parselNo,
        floorPosition,
      };

      console.log("hotelData", hotelData);

      let response;

      // If in update mode, use PATCH instead of POST
      if (isUpdate && hotelId) {
        response = await axiosInstance.patch(
          `/admin/hotels/${hotelId}`,
          hotelData
        );
        console.log("Hotel updated successfully:", response.data);
      } else {
        response = await axiosInstance.post("/admin/hotels", hotelData);
        console.log("Hotel created successfully:", response.data);
      }

      // Redirect to admin dashboard or hotel list
      router.push("/admin/ilanlar");
    } catch (error: any) {
      console.error(`Hotel ${isUpdate ? "update" : "creation"} error:`, error);
      setSubmitError(
        error.response?.data?.message ||
          `İlan ${
            isUpdate ? "güncellenirken" : "oluşturulurken"
          } bir hata oluştu. Lütfen tekrar deneyin.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form completion
  const handleComplete = () => {
    setErrors([]);

    const hasUploadingDocs = Object.values(uploadingDocs).some(
      (uploading) => uploading
    );
    if (hasUploadingDocs) {
      setErrors(["Yüklenmekte olan dökümanlar var, lütfen bekleyin."]);
      if (formPanelRef.current) {
        formPanelRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // Submit the hotel creation or update
    submitHotelCreation();
  };

  // Add scroll reset effect when step changes
  useEffect(() => {
    if (formPanelRef.current) {
      formPanelRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <div className="min-h-screen bg-[#ECEBF4] flex justify-center items-start p-4">
      <div className="w-full max-w-[1200px] rounded-2xl shadow-lg bg-white">
        <div className="flex flex-col md:flex-row p-10">
          {/* Left Info Panel - 30% width on desktop */}
          <div className="w-full md:w-[30%] mb-8 md:mb-0 md:pr-6 flex flex-col">
            <h1 className="text-2xl font-extrabold leading-tight text-[#362C75]">
              Dökümanlar
            </h1>
            <div className="mt-4 text-base text-[#595959] font-medium">
              <p className="leading-[140%]">
                İlan vereceğiniz mülkün dökümanlarını yükleyin.
                <br />
                <br />
                Dökümanları dosya olarak yükleyebilir veya link olarak
                ekleyebilirsiniz.
              </p>
            </div>
          </div>

          {/* Right Form Panel - 70% width on desktop */}
          <div
            ref={formPanelRef}
            className="w-full md:w-[70%] md:pl-6 md:h-[67vh]  2xl:h-[73vh]  overflow-y-auto overflow-x-hidden"
          >
            {/* Errors display */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
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
            )}

            {/* Form submission error */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    İlan oluşturma hatası:
                  </h3>
                  <div className="mt-2 text-sm text-red-700">{submitError}</div>
                </div>
              </div>
            )}

            {/* Document Upload Sections */}
            {DOCUMENT_TYPES.map((docType, index) => {
              const docKey = `${docType.tr}_${docType.en}`;
              const hasDocument = !!documentLinks[docKey];
              const isLink = isDocumentLink(docType);
              const isUploading = uploadingDocs[docKey];

              return (
                <div key={index} className="mb-8">
                  <h2 className="font-semibold text-lg mb-2 text-gray-700">
                    {docType.tr}
                  </h2>

                  {/* Link input */}
                  <div className="w-full flex flex-row items-center relative mb-5 ml-4">
                    <img src="/link-angled.png" className="w-6 h-6" />
                    <input
                      className="border border-[#D9D9D9] rounded-2xl p-4 flex items-center gap-2 w-full text-gray-600 pl-12 pr-12 -ml-10 placeholder:text-gray-400"
                      placeholder="Dosya linkini girin"
                      value={isLink ? documentLinks[docKey] : ""}
                      onChange={(e) =>
                        handleDocumentLink(docType, e.target.value)
                      }
                      disabled={hasDocument && !isLink}
                    />
                    {isLink && (
                      <button
                        type="button"
                        onClick={() => handleDocumentLink(docType, "")}
                        className="absolute right-6 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* File upload area */}
                  {!hasDocument || !isLink ? (
                    <div
                      className={`border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center ${
                        hasDocument ? "bg-green-50" : "bg-white"
                      } ${!hasDocument ? "cursor-pointer" : ""} ${
                        dragActive[docKey] ? "border-blue-500 bg-blue-50" : ""
                      } transition-colors`}
                      onClick={() => {
                        if (!hasDocument && fileInputRefs.current[docKey]) {
                          fileInputRefs.current[docKey]?.click();
                        }
                      }}
                      onDragEnter={(e) => handleDrag(e, docKey)}
                      onDragLeave={(e) => handleDrag(e, docKey)}
                      onDragOver={(e) => handleDrag(e, docKey)}
                      onDrop={(e) => handleDrop(e, docType)}
                    >
                      <input
                        type="file"
                        ref={(el) => {
                          fileInputRefs.current[docKey] = el;
                        }}
                        onChange={(e) => handleDocumentSelect(e, docType)}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="hidden"
                        disabled={hasDocument}
                      />

                      {isUploading ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin mr-2 h-6 w-6 text-gray-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span className="text-sm text-gray-600">
                            Yükleniyor...
                          </span>
                        </div>
                      ) : hasDocument ? (
                        <div className="flex items-center space-x-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-8 h-8 text-green-600"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-sm text-green-600">
                            Dosya yüklendi
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeDocument(docType);
                            }}
                            className="ml-4 text-red-600 hover:text-red-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={`w-8 h-8 ${
                              dragActive[docKey]
                                ? "text-blue-500"
                                : "text-gray-400"
                            } transition-colors`}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                          <p
                            className={`mt-2 text-sm ${
                              dragActive[docKey]
                                ? "text-blue-600"
                                : "text-gray-600"
                            } transition-colors`}
                          >
                            {dragActive[docKey]
                              ? "Dosyayı bırakın"
                              : "Bilgisayardan yükle veya sürükle bırak"}
                          </p>
                          {dragActive[docKey] && (
                            <p className="mt-1 text-xs text-blue-500">
                              PDF, DOC, DOCX, JPG, JPEG, PNG
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}

            {/* Navigation buttons */}
          </div>
        </div>
        <div className=" flex flex-col sm:flex-row justify-between items-center p-6">
          <GoBackButton
            handleBack={() => {
              setCurrentStep(5);
            }}
            step={6}
            totalSteps={6}
          />
          <button
            type="button"
            onClick={handleComplete}
            disabled={
              Object.values(uploadingDocs).some((uploading) => uploading) ||
              isSubmitting
            }
            className="bg-[#6656AD] hover:bg-[#5349a0] text-white font-semibold px-8 py-3 rounded-xl transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>İşleniyor...</span>
              </div>
            ) : (
              <span>{isUpdate ? "Güncelle" : "Oluştur"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
