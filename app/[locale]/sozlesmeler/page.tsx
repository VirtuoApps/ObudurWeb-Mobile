import React from "react";
import Header from "./Header/Header";
import AggrementsBox from "./AgreementsBox/AggrementsBox";
import Footer from "../resident/[slug]/Footer/Footer";

export default function sozlesmeler() {
  return (
    <div className="w-full bg-[#ebeaf1] min-h-screen pt-32">
      <Header />
      <AggrementsBox />
      <Footer />
    </div>
  );
}
