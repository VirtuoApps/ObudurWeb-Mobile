"use client";

import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { LocalizedText } from "@/types/filter-options.type";
import { useHotelData } from "../hotelContext";

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

  return (
    <section
      id="plans-section"
      className="max-w-5xl mx-auto p-4 mt-12 border-t pt-24 border-gray-300"
    >
      <h2 className="text-[#31286A] font-semibold tracking-tight text-3xl md:text-4xl">
        {t("floorPlans")}
      </h2>
      <p className="mt-2 max-w-xl text-sm md:text-base leading-relaxed text-gray-500">
        {floorPlansT("description")}
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {documents.map(({ name, file }) => (
          <a
            key={name.tr}
            href={file}
            target="_blank"
            rel="noopener"
            className="group flex items-center justify-between w-full rounded-xl border border-[#BFBFBF] px-6 md:px-8 md:py-3 bg-white shadow-sm/0 hover:shadow-sm transition-shadow focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#31286A]"
          >
            <span className="text-[#262626] font-medium text-base lg:text-lg">
              {name[currentLocale]}
            </span>
            <img
              src="/arrow-up-right.png"
              alt="arrow-right"
              className="w-[24px]"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
