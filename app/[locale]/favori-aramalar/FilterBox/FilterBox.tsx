"use client";

import React from "react";

export default function FilterBox() {
  const [siteNotifications, setSiteNotifications] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(false);

  return (
    <div className="bg-white rounded-4xl   shadow-sm w-1/2">
      {/* Header Section */}
      <div className="flex flex-row items-center justify-between w-full pb-6 border-b border-[#F0F0F0] mb-6 p-6">
        <h2 className="text-[#262626] font-bold text-base leading-[140%] tracking-normal align-middle">
          Antalya Merkez Villa
        </h2>
        <p className="text-[#8C8C8C] font-normal text-base leading-[140%] tracking-normal align-middle mt-1">
          23 Nisan 2025'te kaydedildi
        </p>
      </div>

      {/* Details Section */}
      <div className="space-y-2 pb-6 py-0 p-6 border-b border-[#F0F0F0]">
        <div className="flex">
          <span className="text-[#262626] font-bold text-sm leading-[140%] tracking-normal align-middle min-w-[80px]">
            Kategori:
          </span>
          <span className="text-gray-700 font-normal text-sm leading-[140%] tracking-normal align-middle">
            Satılık, Konut, Villa,
          </span>
        </div>

        <div className="flex">
          <span className="text-[#262626] font-bold text-sm leading-[140%] tracking-normal align-middle min-w-[80px]">
            Konum:
          </span>
          <span className="text-gray-700 font-normal text-sm leading-[140%] tracking-normal align-middle">
            Muratpaşa, Lara, Konyaaltı
          </span>
        </div>

        <div className="flex">
          <span className="text-[#262626] font-bold text-sm leading-[140%] tracking-normal align-middle min-w-[80px]">
            Filtreler:
          </span>
          <span className="text-gray-700 font-normal text-sm leading-[140%] tracking-normal align-middle">
            3+1, Müstakil Giriş, Min 120 m², Bahçe, Açık Havuz, Otopark,
            Güvenlik, +3 Filtre daha
          </span>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-4 mb-8 p-6 border-b border-[#F0F0F0]">
        <div className="flex items-center ">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={siteNotifications}
              onChange={() => setSiteNotifications(!siteNotifications)}
              className="sr-only"
            />
            {siteNotifications ? (
              <svg
                width="42"
                height="24"
                viewBox="0 0 42 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="41"
                  height="23"
                  rx="8.5"
                  fill="#1EB173"
                  stroke="#F5F5F5"
                />
                <rect
                  x="19"
                  y="3"
                  width="20"
                  height="18"
                  rx="6"
                  fill="#FCFCFC"
                />
              </svg>
            ) : (
              <svg
                width="42"
                height="24"
                viewBox="0 0 42 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="41"
                  height="23"
                  rx="8.5"
                  fill="#BFBFBF"
                  stroke="#F5F5F5"
                />
                <rect
                  x="3"
                  y="3"
                  width="20"
                  height="18"
                  rx="6"
                  fill="#FCFCFC"
                />
              </svg>
            )}
          </label>
          <span className="text-[#262626] font-medium text-base leading-[140%] tracking-normal align-middle ml-4">
            Site içi bildirimler almak istiyorum
          </span>
        </div>

        <div className="flex items-center ">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
              className="sr-only"
            />
            {emailNotifications ? (
              <svg
                width="42"
                height="24"
                viewBox="0 0 42 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="41"
                  height="23"
                  rx="8.5"
                  fill="#1EB173"
                  stroke="#F5F5F5"
                />
                <rect
                  x="19"
                  y="3"
                  width="20"
                  height="18"
                  rx="6"
                  fill="#FCFCFC"
                />
              </svg>
            ) : (
              <svg
                width="42"
                height="24"
                viewBox="0 0 42 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="41"
                  height="23"
                  rx="8.5"
                  fill="#BFBFBF"
                  stroke="#F5F5F5"
                />
                <rect
                  x="3"
                  y="3"
                  width="20"
                  height="18"
                  rx="6"
                  fill="#FCFCFC"
                />
              </svg>
            )}
          </label>
          <span className="text-[#262626] font-medium text-base leading-[140%] tracking-normal align-middle ml-4">
            E-Posta bildirimleri almak istiyorum
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 p-6 pt-0">
        <button
          className="flex-1 bg-[#5E5691] text-white font-medium text-base leading-[140%] tracking-normal align-middle rounded-2xl px-6 py-4 flex items-center justify-center gap-2 hover:bg-[#504682] transition-colors max-w-[263px]"
          style={{ height: "56px" }}
        >
          Sonuçları Görüntüle (42)
          <img src="/chevron-right.png" className="w-6 h-6" />
        </button>

        <button
          className="px-6 py-4 text-gray-700 font-medium text-base leading-[140%] tracking-normal align-middle border border-[#BFBFBF] rounded-2xl hover:bg-gray-50 transition-colors ml-auto"
          style={{ width: "110px", height: "56px" }}
        >
          Düzenle
        </button>

        <button
          className="px-6 py-4 bg-[#F24853] text-white font-medium text-base leading-[140%] tracking-normal align-middle rounded-2xl hover:bg-[#E03843] transition-colors"
          style={{ width: "66px", height: "56px" }}
        >
          Sil
        </button>
      </div>
    </div>
  );
}
