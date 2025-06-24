import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";

import axiosInstance from "@/axios";
import { useListingForm } from "../CreationSteps";
import { useRouter } from "@/app/utils/router";
import { useTranslations } from "next-intl";
import GoBackButton from "../../GoBackButton/GoBackButton";

export default function FifthCreateStep() {
  const router = useRouter();
  const t = useTranslations("adminCreation.step5");
  const {
    setCurrentStep,
    images,
    setImages,
    video,
    setVideo,
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
  } = useListingForm();

  const [selectedImages, setSelectedImages] = useState<
    { file: File; url: string; uploading: boolean; error: boolean }[]
  >([]);
  const [selectedVideo, setSelectedVideo] = useState<{
    file: File;
    url: string;
    uploading: boolean;
    error: boolean;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const formPanelRef = useRef<HTMLDivElement>(null);

  // Initialize selectedImages with existing images when in update mode
  useEffect(() => {
    if (isUpdate && images.length > 0) {
      const existingImages = images.map((imageUrl) => ({
        file: new File([], "existing-image"), // Dummy file, not needed for existing images
        url: imageUrl,
        uploading: false,
        error: false,
      }));
      setSelectedImages(existingImages);
    }

    // Initialize video preview if one exists
    if (isUpdate && video) {
      setSelectedVideo({
        file: new File([], "existing-video"), // Dummy file, not needed for existing video
        url: video,
        uploading: false,
        error: false,
      });
    }
  }, [isUpdate, images, video]);

  // Add scroll reset effect when step changes
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
  }, []); // Empty dependency array means this runs once when component mounts

  // Upload a single image
  const uploadImage = async (file: File, index: number) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const formData = new FormData();
      formData.append("image", file);

      // Update the status to uploading
      setSelectedImages((prev) => {
        const newImages = [...prev];
        newImages[index] = { ...newImages[index], uploading: true };
        return newImages;
      });

      const response = await axiosInstance.post(
        `${baseUrl}/file-system/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the image URL and status
      setSelectedImages((prev) => {
        const newImages = [...prev];
        newImages[index] = {
          ...newImages[index],
          uploading: false,
          url: response.data.location,
        };
        return newImages;
      });

      // Add to context
      setImages((prev) => [...prev, response.data.location]);

      return response.data.location;
    } catch (error) {
      console.error("Upload error:", error);

      // Mark as error
      setSelectedImages((prev) => {
        const newImages = [...prev];
        newImages[index] = {
          ...newImages[index],
          uploading: false,
          error: true,
        };
        return newImages;
      });

      return null;
    }
  };

  // Upload video
  const uploadVideo = async (file: File) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const formData = new FormData();
      formData.append("file", file);

      // Update the status to uploading
      setSelectedVideo((prev) => {
        if (!prev) return null;
        return { ...prev, uploading: true };
      });

      const response = await axiosInstance.post(
        `${baseUrl}/file-system/file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the video URL and status
      setSelectedVideo((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          uploading: false,
          url: URL.createObjectURL(file), // Keep the local URL for preview
        };
      });

      // Add to context
      setVideo(response.data.location);

      return response.data.location;
    } catch (error) {
      console.error("Video upload error:", error);

      // Mark as error
      setSelectedVideo((prev) => {
        if (!prev) return null;
        return { ...prev, uploading: false, error: true };
      });

      return null;
    }
  };

  // Handle image selection
  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    if (selectedImages.length + files.length > 15) {
      setErrors([t("validation.maxImages")]);
      setTimeout(() => {
        setErrors([]);
      }, 3000);
      return;
    }

    // Add files to local state first for immediate display
    const newImageItems = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      uploading: false,
      error: false,
    }));

    setSelectedImages((prev) => [...prev, ...newImageItems]);

    // Upload each file immediately
    files.forEach((file, idx) => {
      const newIndex = selectedImages.length + idx;
      uploadImage(file, newIndex);
    });
  };

  // Handle video selection
  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;

    const file = event.target.files[0];

    // Create local preview
    const videoObj = {
      file,
      url: URL.createObjectURL(file),
      uploading: false,
      error: false,
    };

    setSelectedVideo(videoObj);

    // Start upload immediately
    uploadVideo(file);
  };

  // Handle image drag and drop
  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!event.dataTransfer.files) return;

    const files = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (selectedImages.length + files.length > 15) {
      setErrors([t("validation.maxImages")]);
      return;
    }

    // Add files to local state first for immediate display
    const newImageItems = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      uploading: false,
      error: false,
    }));

    setSelectedImages((prev) => [...prev, ...newImageItems]);

    // Upload each file immediately
    files.forEach((file, idx) => {
      const newIndex = selectedImages.length + idx;
      uploadImage(file, newIndex);
    });
  };

  // Handle video drag and drop
  const handleVideoDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!event.dataTransfer.files || !event.dataTransfer.files[0]) return;

    const file = event.dataTransfer.files[0];
    if (file.type.startsWith("video/")) {
      // Create local preview
      const videoObj = {
        file,
        url: URL.createObjectURL(file),
        uploading: false,
        error: false,
      };

      setSelectedVideo(videoObj);

      // Start upload immediately
      uploadVideo(file);
    }
  };

  // Prevent default behavior for drag over
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Remove image from selection
  const removeImage = (index: number) => {
    // Get the URL of the image being removed
    const imageToRemove = selectedImages[index];

    // Remove from selected images
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));

    // For new images (those that were just uploaded) or for existing images with a URL
    if (imageToRemove.url) {
      setImages((prev) => prev.filter((url) => url !== imageToRemove.url));
    }
  };

  // Remove video from selection
  const removeVideo = () => {
    setSelectedVideo(null);
    setVideo("");
  };

  const handleSubmit = () => {
    // Clear previous errors
    setErrors([]);

    // Validate all fields

    const newErrors = [];

    // Check minimum image requirement (3 images)
    if (selectedImages.length < 3 && images.length < 3) {
      newErrors.push(t("validation.minImages"));
    }

    // Check maximum image requirement (15 images)
    if (selectedImages.length > 15 || images.length > 15) {
      newErrors.push(t("validation.maxImages"));
    }

    // Check if there are no images at all (neither in selectedImages nor in context)
    if (selectedImages.length === 0 && images.length === 0) {
      newErrors.push(t("validation.noImages"));
    }

    const hasUploadingImages = selectedImages.some((img) => img.uploading);
    if (hasUploadingImages) {
      newErrors.push(t("validation.uploadingImages"));
    }

    const hasErrorImages = selectedImages.some((img) => img.error);
    if (hasErrorImages) {
      newErrors.push(t("validation.imageErrors"));
    }

    if (selectedVideo?.uploading) {
      newErrors.push(t("validation.uploadingVideo"));
    }

    if (newErrors.length === 0) {
      // Log current form data

      // Move to the next step
      setCurrentStep(6);
    } else {
      setErrors(newErrors);
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

  console.log("Selected Images:", selectedImages);

  const handleBack = () => {
    setCurrentStep(4);
  };

  return (
    <div className="bg-[#ECEBF4] flex justify-center items-start p-4 py-6">
      <div className="w-full max-w-[1200px] rounded-2xl shadow-lg bg-white h-full">
        <div className="flex flex-col md:flex-row h-[inherit] md:h-[73vh]  2xl:h-[73vh]">
          {/* Left Info Panel - 30% width on desktop */}
          <div className="w-full md:w-[30%] mb-8 md:mb-0 md:p-6 hidden flex-col md:flex justify-between">
            <div className="">
              <h1 className="text-2xl font-extrabold leading-tight text-[#362C75]">
                {t("title")}
              </h1>
              <div className="mt-4 text-base text-[#595959] font-medium">
                <p className="leading-[140%]">{t("description")}</p>
              </div>
            </div>
          </div>

          {/* Right Form Panel - 70% width on desktop */}
          <div
            ref={formPanelRef}
            className="w-full md:w-[70%] md:overflow-auto h-full flex flex-col justify-between"
          >
            <div className="p-6 flex-1 overflow-auto md:border-l border-[#F0F0F0]">
              {/* Error display */}
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
              {submitError && (
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
                        {t("submitError")}
                      </h3>
                      <p className="mt-2 text-sm text-red-700">{submitError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Image Upload Section */}
              <div className="mb-8">
                <h2 className="text-[16px] text-[#262626] font-bold">
                  {t("imageTitle")}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {t("imageDescription")}
                </p>

                {/* Drag and drop area for images */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 cursor-pointer"
                  onClick={() => imageInputRef.current?.click()}
                  onDrop={handleImageDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageSelect}
                    multiple
                    accept="image/jpeg,image/png,image/heic,image/jpg,image/heif"
                    className="hidden"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    {t("dropzoneText")}
                  </p>
                </div>

                {/* Image preview area */}
                {selectedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url}
                          alt={`Preview ${index}`}
                          className={`w-full h-24 object-cover rounded-lg ${
                            image.error
                              ? "opacity-50 border border-red-500"
                              : ""
                          }`}
                        />
                        {image.uploading ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                            <svg
                              className="animate-spin h-6 w-6 text-white"
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
                          </div>
                        ) : (
                          <div
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-[16px] cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 text-white"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </div>
                        )}
                        {image.error && (
                          <div className="absolute bottom-1 right-1 bg-white rounded-full p-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 text-red-600"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Upload Section */}
              <div className="mb-8">
                <h2 className="font-semibold text-lg mb-2 text-gray-700">
                  {t("videoTitle")}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {t("videoDescription")}
                </p>
                {/* Video Upload Section */}
                <div className="">
                  {/* Drag and drop area for video */}
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-[16px] p-6 flex flex-col items-center justify-center bg-gray-50 cursor-pointer"
                    onClick={() => videoInputRef.current?.click()}
                    onDrop={handleVideoDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      ref={videoInputRef}
                      onChange={handleVideoSelect}
                      accept="video/mp4,video/quicktime"
                      className="hidden"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      {t("dropzoneText")}
                    </p>
                  </div>

                  {/* Video preview */}
                  {selectedVideo && (
                    <div className="mt-4 relative group">
                      <video
                        src={selectedVideo.url}
                        className={`w-full h-40 object-cover rounded-lg ${
                          selectedVideo.error
                            ? "opacity-50 border border-red-500"
                            : ""
                        }`}
                        controls
                      />
                      {selectedVideo.uploading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                          <svg
                            className="animate-spin h-8 w-8 text-white"
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
                        </div>
                      ) : (
                        <div
                          className="absolute top-2 right-2 p-1 bg-white rounded-full cursor-pointer"
                          onClick={removeVideo}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-600"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      )}
                      {selectedVideo.error && (
                        <div className="absolute bottom-2 right-2 bg-white rounded-full p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 text-red-600"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=" flex flex-col sm:flex-row justify-between items-center p-6">
          <GoBackButton handleBack={handleBack} step={5} totalSteps={6} />
          <button
            type="button"
            onClick={handleSubmit}
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
