"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FaBars } from "react-icons/fa";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import AuthBox from "@/app/HomePage/Header/AuthBox/AuthBox";
import MenuItems from "./MenuItems/MenuItems";
import { useParams } from "next/navigation";
import { useRouter } from "@/app/utils/router";
import axiosInstance from "@/axios";
import { useHotelData } from "../hotelContext";

// Like Button Component
const LikeButton = ({
  isLiked = false,
  onToggle,
}: {
  isLiked?: boolean;
  onToggle?: () => void;
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    setLiked(!liked);
    onToggle?.();

    // Reset animation after it completes
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`
         rounded-lg transition-all duration-300 hover:bg-gray-100
        w-[48px] h-[48px] flex items-center justify-center cursor-pointer
        ${isAnimating ? "scale-110" : "scale-100"}
      `}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-all duration-300 ${
          isAnimating ? "animate-pulse" : ""
        }`}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.49998 2.69281C3.53982 1.65329 4.94994 1.06932 6.42027 1.06932C7.89059 1.06932 9.30072 1.65329 10.3406 2.69281L11.9652 4.31609L13.5899 2.69281C14.1014 2.16321 14.7133 1.74078 15.3898 1.45018C16.0663 1.15957 16.7939 1.00661 17.5301 1.00021C18.2664 0.993811 18.9965 1.13411 19.678 1.41291C20.3595 1.69172 20.9786 2.10345 21.4992 2.62408C22.0198 3.14471 22.4316 3.76382 22.7104 4.44527C22.9892 5.12672 23.1295 5.85688 23.1231 6.59314C23.1167 7.32939 22.9637 8.057 22.6731 8.73351C22.3825 9.41002 21.9601 10.0219 21.4305 10.5334L11.9652 20L2.49998 10.5334C1.46046 9.49354 0.876495 8.08342 0.876495 6.61309C0.876495 5.14277 1.46046 3.73264 2.49998 2.69281V2.69281Z"
          stroke="#5E5691"
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeLinejoin="round"
          fill={liked ? "#5E5691" : "none"}
          className="transition-all duration-300"
        />
      </svg>
    </button>
  );
};

export default function Header() {
  const t = useTranslations("header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const { hotelData, locale } = useHotelData();
  const hotelId = hotelData.hotelDetails._id;

  useEffect(() => {
    if (!hotelId) return;

    const viewedHotels = JSON.parse(
      localStorage.getItem("viewedHotels") || "{}"
    );

    if (!viewedHotels[hotelId]) {
      axiosInstance
        .post(`/hotels/${hotelId}/increase-view-count`)
        .then(() => {
          viewedHotels[hotelId] = true;
          localStorage.setItem("viewedHotels", JSON.stringify(viewedHotels));
        })
        .catch((error) => {
          console.error("Failed to increase view count:", error);
        });
    }
  }, [hotelId]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 bg-white h-[80px] w-full px-4 md:px-0 border-b border-[#F0F0F0] hidden md:block">
      <div className="w-full px-4 mx-auto flex flex-wrap items-center">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img
            src="/obudur-icon.png"
            alt="oBudur Logo"
            width={30}
            height={20}
          />
        </div>

        <div className="w-[1px] h-[16px] bg-[#D9D9D9] ml-12"></div>

        <div className="hidden md:block ml-12">
          <MenuItems />
        </div>

        {/* Right Side Items for Desktop */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <AuthBox showLikeButton={true} />
          <LanguageSwitcher />
        </div>

        {/* Hamburger Menu Button for Mobile */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            <FaBars className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[80px] left-0 right-0 bg-white shadow-lg z-50 p-4 border-t">
          <MenuItems />

          <div className="flex flex-row justify-between gap-4">
            <LikeButton
              isLiked={false}
              onToggle={() => {
                // Handle favorite toggle logic here
                console.log("Favorite toggled");
              }}
            />
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
