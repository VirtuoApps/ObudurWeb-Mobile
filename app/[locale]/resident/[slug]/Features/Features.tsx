"use client";

import React from "react";
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

// Feature data
const indoor = [
  { icon: FiTv, label: "Kablo Tv" },
  { icon: FiWifi, label: "Wi-Fi" },
  { icon: FiBell, label: "Alarm" },
  { icon: FiGrid, label: "Çift Cam" },
  { icon: FiHome, label: "Akıllı Ev" },
  { icon: FiMonitor, label: "Mikrodalga" },
  { icon: FiCpu, label: "Kombi" },
  { icon: FiCoffee, label: "Şömine" },
  { icon: FiHardDrive, label: "Ankastre" },
  { icon: FiWind, label: "Klima" },
  { icon: FiPackage, label: "Depo" },
  { icon: FiLayers, label: "Çamaşır Odası" },
  { icon: FiScissors, label: "Giyinme Odası" },
  { icon: FiFile, label: "Yangın Alarmı" },
];

const outdoor = [
  { icon: FiSun, label: "Güney Cephe" },
  { icon: FiAperture, label: "Balkon" },
  { icon: FiCloud, label: "Bahçe" },
  { icon: FiBox, label: "Dış Cephe Yalıtımı" },
  { icon: FiUsers, label: "Güvenlik" },
  { icon: FiMove, label: "Asansör" },
  { icon: FiActivity, label: "Bisiklet Yolu" },
  { icon: FiCircle, label: "Otopark" },
  { icon: FiTruck, label: "Garaj" },
  { icon: FiVideo, label: "Güvenlik Kamerası" },
  { icon: FiArchive, label: "Depo" },
  { icon: FiLock, label: "Güvenli Giriş" },
  { icon: FiMusic, label: "Spor Salonu" },
  { icon: FiDroplet, label: "SPA" },
  { icon: FiBriefcase, label: "Ofis" },
  { icon: FiCalendar, label: "Toplantı Odası" },
];

// Type definitions
type FeatureItemProps = {
  icon: React.ComponentType<IconBaseProps>;
  label: string;
};

type FeatureGroupProps = {
  title: string;
  features: FeatureItemProps[];
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
  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <ul
        role="list"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 "
      >
        {features.map((feature, index) => (
          <FeatureItem key={index} icon={feature.icon} label={feature.label} />
        ))}
      </ul>
    </div>
  );
};

// Main Component
export default function FeaturesEquipment() {
  return (
    <section className="max-w-5xl mx-auto p-4 mt-12">
      <div>
        <h2 className="text-[#31286A] font-semibold tracking-tight text-3xl md:text-4xl">
          Özellikler & Donanımlar
        </h2>
        <p className="mt-2 max-w-xl text-sm md:text-base leading-relaxed text-gray-500">
          Konutun iç ve dış mekandaki donanımları, yapı özellikleri ve sunduğu
          yaşam alanları hakkında detaylı bilgiler.
        </p>
      </div>

      <FeatureGroup title="İç Özellikler" features={indoor} />
      <FeatureGroup title="Dış Özellikler" features={outdoor} />
    </section>
  );
}
