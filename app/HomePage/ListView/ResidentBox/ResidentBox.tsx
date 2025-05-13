import React, { useState } from "react";
import {
  MapPinIcon,
  HomeIcon,
  ArrowsPointingOutIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import { MdFavoriteBorder } from "react-icons/md";
import { MdOutlineFavorite } from "react-icons/md";
import LikeIcon from "@/app/svgIcons/likeIcon";
import BedIcon from "@/app/svgIcons/BedIcon";
import FloorCountIcon from "@/app/svgIcons/FloorCountIcon";
import AreaIcon from "@/app/svgIcons/AreaIcon";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
interface ResidentBoxProps {
  isFavorite?: boolean;
  type: string; // Satılık/Kiralık
  isOptinable?: boolean;
  residentTypeName: string;
  title: string;
  price: string;
  bedCount: string;
  floorCount: string;
  area: string;
  locationText: string;
  image?: string;
}

export default function ResidentBox({
  isFavorite: propIsFavorite = false,
  type = "Satılık",
  isOptinable = false,
  residentTypeName = "Modern Villa",
  title = "Comfortable Villa in Green",
  price = "$1,420,000",
  bedCount = "4+1",
  floorCount = "2",
  area = "240m²",
  locationText = "814 E Highland Dr, Seattle, WA 98102",
  image = "/example-house.png",
}: ResidentBoxProps) {
  const t = useTranslations("residentBox");
  const [localIsFavorite, setLocalIsFavorite] = useState(propIsFavorite);

  const router = useRouter();

  const handleFavoriteToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLocalIsFavorite(!localIsFavorite);
  };

  return (
    <div
      className="w-full overflow-hidden bg-white rounded-xl hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => router.push(`/resident/${title}`)}
    >
      {/* Image container with badges */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover rounded-lg"
        />

        {/* Sale badge */}
        <div className="absolute top-3 left-3 flex flex-row items-center">
          <div className=" bg-white border border-gray-200 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-lg">
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
            fill={localIsFavorite ? "#362C75" : "#362C75"}
            fillOpacity={localIsFavorite ? "1" : "0.2"}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Property type */}
        <p className="text-xs text-gray-500 font-medium mb-1">
          {residentTypeName}
        </p>

        <div className="flex flex-row items-center justify-between mb-4">
          {/* Title */}
          <h3 className="text-base font-bold text-gray-800 ">{title}</h3>

          {/* Price */}
          <p className="text-sm font-bold text-[#362C75]">{price}</p>
        </div>

        {/* Features */}
        <div className="flex justify-between items-center mb-4 text-sm text-gray-800 font-semibold">
          <div className="flex items-center space-x-1">
            <BedIcon />
            <span>{bedCount}</span>
          </div>

          <div className="flex items-center space-x-1">
            <FloorCountIcon />
            <span>{floorCount}</span>
          </div>

          <div className="flex items-center space-x-1">
            <AreaIcon />
            <span>{area}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start space-x-1 text-xs text-gray-500">
          <MapPinIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{locationText}</span>
        </div>
      </div>
    </div>
  );
}
