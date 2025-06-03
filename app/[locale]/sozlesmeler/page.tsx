import React from "react";
import Header from "./Header/Header";
import AggrementsBox from "./AgreementsBox/AggrementsBox";
import Footer from "../resident/[slug]/Footer/Footer";
import HeaderWithoutButton from "@/app/components/HeaderWithoutButton/HeaderWithoutButton";

export default function sozlesmeler() {
  return (
    <div className="w-full bg-[#ebeaf1] min-h-screen pt-32">
      <HeaderWithoutButton />
      <AggrementsBox />
      <Footer />
    </div>
  );
}
