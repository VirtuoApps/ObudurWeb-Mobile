"use client";

import React from "react";
import Header from "./Header/Header";
import FormTexts from "./FormTexts/FormTexts";
import FormSection from "./FormSection/FormSection";

export default function BayimizOlun() {
  return (
    <div className="w-full pb-24">
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
      <div className="w-full max-w-[1440px] mx-auto flex justify-between items-center mt-12">
        <div className="flex flex-row items-center">
          <img src="/obudur-icon-v2.png" className="w-[28px] h-[32px]" />
          <p className="text-[#8C8C8C] text-[14px] font-medium ml-5">
            © 2025 Obudur
          </p>
        </div>

        <div className="flex flex-row items-center">
          <p className="font-medium text-[#595959] text-[14px]">Created by</p>
          <p className="font-medium text-[#8C8C8C] text-[14px] ml-1"> Talya</p>
        </div>
      </div>
    </div>
  );
}
