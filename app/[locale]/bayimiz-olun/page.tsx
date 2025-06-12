"use client";

import FormSection from "./FormSection/FormSection";
import FormTexts from "./FormTexts/FormTexts";
import React from "react";
import SimpleHeader from "@/app/components/SimpleHeader/SimpleHeader";
import Footer from "../resident/[slug]/Footer/Footer";

export default function BayimizOlun() {
  return (
    <>
      <div className="w-full pb-12">
        <SimpleHeader />
        <div className="w-full max-w-[1200px] mx-auto mt-24">
          <FormTexts />
          <FormSection />
        </div>
        <img
          src="/bayimiz.png"
          alt="bayimiz"
          className="w-full max-w-[1440px] mx-auto"
        />
      </div>
      <Footer />
    </>
  );
}
