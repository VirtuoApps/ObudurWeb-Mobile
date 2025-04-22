"use client";

import React from "react";
import { GoPerson } from "react-icons/go";
import { useTranslations } from "next-intl";

export default function AuthBox() {
  const t = useTranslations("header");

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <div className="text-sm text-black font-bold">{t("login")}</div>
        <div className="text-sm text-gray-600">{t("register")}</div>
      </div>

      <div className="bg-gray-100 rounded-lg flex items-center justify-center py-3 px-2">
        <GoPerson className="text-gray-600 text-2xl" />
      </div>
    </div>
  );
}
