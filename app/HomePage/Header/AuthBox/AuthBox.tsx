"use client";

import React, { useState, useRef, useEffect } from "react";
import { GoPerson } from "react-icons/go";
import { useTranslations } from "next-intl";
import AuthPopup from "@/app/components/AuthPopup/AuthPopup";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { clearUser } from "@/app/store/userSlice";
import axiosInstance, { mainWebsiteUrl } from "@/axios";
import { MdFavoriteBorder } from "react-icons/md";

export default function AuthBox() {
  const t = useTranslations("header");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("accessToken");
    // Remove Authorization header
    delete axiosInstance.defaults.headers.common["Authorization"];
    // Clear user from Redux
    dispatch(clearUser());
    // Close dropdown
    setDropdownOpen(false);

    window.location.href = "/";
  };

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-4 cursor-pointer max-w-[200px]"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="text-right">
            <div className="text-sm text-black font-bold">
              {user.firstName} {user.lastName}
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg flex items-center justify-center py-3 px-2">
            <GoPerson className="text-gray-600 text-2xl" />
          </div>
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1">
            <a
              href="/account"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Hesap Ayarları
            </a>

            <a
              href="/favorilerim"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <MdFavoriteBorder className="mr-2" />
              Favorilerim
            </a>

            {(user.role === "admin" || user.role === "super-admin") && (
              <a
                href="/admin/ilanlar"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                İlanlarım
              </a>
            )}

            {user.role === "super-admin" && (
              <a
                href={`${mainWebsiteUrl}/auth/jwt/auto-login/${localStorage.getItem(
                  "accessToken"
                )}`}
                target="_blank"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Admin Paneli
              </a>
            )}

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Çıkış Yap
            </button>
          </div>
        )}
      </div>
    );
  }

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
