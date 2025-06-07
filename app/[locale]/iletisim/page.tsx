"use client";

import React from "react";
import Header from "./Header/Header";
import ContactTextList from "./ContactTextList/ContactTextList";
import FormSection from "./FormSection/FormSection";
import OfficesSection from "./OfficesSection/OfficesSection";
import Footer from "../resident/[slug]/Footer/Footer";
import HeaderWithoutButton from "@/app/components/HeaderWithoutButton/HeaderWithoutButton";
import SimpleHeader from "@/app/components/SimpleHeader/SimpleHeader";

export default function contact() {
  return (
    <div className="w-full h-full bg-[#ebeaf1]">
      <SimpleHeader />

      <div className="bg-[#ebeaf1] w-full min-h-screen pt-20 px-8  max-w-[1440px] mx-auto">
        <div className="flex flex-col items-center justify-center text-center py-10">
          <h1 className=" sm:text-[56px] text-[32px] md:text-[56px] font-bold text-[#362C75] mb-3">
            Obudur’a ulaşmak çok kolay!
          </h1>
          <p className="text-[16px] md:text-[24px] text-[#262626] mb-3  text-left">
            Obudur, işini büyütmek isteyen bağımsız emlakçılara güvenilir bir
            zemin sunar.
          </p>
          <p className="text-base text-[#595959] font-medium">
            Eğitimden teknolojiye, pazarlamadan kurumsal kimliğe kadar her
            adımda yanındayız.
          </p>
          <p className="text-base text-[#595959] font-medium">
            Kendi ofisini açarken yalnız kalmak istemiyorsan, başvurunu
            yap: aradığın o destek, O Budur.
          </p>
        </div>

        <img
          src="/contact.png"
          alt="bayimiz"
          className="w-full max-w-[1440px] mx-auto"
        />

        <ContactTextList />
        <FormSection />

        <p
          className="text-[#262626] font-extrabold text-4xl mt-8"
          id="offices-section"
        >
          Gayrimenkül Ofislerimiz
        </p>
        <p className="text-[#595959] text-base font-medium">
          Obudur ile birlikte çalışan markalarımızın ofisleri.
        </p>
        <OfficesSection />
      </div>
      <Footer />
    </div>
  );
}
