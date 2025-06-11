import Image from "next/image";
import React from "react";

export default function FooterBottom() {
  return (
    <>
      {/* Primary bottom divider */}
      <div
        className={`
            border-t border-[#C1BED4] w-full mt-24 max-w-[1440px] mx-auto
          `}
      ></div>

      {/* Bottom bar */}
      <div className={` mx-auto px-4 2xl:px-0  w-full max-w-[1440px]`}>
        <div className="flex justify-center lg:justify-between items-center py-4 lg:py-6 text-xs text-slate-500">
          <div className="flex items-center">
            <Image
              src="/obudur-icon.png"
              alt="Obudur Logo"
              width={28}
              height={32}
              className="h-5 w-auto mr-2"
            />
            <span className="text-sm text-[#8C8C8C] ml-3">© 2025 Obudur</span>
            <span className="text-sm text-[#8C8C8C] ml-4">
              Şirket Bilgileri
            </span>
          </div>
          <div>
            <span className="text-sm text-[#595959] font-medium">
              Created by
            </span>
            <span className="text-[#8C8C8C] text-sm ml-2">Talya</span>
          </div>
        </div>
      </div>

      <div className={` h-[16px] bg-[#C1BED4] w-full mx-auto`}></div>
    </>
  );
}
