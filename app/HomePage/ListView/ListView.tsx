import React from "react";
import ResidentBox from "./ResidentBox/ResidentBox";

export default function ListView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-t pt-7 px-2 pb-8">
      <ResidentBox />
      <ResidentBox />
      <ResidentBox />
      <ResidentBox />
      <ResidentBox />
      <ResidentBox />
      <ResidentBox />
      <ResidentBox />
    </div>
  );
}
