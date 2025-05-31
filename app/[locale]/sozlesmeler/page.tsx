import React from "react";
import Header from "./Header/Header";
import AggrementsBox from "./AgreementsBox/AggrementsBox";

export default function sozlesmeler() {
  return (
    <div className="w-full bg-[#ebeaf1] min-h-screen pt-32 pb-24">
      <Header />
      <AggrementsBox />
    </div>
  );
}
