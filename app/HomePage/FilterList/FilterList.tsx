import React, { useState } from "react";
import {
  FaHotjar,
  FaKey,
  FaCar,
  FaParking,
  FaDumbbell,
  FaBath,
  FaChargingStation,
  FaFilter,
} from "react-icons/fa";
import { TbSquarePlus } from "react-icons/tb";
import {
  MdHouse,
  MdHolidayVillage,
  MdLocationCity,
  MdPool,
  MdKitchen,
} from "react-icons/md";
import { LuSettings2 } from "react-icons/lu";
import { useTranslations } from "next-intl";
import FilterPopup from "@/app/components/FilterPopup/FilterPopup";
const iconClassName = "text-xl";
const iconColor = "rgba(0,0,0,0.6)";

const filterList = [
  {
    id: 1,
    name: "Popüler",
    icon: <FaHotjar color={iconColor} className={iconClassName} />,
  },
  {
    id: 2,
    name: "Yeni",
    icon: <FaKey color={iconColor} className={iconClassName} />,
  },
  {
    id: 3,
    name: "1+1",
    icon: <TbSquarePlus color={iconColor} className={iconClassName} />,
  },
  {
    id: 4,
    name: "2+1",
    icon: <TbSquarePlus color={iconColor} className={iconClassName} />,
  },
  {
    id: 5,
    name: "3+1",
    icon: <TbSquarePlus color={iconColor} className={iconClassName} />,
  },
  {
    id: 6,
    name: "Müstakil Villa",
    icon: <MdHouse color={iconColor} className={iconClassName} />,
  },
  {
    id: 7,
    name: "İkiz Villa",
    icon: <MdHolidayVillage color={iconColor} className={iconClassName} />,
  },
  {
    id: 8,
    name: "Kapalı Otopark",
    icon: <FaCar color={iconColor} className={iconClassName} />,
  },
  {
    id: 9,
    name: "Açık Otopark",
    icon: <FaParking color={iconColor} className={iconClassName} />,
  },
  {
    id: 10,
    name: "Site İçinde",
    icon: <MdLocationCity color={iconColor} className={iconClassName} />,
  },
  {
    id: 11,
    name: "Açık Havuz",
    icon: <MdPool color={iconColor} className={iconClassName} />,
  },
  {
    id: 12,
    name: "Spor Salonu",
    icon: <FaDumbbell color={iconColor} className={iconClassName} />,
  },
  {
    id: 13,
    name: "Jakuzi",
    icon: <FaBath color={iconColor} className={iconClassName} />,
  },
  {
    id: 14,
    name: "Şarj İstasyonu",
    icon: <FaChargingStation color={iconColor} className={iconClassName} />,
  },
  {
    id: 15,
    name: "Açık Mutfak",
    icon: <MdKitchen color={iconColor} className={iconClassName} />,
  },
];

export default function FilterList() {
  const t = useTranslations("filterList");
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

  const handleFilterClick = (filterId: number) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <>
      <FilterPopup
        isOpen={isFilterPopupOpen}
        onClose={() => setIsFilterPopupOpen(false)}
      />
      <div className="bg-white flex flex-col md:flex-row items-center px-2 md:px-6 py-2 h-auto md:h-[75px]">
        <div className="flex-1 overflow-x-auto scrollbar-hide w-full md:h-[75px] no-scrollbar py-2 md:py-0">
          <div className="flex flex-row gap-2 md:gap-4 items-center justify-start md:justify-center min-w-max mt-0 md:mt-2 px-2 md:px-0">
            {filterList.map((filterItem) => (
              <div
                key={filterItem.id}
                className={`flex flex-col items-center cursor-pointer rounded-lg min-w-[65px] md:min-w-[80px] p-1 md:p-2 ${
                  selectedFilters.includes(filterItem.id)
                    ? "bg-[#5E5691] text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleFilterClick(filterItem.id)}
              >
                {selectedFilters.includes(filterItem.id)
                  ? React.cloneElement(filterItem.icon, { color: "white" })
                  : filterItem.icon}
                <p
                  className={`text-xs mt-1 font-light text-center ${
                    selectedFilters.includes(filterItem.id)
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  {filterItem.name}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-row gap-2 md:gap-4 justify-end w-full md:w-auto md:min-w-[200px] mt-2 md:mt-0 md:ml-12 items-center px-2 md:px-0">
          <button
            onClick={() => setIsFilterPopupOpen(true)}
            className="flex-1 md:flex-none flex flex-row justify-center items-center border h-[35px] border-[#5E5691] rounded-lg px-2 py-1 cursor-pointer hover:bg-[#5E5691] text-[#5E5691] hover:text-white transition-all duration-300"
          >
            <LuSettings2 className="text-xl md:text-2xl" />
            <p className="text-xs font-bold ml-1 md:ml-2">{t("allFilters")}</p>
          </button>
          <button
            className="flex-1 md:flex-none flex flex-row justify-center items-center border h-[35px] border-[#EC755D] rounded-lg px-2 py-1 cursor-pointer hover:bg-[#EC755D] text-[#EC755D] hover:text-white transition-all duration-300"
            onClick={() => setSelectedFilters([])}
          >
            <p className="text-xs font-bold">{t("clear")}</p>
          </button>
        </div>
      </div>
    </>
  );
}
