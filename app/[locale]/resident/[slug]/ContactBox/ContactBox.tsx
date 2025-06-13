"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Switch } from "@headlessui/react";
import { countryCodes } from "./countryCodes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/app/store/hooks";
import axiosInstance from "@/axios";
import AuthPopup from "@/app/components/AuthPopup/AuthPopup";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Define the type for form data
type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
};

type ExistingMessage = {
  _id: string;
  senderUserId: string;
  hotelId: string;
  message: string;
  isInitialMessage: boolean;
  from: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function ContactBox({ hotelData }: { hotelData: any }) {
  const [countryCode, setCountryCode] = useState("+90");
  const [wantsVisit, setWantsVisit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingMessage, setExistingMessage] =
    useState<ExistingMessage | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const t = useTranslations("contactBox");

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);

  const { user } = useAppSelector((state) => state.user);
  const isLoginned = user ? true : false;

  // Define the schema for form validation
  const contactSchema = z.object({
    firstName: z.string().min(1, t("validation.firstNameRequired")),
    lastName: z.string().min(1, t("validation.lastNameRequired")),
    email: z.string().email(t("validation.emailRequired")),
    phone: z.string().optional(),
    message: z.string().min(1, t("validation.messageRequired")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: t("defaultMessage"),
    },
  });

  console.log({
    hotelData,
  });

  // Fill form with user data immediately when user data is available
  useEffect(() => {
    if (user) {
      console.log("Setting user data in form:", user);
      if (user.firstName) setValue("firstName", user.firstName);
      if (user.lastName) setValue("lastName", user.lastName);
      if (user.email) setValue("email", user.email);
    }
  }, [user, setValue]);

  // Prevent body scroll when bottom sheet is open
  useEffect(() => {
    if (isSheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSheetOpen]);

  // Check for existing messages when component mounts if user is logged in
  useEffect(() => {
    const checkExistingMessages = async () => {
      if (isLoginned && hotelData?.hotelDetails?._id) {
        try {
          setLoading(true);
          const response = await axiosInstance.get(
            `/hotel-messages/hotels/${hotelData.hotelDetails._id}`
          );

          if (response.data) {
            setExistingMessage(response.data);

            // Pre-fill form with existing data
            setValue("firstName", response.data.firstName);
            setValue("lastName", response.data.lastName);
            setValue("email", response.data.email);

            // Handle phone number with country code
            if (response.data.phoneNumber) {
              const phoneWithoutCode = response.data.phoneNumber.replace(
                /^\+\d+\s/,
                ""
              );
              const countryCodeMatch =
                response.data.phoneNumber.match(/^\+(\d+)/);
              if (countryCodeMatch) {
                setCountryCode(`+${countryCodeMatch[1]}`);
              }
              setValue("phone", phoneWithoutCode);
            }
          }
        } catch (error) {
          console.log("Error fetching existing messages:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    checkExistingMessages();
  }, [isLoginned, hotelData, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    if (existingMessage) return;

    try {
      setLoading(true);
      setSubmitError("");

      const payload = {
        message: data.message,
        hotelId: hotelData.hotelDetails._id,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: `${countryCode} ${data.phone}`,
        email: data.email,
        wantsVisit,
        iWantToSeeProperty: wantsVisit,
      };

      await axiosInstance.post("/hotel-messages/initial", payload);

      // Set as existing message to prevent further submissions
      setExistingMessage({
        _id: Date.now().toString(),
        senderUserId: user?._id || "",
        hotelId: hotelData.hotelDetails._id,
        message: data.message,
        isInitialMessage: true,
        from: "user",
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: `${countryCode} ${data.phone}`,
        email: data.email,
        isSeen: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Optional: Show success message
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitError(t("errorSendingMessage"));
    } finally {
      setLoading(false);
    }
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryCode(e.target.value);
  };

  const toggleVisit = (checked: boolean) => {
    setWantsVisit(checked);
  };

  const managerName = `${hotelData.manager.firstName} ${hotelData.manager.lastName}`;
  const managerPhone = hotelData.manager.phoneNumber;

  const maskName = (name: string) => {
    return name
      .split(" ")
      .map((part) => {
        if (!part) return "";
        return `${part[0]}${Array(part.length - 1)
          .fill("*")
          .join("")}`;
      })
      .join(" ");
  };

  const maskPhone = (phone: string) => {
    return phone
      .split(" ")
      .map((part) => {
        if (!part) return "";
        return `${part.slice(0, 4)}${Array(part.length - 4)
          .fill("*")
          .join("")}`;
      })
      .join(" ");
  };

  const copyPhoneToClipboard = async () => {
    if (isLoginned && managerPhone) {
      try {
        await navigator.clipboard.writeText(managerPhone);
        setPhoneCopied(true);
        // Hide the success message after 2 seconds
        setTimeout(() => {
          setPhoneCopied(false);
        }, 2000);
      } catch (error) {
        console.error("Failed to copy phone number:", error);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = managerPhone;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          setPhoneCopied(true);
          setTimeout(() => {
            setPhoneCopied(false);
          }, 2000);
        } catch (fallbackError) {
          console.error("Fallback copy failed:", fallbackError);
        }
        document.body.removeChild(textArea);
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 768) return;
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY === null || window.innerWidth >= 768) return;
    const deltaY = e.touches[0].clientY - touchStartY;
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (window.innerWidth >= 768) return;
    if (translateY > 120) {
      setIsSheetOpen(false);
    }
    setTranslateY(0);
    setTouchStartY(null);
  };

  const renderContactForm = () => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-md w-full p-4">
      {/* Agent Info Section */}
      <div className="bg-[#31286A] p-4 rounded-xl">
        <div className="flex flex-row items-center">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-300 mr-4 flex-shrink-0">
            <img
              src="/example-person.png"
              alt={t("agentImageAlt")}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  t("placeholderImage") || "https://via.placeholder.com/150";
              }}
            />
          </div>
          <div className="text-white">
            <h3 className="font-bold text-lg">
              {isLoginned ? managerName : maskName(managerName)}
            </h3>
            {/* <p className="text-white/80 text-sm">
            {isLoginned ? t("agentCompanyName") : "M**** Y****"}
          </p> */}
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={() => {
              if (isLoginned) {
                copyPhoneToClipboard();
              }
            }}
            className="flex-1 bg-[#EC755D] text-white py-2 px-4 rounded-xl font-medium cursor-pointer"
          >
            {isLoginned
              ? managerPhone
              : maskPhone(managerPhone || "0539 000 00 00")}
          </button>
          <button className="flex-1 bg-[#FCFCFC] text-gray-800 py-2 px-4 rounded-xl border border-gray-200 font-medium cursor-pointer">
            {t("allListings")}
          </button>
        </div>
      </div>

      {/* Success message for phone copy */}
      {phoneCopied && (
        <div className="mx-4 mt-2 mb-2">
          <div className="bg-green-50 p-3 rounded-xl border border-green-200">
            <p className="text-green-700 text-sm font-medium text-center">
              {t("phoneCopied")}
            </p>
          </div>
        </div>
      )}

      {/* Contact Form */}
      {!isLoginned && (
        <div className="p-4">
          <h4 className="font-bold text-xl text-[#595959] mb-4">
            {t("loginPromptTitle")}
          </h4>
          <p className="text-gray-500 text-base">
            {t("loginPromptDescription")}
          </p>
          <button
            onClick={() => setIsAuthPopupOpen(true)}
            className={`w-full py-3 rounded-xl font-medium cursor-pointer bg-[#5E5691] text-white mt-7`}
          >
            {t("loginButton")}
          </button>
        </div>
      )}
      {isLoginned && (
        <div className="p-4">
          <h4 className="font-medium text-gray-800 mb-4">
            {t("getMoreInfo")}
          </h4>

          {existingMessage ? (
            <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-4">
              <h5 className="font-medium text-green-800 mb-2">
                {t("messageSentTitle")}
              </h5>
              <p className="text-green-700 text-sm">
                {t("messageSentDescription")}
              </p>
            </div>
          ) : null}

          {submitError && (
            <div className="bg-red-50 p-4 rounded-xl border border-red-200 mb-4">
              <p className="text-red-700 text-sm">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit as any)}>
            <div className="mb-3">
              <input
                type="text"
                id="firstName"
                placeholder={t("firstName")}
                {...register("firstName")}
                disabled={loading || !!existingMessage}
                className={`w-full border ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                } rounded-2xl text-sm placeholder:text-gray-400 text-[#262626] font-semibold py-4 px-3 ${
                  loading || !!existingMessage
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="mb-3">
              <input
                type="text"
                id="lastName"
                placeholder={t("lastName")}
                {...register("lastName")}
                disabled={loading || !!existingMessage}
                className={`w-full border ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                } rounded-2xl text-sm placeholder:text-gray-400 text-[#262626] font-semibold py-4 px-3 ${
                  loading || !!existingMessage
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className="mb-3">
              <input
                type="email"
                id="email"
                placeholder={t("email")}
                {...register("email")}
                disabled={loading || !!existingMessage}
                className={`w-full border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-2xl text-sm placeholder:text-gray-400 text-[#262626] font-semibold py-4 px-3 ${
                  loading || !!existingMessage
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-3">
              <label
                htmlFor="phone"
                className="block text-sm text-[#262626] font-semibold mb-1"
              >
                {t("phone")}
              </label>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    name="countryCode"
                    value={countryCode}
                    onChange={handleCountryCodeChange}
                    disabled={loading || !!existingMessage}
                    className={`bg-white border border-gray-300 rounded-2xl text-sm text-[#262626] font-semibold py-4 px-2 w-24 appearance-none pr-8 ${
                      loading || !!existingMessage
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {countryCodes.map((country, index) => (
                      <option
                        key={country.code + index.toString()}
                        value={country.code}
                      >
                        +{country.code}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <FaChevronDown size={12} />
                  </div>
                </div>
                <input
                  type="tel"
                  id="phone"
                  {...register("phone")}
                  placeholder={t("phoneNumber")}
                  disabled={loading || !!existingMessage}
                  className={`w-full border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } rounded-2xl text-sm placeholder:text-gray-400 text-[#262626] font-semibold py-4 px-3 ${
                    loading || !!existingMessage
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="mb-3 flex items-center mt-4">
              <Switch
                checked={wantsVisit}
                onChange={toggleVisit}
                disabled={loading || !!existingMessage}
                className={`${
                  wantsVisit ? "bg-[#31286A]" : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  loading || !!existingMessage
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
              >
                <span className="sr-only">{t("wantToVisit")}</span>
                <span
                  className={`${
                    wantsVisit ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
              <label
                htmlFor="wantsVisit"
                className="text-sm text-gray-700 ml-4"
              >
                {t("wantToVisit")}
              </label>
            </div>

            <div className="mb-4 mt-8">
              <label
                htmlFor="message"
                className="block text-sm text-gray-400 -mb-8 ml-3"
              >
                {t("message")}
              </label>
              <textarea
                id="message"
                {...register("message")}
                rows={4}
                disabled={loading || !!existingMessage}
                className={`w-full px-3 py-2 border ${
                  errors.message ? "border-red-500" : "border-gray-300"
                } rounded-2xl text-sm resize-none placeholder:text-gray-400 text-[#262626] font-semibold pt-10 ${
                  loading || !!existingMessage
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid || loading || !!existingMessage}
              className={`w-full py-3 rounded-xl font-medium cursor-pointer ${
                isValid && !loading && !existingMessage
                  ? "bg-[#31286A] text-white"
                  : "bg-[#F0F0F0] text-gray-700 cursor-not-allowed"
              }`}
            >
              {loading
                ? t("sending")
                : existingMessage
                ? t("messageSent")
                : t("sendMessage")}
            </button>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <>
      <AuthPopup
        isOpen={isAuthPopupOpen}
        onClose={() => setIsAuthPopupOpen(false)}
      />
      {/* Mobile: Fixed button to open sheet */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-center items-center border-t border-gray-200 z-50">
        <button
          onClick={() => setIsSheetOpen(true)}
          className="bg-[#5E5691] text-white py-3 rounded-full font-medium cursor-pointer w-full text-center"
        >
          İletişime Geç
        </button>
      </div>

      {/* Mobile: Bottom Sheet */}
      {isSheetOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end justify-center md:hidden pt-28">
          <div
            className="fixed inset-0"
            onClick={() => setIsSheetOpen(false)}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          ></div>
          <div
            className="relative bg-white rounded-t-[24px] shadow-xl max-w-[600px] w-full mx-auto max-h-[calc(100vh-112px)] flex flex-col mt-28"
            style={{
              transform: `translateY(${translateY}px)`,
              transition: touchStartY ? "none" : "transform 0.3s ease-out",
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 rounded-t-[24px] relative">
              <div className="flex items-center justify-between">
                <h2 className="md:text-lg text-2xl font-bold text-gray-700">
                  İletişime Geç
                </h2>
                <button
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => setIsSheetOpen(false)}
                >
                  <XMarkIcon className="w-8 h-8 md:w-6 md:h-6 text-gray-700" />
                </button>
              </div>
              <span className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-gray-300 rounded-full md:hidden"></span>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto p-2">
              {renderContactForm()}
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Static component */}
      <div className="hidden md:block">{renderContactForm()}</div>
    </>
  );
}
