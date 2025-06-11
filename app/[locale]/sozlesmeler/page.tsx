import React from "react";
import Header from "./Header/Header";
import AggrementsBox from "./AgreementsBox/AggrementsBox";
import Footer from "../resident/[slug]/Footer/Footer";
import HeaderWithoutButton from "@/app/components/HeaderWithoutButton/HeaderWithoutButton";
import SimpleHeader from "@/app/components/SimpleHeader/SimpleHeader";

export default function sozlesmeler() {
  return (
    <>
      <SimpleHeader customMaxWidth="max-w-[1288px]" />

      <div className="w-full bg-[#ebeaf1] min-h-screen pt-32">
        <AggrementsBox />
        <Footer
          customMaxWidth="max-w-[1288px]"
          customPadding="sm:px-0 px-4"
          fullWidthTopBorder={true}
          fullWidthBottomBorder={true}
          fullWidthStripe={true}
        />
      </div>
    </>
  );
}
