import React from "react";
import Image from "next/image";
import MiddleSearchBox from "./MiddleSearchBox/MiddlesearchBox";
import AuthBox from "./AuthBox/AuthBox";

export default function Header() {
  return (
    <header className="border-b shadow-sm py-4 bg-white h-[80px]">
      <div className="container mx-auto px-4 flex items-center justify-between">
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

        {/* Right Side */}
        <AuthBox />
      </div>
    </header>
  );
}
