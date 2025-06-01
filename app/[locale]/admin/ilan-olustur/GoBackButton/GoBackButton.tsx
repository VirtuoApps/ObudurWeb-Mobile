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
  return (
    <div className="flex flex-row items-center mb-4 sm:mb-0 mt-auto">
      <button
        type="button"
        onClick={handleBack}
        className=" mb-4 sm:mb-0  bg-white hover:bg-gray-50 text-[#262626] w-[56px] h-[56px] font-semibold  mr-4  inline-flex items-center justify-center gap-2 transition border border-[#BFBFBF] hover:border-[#6656AD] cursor-pointer rounded-[16px]"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <span className="text-sm text-gray-600 ">Adım {step} / 6</span>
    </div>
  );
}
