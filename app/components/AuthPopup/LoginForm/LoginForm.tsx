"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import axiosInstance from "@/axios";
import { AxiosError } from "axios";

// Define the type for form data
type LoginFormData = {
  email: string;
  password: string;
};

// Define response type for login
interface LoginResponse {
  accessToken: string;
}

export default function LoginForm({
  onClose,
  onChangeAuthState,
}: {
  onClose: () => void;
  onChangeAuthState: (authState: string) => void;
}) {
  const t = useTranslations("loginForm");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Define the schema for form validation with localized error messages
  const loginSchema = z.object({
    email: z.string().email(t("emailError")),
    password: z.string().min(6, t("passwordError")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setLoginError("");

      const response = await axiosInstance.post<LoginResponse>(
        "/auth/login",
        data
      );

      // Store the access token in localStorage
      localStorage.setItem("accessToken", response.data.accessToken);

      // Refresh the page
      window.location.reload();
    } catch (error) {
      const axiosError = error as any;

      if (axiosError.errorCode === "INVALID_EMAIL") {
        setLoginError(t("invalidEmail"));
      } else if (axiosError.errorCode === "INVALID_PASSWORD") {
        setLoginError(t("invalidPassword"));
      } else {
        setLoginError(t("unexpectedError"));
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
          <h2 className="text-2xl font-bold  text-center text-gray-700">
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {loginError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {loginError}
            </div>
          )}

          <div>
            <input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              {...register("email")}
              className={`w-full px-3 py-2 pl-1 border-b outline-none text-gray-600  placeholder:text-gray-400 ${
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
              className={`w-full px-3 py-2 pl-1 border-b placeholder:text-gray-400 text-gray-600 outline-none  ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-between text-sm text-gray-400">
            <button
              type="button"
              className="hover:underline cursor-pointer"
              onClick={() => onChangeAuthState("forgotPassword")}
            >
              {t("forgotPassword")}
            </button>
            <button
              type="button"
              className="hover:underline cursor-pointer"
              onClick={() => onChangeAuthState("signup")}
            >
              {t("notMember")}
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
            {isLoading ? t("loggingIn") || "Logging in..." : t("loginButton")}
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
