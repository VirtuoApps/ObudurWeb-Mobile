import React from "react";

export default function HeaderSection() {
  return (
    <div className="w-full py-6 sm:py-10">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 px-4 sm:px-0">
        {/* Left side - Title and subtitle */}
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#262626] mb-1 sm:mb-2">
            Favori Aramalar
          </h1>
          <p className="text-xs sm:text-sm text-[#595959]">
            3 adet favori aramanız var.
          </p>
        </div>

        {/* Right side - New Search Button */}
        <button className="flex items-center gap-2 sm:gap-3 bg-[#5E5691] hover:bg-[#4B4578] transition-colors text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base h-[48px] sm:h-[56px] w-full sm:w-auto justify-center">
          <img src="/search-icon.png" className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>Yeni Arama</span>
        </button>
      </div>
    </div>
  );
}
