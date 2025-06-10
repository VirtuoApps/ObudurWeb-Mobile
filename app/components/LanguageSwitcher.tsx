"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Fragment, useState, useEffect } from "react";
import { TbWorld } from "react-icons/tb";
import { XMarkIcon } from "@heroicons/react/24/outline";

const languageOptions = [
  { code: "tr", name: "Türkçe", translation: "Turkish" },
  { code: "en", name: "English", translation: "English" },
  // { code: "ru", name: "Russian", translation: "Russian" },
];

export const currencyOptions = [
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "USD", symbol: "$", name: "US Dollar" },
];

interface LanguageSwitcherProps {
  isOpen?: boolean;
  onClose?: () => void;
  showButton?: boolean;
}

export default function LanguageSwitcher({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  showButton = true,
}: LanguageSwitcherProps = {}) {
  const t = useTranslations("header");
  const ls = useTranslations("languageSwitcher");
  const currentLocale = useLocale();
  const pathname = usePathname();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(currentLocale);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  // Use external isOpen if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnClose
    ? (value: boolean) => {
        if (!value) externalOnClose();
      }
    : setInternalIsOpen;

  useEffect(() => {
    // Initialize selectedCurrency from localStorage if available
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setInternalIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

  const changeLanguage = (newLocale: string) => {
    let newPath = pathname;

    if (pathname.startsWith(`/${currentLocale}`)) {
      newPath = pathname.substring(currentLocale.length + 1) || "/";
    } else {
      newPath = pathname;
    }

    window.location.href = `/${newLocale}${newPath === "/" ? "" : newPath}`;
  };

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
  };

  const handleUpdate = () => {
    // Save currency to localStorage

    const savedCurrency = localStorage.getItem("selectedCurrency");

    localStorage.setItem("selectedCurrency", selectedCurrency);

    if (selectedLanguage !== currentLocale) {
      changeLanguage(selectedLanguage);
    } else if (savedCurrency !== selectedCurrency) {
      window.location.reload();
    }

    // Always close the modal after an update attempt
    setIsOpen(false);

    // Removed window.location.reload(); to allow language change navigation to complete
  };

  return (
    <div className="relative">
      {showButton && (
        <button
          onClick={() => setInternalIsOpen(true)}
          className="w-[48px] h-[48px] flex items-center justify-center hover:bg-gray-100 transition-all duration-200 rounded-lg cursor-pointer"
        >
          <img src="/globe.png" className="w-[24px] h-[24px]" />
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 "
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full  absolute top-4 right-4 cursor-pointer"
            >
              <img src="/close-button-ani.png" className="w-[24px] h-[24px]" />
            </button>
            <div className="flex justify-between items-center mb-6 mt-12">
              <h2 className="text-2xl font-bold text-[#262626]">
                {ls("chooseLanguage")}
              </h2>
              <div className="text-gray-400">{ls("language")}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {languageOptions.map((lang) => (
                <div
                  key={lang.code}
                  className={` rounded-lg p-4 cursor-pointer ${
                    selectedLanguage === lang.code
                      ? "border border-[#362C75]"
                      : "border border-[#D9D9D9] transition-all duration-200 hover:border-[#8C8C8C]"
                  }`}
                  onClick={() => setSelectedLanguage(lang.code)}
                  style={{
                    borderColor:
                      selectedLanguage === lang.code ? "#5E5691" : "",
                  }}
                >
                  <div className="font-medium text-[#262626] text-base">
                    {lang.name}
                  </div>
                  <div className="text-[#595959] text-base">
                    {lang.translation}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#262626]">
                {ls("chooseCurrency")}
              </h2>
              <div className="text-[#8C8C8C] text-base">{ls("currency")}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {currencyOptions.map((currency) => (
                <div
                  key={currency.code}
                  className={` rounded-lg p-4 cursor-pointer ${
                    selectedCurrency === currency.code
                      ? "border border-[#362C75]"
                      : "border border-[#D9D9D9] transition-all duration-200 hover:border-[#8C8C8C]"
                  }`}
                  onClick={() => handleCurrencyChange(currency.code)}
                  style={{
                    borderColor:
                      selectedCurrency === currency.code ? "#5E5691" : "",
                  }}
                >
                  <div className="font-medium text-[#262626] text-base">
                    {currency.code} {currency.symbol}
                  </div>
                  <div className="text-[#595959] text-base">
                    {currency.name}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpdate}
              className="w-full text-white py-3 rounded-xl font-medium hover:opacity-90 h-[56px]"
              style={{ backgroundColor: "#5E5691" }}
            >
              {ls("update")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
