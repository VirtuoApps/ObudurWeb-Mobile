"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import axiosInstance from "@/axios";

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
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailForReset, setEmailForReset] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);

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

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email: data.email,
      });

      if (response.data.status === "success") {
        setSuccessMessage(response.data.message);
        setEmailForReset(data.email);
        setShowResetForm(true);
      }
    } catch (error: any) {
      if (error.errorCode === "EMAIL_NOT_FOUND") {
        setErrorMessage(error.message || t("emailNotFound"));
      } else {
        setErrorMessage(error.message || t("genericError"));
      }
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // If showing the reset form with code and new password
  if (showResetForm) {
    return (
      <PasswordResetForm
        email={emailForReset}
        onClose={onClose}
        onBack={() => setShowResetForm(false)}
        onChangeAuthState={onChangeAuthState}
      />
    );
  }

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

        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

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
            disabled={!isValid || isLoading}
            className={`w-full py-2 px-4 rounded-2xl font-medium cursor-pointer ${
              isValid && !isLoading
                ? "bg-[#5E5691] text-white"
                : "bg-[#F0F0F0] cursor-not-allowed text-gray-500"
            }`}
          >
            {isLoading ? t("loading") || "Loading..." : t("resetButton")}
          </button>
        </form>
      </div>
    </div>
  );
}

// Password reset form component for entering code and new password
function PasswordResetForm({
  email,
  onClose,
  onBack,
  onChangeAuthState,
}: {
  email: string;
  onClose: () => void;
  onBack: () => void;
  onChangeAuthState: (authState: string) => void;
}) {
  const t = useTranslations("forgotPasswordForm");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resetCode, setResetCode] = useState("");

  // Define the schema for password reset validation
  const resetPasswordSchema = z
    .object({
      password: z
        .string()
        .min(
          8,
          t("passwordMinLength") || "Password must be at least 8 characters"
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsDoNotMatch") || "Passwords do not match",
      path: ["confirmPassword"],
    });

  type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!resetCode) {
      setErrorMessage(t("codeRequired") || "Reset code is required");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axiosInstance.patch(
        `/auth/reset-password/${resetCode}`,
        {
          password: data.password,
          confirmPassword: data.confirmPassword,
        }
      );

      setSuccessMessage(
        t("passwordResetSuccess") || "Password successfully reset"
      );

      // Redirect to login after successful password reset
      setTimeout(() => {
        onChangeAuthState("login");
      }, 1000);
    } catch (error: any) {
      setErrorMessage(
        error.message || t("genericError") || "An error occurred"
      );
      console.error("Password reset error:", error);
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
            {t("resetPasswordTitle") || "Reset Your Password"}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <p className="text-lg text-gray-600 mb-6 text-start">
          {t("resetPasswordDescription") ||
            `Enter the code sent to ${email} and your new password`}
        </p>

        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              id="resetCode"
              type="text"
              placeholder={t("resetCodePlaceholder") || "Reset Code"}
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              className="w-full px-3 py-2 pl-1 border-b outline-none text-gray-600 placeholder:text-gray-400 border-gray-300"
              autoComplete="off"
            />
          </div>

          <div>
            <input
              id="password"
              type="password"
              placeholder={t("newPasswordPlaceholder") || "New Password"}
              {...register("password")}
              className={`w-full px-3 py-2 pl-1 border-b outline-none text-gray-600 placeholder:text-gray-400 ${
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
              id="confirmPassword"
              type="password"
              placeholder={
                t("confirmPasswordPlaceholder") || "Confirm Password"
              }
              {...register("confirmPassword")}
              className={`w-full px-3 py-2 pl-1 border-b outline-none text-gray-600 placeholder:text-gray-400 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-center text-sm text-gray-400">
            <button
              type="button"
              className="hover:underline cursor-pointer"
              onClick={onBack}
            >
              {t("backToForgotPassword") || "Back"}
            </button>
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading || !resetCode}
            className={`w-full py-2 px-4 rounded-2xl font-medium cursor-pointer ${
              isValid && !isLoading && resetCode
                ? "bg-[#5E5691] text-white"
                : "bg-[#F0F0F0] cursor-not-allowed text-gray-500"
            }`}
          >
            {isLoading
              ? t("loading") || "Loading..."
              : t("submitNewPassword") || "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
