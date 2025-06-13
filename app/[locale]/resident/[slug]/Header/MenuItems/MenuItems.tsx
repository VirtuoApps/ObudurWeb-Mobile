"use client";

import React, { useEffect, useRef, useState } from "react";

import { useHotelData } from "../../hotelContext";
import { useTranslations } from "next-intl";

export default function MenuItems() {
  const t = useTranslations("residentMenu");
  const [activeSection, setActiveSection] = useState("images-section");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  menuItems.push({
    key: "floorPlans",
    label: t("floorPlans"),
    sectionId: "plans-section",
  });

  useEffect(() => {
    const handleScroll = () => {
      // Adjusted scroll position to be closer to the top of the viewport
      const scrollPosition = window.scrollY + 150;

      // Find the section that is currently in view
      for (let i = menuItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(menuItems[i].sectionId);
        if (section && section.offsetTop <= scrollPosition) {
          const newActiveSection = menuItems[i].sectionId;
          setActiveSection(newActiveSection);
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

  useEffect(() => {
    const activeIndex = menuItems.findIndex(
      (item) => item.sectionId === activeSection
    );
    if (activeIndex !== -1 && itemRefs.current[activeIndex]) {
      const isLast = activeIndex === menuItems.length - 1;
      itemRefs.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: isLast ? "end" : "center",
      });
    }
  }, [activeSection, menuItems]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 120, // Adjust this value to account for the sticky header height
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
      <div
        ref={scrollContainerRef}
        className="flex flex-row w-full items-center gap-4 md:gap-[32px] mb-5 md:mb-0 overflow-x-auto flex-nowrap px-4 md:px-0 hide-scrollbar pt-4 sm:pt-0 border-b border-gray-200"
      >
        {menuItems.map((item, index) => (
          <div
            key={item.key}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={`text-sm font-medium cursor-pointer transition-all duration-200 whitespace-nowrap flex-shrink-0 py-2 ${
              activeSection === item.sectionId
                ? "text-[#4F46E5] border-b-2 border-[#4F46E5]"
                : "text-gray-500"
            }`}
            onClick={() => scrollToSection(item.sectionId)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </>
  );
}
