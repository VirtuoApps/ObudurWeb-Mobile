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
  const isMobile = useSelector((state: any) => state.favorites.isMobile);

  const router = useRouter();

  return (
    <header
      className={`relative border-none lg:border-solid lg:border-b lg:border-[#F0F0F0] py-0 lg:py-4 bg-white h-[72px] lg:h-[96px] w-full px-0 xl:px-0 flex ${
        isMobile ? "sticky top-0 z-40" : ""
      }`}
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
