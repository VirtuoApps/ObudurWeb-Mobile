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

// Type definitions
type FeatureItemProps = {
  icon: React.ComponentType<IconBaseProps>;
  label: string;
};

type FeatureGroupProps = {
  title: string;
  features: { icon: React.ComponentType<IconBaseProps>; key: string }[];
};

// Feature Item Component
const FeatureItem: React.FC<FeatureItemProps> = ({ icon: Icon, label }) => {
  return (
    <li className="flex items-center gap-2 md:gap-3 text-[#31286A]">
      <Icon className="w-4 h-4 md:w-5 md:h-5" />
      <span className="text-gray-700 text-sm md:text-base font-medium">
        {label}
      </span>
    </li>
  );
};

// Feature Group Component
const FeatureGroup: React.FC<FeatureGroupProps> = ({ title, features }) => {
  const t = useTranslations("features");

  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <ul
        role="list"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 "
      >
        {features.map((feature, index) => (
          <FeatureItem key={index} icon={feature.icon} label={t(feature.key)} />
        ))}
      </ul>
    </div>
  );
};

// Main Component
export default function FeaturesEquipment() {
  const t = useTranslations("features");

  // Feature data with translation keys
  const indoor = [
    { icon: FiTv, key: "cableTV" },
    { icon: FiWifi, key: "wifi" },
    { icon: FiBell, key: "alarm" },
    { icon: FiGrid, key: "doubleGlazed" },
    { icon: FiHome, key: "smartHome" },
    { icon: FiMonitor, key: "microwave" },
    { icon: FiCpu, key: "combi" },
    { icon: FiCoffee, key: "fireplace" },
    { icon: FiHardDrive, key: "builtInAppliances" },
    { icon: FiWind, key: "airConditioning" },
    { icon: FiPackage, key: "storage" },
    { icon: FiLayers, key: "laundryRoom" },
    { icon: FiScissors, key: "dressingRoom" },
    { icon: FiFile, key: "fireAlarm" },
  ];

  const outdoor = [
    { icon: FiSun, key: "southFacing" },
    { icon: FiAperture, key: "balcony" },
    { icon: FiCloud, key: "garden" },
    { icon: FiBox, key: "exteriorInsulation" },
    { icon: FiUsers, key: "security" },
    { icon: FiMove, key: "elevator" },
    { icon: FiActivity, key: "bikePath" },
    { icon: FiCircle, key: "parking" },
    { icon: FiTruck, key: "garage" },
    { icon: FiVideo, key: "securityCamera" },
    { icon: FiArchive, key: "storage" },
    { icon: FiLock, key: "secureEntrance" },
    { icon: FiMusic, key: "gym" },
    { icon: FiDroplet, key: "spa" },
    { icon: FiBriefcase, key: "office" },
    { icon: FiCalendar, key: "meetingRoom" },
  ];

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

      <FeatureGroup title={t("indoorTitle")} features={indoor} />
      <FeatureGroup title={t("outdoorTitle")} features={outdoor} />
    </section>
  );
}
