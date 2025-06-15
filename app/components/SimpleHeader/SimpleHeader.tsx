"use client";

import React, { useState } from "react";

import AuthBox from "@/app/HomePage/Header/AuthBox/AuthBox";
import { FaBars } from "react-icons/fa";
import Image from "next/image";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useRouter } from "@/app/utils/router";

interface HeaderProps {
  customRedirectUrl?: string;
  showBackButton?: boolean;
  backUrl?: string;
  customMaxWidth?: string;
}

export default function SimpleHeader({
  customRedirectUrl,
  showBackButton,
  backUrl,
  customMaxWidth,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  return (
        <header className="relative border-none lg:border-solid lg:border-b lg:border-[#F0F0F0] py-4 bg-white h-[72px] lg:h-[96px] w-full px-0 xl:px-0 flex">
      <div className="w-full flex items-center px-4 sm:px-6 gap-3">
        {showBackButton && (
          <div
            onClick={() => router.push(backUrl || "/")}
            className="block md:hidden shrink-0 w-[28px]"
          >
            <img
              src="/left-icon.png"
              alt="oBudur Logo"
              width={28}
              height={28}
            />
          </div>
        )}

        {/* Logo - Sabit genişlik */}
        <div
          className="flex items-center cursor-pointer flex-1 justify-center md:justify-start md:flex-initial md:shrink-0 md:w-[144px]"
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

        {/* Center Navigation - Burada search alanı olsaydı buraya gelirdi */}

        {/* Right Side Items - Sabit genişlik */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <AuthBox />
          <LanguageSwitcher />
        </div>

        {/* Mobile Right Side - Sabit genişlik */}
        <div className="md:hidden flex items-center shrink-0">
          <AuthBox />
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
