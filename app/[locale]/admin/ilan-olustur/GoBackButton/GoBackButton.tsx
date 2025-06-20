import {
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import React from "react";

type GoBackButtonProps = {
  handleBack: () => void;
  step: number;
  totalSteps: number;
};

export default function GoBackButton({
  handleBack,
  step,
  totalSteps,
}: GoBackButtonProps) {
  const handleBackWithScroll = () => {
    // Execute the original back handler
    handleBack();

    // Add scroll to top functionality
    setTimeout(() => {
      const isMobile = window.innerWidth < 768; // md breakpoint

      if (isMobile) {
        // On mobile, scroll the window to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // On desktop, also scroll window to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 50); // Small delay to ensure step change has occurred
  };

  return (
    <div className="flex flex-row items-center justify-between mb-4 sm:mb-0 mt-auto w-full md:justify-start md:w-auto">
      <button
        type="button"
        onClick={handleBackWithScroll}
        className=" mb-4 sm:mb-0  bg-white hover:bg-gray-50 text-[#262626] w-[56px] h-[56px] font-semibold  mr-4  inline-flex items-center justify-center gap-2 transition border border-[#BFBFBF] hover:border-[#6656AD] cursor-pointer rounded-[16px]"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <span className="text-sm text-gray-600 ">Adım {step} / 6</span>
    </div>
  );
}
