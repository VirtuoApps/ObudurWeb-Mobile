"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Fragment, useState, useEffect } from "react";

const languageOptions = [
  { code: "tr", name: "Türkçe", translation: "Turkish" },
  { code: "en", name: "İngilizce", translation: "English" },
];

export const currencyOptions = [
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
];

export default function DilParaBirimiPage() {
  const router = useRouter();
  const currentLocale = useLocale();
  const pathname = usePathname();

  const [initialLanguage, setInitialLanguage] = useState(currentLocale);
  const [initialCurrency, setInitialCurrency] = useState("TRY");

  const [selectedLanguage, setSelectedLanguage] = useState(currentLocale);
  const [selectedCurrency, setSelectedCurrency] = useState("TRY");
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
      setInitialCurrency(savedCurrency);
    }
  }, []);

  useEffect(() => {
    if (
      selectedLanguage !== initialLanguage ||
      selectedCurrency !== initialCurrency
    ) {
      setHasChanged(true);
    } else {
      setHasChanged(false);
    }
  }, [selectedLanguage, selectedCurrency, initialLanguage, initialCurrency]);

  const changeLanguage = (newLocale: string) => {
    let newPath = pathname;

    if (pathname.startsWith(`/${currentLocale}`)) {
      newPath = pathname.substring(currentLocale.length + 1) || "/";
      if (newPath.startsWith('dil-para-birimi')) {
        newPath = '/';
      }
    } else {
      newPath = pathname;
    }

    window.location.href = `/${newLocale}${newPath === "/" ? "" : newPath}`;
  };

  const handleUpdate = () => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    localStorage.setItem("selectedCurrency", selectedCurrency);

    if (selectedLanguage !== currentLocale) {
      changeLanguage(selectedLanguage);
    } else if (savedCurrency !== selectedCurrency) {
      window.location.reload();
    }
  };
  
  const handleCancel = () => {
    setSelectedLanguage(initialLanguage);
    setSelectedCurrency(initialCurrency);
  }

  return (
    <div className="lg:hidden flex flex-col h-screen bg-white">
      <header className="p-4 mb-2">
        <button onClick={() => router.back()}>
          <img src="/arrow-left.png" alt="Back" className="w-6 h-6" />
        </button>
      </header>

      <hr className="border-t-[1px] mx-4" style={{ borderColor: "#F0F0F0" }} />

      <main className="flex-grow px-4 pb-4">
        <h1 className="text-3xl font-bold text-[#262626] mt-4 mb-8">
          Dil ve Para Birimi
        </h1>
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-[#262626]">Dil Seçin</h2>
              <span className="text-sm text-[#8C8C8C]">Language</span>
            </div>
            <div className="space-y-4">
              {languageOptions.map((lang) => (
                <div
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-4 rounded-lg border cursor-pointer ${
                    selectedLanguage === lang.code
                      ? "border-[#5E5691]"
                      : "border-[#D9D9D9]"
                  }`}
                >
                  <p className="font-medium text-[#262626]">{lang.name}</p>
                  <p className="text-sm text-[#595959]">{lang.translation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-t-[1px] my-8" style={{ borderColor: "#F0F0F0" }} />

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-[#262626]">Para Birimi Seçin</h2>
            <span className="text-sm text-[#8C8C8C]">Currency</span>
          </div>
          <div className="space-y-4">
            {currencyOptions.map((currency) => (
              <div
                key={currency.code}
                onClick={() => setSelectedCurrency(currency.code)}
                className={`p-4 rounded-lg border cursor-pointer ${
                  selectedCurrency === currency.code
                    ? "border-[#5E5691]"
                    : "border-[#D9D9D9]"
                }`}
              >
                <p className="font-medium text-[#262626]">
                  {currency.code} {currency.symbol}
                </p>
                <p className="text-sm text-[#595959]">{currency.name}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {hasChanged && (
        <footer className="p-4 bg-white flex items-center justify-center space-x-4">
          <button
            onClick={handleCancel}
            className="px-6 py-3 rounded-lg border border-[#D9D9D9] bg-white text-[#262626] font-medium w-1/2"
          >
            Vazgeç
          </button>
          <button
            onClick={handleUpdate}
            className="px-6 py-3 rounded-lg bg-[#5E5691] text-white font-medium w-1/2"
          >
            Güncelle
          </button>
        </footer>
      )}
      <div className="p-4 flex items-center justify-center">
            <p className='text-sm text-gray-500'>© obudur.com</p>
      </div>
    </div>
  );
} 