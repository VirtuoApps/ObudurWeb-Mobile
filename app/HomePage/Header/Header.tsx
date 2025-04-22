"use client";

import React from "react";
import Image from "next/image";
import MiddleSearchBox from "./MiddleSearchBox/MiddlesearchBox";
import AuthBox from "./AuthBox/AuthBox";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations("header");

  return (
    <header className="border-b shadow-sm py-4 bg-white h-[80px]">
      <div className="container mx-auto  flex items-center justify-between">
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

        {/* Center Navigation */}
        <MiddleSearchBox />

        {/* Right Side with Auth and Language */}
        <div className="flex items-center gap-4">
          <AuthBox />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
