"use client";

import React, { useState } from "react";
import Image from "next/image";
import AuthBox from "@/app/HomePage/Header/AuthBox/AuthBox";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { FaBars } from "react-icons/fa";
import { useRouter } from "@/app/utils/router";
import SimpleHeader from "@/app/components/SimpleHeader/SimpleHeader";
import Footer from "../../resident/[slug]/Footer/Footer";

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <SimpleHeader showBackButton />

        <main className="flex-grow bg-[#FFFFFF]">{children}</main>
      </div>
      <Footer customMy="my-0" />
    </>
  );
}
