"use client";

import React, { useState, useRef, useEffect } from "react";
import { GoPerson } from "react-icons/go";
import { useTranslations } from "next-intl";
import AuthPopup from "@/app/components/AuthPopup/AuthPopup";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { clearUser } from "@/app/store/userSlice";
import axiosInstance, { mainWebsiteUrl } from "@/axios";
import { MdFavoriteBorder } from "react-icons/md";
import { Link } from "@/app/components/nprogress";
import { useRouter } from "next/navigation";

// Like Button Component
const LikeButton = ({
  isLiked = false,
  onToggle,
}: {
  isLiked?: boolean;
  onToggle?: () => void;
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    setLiked(!liked);
    onToggle?.();

    // Reset animation after it completes
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`
         rounded-lg transition-all duration-300 hover:bg-gray-100
        w-[48px] h-[48px] flex items-center justify-center
        ${isAnimating ? "scale-110" : "scale-100"}
      `}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-all duration-300 ${
          isAnimating ? "animate-pulse" : ""
        }`}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.49998 2.69281C3.53982 1.65329 4.94994 1.06932 6.42027 1.06932C7.89059 1.06932 9.30072 1.65329 10.3406 2.69281L11.9652 4.31609L13.5899 2.69281C14.1014 2.16321 14.7133 1.74078 15.3898 1.45018C16.0663 1.15957 16.7939 1.00661 17.5301 1.00021C18.2664 0.993811 18.9965 1.13411 19.678 1.41291C20.3595 1.69172 20.9786 2.10345 21.4992 2.62408C22.0198 3.14471 22.4316 3.76382 22.7104 4.44527C22.9892 5.12672 23.1295 5.85688 23.1231 6.59314C23.1167 7.32939 22.9637 8.057 22.6731 8.73351C22.3825 9.41002 21.9601 10.0219 21.4305 10.5334L11.9652 20L2.49998 10.5334C1.46046 9.49354 0.876495 8.08342 0.876495 6.61309C0.876495 5.14277 1.46046 3.73264 2.49998 2.69281V2.69281Z"
          stroke="#5E5691"
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeLinejoin="round"
          fill={liked ? "#5E5691" : "none"}
          className="transition-all duration-300"
        />
      </svg>
    </button>
  );
};

export default function AuthBox({
  showLikeButton = false,
  hideCreateListingButton = false,
}: {
  showLikeButton?: boolean;
  hideCreateListingButton?: boolean;
}) {
  const t = useTranslations("header");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

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
          {user.role !== "admin" && user.role !== "super-admin" && (
            <div className="text-right">
              <div className="text-sm text-black font-bold">
                {user.firstName} {user.lastName}
              </div>
            </div>
          )}

          {(user.role === "admin" || user.role === "super-admin") &&
            !showLikeButton &&
            !hideCreateListingButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/admin/ilan-olustur");
                }}
                className="border border-[#D9D9D9] rounded-lg px-4 py-2 transition-all duration-300 hover:bg-[#362C75] hover:text-white text-[#5E5691] cursor-pointer"
              >
                <p className="">{t("postListing")}</p>
              </button>
            )}

          {showLikeButton && (
            <LikeButton
              isLiked={false}
              onToggle={() => {
                // Handle favorite toggle logic here
                console.log("Favorite toggled");
              }}
            />
          )}

          <div className="bg-gray-100 rounded-lg flex items-center justify-center py-3 px-3">
            <img src="/user-profile-03.png" className="w-6" />
          </div>
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute -right-4 mt-2 min-w-[320px]   bg-white rounded-[16px] shadow-lg z-50 py-1">
            <div className="px-4  border-b border-gray-100 pb-3">
              <p className="text-[#362C75] text-[16px] font-bold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[#A39EC0] text-[14px]">{user.email}</p>
            </div>

            <Link
              href="/account"
              className=" px-4 py-2 text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center"
            >
              <img
                src="/user-profile-settings-2.png"
                className="w-[20px] h-[20px] mr-2"
              />
              Profil Detayları
            </Link>

            <Link
              href="/bildirimler"
              className=" px-4 py-2 text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center"
            >
              <img src="/bell-01.png" className="w-[20px] h-[20px] mr-2" />
              Bildirimler (3)
            </Link>

            <Link
              href="/Mesajlar"
              className=" px-4 py-2 text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center"
            >
              <img src="/mail-01.png" className="w-[20px] h-[20px] mr-2" />
              Mesajlar (2)
            </Link>

            <div className="border-b border-gray-100 my-2"></div>

            {(user.role === "admin" || user.role === "super-admin") && (
              <Link
                href="/admin/ilanlar"
                className=" px-4 py-2 text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center"
              >
                <img src="/favourite.png" className="w-[20px] h-[20px] mr-2" />
                İlanlarım
              </Link>
            )}

            <Link
              href="/favorilerim"
              className=" px-4 py-2 text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center"
            >
              <img src="/heart.png" className="w-[20px] h-[20px] mr-2" />
              Favori ilanlar
            </Link>

            <Link
              href="/favori-aramalar"
              className=" px-4 py-2 text-[14px] text-[#262626]  hover:bg-gray-100 flex flex-row items-center"
            >
              <img src="/search-02.png" className="w-[20px] h-[20px] mr-2" />
              Favori aramalar
            </Link>

            <div className="border-b border-gray-100 my-2"></div>

            <Link
              href="/iletisim-kanallari"
              className=" px-4 py-2 text-[14px] text-[#595959]  hover:bg-gray-100 flex flex-row items-center"
            >
              İletişim Kanalları
            </Link>

            <Link
              href="/gayrimenkul-ofisleri"
              className=" px-4 py-2 text-[14px] text-[#595959]  hover:bg-gray-100 flex flex-row items-center"
            >
              Gayrimenkul Ofislerimiz
            </Link>

            {user.role === "super-admin" && (
              <a
                href={`${mainWebsiteUrl}/auth/jwt/auto-login/${localStorage.getItem(
                  "accessToken"
                )}`}
                target="_blank"
                className=" px-4 py-2 text-[14px] text-[#595959]  hover:bg-gray-100 flex flex-row items-center"
              >
                Admin Paneli
              </a>
            )}

            <div className="border-b border-gray-100 my-2"></div>

            <Link
              href="/geri-bildirim"
              className=" px-4 py-2 text-[12px] font-[500] text-[#595959]  hover:bg-gray-100 flex flex-row items-center"
            >
              Geri Bildirim
            </Link>

            <Link
              href="/kullanici-sozlesmeleri"
              className=" px-4 py-2 text-[12px] font-[500] text-[#595959]  hover:bg-gray-100 flex flex-row items-center"
            >
              Kullanıcı Sözleşmeleri
            </Link>

            <div className="border-b border-gray-100 my-2"></div>

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-[12px] text-[#EF1A28] hover:bg-gray-100 cursor-pointer"
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

        <div className="bg-gray-100 rounded-lg flex items-center justify-center py-3 px-3">
          <img src="/user-profile-03.png" className="w-6" />
        </div>
      </div>
    </>
  );
}
