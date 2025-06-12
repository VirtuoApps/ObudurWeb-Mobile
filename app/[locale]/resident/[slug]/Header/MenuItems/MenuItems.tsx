"use client";

import React, { useEffect, useState } from "react";

import { useHotelData } from "../../hotelContext";
import { useTranslations } from "next-intl";

export default function MenuItems() {
  const t = useTranslations("residentMenu");
  const [activeSection, setActiveSection] = useState("images-section");

  const { hotelData, locale } = useHotelData();

  const menuItems = [
    { key: "photos", label: t("photos"), sectionId: "images-section" },
    {
      key: "descriptions",
      label: t("descriptions"),
      sectionId: "descriptions-section",
    },
    { key: "details", label: t("details"), sectionId: "details-section" },
    { key: "features", label: t("features"), sectionId: "features-section" },

    // { key: "floorPlans", label: t("floorPlans"), sectionId: "plans-section" },
  ];

  if (hotelData.hotelDetails.video) {
    menuItems.push({
      key: "virtualTour",
      label: t("virtualTour"),
      sectionId: "panoramic-section",
    });

    menuItems.push({
      key: "location",
      label: t("location"),
      sectionId: "location-section",
    });
  } else {
    menuItems.push({
      key: "location",
      label: t("location"),
      sectionId: "location-section",
    });
  }

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
    <>
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none; /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }
      `}</style>
      <div className="flex flex-row w-full items-center gap-4 md:gap-[32px] mb-5 md:mb-0 overflow-x-auto flex-nowrap px-4 md:px-0 hide-scrollbar pt-4 sm:pt-0">
        {menuItems.map((item) => (
          <div
            key={item.key}
            className={`text-sm font-medium cursor-pointer transition-all duration-200 overflow-hidden h-5 relative group whitespace-nowrap flex-shrink-0 ${
              activeSection === item.sectionId
                ? "text-[#362C75]"
                : "text-[#8C8C8C]"
            }`}
            onClick={() => scrollToSection(item.sectionId)}
          >
            {/* Normal text */}
            <p
              className={`transition-transform duration-300 ease-in-out group-hover:-translate-y-full ${
                activeSection === item.sectionId
                  ? "text-[#362C75]"
                  : "text-[#8C8C8C]"
              }`}
            >
              {item.label}
            </p>

            {/* Hover text (purple) */}
            <p className="absolute top-0 left-0 text-[#362C75] translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
