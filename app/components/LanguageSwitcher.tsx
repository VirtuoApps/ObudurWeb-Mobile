"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Fragment, useState, useEffect } from "react";
import { TbWorld } from "react-icons/tb";
import { XMarkIcon } from "@heroicons/react/24/outline";

const languageOptions = [
  { code: "tr", name: "Türkçe", translation: "Turkish" },
  { code: "en", name: "English", translation: "English" },
  { code: "de", name: "Deutsch", translation: "German" },
  { code: "ru", name: "Russian", translation: "Russian" },
];

export const currencyOptions = [
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "RUB", symbol: "", name: "Ruble" },
];

export default function LanguageSwitcher() {
  const t = useTranslations("header");
  const ls = useTranslations("languageSwitcher");
  const currentLocale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(currentLocale);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  useEffect(() => {
    // Initialize selectedCurrency from localStorage if available
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

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
    localStorage.setItem("selectedCurrency", selectedCurrency);

    if (selectedLanguage !== currentLocale) {
      changeLanguage(selectedLanguage);
    }

    // Always close the modal after an update attempt
    setIsOpen(false);

    // Removed window.location.reload(); to allow language change navigation to complete
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
      >
        <TbWorld className="w-8 h-8" />
      </button>

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
              className="p-1 rounded-full hover:bg-gray-100 absolute top-2 right-2 cursor-pointer"
            >
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex justify-between items-center mb-6 mt-8">
              <h2 className="text-xl font-bold text-[#262626]">
                {ls("chooseLanguage")}
              </h2>
              <div className="text-gray-400">{ls("language")}</div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              {languageOptions.map((lang) => (
                <div
                  key={lang.code}
                  className={` rounded-lg p-4 cursor-pointer border-2 ${
                    selectedLanguage === lang.code
                      ? "border-2"
                      : "border-gray-100"
                  }`}
                  onClick={() => setSelectedLanguage(lang.code)}
                  style={{
                    borderColor:
                      selectedLanguage === lang.code ? "#5E5691" : "",
                  }}
                >
                  <div className="font-medium text-gray-500">{lang.name}</div>
                  <div className="text-gray-400 text-sm">
                    {lang.translation}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#262626]">
                {ls("chooseCurrency")}
              </h2>
              <div className="text-gray-400">{ls("currency")}</div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              {currencyOptions.map((currency) => (
                <div
                  key={currency.code}
                  className={`border-2 rounded-lg p-4 cursor-pointer ${
                    selectedCurrency === currency.code
                      ? "border-2"
                      : "border-gray-100"
                  }`}
                  onClick={() => handleCurrencyChange(currency.code)}
                  style={{
                    borderColor:
                      selectedCurrency === currency.code ? "#5E5691" : "",
                  }}
                >
                  <div className="font-medium text-gray-500">
                    {currency.code} {currency.symbol}
                  </div>
                  <div className="text-gray-400 text-sm">{currency.name}</div>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpdate}
              className="w-full text-white py-3 rounded-xl font-medium hover:opacity-90"
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
