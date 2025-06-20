import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type HeaderSectionType = {
  totalFilters: number;
};

export default function HeaderSection({ totalFilters }: HeaderSectionType) {
  const router = useRouter();
  const t = useTranslations("savedSearchesPage");

  if (totalFilters === 0) {
    return null; // Don't render if there are no filters
  }

  return (
    <div className="w-full py-6 sm:py-10 sm:px-14">
      <div className="max-w-[1440px] mx-auto flex flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 px-4 sm:px-0">
        {/* Left side - Title and subtitle */}
        <div>
          <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-[#262626] mb-1 sm:mb-2">
            {t("title")}
          </h1>
          <p className="text-sm sm:text-sm text-[#595959]">
            {t("subtitle", { count: totalFilters })}
          </p>
        </div>

        {/* Right side - New Search Button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 bg-[#5E5691] hover:bg-[#4B4578] transition-colors text-white px-4 py-2 rounded-xl font-medium text-sm h-[36px] sm:w-[159px] justify-center cursor-pointer"
        >
          <img src="/search-icon.png" className="w-5 h-5" />
          <span>{t("newSearch")}</span>
        </button>
      </div>
    </div>
  );
}
