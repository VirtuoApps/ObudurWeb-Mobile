import { useAppSelector } from "@/app/store/hooks";
import React, { useState } from "react";
import GeneralSelect from "../GeneralSelect/GeneralSelect";
import { countryCodes } from "@/app/[locale]/resident/[slug]/ContactBox/countryCodes";

interface PersonalInformationFormPopupProps {
  onClose: () => void;
}

export default function PersonalInformationFormPopup({
  onClose,
}: PersonalInformationFormPopupProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<any>(null);
  const [selectCountryCode, setSelectCountryCode] = useState<any>(null);
  const [selectCountry, setSelectCountry] = useState<any>(null);

  const days = Array.from({ length: 31 }, (_, i) => ({
    id: i + 1,
    name: `${i + 1}`,
  }));

  const months = [
    { id: 1, name: "Ocak" },
    { id: 2, name: "Şubat" },
    { id: 3, name: "Mart" },
    { id: 4, name: "Nisan" },
    { id: 5, name: "Mayıs" },
    { id: 6, name: "Haziran" },
    { id: 7, name: "Temmuz" },
    { id: 8, name: "Ağustos" },
    { id: 9, name: "Eylül" },
    { id: 10, name: "Ekim" },
    { id: 11, name: "Kasım" },
    { id: 12, name: "Aralık" },
  ];

  const startYear = 2005;
  const years = Array.from({ length: 100 }, (_, i) => ({
    id: startYear - i,
    name: `${startYear - i}`,
  }));

  return (
    <div
      className="fixed inset-0  flex items-center justify-center z-50 "
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="bg-[#FCFCFC] rounded-3xl p-8 w-[416px] max-w-[90vw] relative">
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
          Kişisel Bilgiler
        </h2>

        {/* Main Message */}
        <h3 className="text-base font-bold text-[#262626] mb-4 mt-8">
          İlan verebilmek, ilan sahipleri ile iletişim kurabilmek için lütfen
          kişisel bilgilerinizi girin.
        </h3>

        <input
          type="text"
          placeholder="Adınız"
          className="w-full h-[56px] px-3 rounded-2xl border border-[#F5F5F5] text-sm outline-none  transition-colors text-[#262626]"
          style={{
            backgroundColor: "#FCFCFC",
          }}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Soyadınız"
          className="w-full h-[56px] px-3 rounded-2xl border border-[#F5F5F5] text-sm outline-none  transition-colors text-[#262626] mt-3"
          style={{
            backgroundColor: "#FCFCFC",
          }}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <p className="font-bold text-sm text-[#262626] mt-8">Doğum Tarihiniz</p>
        <div className="flex justify-between items-center mt-3 space-x-3">
          <GeneralSelect
            selectedItem={selectedDay}
            onSelect={setSelectedDay}
            options={days}
            defaultText="Gün"
            extraClassName="w-[110px] h-[56px] border border-[#F5F5F5] rounded-2xl bg-[#FCFCFC] text-[#262626]"
            popoverExtraClassName="w-[150px] max-w-[150px] "
            maxHeight="200"
            customTextColor={true}
          />
          <GeneralSelect
            selectedItem={selectedMonth}
            onSelect={setSelectedMonth}
            options={months}
            defaultText="Ay"
            extraClassName="w-[110px] h-[56px] border border-[#F5F5F5] rounded-2xl bg-[#FCFCFC] text-[#262626]"
            popoverExtraClassName="w-[150px] max-w-[150px] "
            customTextColor={true}
            maxHeight="200"
          />
          <GeneralSelect
            selectedItem={selectedYear}
            onSelect={setSelectedYear}
            options={years}
            defaultText="Yıl"
            extraClassName="w-[110px] h-[56px] border border-[#F5F5F5] rounded-2xl bg-[#FCFCFC] text-[#262626]"
            popoverExtraClassName="w-[150px] max-w-[150px] "
            customTextColor={true}
            maxHeight="200"
          />
        </div>

        <p className="font-bold text-sm text-[#262626] mt-8">
          Telefon Numaranız
        </p>

        <div className="flex flex-row items-center justify-between">
          <GeneralSelect
            selectedItem={selectCountryCode}
            onSelect={setSelectCountryCode}
            options={countryCodes.map((country) => ({
              id: `+${country.code}`,
              name: `+${country.code}`,
            }))}
            defaultText="Seçin"
            extraClassName="w-[100px] h-[56px] border border-[#F5F5F5] rounded-2xl bg-[#FCFCFC] text-[#262626]"
            popoverExtraClassName="w-[150px] max-w-[150px] "
            maxHeight="200"
            customTextColor={true}
          />

          <input
            type="text"
            placeholder="Telefon Numaranız"
            className="w-full h-[56px] px-3 rounded-2xl border border-[#F5F5F5] text-sm outline-none  transition-colors text-[#262626] ml-3"
            style={{
              backgroundColor: "#FCFCFC",
            }}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full bg-[#5E5691] text-white py-4 px-6 rounded-2xl font-medium hover:bg-[#4c4677] transition-colors mt-12"
        >
          Devam Et
        </button>
      </div>
    </div>
  );
}
