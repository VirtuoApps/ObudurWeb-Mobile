"use client";

import React from "react";
import Header from "./Header/Header";
import FormTexts from "./FormTexts/FormTexts";
import FormSection from "./FormSection/FormSection";
import SimpleFooter from "@/app/components/SimpleFooter/SimpleFooter";

export default function BayimizOlun() {
  return (
    <div className="w-full">
      <Header />
      <div className="w-full max-w-[1200px] mx-auto mt-24">
        <FormTexts />
        <FormSection />
      </div>
      <img
        src="/kariyer-image.png"
        alt="bayimiz"
        className="w-full max-w-[1440px] mx-auto"
      />
      <SimpleFooter />
    </div>
  );
}
