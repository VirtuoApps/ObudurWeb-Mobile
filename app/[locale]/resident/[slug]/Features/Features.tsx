"use client";

import { Feature, LocalizedText } from "../page";
import {
  FiActivity,
  FiAperture,
  FiArchive,
  FiBell,
  FiBox,
  FiBriefcase,
  FiCalendar,
  FiCircle,
  FiCloud,
  FiCoffee,
  FiCpu,
  FiDroplet,
  FiFile,
  FiGrid,
  FiHardDrive,
  FiHome,
  FiLayers,
  FiLock,
  FiMonitor,
  FiMove,
  FiMusic,
  FiPackage,
  FiScissors,
  FiSun,
  FiTruck,
  FiTv,
  FiUsers,
  FiVideo,
  FiWifi,
  FiWind,
} from "react-icons/fi";

import { IconBaseProps } from "react-icons";
import React from "react";
import { infrastructureFeatures } from "../../../../utils/infrastructureFeatures";
import { useHotelData } from "../hotelContext";
import { useTranslations } from "next-intl";
import { views } from "../../../../utils/views";

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
    <li className="flex items-center gap-2 md:gap-3 text-[#595959] min-w-0">
      <img src={imageUrl} alt={label} className="w-6 h-6 flex-shrink-0" />
      <span className="text-[#595959] text-sm md:text-[14px] font-medium truncate">
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

  const faceFeatures = hotelData.populatedData.faces;

  const infrastructureData: Feature[] =
    (hotelData as any).infrastructureFeatureIds
      ?.map((id: string) => {
        const feature = infrastructureFeatures[id];
        if (!feature) return null;
        return {
          _id: id,
          name: { tr: feature.tr, en: feature.en },
          iconUrl: feature.image,
        };
      })
      .filter((f: Feature | null): f is Feature => f !== null) || [];

  const viewData: Feature[] =
    (hotelData as any).viewIds
      ?.map((id: string) => {
        const view = views[id];
        if (!view) return null;
        return {
          _id: id,
          name: { tr: view.tr, en: view.en },
          iconUrl: view.image,
        };
      })
      .filter((v: Feature | null): v is Feature => v !== null) || [];

  return (
    <section
      id="features-section"
      className="max-w-5xl mx-auto my-[24px] md:my-[72px]"
    >
      <div>
        <h2 className="text-[#31286A] font-semibold tracking-tight text-3xl md:text-2xl">
          {t("title")}
        </h2>
        <p className="mt-2 max-w-xl text-sm md:text-base leading-relaxed text-gray-500">
          {t("description")}
        </p>
      </div>
      {faceFeatures?.length > 0 && (
        <FeatureGroup
          title={t("facadeTitle")}
          features={faceFeatures}
          locale={currentLocale}
        />
      )}
      {insideFeatures?.length > 0 && (
        <FeatureGroup
          title={t("indoorTitle")}
          features={insideFeatures}
          locale={currentLocale}
        />
      )}
      {outsideFeatures?.length > 0 && (
        <FeatureGroup
          title={t("outdoorTitle")}
          features={outsideFeatures}
          locale={currentLocale}
        />
      )}
      {infrastructureData?.length > 0 && (
        <FeatureGroup
          title={t("infrastructureTitle")}
          features={infrastructureData}
          locale={currentLocale}
        />
      )}
      {viewData?.length > 0 && (
        <FeatureGroup
          title={t("viewTitle")}
          features={viewData}
          locale={currentLocale}
        />
      )}
    </section>
  );
}
