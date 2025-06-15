"use client";

import { FiArrowUpRight } from "react-icons/fi";
import { LocalizedText } from "@/types/filter-options.type";
import React from "react";
import { useHotelData } from "../hotelContext";
import { useTranslations } from "next-intl";

type PlansAndDocumentationProps = {
  documents: {
    name: LocalizedText;
    file: string;
  }[];
};

export default function PlansAndDocumentation({
  documents,
}: PlansAndDocumentationProps) {
  const t = useTranslations("residentMenu");
  const floorPlansT = useTranslations("floorPlans");
  const { hotelData, locale } = useHotelData();

  const currentLocale = locale as keyof LocalizedText;

  // Sabit buton tanımları
  const fixedButtons = [
    {
      name: {
        tr: "Kat Planı",
        en: "Floor Plan",
      },
      key: "kat-plani",
    },
    {
      name: {
        tr: "Enerji Sertifikası",
        en: "Energy Certificate",
      },
      key: "enerji-sertifikasi",
    },
    {
      name: {
        tr: "Eskertiz Raporu",
        en: "Expertise Report",
      },
      key: "eskertiz-raporu",
    },
    {
      name: {
        tr: "Teklif Formu",
        en: "Offer Form",
      },
      key: "teklif-formu",
    },
  ];

  // Her sabit buton için documents array'inde eşleşen item olup olmadığını kontrol et
  const getDocumentForButton = (buttonKey: string) => {
    return documents.find((doc) => {
      const docNameTr = doc.name.tr?.toLowerCase();
      const buttonNameTr = fixedButtons
        .find((btn) => btn.key === buttonKey)
        ?.name.tr.toLowerCase();
      return docNameTr === buttonNameTr;
    });
  };

  return (
    <section
      id="plans-section"
      className="max-w-5xl mx-auto my-[24px] md:my-[72px] mb-24 md:mb-[72px]"
    >
      <h2 className="text-[#31286A] font-semibold tracking-tight text-3xl md:text-2xl">
        {t("floorPlans")}
      </h2>
      <p className="mt-2 max-w-xl text-sm md:text-base leading-relaxed text-gray-500">
        {floorPlansT("description")}
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-4">
        {fixedButtons.map((button) => {
          const matchingDocument = getDocumentForButton(button.key);
          const isDisabled = !matchingDocument;

          return isDisabled ? (
            <div
              key={button.key}
              className="relative flex items-center justify-between w-full rounded-xl border border-[#D9D9D9] px-6 md:px-8 py-3 bg-white cursor-not-allowed group"
            >
              <span className="text-[#8C8C8C] font-medium text-base lg:text-lg">
                {button.name[currentLocale]}
              </span>
              <img
                src="/arrow-up-right_gray.png"
                alt="arrow-right"
                className="w-[24px] opacity-40"
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                Ekli Dosya Bulunmuyor
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          ) : (
            <a
              key={button.key}
              href={matchingDocument.file}
              target="_blank"
              rel="noopener"
              className="group flex items-center justify-between w-full rounded-xl border border-[#BFBFBF] px-6 md:px-8 py-3 bg-white shadow-sm/0 hover:shadow-sm transition-shadow focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#31286A]"
            >
              <span className="text-[#262626] font-medium text-base lg:text-lg">
                {button.name[currentLocale]}
              </span>
              <img
                src="/arrow-up-right.png"
                alt="arrow-right"
                className="w-[24px]"
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}
