import React, { useState } from "react";

export default function PauseConfirm() {
  const [isPauseSuccess, setIsPauseSuccess] = useState(false);

  if (isPauseSuccess) {
    return (
      <>
        <div className="flex flex-row items-center justify-between">
          <p className="font-bold text-2xl text-[#262626]">Yayın Durduruldu</p>

          <img src="/close-button-ani.png" className="w-6 h-6 cursor-pointer" />
        </div>

        <p className="text-[#262626] font-bold text-base mt-6">
          İlanın yayınlanması durduruldu.
        </p>
        <p className="text-[#595959] font-medium mt-4">
          Dilediğiniz zaman ilanı yeniden yayınlamaya başlayabilirsiniz.
        </p>

        <div className="mt-auto flex flex-row items-center">
          <button className="bg-[#5E5691] rounded-2xl h-[54px] w-full">
            <p className="text-white text-base font-medium">Tamam</p>
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <p className="font-bold text-2xl text-[#262626]">Yayını Duraklat</p>

        <img src="/close-button-ani.png" className="w-6 h-6 cursor-pointer" />
      </div>

      <p className="text-[#262626] font-bold text-base mt-6">
        İlanın yayınlanmasını durdurmak istediğinize emin misiniz?
      </p>
      <p className="text-[#595959] font-medium mt-4">
        Dilediğiniz zaman ilanı yeniden yayınlamaya başlayabilirsiniz.
      </p>

      <div className="mt-auto flex flex-row items-center gap-3">
        <button className="bg-[#FCFCFC] rounded-2xl border border-[#BFBFBF] h-[54px] w-1/2">
          <p className="text-[#262626] text-base font-medium">Vazgeç</p>
        </button>
        <button className="bg-[#F24853] rounded-2xl h-[54px] w-1/2">
          <p className="text-white text-base font-medium">Duraklat</p>
        </button>
      </div>
    </>
  );
}
