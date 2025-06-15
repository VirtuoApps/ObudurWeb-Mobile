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
            className="w-[28px] h-[32px] md:w-[144px] md:h-[32px]"
            priority
          />
        </div>

        {/* Center Navigation - Hidden on mobile, shown on md and larger */}

        {/* Right Side Items for Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <AuthBox />
          <LanguageSwitcher />
        </div>

        {/* Hamburger Menu Button for Mobile */}
        <div className="md:hidden flex items-center">
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
