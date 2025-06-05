import { FilterType } from "@/types/filter.type";
import React from "react";

type NewFilterItemProps = {
  filters: FilterType | null;
  setFilters: (filters: any) => void;
};

export default function NewFilterItem({
  filters,
  setFilters,
}: NewFilterItemProps) {
  const isSelected = filters?.isNewSelected ? true : false;

  return (
    <div
      className={`flex flex-row items-center cursor-pointer rounded-2xl px-3 py-2 whitespace-nowrap transition-colors duration-200 flex-shrink-0 ${
        isSelected
          ? "bg-[#EBEAF180] border-[0.5px] border-[#362C75] text-[#362C75] "
          : "bg-white hover:bg-[#F5F5F5] border-[0.5px] border-transparent"
      }`}
      onClick={() => setFilters({ ...filters, isNewSelected: !isSelected })}
    >
      <div className="flex items-center w-full">
        <img
          src="/new.png"
          alt="new"
          className="w-[24px] h-[24px] object-contain flex-shrink-0"
        />
        <p className="text-[14px] ml-2 text-[#595959] font-medium">Yeni</p>
      </div>
    </div>
  );
}
