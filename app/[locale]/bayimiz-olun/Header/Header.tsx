"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { FaBars } from "react-icons/fa";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import AuthBox from "@/app/HomePage/Header/AuthBox/AuthBox";
import { useRouter } from "@/app/utils/router";

export default function Header() {
  const t = useTranslations("header");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#F0F0F0] py-4 bg-white h-[80px] w-full px-4 md:px-0">
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
            className="w-[28px] h-[32px] md:w-[30px] md:h-[20px]"
          />
        </div>

        <div className="w-[1px] h-[16px] bg-[#D9D9D9] ml-12"></div>

        <div className="hidden md:block ml-12"></div>

        {/* Right Side Items for Desktop */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <AuthBox showLikeButton={false} hideCreateListingButton={true} />
          <LanguageSwitcher />
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
