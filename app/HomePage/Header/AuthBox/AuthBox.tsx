"use client";

import React, { useState } from "react";
import { GoPerson } from "react-icons/go";
import { useTranslations } from "next-intl";
import AuthPopup from "@/app/components/AuthPopup/AuthPopup";

export default function AuthBox() {
  const t = useTranslations("header");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AuthPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="text-right">
          <div className="text-sm text-black font-bold">{t("welcome")}</div>
          <div className="text-sm text-gray-600">{t("login")}</div>
        </div>

        <div className="bg-gray-100 rounded-lg flex items-center justify-center py-3 px-2">
          <GoPerson className="text-gray-600 text-2xl" />
        </div>
      </div>
    </>
  );
}
