import React from "react";
import Boxes from "./Boxes/Boxes";

export default function LeftSide() {
  return (
    <div className="w-[32%] h-full p-8 pt-6 border-r border-[#F0F0F0]">
      <p className="text-[#362C75] font-bold text-[24px]">
        Kullanıcı Sözleşmeleri
      </p>
      <Boxes />
    </div>
  );
}
