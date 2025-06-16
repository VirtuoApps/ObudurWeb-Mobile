"use client";

import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import AuthBox from "@/app/HomePage/Header/AuthBox/AuthBox";
import Image from "next/image";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { useRouter } from "@/app/utils/router";

interface HeaderProps {
  customRedirectUrl?: string;
}

export default function Header({ customRedirectUrl }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  return (
    <header className="relative border-b border-[#F0F0F0] py-4 bg-white h-[80px] w-full px-4 md:px-0">
      <div className=" mx-auto flex flex-wrap items-center justify-between px-5">
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
            className="w-[28px] h-[32px] md:w-[120px] md:h-[40px]"
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
