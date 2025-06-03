"use client";

import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import AuthBox from "@/app/HomePage/Header/AuthBox/AuthBox";
import Image from "next/image";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { useRouter } from "@/app/utils/router";

interface HeaderProps {
  customRedirectUrl?: string;
  showBackButton?: boolean;
  backUrl?: string;
}

export default function SimpleHeader({
  customRedirectUrl,
  showBackButton,
  backUrl,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  return (
    <header className="relative border-b border-[#f0f0f0] py-4 bg-white h-[80px] w-full px-4 md:px-0">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        {showBackButton && (
          <div
            onClick={() => router.push(backUrl || "/")}
            className="block md:hidden"
          >
            <img
              src="/left-icon.png"
              alt="oBudur Logo"
              className="w-[32px] h-[32px]"
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
            width={120}
            height={40}
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
