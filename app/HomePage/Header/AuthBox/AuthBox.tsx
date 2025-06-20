"use client";

import React, { useEffect, useRef, useState } from "react";
import axiosInstance, { mainWebsiteUrl } from "@/axios";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";

import AuthPopup from "@/app/components/AuthPopup/AuthPopup";
import { GoPerson } from "react-icons/go";
import { Link } from "@/app/components/nprogress";
import { MdFavoriteBorder } from "react-icons/md";
import { clearUser } from "@/app/store/userSlice";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
        w-[48px] h-[48px] flex items-center justify-center cursor-pointer
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
  setShowIsPersonalInformationFormPopup,
  hideProfileIcon = false,
  disableMapListButton,
  setDisableMapListButton,
}: {
  showLikeButton?: boolean;
  hideCreateListingButton?: boolean;
  setShowIsPersonalInformationFormPopup?: (show: boolean) => void;
  hideProfileIcon?: boolean;
  disableMapListButton?: boolean;
  setDisableMapListButton?: (isOpen: boolean) => void;
}) {
  const t = useTranslations("header");
  const [isOpen, setIsOpen] = useState(false);
  const [authState, setAuthState] = useState("login");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const guestDropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const isUserAccountCompleted =
    user?.firstName &&
    user?.lastName &&
    user?.email &&
    user.phoneNumber &&
    user.birthDate;

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdownHandler();
      }
      if (
        guestDropdownRef.current &&
        !guestDropdownRef.current.contains(event.target as Node)
      ) {
        setGuestDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent body scrolling when dropdown is open on mobile
  useEffect(() => {
    if (dropdownOpen || guestDropdownOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [dropdownOpen, guestDropdownOpen]);

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("accessToken");
    // Remove Authorization header
    delete axiosInstance.defaults.headers.common["Authorization"];
    // Clear user from Redux
    dispatch(clearUser());
    // Close dropdown
    closeDropdownHandler();

    window.location.href = "/";
  };

  const closeDropdownHandler = () => {
    setDropdownOpen(false);
    if (setDisableMapListButton) setDisableMapListButton(false);
  };

  if (user) {
    return (
      <>
        <AuthPopup
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          defaultState={authState}
        />

        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-2 cursor-pointer lg:max-w-[200px] max-w-[50px]"
            onClick={() => {
              if (!dropdownOpen === true && setDisableMapListButton) {
                console.log("Dropdown is closed, opening it now");
                setDisableMapListButton(true);
              }

              setDropdownOpen(!dropdownOpen);
            }}
          >
            {!showLikeButton && !hideCreateListingButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();

                  if (!isUserAccountCompleted) {
                    setShowIsPersonalInformationFormPopup?.(true);
                    return;
                  }

                  router.push("/admin/ilan-olustur");
                }}
                className="hidden lg:block rounded-lg px-2 py-3 transition-all duration-300 hover:bg-gray-50 text-[#5E5691] cursor-pointer font-medium text-[14px] w-[82px] h-[48px]"
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

            {!hideProfileIcon && !user.profilePicture && (
              <div className="bg-gray-100 rounded-lg flex items-center justify-center py-3 px-3 h-[48px] w-[48px]">
                <img src={"/user-profile-03.png"} className="w-6 h-6" />
              </div>
            )}

            {!hideProfileIcon && user.profilePicture && (
              <img
                src={user.profilePicture}
                className="w-[48px] h-[48px] rounded-md"
              />
            )}
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="fixed lg:absolute inset-0 lg:inset-auto lg:-right-4 lg:right-0 lg:mt-2 lg:min-w-[320px] bg-white lg:rounded-[16px] lg:shadow-lg z-50 lg:border lg:border-[#D9D9D9] flex flex-col overflow-y-auto lg:overflow-visible">
              {/* Mobile Close Button */}

              {/* Mobile Header */}
              <div className="lg:hidden px-4 pb-6 flex flex-row items-center justify-between mt-5">
                <div>
                  <p className="text-[#362C75] text-[24px] font-bold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[#A39EC0] text-[16px]">{user.email}</p>
                </div>

                <button
                  onClick={() => {
                    closeDropdownHandler();
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <img src="/popup-close-icon.png" className="w-6 h-6" />
                </button>
              </div>

              {/* Desktop Header */}
              <div className="hidden lg:flex px-4 mt-4 flex-col gap-2">
                <p className="text-[#362C75] text-[16px] font-bold leading-[14px]">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[#A39EC0] text-[14px] leading-[14px]">
                  {user.email}
                </p>
              </div>

              <div className="hidden lg:block border-b border-gray-100 my-3 lg:my-2"></div>

              <Link
                href="/account"
                onClick={() => {
                  closeDropdownHandler();
                }}
                className="px-4 py-4 lg:py-2 text-[16px] lg:text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center justify-between"
              >
                <div className="flex flex-row items-center font-medium lg:font-normal">
                  <img
                    src="/user-profile-settings-2.png"
                    className="w-[24px] h-[24px] lg:w-[20px] lg:h-[20px] mr-3 lg:mr-2 "
                  />
                  Profil Detayları
                </div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="lg:hidden"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#595959"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              {/* <Link
              href="/bildirimler"
              className=" px-4 py-2 text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center"
            >
              <img src="/bell-01.png" className="w-[20px] h-[20px] mr-2" />
              Bildirimler (3)
            </Link> */}

              {/* <Link
              href="/Mesajlar"
              className=" px-4 py-2 text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center"
            >
              <img src="/mail-01.png" className="w-[20px] h-[20px] mr-2" />
              Mesajlar (2)
            </Link> */}

              <div className="hidden lg:block border-b border-gray-100 my-3 lg:my-2"></div>

              <Link
                href="/admin/ilanlar"
                onClick={() => {
                  closeDropdownHandler();
                }}
                className="px-4 py-4 lg:py-2 text-[16px] lg:text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center justify-between"
              >
                <div className="flex flex-row items-center font-medium lg:font-normal">
                  <img
                    src="/favourite.png"
                    className="w-[24px] h-[24px] lg:w-[20px] lg:h-[20px] mr-3 lg:mr-2"
                  />
                  İlanlarım
                </div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="lg:hidden"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#595959"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                href="/favorilerim"
                onClick={() => {
                  closeDropdownHandler();
                }}
                className="px-4 py-4 lg:py-2 text-[16px] lg:text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center justify-between"
              >
                <div className="flex flex-row items-center font-medium lg:font-normal">
                  <img
                    src="/heart.png"
                    className="w-[24px] h-[24px] lg:w-[20px] lg:h-[20px] mr-3 lg:mr-2"
                  />
                  Favori ilanlar
                </div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="lg:hidden"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#595959"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                href="/favori-aramalar"
                onClick={() => {
                  closeDropdownHandler();
                }}
                className="px-4 py-4 lg:py-2 text-[16px] lg:text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center justify-between"
              >
                <div className="flex flex-row items-center font-medium lg:font-normal">
                  <img
                    src="/search-02.png"
                    className="w-[24px] h-[24px] lg:w-[20px] lg:h-[20px] mr-3 lg:mr-2"
                  />
                  Favori aramalar
                </div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="lg:hidden"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#595959"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                href="/dil-para-birimi"
                onClick={() => {
                  closeDropdownHandler();
                }}
                className="px-4 py-4 text-[16px] text-[#262626] hover:bg-gray-100 flex flex-row items-center justify-between lg:hidden"
              >
                <div className="flex flex-row items-center font-medium">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[24px] h-[24px] mr-3"
                    stroke="#262626"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  Dil & Para Birimi
                </div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="lg:hidden"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#595959"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <div className="hidden lg:block border-b border-gray-100 my-3 lg:my-2"></div>

              <Link
                href="/iletisim"
                onClick={() => {
                  closeDropdownHandler();
                }}
                className="px-4 py-4 lg:py-2 text-[16px] lg:text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center justify-between"
              >
                <div className="flex flex-row items-center font-medium lg:font-normal">
                  İletişim
                </div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="lg:hidden"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#262626"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                href="/iletisim#offices-section"
                onClick={() => {
                  closeDropdownHandler();
                }}
                className="px-4 py-4 lg:py-2 text-[16px] lg:text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center justify-between"
              >
                <div className="flex flex-row items-center font-medium lg:font-normal">
                  Gayrimenkul Ofislerimiz
                </div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="lg:hidden"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#262626"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              {user.role === "super-admin" && (
                <a
                  href={`${mainWebsiteUrl}/auth/jwt/auto-login/${localStorage.getItem(
                    "accessToken"
                  )}`}
                  target="_blank"
                  className="px-4 py-4 lg:py-2 text-[16px] lg:text-[14px] text-[#595959] hover:bg-gray-100 flex flex-row items-center justify-between"
                >
                  <span>Admin Paneli</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="lg:hidden"
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="#595959"
                      strokeWidth="2"
                      strokeLinecap="square"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              )}

              <div className="border-b border-gray-100 my-3 lg:my-2"></div>

              <Link
                href="/iletisim"
                onClick={() => {
                  closeDropdownHandler();
                }}
                className="px-4 py-4 lg:py-2 text-[14px] lg:text-[14px] font-[500] text-[#595959] hover:bg-gray-100 flex flex-row items-center"
              >
                Geri Bildirim
              </Link>

              <Link
                href="/sozlesmeler?id=sozlesmeler&itemId=bireysel"
                className="px-4 py-4 lg:py-2 text-[14px] lg:text-[14px] font-[500] text-[#595959] hover:bg-gray-100 flex flex-row items-center"
              >
                Kullanıcı Sözleşmeleri
              </Link>

              <div className="border-b border-gray-100 my-3 lg:my-2"></div>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-4 lg:py-2 text-[14px] lg:text-[14px] text-[#EF1A28] hover:bg-gray-100 cursor-pointer flex flex-row items-center justify-between mb-4"
              >
                <span>Çıkış Yap</span>
              </button>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="z-[9999]">
      <AuthPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultState={authState}
      />
      <div className="relative" ref={guestDropdownRef}>
        <div
          className="flex items-center gap-4 cursor-pointer lg:w-auto w-[50px]"
          onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
        >
          <div className="text-right hidden lg:block">
            <div className="text-sm text-black font-bold hidden lg:block">
              {t("welcome")}
            </div>
            <div className="text-sm text-gray-600">{t("login")}</div>
          </div>

          <div className="bg-gray-100 rounded-lg items-center justify-center py-3 px-3 h-[48px] w-[48px] flex lg:hidden">
            <img src={"/user-profile-03.png"} className="w-6" />
          </div>

          <div className="bg-gray-100 hidden rounded-lg lg:flex items-center justify-center py-3 px-3">
            <img src="/user-profile-03.png" className="w-6" />
          </div>
        </div>

        {/* Guest Dropdown Menu */}
        {guestDropdownOpen && (
          <div className="fixed lg:absolute inset-0 lg:inset-auto lg:-right-4 lg:right-0 lg:mt-2 lg:min-w-[320px] bg-white lg:rounded-[16px] lg:shadow-lg z-50 lg:border lg:border-[#D9D9D9] flex flex-col overflow-y-auto lg:overflow-visible">
            {/* Mobile Close Button */}
            <div className="lg:hidden px-4 pb-6 flex flex-row items-center justify-between mt-5">
              <div>
                <p className="text-[#362C75] text-[24px] font-bold">
                  Hoş Geldiniz!
                </p>
              </div>

              <button
                onClick={() => setGuestDropdownOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <img src="/popup-close-icon.png" className="w-6 h-6" />
              </button>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:flex px-4 mt-4 flex-col gap-2">
              <p className="text-[#362C75] text-[16px] font-bold leading-[14px]">
                Hoş Geldiniz!
              </p>
            </div>

            <div className="hidden lg:block border-b border-gray-100 my-3 lg:my-2"></div>

            <button
              onClick={() => {
                setGuestDropdownOpen(false);
                setAuthState("login");
                setIsOpen(true);
              }}
              className="px-4 py-4 lg:py-2 text-[16px] lg:text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center justify-between text-left"
            >
              <span className="font-medium lg:font-normal">Giriş Yap</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="lg:hidden"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="#595959"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              onClick={() => {
                setGuestDropdownOpen(false);
                setAuthState("signup");
                setIsOpen(true);
              }}
              className="px-4 py-4 lg:py-2 text-[16px] lg:text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center justify-between text-left"
            >
              <span className="font-medium lg:font-normal">Üye Ol</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="lg:hidden"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="#595959"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div
              className="border-b border-[#F5F5F5] my-3 lg:my-2"
              style={{ borderWidth: "1px" }}
            ></div>

            <Link
              onClick={() => {
                setGuestDropdownOpen(false);
                setAuthState("signup");
                setIsOpen(true);
              }}
              className="px-4 py-4 lg:py-2 text-[16px] lg:text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center justify-between cursor-pointer"
            >
              <span className="font-medium lg:font-normal">İlan Ver</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="lg:hidden"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="#595959"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <div
              className="border-b border-[#F5F5F5] my-3 lg:my-2"
              style={{ borderWidth: "1px" }}
            ></div>

            <Link
              href="/iletisim"
              onClick={() => setGuestDropdownOpen(false)}
              className="px-4 py-4 lg:py-2 text-[16px] lg:text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center justify-between"
            >
              <span className="font-medium lg:font-normal">İletişim</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="lg:hidden"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="#262626"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link
              href="/iletisim#offices-section"
              onClick={() => setGuestDropdownOpen(false)}
              className="px-4 py-4 lg:py-2 text-[16px] lg:text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center justify-between"
            >
              <span className="font-medium lg:font-normal">
                Gayrimenkul Ofislerimiz
              </span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="lg:hidden"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="#262626"
                  strokeWidth="2"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <div
              className="border-b border-[#F5F5F5] my-3 lg:my-2"
              style={{ borderWidth: "1px" }}
            ></div>

            <Link
              href="/iletisim"
              onClick={() => setGuestDropdownOpen(false)}
              className="px-4 py-4 lg:py-2 text-[14px] lg:text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center"
            >
              Geri Bildirim
            </Link>

            <Link
              href="/sozlesmeler?id=sozlesmeler&itemId=bireysel"
              onClick={() => setGuestDropdownOpen(false)}
              className="px-4 py-4 lg:py-2 text-[14px] lg:text-[14px] text-[#262626] hover:bg-gray-100 flex flex-row items-center mb-4"
            >
              Kullanıcı Sözleşmeleri
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
