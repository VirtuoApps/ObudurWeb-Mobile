"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { FaBars } from "react-icons/fa";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import AuthBox from "@/app/HomePage/Header/AuthBox/AuthBox";
import MenuItems from "./MenuItems/MenuItems";
import { useRouter } from "next/navigation";

export default function Header() {
  const t = useTranslations("header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b shadow-sm py-4 bg-white h-[80px] w-full px-4 md:px-0">
      <div className="w-full px-4 mx-auto flex flex-wrap items-center justify-between">
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

        <div className="hidden md:block">
          <MenuItems />
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
          <MenuItems />

          <div className="flex flex-row justify-between gap-4">
            <AuthBox />
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
