"use client";

import ContactTextList from "./ContactTextList/ContactTextList";
import Footer from "../resident/[slug]/Footer/Footer";
import FormSection from "./FormSection/FormSection";
import OfficesSection from "./OfficesSection/OfficesSection";
import React from "react";
import SimpleHeader from "@/app/components/SimpleHeader/SimpleHeader";
import { useTranslations } from "next-intl";


export default function contact() {
  const t = useTranslations("contactPage");

  return (
    <>
      <div className="w-full h-full bg-[#ebeaf1]">
        <SimpleHeader />

        <div className="bg-[#ebeaf1] w-full min-h-screen pt-20   max-w-[1440px] mx-auto px-4 md:px-0 pb-24 -mb-12">
          <div className="flex flex-col items-center justify-center text-center md:py-10 -mt-12 md:mt-0">
            <h1 className="  text-[24px] md:text-[56px] font-bold text-[#362C75] mb-3">
              {t("title")}
            </h1>
            <p className="text-[16px] md:text-[24px] text-[#262626] mb-3  md:text-left text-center">
              {t("subtitle")}
            </p>
            <p className="text-xs md:text-base text-[#595959] font-medium">
              {t("description1")}
            </p>
            <p className="text-xs md:text-base text-[#595959] font-medium">
              {t("description2")}
            </p>
          </div>

          <img
            src="/contact.png"
            alt="bayimiz"
            className="w-full max-w-[1440px] mx-auto hidden md:block"
          />

          <img
            src="/contact_mobile.png"
            alt="bayimiz"
            className="max-w-[1440px] mx-auto block md:hidden w-[361px] h-[240px] object-cover rounded-2xl mt-8"
          />

          <ContactTextList />
          <FormSection />

          <p
            className="text-[#262626] font-extrabold text-4xl mt-20"
            id="offices-section"
          >
            {t("officesTitle")}
          </p>
          <p className="text-[#595959] text-base font-medium">
            {t("officesSubtitle")}
          </p>
          <OfficesSection />
        </div>
      </div>
      <Footer customClassName="" customMy="my-0" />
    </>
  );
}
