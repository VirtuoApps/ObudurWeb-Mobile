import { AppDispatch, RootState } from "@/app/store/store";
import React, { useEffect, useState } from "react";
import {
  addToFavorites,
  removeFromFavorites,
} from "@/app/store/favoritesSlice";
import { useDispatch, useSelector } from "react-redux";

import AreaIcon from "@/app/svgIcons/AreaIcon";
import AuthPopup from "@/app/components/AuthPopup/AuthPopup";
import BedIcon from "@/app/svgIcons/BedIcon";
import FloorCountIcon from "@/app/svgIcons/FloorCountIcon";
import LikeIcon from "@/app/svgIcons/likeIcon";
import { useRouter } from "@/app/utils/router";
import { useTranslations } from "next-intl";
import Bowser from "bowser";

interface MapPropertyFloatingCardProps {
  isVisible: boolean;
  onClose: () => void;
  isFavorite?: boolean;
  slug: string;
  type: string; // Satılık/Kiralık
  isOptinable?: boolean;
  residentTypeName: string;
  title: string;
  price: string;
  bedCount: string;
  floorCount: string;
  area: string;
  locationText: string;
  roomAsText: string;
  image?: string;
  images?: string[];
  hotelId: string;
  entranceType: {
    tr: string;
    en: string;
  };
  roomCount: number;
  priceAsNumber: number;
  areaAsNumber: number;
}

export default function MapPropertyFloatingCard({
  isVisible,
  onClose,
  isFavorite: propIsFavorite = false,
  slug,
  type = "Satılık",
  isOptinable = false,
  residentTypeName = "Modern Villa",
  title = "Comfortable Villa in Green",
  price = "$1,420,000",
  bedCount = "4+1",
  floorCount = "2",
  area = "240m²",
  locationText = "814 E Highland Dr, Seattle, WA 98102",
  roomAsText = "1+1",
  image = "/example-house.png",
  images = ["/example-house.png"],
  hotelId,
  entranceType,
  roomCount,
  priceAsNumber,
  areaAsNumber,
}: MapPropertyFloatingCardProps) {
  const t = useTranslations("residentBox");
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );
  const [browser, setBrowser] = useState<string | null>(null);
  const [isMobileSafari, setIsMobileSafari] = useState<boolean>(false);

  const router = useRouter();

  // Use images array if provided, otherwise create array from single image
  const imageArray = images.length > 0 ? images : [image];

  // Check if this hotel is in favorites
  const isFavorite = favorites.some((favorite) => favorite.hotelId === hotelId);

  const handleFavoriteToggle = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    // If user is not logged in, show auth popup
    if (!user) {
      setIsAuthPopupOpen(true);
      return;
    }

    try {
      if (isFavorite) {
        // Remove from favorites using Redux action
        dispatch(removeFromFavorites(hotelId));
      } else {
        // Add to favorites using Redux action
        dispatch(addToFavorites(hotelId));
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const handleCardClick = () => {
    window.open(`/resident/${slug}`, "_blank");
  };

  useEffect(() => {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const browserName = browser.getBrowserName();
    setBrowser(browserName);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Card */}
      <div
        className={`bg-white rounded-lg shadow-lg transform transition-all duration-300 ease-out z-30 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        } ${
          browser === "Safari"
            ? "fixed left-4 right-4"
            : "fixed bottom-4 left-4 right-4"
        }`}
        style={{
          height: "auto",
          minHeight: "136px",
          bottom: browser === "Safari" ? "100px" : "16px",
        }}
        onClick={handleCardClick}
      >
        {/* Content */}
        <div className="p-2">
          <div className="flex gap-[4px]">
            {/* Image */}
            <div className="relative flex-shrink-0">
              <img
                src={imageArray[0]}
                alt={title}
                className="w-[120px] h-[120px] object-cover rounded-xl"
              />

              {/* Favorite button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavoriteToggle(e);
                }}
                className="absolute top-1 left-1"
              >
                <LikeIcon
                  fill={isFavorite ? "#362C75" : "#362C75"}
                  fillOpacity={isFavorite ? "1" : "0.3"}
                />
              </button>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 p-[10px]">
              {/* Property type */}
              <div className="flex flex-row items-center justify-between">
                <p className="text-sm text-[#8C8C8C] font-normal leading-[1.4] mb-1 ">
                  {residentTypeName}
                </p>

                <p className="text-sm font-bold text-[#362C75] leading-[1.4]">
                  {price}
                </p>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-[#262626] leading-[1.4] mb-[16px] line-clamp-2 mt-1 overflow-hidden">
                {title}
              </h3>

              {/* Price */}

              {/* Features */}
              {entranceType.tr === "Konut" && (
                <div className="flex items-center gap-3 text-xs text-[#595959] font-medium leading-[1.4] text-[12px] justify-between">
                  <div className="flex items-center space-x-1">
                    <BedIcon />
                    <span>{roomAsText}</span>
                  </div>

                  <div className="w-px h-4 bg-[#D9D9D9]"></div>

                  <div className="flex items-center space-x-1">
                    <FloorCountIcon />
                    <span>{floorCount}</span>
                  </div>

                  <div className="w-px h-4 bg-[#D9D9D9]"></div>

                  <div className="flex items-center space-x-1 text-[14px]">
                    <AreaIcon />
                    <span>{area}</span>
                  </div>
                </div>
              )}

              {entranceType.tr === "İş Yeri" && (
                <div className="flex items-center gap-3 text-xs text-[#595959] font-medium leading-[1.4] text-[12px] justify-between">
                  <div className="flex items-center space-x-1">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.2 11.0909V2H2.19995V11.0909M22.2 11.0909H17.6545M22.2 11.0909V22H11.2909M11.2909 22H2.19995V11.0909M11.2909 22V20.1818M11.2909 11.0909H13.109M11.2909 11.0909H8.56359M11.2909 11.0909V15.6364M2.19995 11.0909H4.01813"
                        stroke="#595959"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{roomCount}</span>
                  </div>

                  <div className="w-px h-4 bg-[#D9D9D9]"></div>

                  <div className="flex items-center space-x-1">
                    <FloorCountIcon />
                    <span>{floorCount}</span>
                  </div>

                  <div className="w-px h-4 bg-[#D9D9D9]"></div>

                  <div className="flex items-center space-x-1 text-[14px]">
                    <AreaIcon />
                    <span>{area}</span>
                  </div>
                </div>
              )}

              {entranceType.tr === "Arsa" && (
                <div className="flex items-center gap-3 text-xs text-[#595959] font-medium leading-[1.4] text-[12px] justify-between">
                  <div className="flex items-center space-x-1">
                    <AreaIcon />
                    <span>{area}</span>
                  </div>

                  <div className="w-px h-4 bg-[#D9D9D9]"></div>

                  <div className="flex items-center space-x-1">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.6001 4H10.6001M14.6001 4H16.6001M20.6001 8V10M20.6001 14V16M16.6001 20H14.6001M10.6001 20H8.6001M4.6001 16V14M4.6001 10V8M10.4425 9.72727C10.8462 8.15888 12.2698 7 13.964 7C15.9722 7 17.6001 8.62806 17.6001 10.6364C17.6001 12.2375 16.5653 13.597 15.1281 14.0824M5.6001 20C5.6001 20.5523 5.15238 21 4.6001 21C4.04781 21 3.6001 20.5523 3.6001 20C3.6001 19.4477 4.04781 19 4.6001 19C5.15238 19 5.6001 19.4477 5.6001 20ZM5.6001 4C5.6001 4.55228 5.15238 5 4.6001 5C4.04781 5 3.6001 4.55228 3.6001 4C3.6001 3.44772 4.04781 3 4.6001 3C5.15238 3 5.6001 3.44772 5.6001 4ZM21.6001 4C21.6001 4.55228 21.1524 5 20.6001 5C20.0478 5 19.6001 4.55228 19.6001 4C19.6001 3.44772 20.0478 3 20.6001 3C21.1524 3 21.6001 3.44772 21.6001 4ZM21.6001 20C21.6001 20.5523 21.1524 21 20.6001 21C20.0478 21 19.6001 20.5523 19.6001 20C19.601 19.4477 20.0478 19 20.6001 19C21.1524 19 21.6001 19.4477 21.6001 20ZM14.8722 13.3636C14.8722 15.3719 13.2443 17 11.2362 17C9.22801 17 7.6001 15.3719 7.6001 13.3636C7.6001 11.3553 9.22801 9.72727 11.2362 9.72727C13.2443 9.72727 14.8722 11.3553 14.8722 13.3636Z"
                        stroke="#595959"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>
                      {Math.round(priceAsNumber / areaAsNumber).toLocaleString(
                        "tr-TR"
                      )}{" "}
                      ₺/m²
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Popup */}
      <AuthPopup
        isOpen={isAuthPopupOpen}
        onClose={() => setIsAuthPopupOpen(false)}
      />
    </>
  );
}
