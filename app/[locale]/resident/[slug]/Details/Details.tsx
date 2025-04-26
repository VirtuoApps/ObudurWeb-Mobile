import React from "react";

export default function Details() {
  return (
    <section className="max-w-5xl mx-auto p-4 mt-12">
      <div className="header">
        <h2 className="font-semibold tracking-tight text-[#31286A] text-3xl md:text-4xl">
          Detaylar
        </h2>
        <p className="max-w-2xl mt-2 leading-relaxed text-sm md:text-base text-gray-500">
          Yapısal özellikler, inşa yılı ve proje kapsamında sunulan teknik
          bilgiler ile konutun fiziksel yapısına dair açıklamalar.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {/* First Column */}
        <div className="flex flex-col gap-4 sm:border-r">
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              Proje Alanı:
            </span>
            <span className="font-semibold text-[#0F0F0F]">1.200 m2</span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              Alan:
            </span>
            <span className="font-semibold text-[#0F0F0F]">340 m2</span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              İnşa Yılı:
            </span>
            <span className="font-semibold text-[#0F0F0F]">2022</span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              Mimar:
            </span>
            <span className="font-semibold text-[#0F0F0F]">Barry Allen</span>
          </div>
        </div>

        {/* Second Column */}
        <div className="flex flex-col gap-4 sm:border-r">
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              Mutfak:
            </span>
            <span className="font-semibold text-[#0F0F0F]">Ayrı Mutfak</span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              Yatak Odası:
            </span>
            <span className="font-semibold text-[#0F0F0F]">3</span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              Banyo Sayısı:
            </span>
            <span className="font-semibold text-[#0F0F0F]">2</span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              Balkon Sayısı:
            </span>
            <span className="font-semibold text-[#0F0F0F]">2</span>
          </div>
        </div>

        {/* Third Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              Kat:
            </span>
            <span className="font-semibold text-[#0F0F0F]">Dubleks</span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              Konut Tipi:
            </span>
            <span className="font-semibold text-[#0F0F0F]">Villa</span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              Giriş:
            </span>
            <span className="font-semibold text-[#0F0F0F]">Müstakil</span>
          </div>
          <div className="flex items-baseline">
            <span className="w-32 shrink-0 font-medium text-gray-600">
              İlan Türü:
            </span>
            <span className="font-semibold text-[#0F0F0F]">Satılık</span>
          </div>
        </div>
      </div>
    </section>
  );
}
