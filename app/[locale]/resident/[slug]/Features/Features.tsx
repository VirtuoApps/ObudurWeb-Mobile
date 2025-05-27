"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  FiTv,
  FiWifi,
  FiBell,
  FiGrid,
  FiHome,
  FiMonitor,
  FiCpu,
  FiCoffee,
  FiHardDrive,
  FiWind,
  FiPackage,
  FiLayers,
  FiScissors,
  FiFile,
  FiSun,
  FiAperture,
  FiCloud,
  FiBox,
  FiUsers,
  FiMove,
  FiActivity,
  FiCircle,
  FiTruck,
  FiVideo,
  FiArchive,
  FiLock,
  FiMusic,
  FiDroplet,
  FiBriefcase,
  FiCalendar,
} from "react-icons/fi";
import { IconBaseProps } from "react-icons";
import { useHotelData } from "../hotelContext";
import { Feature, LocalizedText } from "../page";

// Type definitions
type FeatureItemProps = {
  imageUrl: string;
  label: string;
};

type FeatureGroupProps = {
  title: string;
  features: Feature[];
  locale: "tr" | "en";
};

// Feature Item Component
const FeatureItem: React.FC<FeatureItemProps> = ({ label, imageUrl }) => {
  return (
    <li className="flex items-center gap-2 md:gap-3 text-[#595959]">
      <img src={imageUrl} alt={label} className="w-6 h-6" />
      <span className="text-[#595959] text-sm md:text-base font-medium">
        {label}
      </span>
    </li>
  );
};

// Feature Group Component
const FeatureGroup: React.FC<FeatureGroupProps> = ({
  title,
  features,
  locale,
}) => {
  const t = useTranslations("features");

  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <ul role="list" className="flex flex-wrap gap-5 md:gap-8">
        {features.map((feature, index) => (
          <FeatureItem
            key={index}
            imageUrl={feature.iconUrl}
            label={feature.name[locale]}
          />
        ))}
      </ul>
    </div>
  );
};

// Main Component
export default function FeaturesEquipment() {
  const t = useTranslations("features");

  const { hotelData, locale } = useHotelData();

  const currentLocale = locale as keyof LocalizedText;

  const insideFeatures = hotelData.populatedData.insideFeatures;

  const outsideFeatures = hotelData.populatedData.outsideFeatures;

  // Feature data with translation keys

  return (
    <section id="features-section" className="max-w-5xl mx-auto p-4 mt-12">
      <div>
        <h2 className="text-[#31286A] font-semibold tracking-tight text-3xl md:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-2 max-w-xl text-sm md:text-base leading-relaxed text-gray-500">
          {t("description")}
        </p>
      </div>

      <FeatureGroup
        title={t("indoorTitle")}
        features={insideFeatures}
        locale={currentLocale}
      />
      <FeatureGroup
        title={t("outdoorTitle")}
        features={outsideFeatures}
        locale={currentLocale}
      />
    </section>
  );
}
