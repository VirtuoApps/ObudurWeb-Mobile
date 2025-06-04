import React from "react";

export default function GeneralLayout() {
  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <p className="font-bold text-2xl text-[#262626]">İşlemler</p>

        <img src="/close-button-ani.png" className="w-6 h-6 cursor-pointer" />
      </div>

      <div className="flex flex-row items-center gap-2 mt-6">
        <div className="bg-[#F5F5F5] rounded-2xl flex flex-col items-center justify-center w-1/3 h-[80px]">
          <img src="/pause-icon.png" className="w-6 h-6" />

          <p className="text-base font-medium text-[#FA9441]">Duraklat</p>
        </div>

        <div className="bg-[#F5F5F5] rounded-2xl flex flex-col items-center justify-center w-1/3 h-[80px]">
          <img src="/edit-contained.png" className="w-6 h-6" />

          <p className="text-base font-medium text-[#262626]">Düzenle</p>
        </div>

        <div className="bg-[#F5F5F5] rounded-2xl flex flex-col items-center justify-center w-1/3 h-[80px]">
          <img src="/share.png" className="w-6 h-6" />

          <p className="text-base font-medium text-[#262626]">Paylaş</p>
        </div>
      </div>

      <div className="w-full bg-[#F5F5F5] h-[56px] rounded-2xl flex flex-row items-center justify-start mt-2 pl-5">
        <img src="/marker-02.png" className="w-6 h-6" />

        <p className="text-base font-medium text-[#262626] ml-4">
          Haritada Gör
        </p>
      </div>

      <div className="w-full bg-[#F5F5F5] h-[56px] rounded-2xl flex flex-row items-center justify-start mt-2 pl-5">
        <img src="/trash-01.png" className="w-6 h-6" />

        <p className="text-base font-medium text-[#F24853] ml-4">İlanı Sil</p>
      </div>

      <div className="mt-auto flex flex-row items-center gap-3">
        <button className="bg-[#FCFCFC] rounded-2xl border border-[#BFBFBF] h-[54px] w-1/2">
          <p className="text-[#262626] text-base font-medium">Kapat</p>
        </button>
        <button className="bg-[#5E5691] rounded-2xl h-[54px] w-1/2">
          <p className="text-white text-base font-medium">Ekle</p>
        </button>
      </div>
    </>
  );
}
