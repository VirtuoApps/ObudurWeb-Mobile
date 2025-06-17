"use client";

import React, { useState } from "react";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import AuthBox from "@/app/HomePage/Header/AuthBox/AuthBox";
import { FaBars } from "react-icons/fa";
import Image from "next/image";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useRouter } from "@/app/utils/router";
import { useSelector } from "react-redux";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useSelector((state: any) => state.favorites.isMobile);

  const router = useRouter();

  if (isMobile) {
    return (
      <header
        className={`border-none lg:border-solid lg:border-b lg:border-[#F0F0F0] py-0 lg:py-4 bg-white h-[72px] lg:h-[96px] w-full px-0 xl:px-0 flex sticky top-0 z-40`}
      >
        <div className="w-full flex items-center px-4 sm:px-6 gap-3">
          <div className="xl:hidden flex items-center shrink-0 w-[32px]">
            <button
              type="button"
              onClick={() => {
                // Navigate to home page
                router.push("/");
              }}
              className="bg-white hover:bg-gray-50 text-[#262626] w-[32px] h-[32px] font-semibold  inline-flex items-center justify-center gap-2 transition hover:border-[#6656AD] cursor-pointer rounded-[16px]"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          </div>
  
          <div className="xl:hidden flex items-center justify-center flex-1 min-w-0">
            <Image
              src="/obudur-logo.png"
              alt="oBudur Logo"
              width={108}
              height={24}
              priority
            />
          </div>
  
          <div className="flex items-center xl:hidden shrink-0">
            <AuthBox />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="relative border-b border-[#F0F0F0] py-4 bg-white h-[80px] w-full">
      <div className=" mx-auto flex flex-wrap items-center justify-between px-5 h-full">
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
