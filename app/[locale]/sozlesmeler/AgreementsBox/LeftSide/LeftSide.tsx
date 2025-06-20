import Boxes from "./Boxes/Boxes";
import React from "react";
import { useTranslations } from "next-intl";

export default function LeftSide({
  handleItemClick,
  selectedItem,
}: {
  handleItemClick: (item: { title: string; mdText: string }) => void;
  selectedItem: { title: string; mdText: string } | null;
}) {
  const t = useTranslations("agreementsPage");

  return (
    <div className="sm:w-[32%] w-full h-full p-8 pt-6">
      <p className="text-[#362C75] font-bold text-[24px]">{t("title")}</p>
      <Boxes handleItemClick={handleItemClick} selectedItem={selectedItem} />
    </div>
  );
}
