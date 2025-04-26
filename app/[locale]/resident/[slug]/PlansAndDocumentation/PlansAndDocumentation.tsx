"use client";

import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { useTranslations } from "next-intl";

interface FileItem {
  label: string;
  href: string;
}

const files: FileItem[] = [
  { label: "Kat Planı", href: "/docs/floor-plan.pdf" },
  { label: "Enerji Sertifikası", href: "/docs/energy-certificate.pdf" },
  { label: "Ekspertiz Raporu", href: "/docs/appraisal.pdf" },
  { label: "Teklif Formu", href: "/docs/offer-form.pdf" },
];

export default function FloorDocs() {
  const t = useTranslations("residentMenu");
  const floorPlansT = useTranslations("floorPlans");

  return (
    <section className="max-w-5xl mx-auto p-4 mt-12">
      <h2 className="text-[#31286A] font-semibold tracking-tight text-3xl md:text-4xl">
        {t("floorPlans")}
      </h2>
      <p className="mt-2 max-w-xl text-sm md:text-base leading-relaxed text-gray-500">
        {floorPlansT("description")}
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {files.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener"
            className="group flex items-center justify-between w-full rounded-xl border border-gray-200 px-6 py-5 md:px-8 md:py-6 bg-white shadow-sm/0 hover:shadow-sm transition-shadow focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#31286A]"
          >
            <span className="text-gray-900 font-medium text-base lg:text-lg">
              {label}
            </span>
            <FiArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-[#31286A] transition group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        ))}
      </div>
    </section>
  );
}
