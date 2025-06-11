import React, { useState, useRef, useEffect } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useListingForm } from "../CreationSteps";
import axiosInstance from "@/axios";
import { useRouter } from "@/app/utils/router";
import GoBackButton from "../../GoBackButton/GoBackButton";
import { XCircleIcon } from "@heroicons/react/24/solid";

// Predefined document types
const DOCUMENT_TYPES = [
  { tr: "Kat Planı", en: "Floor Plan" },
  { tr: "Enerji Sertifikası", en: "Energy Certificate" },
  { tr: "Ekspertiz Raporu", en: "Expert Report" },
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
    orientation,
    country,
    city,
    state,
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
        exchangeable,
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
        face: orientation,
        country,
        city,
        state,
        street,
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
      return;
    }

    // Submit the hotel creation or update
    submitHotelCreation();
  };

  const handleBack = () => {
    setCurrentStep(5);
  };

  return (
    <div className="min-h-screen bg-[#ECEBF4] flex justify-center items-start p-4">
      <div className="w-full max-w-[1200px] rounded-2xl shadow-lg bg-white">
        <div className="flex flex-col md:flex-row p-10">
          {/* Left Info Panel */}
          <div className="w-full md:w-[30%] mb-8 md:mb-0 md:pr-6 flex flex-col">
            <h1 className="text-2xl font-extrabold leading-tight text-[#362C75]">
              İlanınıza ait dökümanları ekleyin.
            </h1>
            <div className="mt-4 text-base text-[#595959] font-medium">
              <p className="leading-[140%]">
                Bu adımda, mülkünüze ait kat planı, ekspertiz raporu gibi
                dökümanları yükleyebilirsiniz. Bu, ilanın güvenilirliğini
                artırır. Son adımda 'İlanı Kaydet' butonuna basarak işlemi
                tamamlayabilirsiniz.
              </p>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="w-full md:w-[70%] md:pl-6 h-auto md:h-[67vh]  2xl:h-[73vh] overflow-auto border-l border-[#F0F0F0]">
            {/* Error display */}
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
            {submitError && (
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
                      Form gönderilirken bir hata oluştu:
                    </h3>
                    <p className="mt-2 text-sm text-red-700">{submitError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Document Upload Section */}
            <div className="space-y-6">
              {DOCUMENT_TYPES.map((docType, index) => {
                const docKey = `${docType.tr}_${docType.en}`;
                const fileLink = documentLinks[docKey];
                const isUploading = uploadingDocs[docKey];
                const isLink = isDocumentLink(docType);

                return (
                  <div key={index} className="rounded-lg">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {docType.tr}
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Dropzone */}
                      <div
                        className={`flex-1 p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                          dragActive[docKey]
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-300 hover:border-indigo-400"
                        }`}
                        onDragEnter={(e) => handleDrag(e, docKey)}
                        onDragLeave={(e) => handleDrag(e, docKey)}
                        onDragOver={(e) => handleDrag(e, docKey)}
                        onDrop={(e) => handleDrop(e, docType)}
                        onClick={() => fileInputRefs.current[docKey]?.click()}
                      >
                        <input
                          type="file"
                          ref={(el) => {
                            fileInputRefs.current[docKey] = el;
                          }}
                          className="hidden"
                          onChange={(e) => handleDocumentSelect(e, docType)}
                        />
                        {isUploading ? (
                          <p>Yükleniyor...</p>
                        ) : (
                          <p className="text-gray-500">
                            Dosyayı sürükleyip bırakın veya seçmek için tıklayın
                          </p>
                        )}
                      </div>
                    </div>

                    {fileLink && (
                      <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700 truncate">
                            {isLink ? fileLink : "Dosya Yüklendi"}
                          </span>
                        </div>
                        <button
                          onClick={() => removeDocument(docType)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Kaldır
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className=" flex flex-col sm:flex-row justify-between items-center p-6">
          <GoBackButton handleBack={handleBack} step={6} totalSteps={6} />
          <button
            type="button"
            onClick={handleComplete}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isSubmitting
              ? "Kaydediliyor..."
              : isUpdate
              ? "İlanı Güncelle"
              : "İlanı Kaydet ve Tamamla"}
          </button>
        </div>
      </div>
    </div>
  );
}
