import React from "react";
import Boxes from "./Boxes/Boxes";

export default function LeftSide({
  handleItemClick,
  selectedItem,
}: {
  handleItemClick: (item: { title: string; mdText: string }) => void;
  selectedItem: { title: string; mdText: string } | null;
}) {
  return (
    <div className="sm:w-[32%] w-full h-full p-8 pt-6 border-r border-[#F0F0F0]">
      <p className="text-[#362C75] font-bold text-[24px]">
        Kullanıcı Sözleşmeleri
      </p>
      <Boxes handleItemClick={handleItemClick} selectedItem={selectedItem} />
    </div>
  );
}
