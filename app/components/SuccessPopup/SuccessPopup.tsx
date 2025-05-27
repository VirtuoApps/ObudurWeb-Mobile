import React from "react";

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessPopup({ isOpen, onClose }: SuccessPopupProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0  flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="bg-[#FCFCFC] rounded-3xl p-8 w-[416px] max-w-[90vw] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-6 h-6 flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18"
              stroke="#262626"
              strokeWidth="2"
              strokeLinecap="square"
            />
            <path
              d="M6 6L18 18"
              stroke="#262626"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#262626] mb-8">Gönderildi</h2>

        {/* Success Icon Circle */}
        {/* <div className="w-[352px] h-[168px] bg-[#F5F5F5] rounded-2xl flex items-center justify-center mb-8">
          <div className="w-3 h-3 bg-[#362C75] rounded-full"></div>
        </div> */}

        {/* Main Message */}
        <h3 className="text-xl font-bold text-[#262626] mb-4">
          Başvuru formunuz başarıyla gönderildi.
        </h3>

        {/* Description */}
        <p className="text-[#595959] mb-2 leading-relaxed">
          Obudur ekibi olarak, başvurunuzu inceleyerek, size en kısa sürede
          dönüş yapacağımızdan emin olabilirsiniz.
        </p>

        <p className="text-[#595959] mb-8">Teşekkürler.</p>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full bg-[#5E5691] text-white py-4 px-6 rounded-2xl font-medium hover:bg-[#4c4677] transition-colors"
        >
          Tamam
        </button>
      </div>
    </div>
  );
}
