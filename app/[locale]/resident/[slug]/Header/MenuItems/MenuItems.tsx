import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function MenuItems() {
  const t = useTranslations("residentMenu");
  const [activeSection, setActiveSection] = useState("images-section");

  const menuItems = [
    { key: "photos", label: t("photos"), sectionId: "images-section" },
    {
      key: "descriptions",
      label: t("descriptions"),
      sectionId: "descriptions-section",
    },
    { key: "details", label: t("details"), sectionId: "details-section" },
    { key: "features", label: t("features"), sectionId: "features-section" },
    {
      key: "virtualTour",
      label: t("virtualTour"),
      sectionId: "panoramic-section",
    },
    { key: "location", label: t("location"), sectionId: "location-section" },
    { key: "floorPlans", label: t("floorPlans"), sectionId: "plans-section" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Add offset for header

      // Find the section that is currently in view
      for (let i = menuItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(menuItems[i].sectionId);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(menuItems[i].sectionId);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount to set initial active section

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuItems]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100, // Offset to account for header height
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="flex md:flex-row flex-col w-full items-center gap-10 mb-20 md:mb-0">
      {menuItems.map((item) => (
        <p
          key={item.key}
          className={`text-sm font-medium cursor-pointer hover:border-b-2 hover:border-gray-700 transition-all duration-200 border-b-2 ${
            activeSection === item.sectionId
              ? "border-gray-700 text-gray-900"
              : "border-transparent text-gray-700"
          }`}
          onClick={() => scrollToSection(item.sectionId)}
        >
          {item.label}
        </p>
      ))}
    </div>
  );
}
