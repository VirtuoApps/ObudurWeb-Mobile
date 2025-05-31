"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateUserData, resetUpdateStatus } from "../../store/userSlice";
import { useTranslations } from "next-intl";
import axiosInstance from "../../../axios";
import GeneralSelect from "../../components/GeneralSelect/GeneralSelect";

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
  profilePicture?: string;
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

  // Country codes for phone number
  const countryCodes = [
    { name: "+90", code: "+90" }, // Turkey
    { name: "+1", code: "+1" }, // USA/Canada
    { name: "+44", code: "+44" }, // UK
    { name: "+49", code: "+49" }, // Germany
    { name: "+33", code: "+33" }, // France
    { name: "+34", code: "+34" }, // Spain
    { name: "+39", code: "+39" }, // Italy
    { name: "+31", code: "+31" }, // Netherlands
    { name: "+46", code: "+46" }, // Sweden
    { name: "+47", code: "+47" }, // Norway
    { name: "+45", code: "+45" }, // Denmark
    { name: "+41", code: "+41" }, // Switzerland
    { name: "+43", code: "+43" }, // Austria
    { name: "+32", code: "+32" }, // Belgium
    { name: "+48", code: "+48" }, // Poland
    { name: "+7", code: "+7" }, // Russia
    { name: "+86", code: "+86" }, // China
    { name: "+81", code: "+81" }, // Japan
    { name: "+82", code: "+82" }, // South Korea
    { name: "+91", code: "+91" }, // India
    { name: "+61", code: "+61" }, // Australia
    { name: "+64", code: "+64" }, // New Zealand
    { name: "+55", code: "+55" }, // Brazil
    { name: "+52", code: "+52" }, // Mexico
    { name: "+54", code: "+54" }, // Argentina
  ];

  // Create separate states for each form's loading status
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
  const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [currentProfilePicture, setCurrentProfilePicture] = useState(
    user?.profilePicture || ""
  );

  // Phone number states
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    countryCodes.find((c) => c.code === "+90") || countryCodes[0]
  );
  const [phoneNumberOnly, setPhoneNumberOnly] = useState("");

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Initialize phone number from user data
  useEffect(() => {
    if (user?.phoneNumber) {
      // Extract country code and number
      const countryCode = countryCodes.find((c) =>
        user.phoneNumber?.startsWith(c.code)
      );
      if (countryCode) {
        setSelectedCountryCode(countryCode);
        setPhoneNumberOnly(user.phoneNumber.substring(countryCode.code.length));
      } else {
        // Default to +90 if no matching country code
        setSelectedCountryCode(countryCodes[0]);
        setPhoneNumberOnly(user.phoneNumber);
      }
    }
  }, [user?.phoneNumber]);

  // Watch phone number to track changes
  const phoneNumber = watchPersonalInfo("phoneNumber");

  // Check if phone number has changed
  const fullPhoneNumber = selectedCountryCode.code + phoneNumberOnly;
  const phoneNumberChanged = fullPhoneNumber !== (user?.phoneNumber || "");

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
      setImageUploadLoading(false);

      // Clear the success state after 3 seconds
      const timer = setTimeout(() => {
        dispatch(resetUpdateStatus());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [updateSuccess, resetPassword, dispatch]);

  // Handle image upload
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Lütfen geçerli bir resim dosyası seçin (JPG, PNG, GIF)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'den büyük olamaz");
      return;
    }

    setImageUploadLoading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("image", file);

      // Upload image to file-system/image endpoint
      const uploadResponse = await axiosInstance.post(
        "/file-system/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.data && uploadResponse.data.location) {
        const imageUrl = uploadResponse.data.location;

        // Update user profile with new image URL
        const updateResponse = await axiosInstance.patch("/auth/mine", {
          profilePicture: imageUrl,
        });

        // If the API returns a new token, update it in localStorage and axios
        if (updateResponse.data.accessToken) {
          localStorage.setItem("accessToken", updateResponse.data.accessToken);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${updateResponse.data.accessToken}`;
        }

        // Update local state and Redux store
        setCurrentProfilePicture(imageUrl);
        dispatch(updateUserData({ profilePicture: imageUrl }));
        window.location.reload();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Resim yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setImageUploadLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmitPersonalInfo = async (data: PersonalInfoData) => {
    const updateData: any = {};

    // Only include fields that have changed
    if (data.email !== user.email) updateData.email = data.email;
    if (data.firstName !== user.firstName)
      updateData.firstName = data.firstName;
    if (data.lastName !== user.lastName) updateData.lastName = data.lastName;

    // Handle phone number with country code
    const completePhoneNumber = selectedCountryCode.code + phoneNumberOnly;
    if (completePhoneNumber !== user.phoneNumber && phoneNumberOnly) {
      updateData.phoneNumber = completePhoneNumber;
    }

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
            src={currentProfilePicture || "/placeholder_picture.png"}
            alt="Profil fotoğrafı"
            className="w-full h-full object-cover"
          />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={handleUploadClick}
          disabled={imageUploadLoading}
          className="h-[36px] px-5 rounded-lg text-[#FCFCFC] text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#5E5691" }}
        >
          {imageUploadLoading ? "Yükleniyor..." : "Yükle"}
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
                <GeneralSelect
                  selectedItem={selectedCountryCode}
                  onSelect={setSelectedCountryCode}
                  options={countryCodes}
                  defaultText="+90"
                  extraClassName="w-[100px] h-[56px] border border-[#E3E3E3] bg-[#F9F9F9]"
                  popoverMaxWidth="120"
                  maxHeight="300"
                />
                <input
                  type="tel"
                  placeholder="123 456 78 90"
                  value={phoneNumberOnly}
                  onChange={(e) => {
                    // Only allow numbers and spaces
                    const value = e.target.value.replace(/[^\d\s]/g, "");
                    setPhoneNumberOnly(value);
                    setPersonalInfoValue(
                      "phoneNumber",
                      selectedCountryCode.code + value,
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      }
                    );
                  }}
                  className="flex-1 h-[56px] px-3 rounded-2xl border border-[#D9D9D9] text-sm outline-none transition-colors text-[#262626]"
                  style={{
                    backgroundColor: "#F9F9F9",
                    borderColor: personalInfoErrors.phoneNumber
                      ? "#EA394B"
                      : "#E3E3E3",
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
                className="px-6 h-[56px] rounded-2xl text-sm font-medium transition-colors disabled:cursor-not-allowed"
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
                className="px-6 h-[56px] rounded-2xl text-sm font-medium transition-colors disabled:cursor-not-allowed"
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
