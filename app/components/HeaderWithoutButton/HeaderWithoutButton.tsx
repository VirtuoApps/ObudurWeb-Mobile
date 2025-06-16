"use client";

import React, { useEffect, useState } from "react";

import AuthBox from "@/app/HomePage/Header/AuthBox/AuthBox";
import { FaBars } from "react-icons/fa";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useRouter } from "@/app/utils/router";
import { useTranslations } from "next-intl";

export default function HeaderWithoutButton() {
  const t = useTranslations("header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#F0F0F0] py-4 bg-white h-[96px] w-full px-4 md:px-0">
      <div className="w-full px-4 mx-auto flex items-center gap-3">
        {/* Logo - Sabit genişlik */}
        <div
          className="flex items-center cursor-pointer shrink-0 w-[30px]"
          onClick={() => router.push("/")}
        >
          <img
            src="/obudur-icon.png"
            alt="oBudur Logo"
            width={30}
            height={20}
          />
        </div>

        <div className="w-[1px] h-[16px] bg-[#D9D9D9] ml-8 shrink-0"></div>

        {/* Orta alan - search alanı buraya gelebilir */}
        <div className="flex-1 min-w-0 hidden md:block"></div>

        {/* Right Side Items - Sabit genişlik */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <AuthBox showLikeButton={false} hideCreateListingButton={true} />
          <LanguageSwitcher />
        </div>

        {/* Mobile Right Side - Sabit genişlik */}
        <div className="md:hidden flex items-center shrink-0 ml-auto">
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
          <div className="flex flex-row justify-between gap-4">
            <AuthBox />
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
