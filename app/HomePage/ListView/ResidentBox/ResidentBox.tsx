import React, { useState, useEffect } from "react";
import {
  MapPinIcon,
  HomeIcon,
  ArrowsPointingOutIcon,
  BuildingOffice2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { MdFavoriteBorder } from "react-icons/md";
import { MdOutlineFavorite } from "react-icons/md";
import LikeIcon from "@/app/svgIcons/likeIcon";
import BedIcon from "@/app/svgIcons/BedIcon";
import FloorCountIcon from "@/app/svgIcons/FloorCountIcon";
import AreaIcon from "@/app/svgIcons/AreaIcon";
import { useTranslations } from "next-intl";
import { useRouter } from "@/app/utils/router";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import AuthPopup from "@/app/components/AuthPopup/AuthPopup";
import {
  addToFavorites,
  removeFromFavorites,
} from "@/app/store/favoritesSlice";

interface ResidentBoxProps {
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
  hotelId: string; // Add hotelId for API calls
  isListView?: boolean;
}

export default function ResidentBox({
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
  isListView = false,
}: ResidentBoxProps) {
  const t = useTranslations("residentBox");
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );

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

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageArray.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageArray.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <div
        className="w-full overflow-hidden bg-white rounded-2xl  transition-shadow duration-300 cursor-pointer border-[9px] border-white"
        onClick={() => router.push(`/resident/${slug}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image container with badges */}
        <div className="relative">
          <img
            src={imageArray[currentImageIndex]}
            alt={title}
            className="w-full h-48 object-cover rounded-lg"
          />

          {/* Navigation buttons */}
          {imageArray.length > 1 && (
            <div
              className={`absolute bottom-2 left-2 flex space-x-2 transition-all duration-300 ease-in-out ${
                isHovered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <button
                onClick={handlePrevImage}
                className="bg-white bg-opacity-50 hover:bg-opacity-70 text-white rounded-lg p-2 transition-all cursor-pointer"
              >
                <ChevronLeftIcon className="w-4 h-4 text-gray-800" />
              </button>
              <button
                onClick={handleNextImage}
                className="bg-white bg-opacity-50 hover:bg-opacity-70 text-white rounded-lg p-2 transition-all cursor-pointer"
              >
                <ChevronRightIcon className="w-4 h-4 text-gray-800" />
              </button>
            </div>
          )}

          {/* Sale badge */}
          <div className="absolute top-3 left-3 flex flex-row items-center">
            <div
              className={`bg-white border border-[#D9D9D9] ${
                type === "Kiralık" || type === "For Rent"
                  ? "text-[#00A9DC]"
                  : "text-[#5E5691]"
              }  text-xs font-semibold px-3 py-1 rounded-lg`}
            >
              {type}
            </div>
            {isOptinable && (
              <div className=" bg-[#EC755D] border border-[#EC755D] text-white ml-2 text-xs font-semibold px-3 py-1 rounded-lg">
                {t("optinable")}
              </div>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-0 right-0 p-1.5  rounded-full cursor-pointer"
          >
            <LikeIcon
              fill={isFavorite ? "#362C75" : "#362C75"}
              fillOpacity={isFavorite ? "1" : "0.2"}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Property type */}
          <p className="text-base text-[#8C8C8C] font-medium">
            {residentTypeName}
          </p>

          <div className="flex flex-row items-center justify-between mb-4">
            {/* Title */}
            <h3 className="text-base font-bold text-[#262626] ">{title}</h3>

            {/* Price */}
            <p className="text-base font-bold text-[#362C75]">{price}</p>
          </div>

          {/* Features */}
          <div className="flex justify-between items-center mb-4 text-sm text-[#595959] font-semibold">
            <div className="flex items-center space-x-1">
              <BedIcon />
              <span>{roomAsText}</span>
            </div>

            <div className="w-[1px] h-[20px] bg-[#D9D9D9]"></div>

            <div className="flex items-center space-x-1">
              <FloorCountIcon />
              <span>{floorCount}</span>
            </div>
            <div className="w-[1px] h-[20px] bg-[#D9D9D9]"></div>

            <div className="flex items-center space-x-1">
              <AreaIcon />
              <span>{area}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start space-x-1 text-[14px] text-[#8C8C8C]">
            <img
              src="/marker-02_(3).png"
              className={`w-[16px] h-[16px] mr-1 ${
                isListView ? "translate-y-1" : ""
              }`}
            />
            <span>{locationText}</span>
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
