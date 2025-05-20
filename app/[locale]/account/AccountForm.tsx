"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateUserData, resetUpdateStatus } from "../../store/userSlice";
import { useTranslations } from "next-intl";
import axiosInstance from "../../../axios";

interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AccountFormProps {
  user: User;
}

export default function AccountForm({ user }: AccountFormProps) {
  const t = useTranslations("accountForm");
  const dispatch = useAppDispatch();
  const { updateLoading, updateError, updateSuccess } = useAppSelector(
    (state) => state.user
  );

  // Create separate states for each form's loading status
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
  const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);

  const personalInfoSchema = z.object({
    email: z.string().email(t("emailError")),
    firstName: z.string().min(1, t("firstNameError")),
    lastName: z.string().min(1, t("lastNameError")),
  });

  const passwordSchema = z
    .object({
      password: z.string().min(6, t("passwordLengthError")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsNotMatchError"),
      path: ["confirmPassword"],
    });

  type PersonalInfoData = z.infer<typeof personalInfoSchema>;
  type PasswordData = z.infer<typeof passwordSchema>;

  const {
    register: registerPersonalInfo,
    handleSubmit: handleSubmitPersonalInfo,
    formState: { errors: personalInfoErrors, isDirty: personalInfoIsDirty },
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isDirty: passwordIsDirty },
  } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Handle successful update and process the new accessToken
  useEffect(() => {
    if (updateSuccess) {
      // Reset password fields
      resetPassword();

      // Reset loading states
      setProfileUpdateLoading(false);
      setPasswordUpdateLoading(false);

      // Clear the success state after 3 seconds
      const timer = setTimeout(() => {
        dispatch(resetUpdateStatus());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [updateSuccess, resetPassword, dispatch]);

  const onSubmitPersonalInfo = async (data: PersonalInfoData) => {
    const updateData: any = {};

    // Only include fields that have changed
    if (data.email !== user.email) updateData.email = data.email;
    if (data.firstName !== user.firstName)
      updateData.firstName = data.firstName;
    if (data.lastName !== user.lastName) updateData.lastName = data.lastName;

    if (Object.keys(updateData).length > 0) {
      setProfileUpdateLoading(true);
      try {
        // Make the API call directly to get the response data
        const response = await axiosInstance.patch("/auth/mine", updateData);

        // If the API returns a new token, update it in localStorage and axios
        if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
        }

        // Dispatch action to update user data in Redux store
        dispatch(updateUserData(updateData));
      } catch (error) {
        console.error("Error updating profile:", error);
        setProfileUpdateLoading(false);
      }
    }
  };

  const onSubmitPassword = async (data: PasswordData) => {
    if (data.password) {
      setPasswordUpdateLoading(true);
      try {
        // Make the API call directly to get the response data
        const response = await axiosInstance.patch("/auth/mine", {
          password: data.password,
        });

        // If the API returns a new token, update it in localStorage and axios
        if (response.data && response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
        }

        // Dispatch action to update user data in Redux store
        dispatch(updateUserData({ password: data.password }));
      } catch (error) {
        console.error("Error updating password:", error);
        setPasswordUpdateLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {updateError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {updateError}
        </div>
      )}

      {updateSuccess && (
        <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
          {t("updateSuccess")}
        </div>
      )}

      {/* Personal Information Form */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {t("personalInfoTitle")}
        </h3>
        <form
          onSubmit={handleSubmitPersonalInfo(onSubmitPersonalInfo)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("emailLabel")}
              </label>
              <input
                id="email"
                type="email"
                {...registerPersonalInfo("email")}
                className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#5E5691] text-gray-700 ${
                  personalInfoErrors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {personalInfoErrors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {personalInfoErrors.email.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("firstNameLabel")}
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...registerPersonalInfo("firstName")}
                  className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#5E5691] text-gray-700 ${
                    personalInfoErrors.firstName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {personalInfoErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {personalInfoErrors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("lastNameLabel")}
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...registerPersonalInfo("lastName")}
                  className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#5E5691] text-gray-700 ${
                    personalInfoErrors.lastName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {personalInfoErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {personalInfoErrors.lastName.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={profileUpdateLoading || !personalInfoIsDirty}
              className={`w-full py-2 px-4 rounded-md font-medium ${
                profileUpdateLoading || !personalInfoIsDirty
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#5E5691] text-white hover:bg-[#4D4777] transition-colors"
              }`}
            >
              {profileUpdateLoading
                ? t("updatingButton")
                : t("updateProfileButton")}
            </button>
          </div>
        </form>
      </div>

      {/* Password Update Form */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {t("changePasswordTitle")}
        </h3>
        <form
          onSubmit={handleSubmitPassword(onSubmitPassword)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("newPasswordLabel")}
              </label>
              <input
                id="password"
                type="password"
                {...registerPassword("password")}
                className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#5E5691] text-gray-700 ${
                  passwordErrors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {passwordErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordErrors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("confirmPasswordLabel")}
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...registerPassword("confirmPassword")}
                className={`w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#5E5691] text-gray-700 ${
                  passwordErrors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={passwordUpdateLoading || !passwordIsDirty}
              className={`w-full py-2 px-4 rounded-md font-medium ${
                passwordUpdateLoading || !passwordIsDirty
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#5E5691] text-white hover:bg-[#4D4777] transition-colors"
              }`}
            >
              {passwordUpdateLoading
                ? t("updatingButton")
                : t("updatePasswordButton")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
