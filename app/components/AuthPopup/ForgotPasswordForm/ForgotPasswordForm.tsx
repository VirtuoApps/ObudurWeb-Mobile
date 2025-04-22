"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

// Define the type for form data
type ForgotPasswordFormData = {
  email: string;
};

export default function ForgotPasswordForm({
  onClose,
  onChangeAuthState,
}: {
  onClose: () => void;
  onChangeAuthState: (authState: string) => void;
}) {
  const t = useTranslations("forgotPasswordForm");

  // Define the schema for form validation
  const forgotPasswordSchema = z.object({
    email: z.string().email(t("emailError")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log(data);
    // Implement password reset request logic here
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              {...register("email")}
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

          <div className="flex justify-center text-sm text-gray-400">
            <button
              type="button"
              className="hover:underline cursor-pointer"
              onClick={() => onChangeAuthState("login")}
            >
              {t("backToLogin")}
            </button>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-2 px-4 rounded-2xl font-medium cursor-pointer ${
              isValid
                ? "bg-[#5E5691] text-white"
                : "bg-[#F0F0F0] cursor-not-allowed text-gray-500"
            }`}
          >
            {t("resetButton")}
          </button>
        </form>
      </div>
    </div>
  );
}
