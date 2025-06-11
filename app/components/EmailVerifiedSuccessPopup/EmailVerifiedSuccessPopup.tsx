import { useAppSelector } from "@/app/store/hooks";
import React, { useEffect, useState } from "react";

interface EmailVerifiedSuccessPopupProps {
  onClose: () => void;
}

export default function EmailVerifiedSuccessPopup({
  onClose,
}: EmailVerifiedSuccessPopupProps) {
  return (
    <div
      className="fixed inset-0  flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="bg-[#FCFCFC] rounded-3xl p-8 w-[416px] max-w-[90vw] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-6 h-6 flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18"
              stroke="#262626"
              strokeWidth="2"
              strokeLinecap="square"
            />
            <path
              d="M6 6L18 18"
              stroke="#262626"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#262626] mb-8">Başarılı</h2>

        <div className="bg-[#F5F5F5] rounded-2xl flex items-center justify-center h-[168px]">
          <svg
            width={120}
            height={120}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="59.679" cy={60} r="28.7547" fill="#362C75" />
            <mask
              id="mask0_14835_6391"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x={46}
              y={49}
              width={27}
              height={22}
            >
              <path
                d="M49.7657 58.4041L46.6714 61.4984L55.3506 70.1777L72.5582 52.9701L69.3129 49.7249L55.1997 63.8381L49.7657 58.4041Z"
                fill="black"
              />
            </mask>
            <g mask="url(#mask0_14835_6391)">
              <rect
                x="46.8491"
                y="55.2453"
                width="18.9451"
                height="4.803"
                transform="rotate(45 46.8491 55.2453)"
                fill="#FCFCFC"
              />
              <rect
                x="51.3208"
                y="67.7169"
                width="35.5955"
                height="4.803"
                transform="rotate(-45 51.3208 67.7169)"
                fill="#FCFCFC"
              />
            </g>
          </svg>
        </div>

        {/* Success Icon Circle */}
        {/* <div className="w-[352px] h-[168px] bg-[#F5F5F5] rounded-2xl flex items-center justify-center mb-8">
          <div className="w-3 h-3 bg-[#362C75] rounded-full"></div>
        </div> */}

        {/* Main Message */}
        <h3 className="text-xl font-bold text-[#262626] mb-4 mt-8">
          Obudur hesabınız başarıyla aktive edildi.
        </h3>

        {/* Description */}
        <p className="text-[#595959] mb-2 leading-relaxed">
          Hemen Obudur’un geniş gayrimenkul dünyasında gezintiye çıkın!
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full bg-[#5E5691] text-white py-4 px-6 rounded-2xl font-medium hover:bg-[#4c4677] transition-colors mt-12"
        >
          Devam Et
        </button>
      </div>
    </div>
  );
}
