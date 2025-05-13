"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import axiosInstance from "../../../../axios";
import { useAppDispatch } from "@/app/store/hooks";
import { fetchUserData } from "@/app/store/userSlice";

// Define the type for form data
type SignupFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  agreement: boolean;
};

export default function SignupForm({
  onClose,
  onChangeAuthState,
}: {
  onClose: () => void;
  onChangeAuthState: (authState: string) => void;
}) {
  const t = useTranslations("signupForm");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  // Define the schema for form validation with localized error messages
  const signupSchema = z
    .object({
      firstName: z.string().min(1, t("firstNameError")),
      lastName: z.string().min(1, t("lastNameError")),
      email: z.string().email(t("emailError")),
      password: z.string().min(6, t("passwordError")),
      passwordConfirm: z.string().min(6, t("passwordConfirmError")),
      agreement: z.boolean().refine((val) => val === true, {
        message: t("agreementError"),
      }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: t("passwordsDoNotMatch"),
      path: ["passwordConfirm"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
      agreement: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      setApiError(null);

      // Combine first name and last name
      const name = `${data.firstName} ${data.lastName}`;

      // Call the registration API with name included
      const response = await axiosInstance.post("/auth/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      // Get the token from the response
      const { accessToken } = response.data;

      // Store the token in localStorage
      localStorage.setItem("accessToken", accessToken);

      // Set the authorization header for all future requests
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;

      // Fetch user data to update Redux store
      await dispatch(fetchUserData());

      // Close the popup
      onClose();
    } catch (error: any) {
      // Handle API error
      if (error.response && error.response.data) {
        if (error.response.data.errorCode === "EMAIL_ALREADY_EXISTS") {
          setApiError(
            t("emailAlreadyExists") || "E-Posta adresi zaten kullanılıyor"
          );
        } else {
          setApiError(
            error.response.data.message ||
              "Kayıt işlemi sırasında bir hata oluştu"
          );
        }
      } else {
        setApiError("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-center text-gray-700">
            {t("title")}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <p className="text-lg text-gray-600 mb-6 text-start">
          {t("description")}
        </p>

        {apiError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              id="firstName"
              type="text"
              placeholder={t("firstNamePlaceholder")}
              {...register("firstName")}
              autoComplete="off"
              className={`w-full px-3 py-2 pl-1 border-b outline-none text-gray-600 placeholder:text-gray-400 ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <input
              id="lastName"
              type="text"
              placeholder={t("lastNamePlaceholder")}
              {...register("lastName")}
              autoComplete="off"
              className={`w-full px-3 py-2 pl-1 border-b outline-none text-gray-600 placeholder:text-gray-400 ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              {...register("email")}
              autoComplete="off"
              className={`w-full px-3 py-2 pl-1 border-b outline-none text-gray-600 placeholder:text-gray-400 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              id="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              {...register("password")}
              autoComplete="off"
              className={`w-full px-3 py-2 pl-1 border-b placeholder:text-gray-400 text-gray-600 outline-none ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <input
              id="passwordConfirm"
              type="password"
              placeholder={t("passwordConfirmPlaceholder")}
              {...register("passwordConfirm")}
              autoComplete="off"
              className={`w-full px-3 py-2 pl-1 border-b placeholder:text-gray-400 text-gray-600 outline-none ${
                errors.passwordConfirm ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.passwordConfirm && (
              <p className="text-red-500 text-xs mt-1">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agreement"
                type="checkbox"
                {...register("agreement")}
                className="w-4 h-4 border border-gray-300 rounded"
              />
            </div>
            <label
              htmlFor="agreement"
              className={`ml-2 text-sm ${
                errors.agreement ? "text-red-500" : "text-gray-500"
              }`}
            >
              {t("agreement")}
            </label>
          </div>
          {errors.agreement && (
            <p className="text-red-500 text-xs mt-1">
              {errors.agreement.message}
            </p>
          )}

          <div className="flex justify-between text-sm text-gray-400">
            <button
              type="button"
              className="hover:underline cursor-pointer"
              onClick={() => onChangeAuthState("login")}
            >
              {t("alreadyMember")}
            </button>
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`w-full py-2 px-4 rounded-2xl font-medium cursor-pointer ${
              isValid && !isLoading
                ? "bg-[#5E5691] text-white"
                : "bg-[#F0F0F0] cursor-not-allowed text-gray-500"
            }`}
          >
            {isLoading
              ? t("signingUp") || "Kayıt Olunuyor..."
              : t("signupButton")}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">{t("or")}</div>

        <div className="mt-4 space-y-3">
          <button
            type="button"
            className="w-full flex items-center justify-center py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-2xl font-medium cursor-pointer hover:bg-gray-100 transition-all duration-300"
          >
            <img
              src="/facebook-icon.png"
              alt="Facebook"
              className="w-6 h-6 mr-3"
            />
            {t("continueWithFacebook")}
          </button>

          <button
            type="button"
            className="w-full flex items-center justify-center py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-2xl font-medium cursor-pointer hover:bg-gray-100 transition-all duration-300"
          >
            <img src="/google-icon.png" alt="Google" className="w-6 h-6 mr-3" />
            {t("continueWithGoogle")}
          </button>
        </div>
      </div>
    </div>
  );
}
