"use client";

import React, { useState } from "react";

import LeftSide from "./LeftSide/LeftSide";
import RightSide from "./RightSide/RightSide";

export default function AggrementsBox() {
  const [selectedItem, setSelectedItem] = useState<{
    title: string;
    mdText: string;
  } | null>(null);

  const handleItemClick = (item: { title: string; mdText: string }) => {
    setSelectedItem(item);
  };

  return (
    <div className="bg-white max-w-[1288px] w-full mx-auto min-h-screen rounded-4xl flex sm:flex-row flex-col mt-6">
      <LeftSide handleItemClick={handleItemClick} selectedItem={selectedItem} />
      <RightSide selectedItem={selectedItem} />
    </div>
  );
}
