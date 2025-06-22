import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { updateUserData } from "@/app/store/userSlice";
import React, { useEffect, useState } from "react";
import GeneralSelect from "../GeneralSelect/GeneralSelect";
import { countryCodes } from "@/app/[locale]/resident/[slug]/ContactBox/countryCodes";
import axiosInstance from "../../../axios";
import PersonalContract from "./PersonalContract/PersonalContract";
import { useTranslations } from "next-intl";

interface PersonalInformationFormPopupProps {
  onClose: () => void;
}

export default function PersonalInformationFormPopup({
  onClose,
}: PersonalInformationFormPopupProps) {
  const t = useTranslations("personalInfoPopup");
  const tMonths = useTranslations("personalInfoPopup.months");
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<any>(null);
  const [selectCountryCode, setSelectCountryCode] = useState<any>(null);
  const [selectCountry, setSelectCountry] = useState<any>(null);
  const [isPersonalContractOpen, setIsPersonalContractOpen] = useState(false);

  const [isUserAgreementConfirmed, setIsUserAgreementConfirmed] =
    useState(false);
  const [isMarketingEmailsAccepted, setIsMarketingEmailsAccepted] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const days = Array.from({ length: 31 }, (_, i) => ({
    id: i + 1,
    name: `${i + 1}`,
  }));

  const months = [
    { id: 1, name: tMonths("january") },
    { id: 2, name: tMonths("february") },
    { id: 3, name: tMonths("march") },
    { id: 4, name: tMonths("april") },
    { id: 5, name: tMonths("may") },
    { id: 6, name: tMonths("june") },
    { id: 7, name: tMonths("july") },
    { id: 8, name: tMonths("august") },
    { id: 9, name: tMonths("september") },
    { id: 10, name: tMonths("october") },
    { id: 11, name: tMonths("november") },
    { id: 12, name: tMonths("december") },
  ];

  const startYear = 2005;
  const years = Array.from({ length: 100 }, (_, i) => ({
    id: startYear - i,
    name: `${startYear - i}`,
  }));

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");

      // Parse phone number
      if (user.phoneNumber) {
        const countryCode = countryCodes.find((country) =>
          user.phoneNumber?.startsWith(`+${country.code}`)
        );
        if (countryCode) {
          setSelectCountryCode({
            id: `+${countryCode.code}`,
            name: `+${countryCode.code}`,
          });
          setPhoneNumber(
            user.phoneNumber.substring(countryCode.code.length + 1)
          );
        } else {
          // Default to first country code if no match
          setSelectCountryCode({
            id: `+${countryCodes[0].code}`,
            name: `+${countryCodes[0].code}`,
          });
          setPhoneNumber(user.phoneNumber);
        }
      } else {
        // Set default country code
        setSelectCountryCode({
          id: `+${countryCodes[0].code}`,
          name: `+${countryCodes[0].code}`,
        });
      }

      // Parse birth date
      if (user.birthDate) {
        const [day, month, year] = user.birthDate.split("-");
        setSelectedDay({ id: parseInt(day), name: day });
        setSelectedMonth({
          id: parseInt(month),
          name: months[parseInt(month) - 1]?.name,
        });
        setSelectedYear({ id: parseInt(year), name: year });
      }
    }
  }, [user]);

  // Validate form
  const isFormValid = () => {
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      phoneNumber.trim() !== "" &&
      selectedDay !== null &&
      selectedMonth !== null &&
      selectedYear !== null &&
      selectCountryCode !== null &&
      isUserAgreementConfirmed
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isFormValid()) {
      setError(t("validationError"));
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare update data
      const birthDate = `${selectedDay.id
        .toString()
        .padStart(2, "0")}-${selectedMonth.id.toString().padStart(2, "0")}-${
        selectedYear.id
      }`;
      const fullPhoneNumber = `${selectCountryCode.id}${phoneNumber}`;

      const updateData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: fullPhoneNumber,
        birthDate: birthDate,
      };

      // Make API call
      const response = await axiosInstance.patch("/auth/mine", updateData);

      // If the API returns a new token, update it in localStorage and axios
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
      }

      // Update Redux store
      dispatch(updateUserData(updateData));

      // Show success message
      setSuccess(t("updateSuccess"));

      // Close popup after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || t("updateError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PersonalContract
        isOpen={isPersonalContractOpen}
        setIsOpen={setIsPersonalContractOpen}
      />
      <div
        className="fixed inset-0  flex items-center justify-center z-[9999] "
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onClick={onClose}
      >
        <div
          className="bg-[#FCFCFC] rounded-3xl p-8 w-[416px] max-w-[90vw] relative"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-6 h-6 flex items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18"
                stroke="#262626"
                strokeWidth="2"
                strokeLinecap="square"
              />
              <path
                d="M6 6L18 18"
                stroke="#262626"
                strokeWidth="2"
                strokeLinecap="square"
              />
            </svg>
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold text-[#262626] mb-8">
            {t("title")}
          </h2>

          {/* Main Message */}
          <h3 className="text-base font-bold text-[#262626] mb-4 mt-8">
            {t("description")}
          </h3>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-200 mb-4">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-xl border border-green-200 mb-4">
              {success}
            </div>
          )}

          <input
            type="text"
            placeholder={t("firstNamePlaceholder")}
            className="w-full h-[56px] px-3 rounded-2xl border border-[#F5F5F5] text-sm outline-none  transition-colors text-[#262626]"
            style={{
              backgroundColor: "#FCFCFC",
            }}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            type="text"
            placeholder={t("lastNamePlaceholder")}
            className="w-full h-[56px] px-3 rounded-2xl border border-[#F5F5F5] text-sm outline-none  transition-colors text-[#262626] mt-3"
            style={{
              backgroundColor: "#FCFCFC",
            }}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <p className="font-bold text-sm text-[#262626] mt-8">
            {t("birthDateLabel")}
          </p>
          <div className="flex justify-between items-center mt-3 space-x-3">
            <GeneralSelect
              selectedItem={selectedDay}
              onSelect={setSelectedDay}
              options={days}
              defaultText={t("dayPlaceholder")}
              extraClassName="w-[110px] h-[56px] border border-[#F5F5F5] rounded-2xl bg-[#FCFCFC] text-[#262626]"
              popoverExtraClassName="w-[150px] max-w-[150px] "
              maxHeight="200"
              customTextColor={true}
            />
            <GeneralSelect
              selectedItem={selectedMonth}
              onSelect={setSelectedMonth}
              options={months}
              defaultText={t("monthPlaceholder")}
              extraClassName="w-[110px] h-[56px] border border-[#F5F5F5] rounded-2xl bg-[#FCFCFC] text-[#262626]"
              popoverExtraClassName="w-[150px] max-w-[150px] "
              customTextColor={true}
              maxHeight="200"
            />
            <GeneralSelect
              selectedItem={selectedYear}
              onSelect={setSelectedYear}
              options={years}
              defaultText={t("yearPlaceholder")}
              extraClassName="w-[110px] h-[56px] border border-[#F5F5F5] rounded-2xl bg-[#FCFCFC] text-[#262626]"
              popoverExtraClassName="w-[150px] max-w-[150px] "
              customTextColor={true}
              maxHeight="200"
            />
          </div>

          <p className="font-bold text-sm text-[#262626] mt-8">
            {t("phoneLabel")}
          </p>

          <div className="flex flex-row items-center justify-between">
            <GeneralSelect
              selectedItem={selectCountryCode}
              onSelect={setSelectCountryCode}
              options={countryCodes.map((country) => ({
                id: `+${country.code}`,
                name: `+${country.code}`,
              }))}
              defaultText={t("countryCodePlaceholder")}
              extraClassName="w-[100px] h-[56px] border border-[#F5F5F5] rounded-2xl bg-[#FCFCFC] text-[#262626]"
              popoverExtraClassName="w-[150px] max-w-[150px] "
              maxHeight="200"
              customTextColor={true}
            />

            <input
              type="text"
              placeholder={t("phoneNumberPlaceholder")}
              className="w-full h-[56px] px-3 rounded-2xl border border-[#F5F5F5] text-sm outline-none  transition-colors text-[#262626] ml-3"
              style={{
                backgroundColor: "#FCFCFC",
              }}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="flex flex-row items-center mt-4">
            <div
              className="w-6 h-6 border border-[#D9D9D9] flex items-center justify-center rounded-lg cursor-pointer"
              onClick={() =>
                setIsUserAgreementConfirmed(!isUserAgreementConfirmed)
              }
            >
              {isUserAgreementConfirmed ? (
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.1998 5.59998L6.42679 10.4L4.7998 8.76379"
                    stroke="#1EB173"
                    strokeWidth={2}
                    strokeLinecap="square"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </div>

            <p className="text-xs text-[#8C8C8C] ml-3">
              <span
                className="font-medium text-[#595959] underline cursor-pointer"
                onClick={() => {
                  setIsPersonalContractOpen(true);
                }}
              >
                {" "}
                {t("agreementLink")}
              </span>{" "}
              {t("agreementText")}
            </p>
          </div>

          <div className="flex flex-row items-center mt-4">
            <div
              className="w-6 h-6 border border-[#D9D9D9] flex items-center justify-center rounded-lg cursor-pointer"
              onClick={() =>
                setIsMarketingEmailsAccepted(!isMarketingEmailsAccepted)
              }
            >
              {isMarketingEmailsAccepted ? (
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.1998 5.59998L6.42679 10.4L4.7998 8.76379"
                    stroke="#1EB173"
                    strokeWidth={2}
                    strokeLinecap="square"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </div>

            <p className="text-xs text-[#8C8C8C] ml-3">{t("marketingLabel")}</p>
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid()}
            className="w-full py-4 px-6 rounded-2xl font-medium transition-colors mt-12 disabled:cursor-not-allowed"
            style={{
              backgroundColor:
                isLoading || !isFormValid() ? "#F0F0F0" : "#5E5691",
              color: isLoading || !isFormValid() ? "#6E6E6E" : "#FFFFFF",
            }}
          >
            {isLoading ? t("updatingButton") : t("continueButton")}
          </button>

          <button
            onClick={onClose}
            className="w-full bg-transparent text-[#5E5691] py-4 px-6 rounded-2xl font-medium hover:bg-[#4c4677] transition-colors mt-3 border border-[#D9D9D9]"
          >
            {t("doItLaterButton")}
          </button>
        </div>
      </div>
    </>
  );
}
