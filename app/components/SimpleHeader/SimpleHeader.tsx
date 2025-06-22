"use client";

import React, { useState } from "react";

import AuthBox from "@/app/HomePage/Header/AuthBox/AuthBox";
import { FaBars } from "react-icons/fa";
import Image from "next/image";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useRouter } from "@/app/utils/router";

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

interface HeaderProps {
  customRedirectUrl?: string;
  showBackButton?: boolean;
  backUrl?: string;
  customMaxWidth?: string;
  showFavoriteButton?: boolean;
}

export default function SimpleHeader({
  customRedirectUrl,
  showBackButton,
  backUrl,
  customMaxWidth,
  showFavoriteButton = false,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  return (
    <header className="relative border-none lg:border-solid lg:border-b lg:border-[#F0F0F0] py-4 bg-white h-[72px] lg:h-[96px] w-full px-0 xl:px-0 flex">
      <div className="w-full flex flex-wrap items-center justify-between px-4 sm:px-6">
        {showBackButton && (
          <div
            onClick={() => router.push(backUrl || "/")}
            className="block md:hidden"
          >
            <img
              src="/left-icon.png"
              alt="oBudur Logo"
              width={28}
              height={28}
            />
          </div>
        )}

        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/obudur-logo.png"
            alt="oBudur Logo"
            width={144}
            height={32}
            priority
          />
        </div>

        {/* Center Navigation - Hidden on mobile, shown on md and larger */}

        {/* Right Side Items for Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          <AuthBox isSimpleHeader={true} />
          <LanguageSwitcher />
        </div>

        {/* Mobile Right Side Items */}
        <div className="lg:hidden flex items-center">
          {showFavoriteButton ? (
            <LikeButton
              isLiked={false}
              onToggle={() => {
                // Handle favorite toggle logic here
                console.log("Favorite toggled");
              }}
            />
          ) : (
            <AuthBox />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[80px] left-0 right-0 bg-white shadow-lg z-50 p-4 border-t">
          <div className="flex flex-row justify-between gap-4">
            <AuthBox />
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
