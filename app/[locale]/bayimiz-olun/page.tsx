"use client";

import React from "react";
import Header from "./Header/Header";
import FormTexts from "./FormTexts/FormTexts";

export default function BayimizOlun() {
  return (
    <div className="w-full">
      <Header />
      <div className="w-full max-w-[1200px] mx-auto mt-24">
        <FormTexts />
      </div>
    </div>
  );
}
