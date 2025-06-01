import React from "react";

export default function HeaderSection() {
  return (
    <div className="w-full py-10">
      <div className="max-w-[1440px] mx-auto  flex items-center justify-between">
        {/* Left side - Title and subtitle */}
        <div>
          <h1 className="text-2xl font-bold text-[#262626] mb-2">
            Favori Aramalar
          </h1>
          <p className="text-sm text-[#595959]">3 adet favori aramanız var.</p>
        </div>

        {/* Right side - New Search Button */}
        <button className="flex items-center gap-3 bg-[#5E5691] hover:bg-[#4B4578] transition-colors text-white px-8 py-4 rounded-2xl font-medium h-[56px]">
          <img src="/search-icon.png" className="w-6 h-6" />
          <span>Yeni Arama</span>
        </button>
      </div>
    </div>
  );
}
