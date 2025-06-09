"use client";

import FormSection from "./FormSection/FormSection";
import FormTexts from "./FormTexts/FormTexts";
import React from "react";
import SimpleHeader from "@/app/components/SimpleHeader/SimpleHeader";

export default function BayimizOlun() {
  return (
    <div className="w-full pb-24">
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
      <div className="w-full max-w-[1440px] mx-auto flex justify-between items-center mt-12">
        <div className="flex flex-row items-center">
          <img src="/obudur-icon-v2.png" className="w-[28px] h-[32px]" />
          <p className="text-[#8C8C8C] text-[14px] font-medium ml-5">
            © 2025 Obudur
          </p>
        </div>
      </div>
    </div>
  );
}
