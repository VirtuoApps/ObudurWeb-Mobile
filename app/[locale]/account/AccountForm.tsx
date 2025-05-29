"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateUserData, resetUpdateStatus } from "../../store/userSlice";
import { useTranslations } from "next-intl";
import axiosInstance from "../../../axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
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
    phoneNumber: z.string().optional(),
  });

  const passwordSchema = z
    .object({
      currentPassword: z.string().min(1, "Mevcut parola gerekli"),
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
    setValue: setPersonalInfoValue,
    watch: watchPersonalInfo,
    formState: { errors: personalInfoErrors, isDirty: personalInfoIsDirty },
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: user?.phoneNumber || "",
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
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Watch phone number to track changes
  const phoneNumber = watchPersonalInfo("phoneNumber");

  // Check if phone number has changed
  const phoneNumberChanged = phoneNumber !== (user?.phoneNumber || "");

  // Check if any field has changed (including phone number)
  const hasChanges = personalInfoIsDirty || phoneNumberChanged;

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
    if (data.phoneNumber !== user.phoneNumber)
      updateData.phoneNumber = data.phoneNumber;

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
          currentPassword: data.currentPassword,
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

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    console.log("Account deletion requested");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    delete axiosInstance.defaults.headers.common["Authorization"];
    window.location.href = "/";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#262626" }}>
            Profil Detayları
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDeleteAccount}
            className="h-[56px] px-4 rounded-2xl bg-white  text-base font-medium hover:border-gray-400 transition-colors cursor-pointer"
            style={{ color: "#262626" }}
          >
            Hesabı Sil
          </button>
          <button
            onClick={handleLogout}
            className="px-4 rounded-2xl bg-white   gap-2 text-base font-medium  transition-colors h-[56px] w-[148px] flex items-center justify-center cursor-pointer"
            style={{ color: "#F24853" }}
          >
            <img
              src="/logout-icon.png"
              alt="logout-icon"
              className="w-[18px]"
            />
            Çıkış Yap
          </button>
        </div>
      </header>

      {/* Success/Error Messages */}
      {updateError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
          {updateError}
        </div>
      )}

      {updateSuccess && (
        <div className="bg-green-50 text-green-600 p-4 rounded-xl border border-green-200">
          {t("updateSuccess")}
        </div>
      )}

      {/* Profile Photo Card */}
      <div className="bg-white rounded-xl p-4 flex items-center gap-4">
        <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden">
          <img
            src="/api/placeholder/80/80"
            alt="Profil fotoğrafı"
            className="w-full h-full object-cover"
          />
        </div>
        <button
          className="h-[36px] px-5 rounded-lg text-[#FCFCFC] text-sm font-medium flex items-center gap-2"
          style={{ backgroundColor: "#5E5691" }}
        >
          Yükle
          <img src="/image-add.png" alt="upload-icon" className="w-[20px]" />
        </button>
        <div>
          <h3 className="font-semibold" style={{ color: "#262626" }}>
            Profil fotoğrafı Yükle
          </h3>
          <p className="text-xs mt-1" style={{ color: "#595959" }}>
            JPG, GIF veya PNG. Maksimum boyut 5MB
          </p>
        </div>
      </div>

      {/* Two Column Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information Form */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-2xl  mb-6 text-[#262626] font-bold">
            Profil Bilgileriniz
          </h2>
          <form
            onSubmit={handleSubmitPersonalInfo(onSubmitPersonalInfo)}
            className="space-y-4"
          >
            <div className="flex gap-4 flex-row justify-between">
              <div className="w-1/2">
                <label className="block text-sm font-semibold mb-2 text-[#262626]">
                  İsim
                </label>
                <input
                  type="text"
                  placeholder="Alfred"
                  {...registerPersonalInfo("firstName")}
                  className="w-full h-[56px] px-3 rounded-2xl border border-[#D9D9D9] text-sm outline-none  transition-colors text-[#262626]"
                  style={{
                    backgroundColor: "#FCFCFC",
                    borderColor: personalInfoErrors.firstName
                      ? "#EA394B"
                      : "#D9D9D9",
                  }}
                />
                {personalInfoErrors.firstName && (
                  <p className="text-xs mt-1" style={{ color: "#EA394B" }}>
                    {personalInfoErrors.firstName.message}
                  </p>
                )}
              </div>

              <div className="w-1/2">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#1E1E1E" }}
                >
                  Soyisim
                </label>
                <input
                  type="text"
                  placeholder="Pennyworth"
                  {...registerPersonalInfo("lastName")}
                  className="w-full h-[56px] px-3 rounded-2xl border border-[#D9D9D9] text-sm outline-none  transition-colors text-[#262626]"
                  style={{
                    backgroundColor: "#F9F9F9",
                    borderColor: personalInfoErrors.lastName
                      ? "#EA394B"
                      : "#E3E3E3",
                  }}
                />
                {personalInfoErrors.lastName && (
                  <p className="text-xs mt-1" style={{ color: "#EA394B" }}>
                    {personalInfoErrors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#1E1E1E" }}
              >
                Telefon
              </label>
              <div className="flex gap-2">
                <PhoneInput
                  placeholder="Telefon numaranızı girin"
                  value={phoneNumber}
                  onChange={(value) =>
                    setPersonalInfoValue("phoneNumber", value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  defaultCountry="TR"
                  className="flex-1"
                  style={{
                    height: "52px",
                    borderRadius: "8px",
                    backgroundColor: "#F9F9F9",
                    border: "1px solid #E3E3E3",
                  }}
                />
              </div>
              {personalInfoErrors.phoneNumber && (
                <p className="text-xs mt-1" style={{ color: "#EA394B" }}>
                  {personalInfoErrors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#1E1E1E" }}
              >
                E-Posta Adresi
              </label>
              <input
                type="email"
                placeholder="alfred.pennyworth@gmail.com"
                {...registerPersonalInfo("email")}
                className="w-full h-[56px] px-3 rounded-2xl border border-[#D9D9D9] text-sm outline-none  transition-colors text-[#262626]"
                style={{
                  backgroundColor: "#F9F9F9",
                  borderColor: personalInfoErrors.email ? "#EA394B" : "#E3E3E3",
                }}
              />
              {personalInfoErrors.email && (
                <p className="text-xs mt-1" style={{ color: "#EA394B" }}>
                  {personalInfoErrors.email.message}
                </p>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={profileUpdateLoading || !hasChanges}
                className="px-6 h-[56px] rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    profileUpdateLoading || !hasChanges ? "#F0F0F0" : "#5E5691",
                  color:
                    profileUpdateLoading || !hasChanges ? "#6E6E6E" : "#FFFFFF",
                }}
              >
                {profileUpdateLoading
                  ? "Güncelleniyor..."
                  : "Bilgilerimi Güncelle"}
              </button>
            </div>
          </form>
        </div>

        {/* Password Form */}
        <div className="bg-white rounded-xl p-6">
          <h2
            className="text-lg font-semibold mb-6"
            style={{ color: "#1E1E1E" }}
          >
            Parola
          </h2>
          <form
            onSubmit={handleSubmitPassword(onSubmitPassword)}
            className="space-y-4"
          >
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#1E1E1E" }}
              >
                Mevcut Parola
              </label>
              <input
                type="password"
                placeholder="Buraya yazın"
                {...registerPassword("currentPassword")}
                className="w-full h-[56px] px-3 rounded-2xl border border-[#D9D9D9] text-sm outline-none  transition-colors text-[#262626]"
                style={{
                  backgroundColor: "#F9F9F9",
                  borderColor: passwordErrors.currentPassword
                    ? "#EA394B"
                    : "#E3E3E3",
                }}
              />
              {passwordErrors.currentPassword && (
                <p className="text-xs mt-1" style={{ color: "#EA394B" }}>
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#1E1E1E" }}
              >
                Yeni Parola
              </label>
              <input
                type="password"
                placeholder="Buraya yazın"
                {...registerPassword("password")}
                className="w-full h-[56px] px-3 rounded-2xl border border-[#D9D9D9] text-sm outline-none  transition-colors text-[#262626]"
                style={{
                  backgroundColor: "#F9F9F9",
                  borderColor: passwordErrors.password ? "#EA394B" : "#E3E3E3",
                }}
              />
              {passwordErrors.password && (
                <p className="text-xs mt-1" style={{ color: "#EA394B" }}>
                  {passwordErrors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: "#1E1E1E" }}
              >
                Yeni Parola Tekrar
              </label>
              <input
                type="password"
                placeholder="Buraya yazın"
                {...registerPassword("confirmPassword")}
                className="w-full h-[56px] px-3 rounded-2xl border border-[#D9D9D9] text-sm outline-none  transition-colors text-[#262626]"
                style={{
                  backgroundColor: "#F9F9F9",
                  borderColor: passwordErrors.confirmPassword
                    ? "#EA394B"
                    : "#E3E3E3",
                }}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-xs mt-1" style={{ color: "#EA394B" }}>
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="pt-4 flex flex-row justify-end">
              <button
                type="submit"
                disabled={passwordUpdateLoading || !passwordIsDirty}
                className="px-6 h-[56px] rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    passwordUpdateLoading || !passwordIsDirty
                      ? "#F0F0F0"
                      : "#5E5691",
                  color:
                    passwordUpdateLoading || !passwordIsDirty
                      ? "#6E6E6E"
                      : "#FFFFFF",
                }}
              >
                {passwordUpdateLoading
                  ? "Güncelleniyor..."
                  : "Parolamı Güncelle"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
