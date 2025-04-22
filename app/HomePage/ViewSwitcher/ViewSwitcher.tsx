import React from "react";
import { useTranslations } from "next-intl";
import { FaList } from "react-icons/fa";
import { IoMapOutline } from "react-icons/io5";

type ViewSwitcherProps = {
  currentView: "map" | "list";
  setCurrentView: (view: "map" | "list") => void;
};

export default function ViewSwitcher({
  currentView,
  setCurrentView,
}: ViewSwitcherProps) {
  const t = useTranslations("viewSwitcher");
  return (
    <div className="absolute bottom-4 left-0 right-0 w-full flex justify-center items-center">
      {currentView === "map" && (
        <div
          className="flex flex-row justify-center items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-lg cursor-pointer"
          onClick={() => setCurrentView("list")}
        >
          <FaList className="text-xl text-[#262626]" />
          <p className="text-sm font-bold text-[#5E5691]">{t("list")}</p>
        </div>
      )}

      {currentView === "list" && (
        <div
          className="flex flex-row justify-center items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-lg cursor-pointer"
          onClick={() => setCurrentView("map")}
        >
          <IoMapOutline className="text-xl text-[#262626]" />
          <p className="text-sm font-bold text-[#5E5691]">{t("map")}</p>
        </div>
      )}
    </div>
  );
}
