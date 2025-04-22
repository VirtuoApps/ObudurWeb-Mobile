"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

// Define the type for form data
type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginForm({ onClose }: { onClose: () => void }) {
  const t = useTranslations("loginForm");

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

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
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
            <button type="button" className="hover:underline cursor-pointer">
              {t("forgotPassword")}
            </button>
            <button type="button" className="hover:underline cursor-pointer">
              {t("notMember")}
            </button>
          </div>

          {/* <div className="flex items-start">
            <input
              id="agreement"
              type="checkbox"
              {...register("agreement")}
              className="mt-1 h-4 w-4 text-[#5E5691] rounded border-gray-300"
            />
            <label
              htmlFor="agreement"
              className="ml-2 block text-sm text-gray-700"
            >
              Kullanıcı sözleşmesini okudum, kabul ediyorum.
            </label>
          </div> */}
          {/* {errors.agreement && (
            <p className="text-red-500 text-xs">{errors.agreement.message}</p>
          )} */}

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-2 px-4 rounded-2xl font-medium cursor-pointer ${
              isValid
                ? "bg-[#5E5691] text-white"
                : "bg-[#F0F0F0] cursor-not-allowed text-gray-500"
            }`}
          >
            {t("loginButton")}
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
