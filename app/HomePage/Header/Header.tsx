"use client";

import React, { useState } from "react";
import Image from "next/image";
import MiddleSearchBox from "./MiddleSearchBox/MiddlesearchBox";
import AuthBox from "./AuthBox/AuthBox";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { FaBars } from "react-icons/fa";

export default function Header() {
  const t = useTranslations("header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative border-b shadow-sm py-4 bg-white h-[80px] w-full px-4 md:px-0">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/obudur-logo.png"
            alt="oBudur Logo"
            width={120}
            height={40}
            priority
          />
        </div>

        {/* Center Navigation - Hidden on mobile, shown on md and larger */}
        <div className="hidden md:flex md:flex-1 md:justify-center md:px-4 lg:px-8">
          <MiddleSearchBox />
        </div>

        {/* Right Side Items for Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <AuthBox />
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
          <div className="mb-4">
            <MiddleSearchBox isMobileMenu={true} />
          </div>
          <div className="flex flex-row justify-between gap-4">
            <AuthBox />
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
