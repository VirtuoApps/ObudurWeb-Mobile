"use client";

import React, { useState } from "react";
import Image from "next/image";
import AuthBox from "@/app/HomePage/Header/AuthBox/AuthBox";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { FaBars } from "react-icons/fa";
import { useRouter } from "@/app/utils/router";

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="relative border-b shadow-sm py-4 bg-white h-[80px] w-full px-4 md:px-0">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
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

      <main className="flex-grow bg-gray-50">{children}</main>

      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4">
          <div className="flex justify-center md:justify-between items-center">
            <div className="hidden md:block">
              <Image
                src="/obudur-logo.png"
                alt="oBudur Logo"
                width={100}
                height={30}
              />
            </div>
            <p className="text-gray-600 text-sm">
              © 2025 oBudur. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
