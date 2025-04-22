"use client";

import React, { useEffect, useState } from "react";
import {
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { RiWifiFill } from "react-icons/ri";
import { AiFillSafetyCertificate, AiOutlineFire } from "react-icons/ai";
import { BsTv, BsFillHouseFill } from "react-icons/bs";
import { ImSpoonKnife } from "react-icons/im";
import { FaTemperatureHigh, FaWarehouse } from "react-icons/fa";
import { GiWashingMachine, GiClothes } from "react-icons/gi";
import { MdKitchen, MdWindow, MdFireplace } from "react-icons/md";
import { TbAirConditioning } from "react-icons/tb";
import { currencyOptions } from "../LanguageSwitcher";
import { useTranslations } from "next-intl";

type FilterPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function FilterPopup({ isOpen, onClose }: FilterPopupProps) {
  const t = useTranslations("filter");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [minArea, setMinArea] = useState<number | "">("");
  const [maxArea, setMaxArea] = useState<number | "">("");
  const [roomCount, setRoomCount] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [currencyCode, setCurrencyCode] = useState("₺");

  const incrementValue = (
    setValue: React.Dispatch<React.SetStateAction<number | "">>,
    currentValue: number | ""
  ) => {
    setValue(currentValue === "" ? 1 : Number(currentValue) + 1);
  };

  const decrementValue = (
    setValue: React.Dispatch<React.SetStateAction<number | "">>,
    currentValue: number | ""
  ) => {
    if (currentValue === "" || Number(currentValue) <= 0) return;
    setValue(Number(currentValue) - 1);
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const resetFeatures = () => {
    setSelectedFeatures([]);
  };

  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    console.log({
      savedCurrency,
    });
    if (savedCurrency) {
      const currency = currencyOptions.find(
        (option) => option.code === savedCurrency
      );
      setCurrencyCode(currency?.symbol || "₺");
    }
  }, []);

  if (!isOpen) return null;

  const features = [
    {
      key: "cableTV",
      icon: <BsTv className="mr-1 text-[#7872A3]" />,
    },
    {
      key: "wifi",
      icon: <RiWifiFill className="mr-1 text-[#7872A3]" />,
    },
    {
      key: "alarm",
      icon: <AiFillSafetyCertificate className="mr-1 text-[#7872A3]" />,
    },
    {
      key: "doubleGlazed",
      icon: <MdWindow className="mr-1 text-[#7872A3]" />,
    },
    {
      key: "smartHome",
      icon: <BsFillHouseFill className="mr-1 text-[#7872A3]" />,
    },
    {
      key: "microwave",
      icon: <ImSpoonKnife className="mr-1 text-[#7872A3]" />,
    },
    {
      key: "combi",
      icon: <FaTemperatureHigh className="mr-1 text-[#7872A3]" />,
    },
    {
      key: "fireplace",
      icon: <AiOutlineFire className="mr-1 text-[#7872A3]" />,
    },
    {
      key: "builtInAppliances",
      icon: <MdKitchen className="mr-1 text-[#7872A3]" />,
    },
    {
      key: "airConditioning",
      icon: <TbAirConditioning className="mr-1 text-[#7872A3]" />,
    },
    {
      key: "storage",
      icon: <FaWarehouse className="mr-1 text-[#7872A3]" />,
    },
    {
      key: "laundryRoom",
      icon: <GiWashingMachine className="mr-1 text-[#7872A3]" />,
    },
    {
      key: "dressingRoom",
      icon: <GiClothes className="mr-1 text-[#7872A3]" />,
    },
    {
      key: "fireAlarm",
      icon: <MdFireplace className="mr-1 text-[#7872A3]" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0"
        onClick={onClose}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-700">{t("title")}</h2>
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Price Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              {t("priceLabel")} ({currencyCode})
            </h3>
            <button
              className="text-sm text-purple-600 hover:underline cursor-pointer"
              onClick={() => {
                setMinPrice("");
                setMaxPrice("");
              }}
            >
              {t("reset")}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="relative flex items-center">
              <input
                value={minPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || !isNaN(Number(value))) {
                    setMinPrice(value === "" ? "" : Number(value));
                  }
                }}
                placeholder={t("minValue")}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="absolute right-2 flex flex-col">
                <button
                  onClick={() => incrementValue(setMinPrice, minPrice)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronUpIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => decrementValue(setMinPrice, minPrice)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="relative flex items-center">
              <input
                value={maxPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || !isNaN(Number(value))) {
                    setMaxPrice(value === "" ? "" : Number(value));
                  }
                }}
                placeholder={t("maxValue")}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="absolute right-2 flex flex-col">
                <button
                  onClick={() => incrementValue(setMaxPrice, maxPrice)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronUpIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => decrementValue(setMaxPrice, maxPrice)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              {t("rooms")}
            </h3>
            <button
              className="text-sm text-purple-600 hover:underline cursor-pointer"
              onClick={() => setRoomCount("")}
            >
              {t("reset")}
            </button>
          </div>
          <select
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mt-3 r"
            value={roomCount}
            onChange={(e) => setRoomCount(e.target.value)}
          >
            <option value="">{t("roomsSelect")}</option>
            <option value="1+0">1+0</option>
            <option value="1+1">1+1</option>
            <option value="2+1">2+1</option>
            <option value="3+1">3+1</option>
            <option value="4+1">4+1</option>
            <option value="5+1">5+1 {t("roomsAndMore")}</option>
          </select>
        </div>

        {/* Area Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">{t("area")}</h3>
            <button
              className="text-sm text-purple-600 hover:underline cursor-pointer"
              onClick={() => {
                setMinArea("");
                setMaxArea("");
              }}
            >
              {t("reset")}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="relative flex items-center">
              <input
                value={minArea}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || !isNaN(Number(value))) {
                    setMinArea(value === "" ? "" : Number(value));
                  }
                }}
                placeholder={t("minValue")}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="absolute right-2 flex flex-col">
                <button
                  onClick={() => incrementValue(setMinArea, minArea)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronUpIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => decrementValue(setMinArea, minArea)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="relative flex items-center">
              <input
                value={maxArea}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || !isNaN(Number(value))) {
                    setMaxArea(value === "" ? "" : Number(value));
                  }
                }}
                placeholder={t("maxValue")}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="absolute right-2 flex flex-col">
                <button
                  onClick={() => incrementValue(setMaxArea, maxArea)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronUpIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => decrementValue(setMaxArea, maxArea)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Interior Features Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              {t("interiorFeatures")}
            </h3>
            <button
              className="text-sm text-purple-600 hover:underline cursor-pointer"
              onClick={resetFeatures}
            >
              {t("reset")}
            </button>
          </div>
          <div className="mt-3 overflow-y-auto max-h-48">
            <div className="flex flex-wrap gap-2 ">
              {features.map((feature) => (
                <button
                  key={feature.key}
                  onClick={() => toggleFeature(t(`features.${feature.key}`))}
                  className={`inline-flex items-center ${
                    selectedFeatures.includes(t(`features.${feature.key}`))
                      ? "bg-purple-100 border-purple-300 text-purple-700"
                      : "bg-white border-gray-100 text-gray-600"
                  } border rounded-full px-3 py-1 text-xs font-medium  cursor-pointer`}
                >
                  {feature.icon}
                  {t(`features.${feature.key}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            className="w-full py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
              setMinArea("");
              setMaxArea("");
              setRoomCount("");
              setSelectedFeatures([]);
            }}
          >
            {t("clearAll")}
          </button>
          <button className="w-full py-3 text-sm font-medium text-white bg-[#5E5691] rounded-lg cursor-pointer">
            {t("apply")}
          </button>
        </div>
      </div>
    </div>
  );
}
