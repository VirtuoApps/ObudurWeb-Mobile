import AggrementsBox from "./AgreementsBox/AggrementsBox";
import Footer from "../resident/[slug]/Footer/Footer";
import React from "react";
import SimpleHeader from "@/app/components/SimpleHeader/SimpleHeader";

export default function sozlesmeler() {
  return (
    <>
      <SimpleHeader />
      <div className="w-full bg-[#ebeaf1] min-h-screen pt-8">
        <AggrementsBox />
        <Footer />
      </div>
    </>
  );
}
