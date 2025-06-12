import React from "react";

export default function ContactTextList() {
  return (
    <div className=" px-6 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Merkez Ofis */}
          <div className="text-center md:text-left">
            <h3 className="text-[#262626] text-2xl font-semibold mb-6">
              Merkez Ofis
            </h3>
            <div className="">
              <p className="text-[#262626] text-base">
                Havaalan Cad. Organize San. Sitesi 3M/C
              </p>
              <p className="text-[#262626] text-base">Muratpaşa / Antalya</p>
              <a
                href="#"
                className="text-[#5E5691] text-base inline-block mt-3 hover:underline"
              >
                Yol Tarifi Al
              </a>
            </div>
          </div>

          {/* İletişim Kanalları */}
          <div className="flex flex-col items-center ">
            <h3 className="text-[#262626] text-2xl font-semibold mb-6">
              İletişim Kanalları
            </h3>
            <div className="space-y-2">
              <p className="text-[#262626] text-base text-center">
                +90 312 345 67 89
              </p>
              <p className="text-[#262626] text-base text-center">
                info@obudur.com
              </p>
              <p className="text-[#262626] text-base text-center">
                kariyer@obudur.com
              </p>
            </div>
          </div>

          {/* Bizi Takip Edin */}
          <div className="text-center md:text-right">
            <h3 className="text-[#262626] text-2xl font-semibold mb-4 flex justify-center md:justify-end">
              Bizi Takip Edin
            </h3>
            <div className="flex flex-col items-center md:items-end">
              <span className="inline-flex items-center  rounded-full text-[#262626] text-base">
                Facebook
              </span>
              <span className="inline-flex items-center  rounded-full text-[#262626] text-base">
                Instagram
              </span>
              <span className="inline-flex items-center  rounded-full text-[#262626] text-base">
                LinkedIn
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
