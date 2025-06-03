"use client";

import React, { useState } from "react";
import Image from "next/image";
import AuthBox from "@/app/HomePage/Header/AuthBox/AuthBox";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { FaBars } from "react-icons/fa";
import { useRouter } from "@/app/utils/router";
import SimpleHeader from "@/app/components/SimpleHeader/SimpleHeader";

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader showBackButton />

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
