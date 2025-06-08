"use client";

import FormSection from "./FormSection/FormSection";
import FormTexts from "./FormTexts/FormTexts";
import Header from "./Header/Header";
import React from "react";
import SimpleFooter from "@/app/components/SimpleFooter/SimpleFooter";
import SimpleHeader from "@/app/components/SimpleHeader/SimpleHeader";

export default function BayimizOlun() {
  return (
    <div className="w-full">
      <SimpleHeader />
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
