import React from "react";
import LeftSide from "./LeftSide/LeftSide";
import RightSide from "./RightSide/RightSide";

export default function AggrementsBox() {
  return (
    <div className="bg-white max-w-[1288px] w-full mx-auto min-h-screen rounded-4xl flex flex-row">
      <LeftSide />
      <RightSide />
    </div>
  );
}
