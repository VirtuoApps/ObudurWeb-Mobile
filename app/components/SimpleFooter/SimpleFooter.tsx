import React from "react";

type SimpleFooterProps = {
  hideBorderTop?: boolean;
};

export default function SimpleFooter({ hideBorderTop }: SimpleFooterProps) {
  return (
    <>
      <div
        className={`w-full max-w-[1440px] mx-auto flex justify-between items-center bg-white py-10 border-t border-[#EBEAF1] mt-8 md:px-0 px-4 ${
          hideBorderTop ? "border-t-0" : "border-t"
        }`}
      >
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
      <div className="w-full h-[16px] bg-[#C1BED4]"></div>
    </>
  );
}
