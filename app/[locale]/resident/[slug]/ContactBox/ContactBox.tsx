"use client";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Switch } from "@headlessui/react";
import { countryCodes } from "./countryCodes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

// Define the type for form data
type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
};

export default function ContactBox() {
  const [countryCode, setCountryCode] = useState("+90");
  const [wantsVisit, setWantsVisit] = useState(false);
  const t = useTranslations("contactBox");

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

  const onSubmit = (data: ContactFormData) => {
    console.log({ ...data, countryCode, wantsVisit });
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryCode(e.target.value);
  };

  const toggleVisit = (checked: boolean) => {
    setWantsVisit(checked);
  };

  const isLoginned = false;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-md w-full p-4">
      {/* Agent Info Section */}
      <div className="bg-[#31286A] p-4 rounded-xl">
        <div className="flex flex-row items-center">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-300 mr-4 flex-shrink-0">
            <img
              src="/example-person.png"
              alt="Bruce Wayne"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/150";
              }}
            />
          </div>
          <div className="text-white">
            <h3 className="font-bold text-lg">
              {isLoginned ? "Bruce Wayne" : "B**** W****"}
            </h3>
            <p className="text-white/80 text-sm">
              {isLoginned ? t("agentCompanyName") : "M**** Y****"}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button className="flex-1 bg-[#EC755D] text-white py-2 px-4 rounded-xl font-medium cursor-pointer">
            {isLoginned ? t("call") : "+90 512 *** ** **"}
          </button>
          <button className="flex-1 bg-[#FCFCFC] text-gray-800 py-2 px-4 rounded-xl border border-gray-200 font-medium cursor-pointer">
            {t("allListings")}
          </button>
        </div>
      </div>

      {/* Action Buttons */}

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
            type="submit"
            disabled={!isValid}
            className={`w-full py-3 rounded-xl font-medium cursor-pointer bg-[#5E5691] text-white mt-7`}
          >
            {t("loginButton")}
          </button>
        </div>
      )}
      {isLoginned && (
        <div className="p-4">
          <h4 className="font-medium text-gray-800 mb-4">{t("getMoreInfo")}</h4>

          <form onSubmit={handleSubmit(onSubmit as any)}>
            <div className="mb-3">
              <input
                type="text"
                id="firstName"
                placeholder={t("firstName")}
                {...register("firstName")}
                className={`w-full border ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                } rounded-2xl text-sm placeholder:text-gray-400 text-[#262626] font-semibold py-4 px-3`}
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
                className={`w-full border ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                } rounded-2xl text-sm placeholder:text-gray-400 text-[#262626] font-semibold py-4 px-3`}
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
                className={`w-full border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-2xl text-sm placeholder:text-gray-400 text-[#262626] font-semibold py-4 px-3`}
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
                    className="bg-white border border-gray-300 rounded-2xl text-sm text-[#262626] font-semibold py-4 px-2 w-24 appearance-none pr-8"
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
                  className={`w-full border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } rounded-2xl text-sm placeholder:text-gray-400 text-[#262626] font-semibold py-4 px-3`}
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
                className={`${
                  wantsVisit ? "bg-[#31286A]" : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
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
                className={`w-full px-3 py-2 border ${
                  errors.message ? "border-red-500" : "border-gray-300"
                } rounded-2xl text-sm resize-none placeholder:text-gray-400 text-[#262626] font-semibold pt-10`}
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-3 rounded-xl font-medium cursor-pointer ${
                isValid
                  ? "bg-[#31286A] text-white"
                  : "bg-[#F0F0F0] text-gray-700 cursor-not-allowed"
              }`}
            >
              {t("sendMessage")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
