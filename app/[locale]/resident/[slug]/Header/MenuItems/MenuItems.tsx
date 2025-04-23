import React from "react";
import { useTranslations } from "next-intl";

export default function MenuItems() {
  const t = useTranslations("residentMenu");

  const menuItems = [
    { key: "photos", label: t("photos") },
    { key: "descriptions", label: t("descriptions") },
    { key: "details", label: t("details") },
    { key: "features", label: t("features") },
    { key: "virtualTour", label: t("virtualTour") },
    { key: "location", label: t("location") },
    { key: "floorPlans", label: t("floorPlans") },
  ];

  return (
    <div className="flex md:flex-row flex-col w-full items-center gap-10 mb-20 md:mb-0">
      {menuItems.map((item) => (
        <p
          key={item.key}
          className="text-sm font-medium text-gray-700 cursor-pointer hover:border-b-2 hover:border-gray-700 transition-all duration-200 border-b-2 border-transparent"
        >
          {item.label}
        </p>
      ))}
    </div>
  );
}
