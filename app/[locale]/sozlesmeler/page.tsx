import AggrementsBox from "./AgreementsBox/AggrementsBox";
import Footer from "../resident/[slug]/Footer/Footer";
import Header from "./Header/Header";
import HeaderWithoutButton from "@/app/components/HeaderWithoutButton/HeaderWithoutButton";
import React from "react";
import SimpleHeader from "@/app/components/SimpleHeader/SimpleHeader";

export default function sozlesmeler() {
  return (
    <div className="w-full bg-[#ebeaf1] min-h-screen">
      <SimpleHeader />
      <AggrementsBox />
      <Footer />
    </div>
  );
}
