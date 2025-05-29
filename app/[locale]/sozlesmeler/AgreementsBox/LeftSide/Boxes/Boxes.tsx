"use client";

import React, { useState } from "react";

interface AccordionItem {
  id: string;
  title: string;
  items?: {
    id: string;
    title: string;
    isActive?: boolean;
  }[];
}

// Custom Chevron Components
const ChevronUp = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7 14.5L12 9.5L17 14.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M7 9.5L12 14.5L17 9.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Boxes() {
  const [openSections, setOpenSections] = useState<string[]>([
    "sozlesmeler",
    "kurallar",
    "cerezler",
  ]);

  const accordionData: AccordionItem[] = [
    {
      id: "sozlesmeler",
      title: "Sözleşmeler",
      items: [
        { id: "bireysel", title: "Bireysel Hesap Sözleşmesi" },
        { id: "kurumsal", title: "Kurumsal Hesap Sözleşmesi" },
      ],
    },
    {
      id: "kurallar",
      title: "Kurallar Politikalar",
      items: [
        { id: "kullanim", title: "Kullanım Koşulları" },
        { id: "ilan", title: "İlan Verme Kuralları" },
        { id: "icerik", title: "İçerik Politikası" },
        { id: "kvkk", title: "KVKK Metni" },
      ],
    },
    {
      id: "cerezler",
      title: "Çerezler",
      items: [
        { id: "tercihler", title: "Çerez Tercihleri" },
        { id: "aydinlatma", title: "Çerez Aydınlatma Metni", isActive: true },
      ],
    },
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div className="w-full space-y-1 mt-2">
      {accordionData.map((section) => (
        <div key={section.id}>
          {/* Section Header */}
          <div
            className="h-12 bg-[#F5F5F5] rounded-2xl flex items-center justify-between px-3 cursor-pointer "
            onClick={() => toggleSection(section.id)}
          >
            <span className="text-[#8C8C8C] text-sm font-medium">
              {section.title}
            </span>
            {openSections.includes(section.id) ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>

          {/* Section Items */}
          {openSections.includes(section.id) && section.items && (
            <div className="mt-1 space-y-1">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="h-9  rounded-2xl flex items-center px-3  transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full pl-11">
                    <span
                      className={`${
                        item.isActive
                          ? "text-[#362C75] font-medium"
                          : "text-[#262626] font-normal"
                      } text-sm `}
                    >
                      {item.title}
                    </span>
                    {item.isActive && (
                      <div className="w-2 h-2 rounded-full bg-indigo-700" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
