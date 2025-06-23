"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useHotelData } from "../../hotelContext";

export default function MenuItems() {
  const t = useTranslations("residentMenu");
  const [activeSection, setActiveSection] = useState("images-section");

  const { hotelData, locale } = useHotelData();

  // useMemo ile menuItems'ı optimize et
  const menuItems = useMemo(() => {
    const items = [
      { key: "photos", label: t("photos"), sectionId: "images-section" },
      {
        key: "descriptions",
        label: t("descriptions"),
        sectionId: "descriptions-section",
      },
      { key: "details", label: t("details"), sectionId: "details-section" },
      { key: "features", label: t("features"), sectionId: "features-section" },
    ];

    // Video varsa virtual tour ekle
    if (hotelData.hotelDetails.video) {
      items.push({
        key: "virtualTour",
        label: t("virtualTour"),
        sectionId: "panoramic-section",
      });
    }

    // Location ekle
    items.push({
      key: "location",
      label: t("location"),
      sectionId: "location-section",
    });

    // Floor plans en sonda
    items.push({
      key: "floorPlans",
      label: t("floorPlans"),
      sectionId: "plans-section",
    });

    return items;
  }, [hotelData.hotelDetails.video, t]);

  // Refs to each menu item for horizontal scrolling
  const menuRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Increased offset for better detection
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if we're near the bottom of the page (within 200px) - more generous
      if (scrollPosition + windowHeight >= documentHeight - 200) {
        setActiveSection(menuItems[menuItems.length - 1].sectionId);
        return;
      }

      // Find the section that is currently in view with better logic
      let closestSection = null;
      let closestDistance = Infinity;

      for (let i = 0; i < menuItems.length; i++) {
        const section = document.getElementById(menuItems[i].sectionId);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          const sectionCenter = sectionTop + sectionHeight / 2;

          // Calculate distance from current scroll position to section center
          const distance = Math.abs(scrollPosition - sectionCenter);

          // If this section is visible in viewport
          if (
            sectionTop <= scrollPosition + windowHeight &&
            sectionTop + sectionHeight >= scrollPosition
          ) {
            if (distance < closestDistance) {
              closestDistance = distance;
              closestSection = menuItems[i].sectionId;
            }
          }
        }
      }

      // If we found a section in viewport, use it
      if (closestSection) {
        setActiveSection(closestSection);
        return;
      }

      // Fallback: use traditional logic with adjusted thresholds
      for (let i = menuItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(menuItems[i].sectionId);
        if (section) {
          // More generous threshold for last section
          const threshold = i === menuItems.length - 1 ? 300 : 50;
          if (section.offsetTop <= scrollPosition + threshold) {
            setActiveSection(menuItems[i].sectionId);
            break;
          }
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

  // Automatically scroll the horizontal menu to keep the active item in view
  useEffect(() => {
    const index = menuItems.findIndex(
      (item) => item.sectionId === activeSection
    );
    const target = menuRefs.current[index];
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeSection, menuItems]);

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
      <div className="flex flex-row w-full items-center justify-start md:justify-center xl:justify-start gap-4 md:gap-10 mb-5 xl:mb-0 overflow-x-auto flex-nowrap px-4 md:px-0 hide-scrollbar pt-4 xl:pt-0">
        {menuItems.map((item, index) => (
          <div
            key={item.key}
            ref={(el) => {
              menuRefs.current[index] = el;
            }}
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
