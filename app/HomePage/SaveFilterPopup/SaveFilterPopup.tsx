import React, { useState } from "react";

interface SaveFilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    searchName: string;
    inAppNotifications: boolean;
    emailNotifications: boolean;
  }) => void;
}

export default function SaveFilterPopup({
  isOpen,
  onClose,
  onSave,
}: SaveFilterPopupProps) {
  const [searchName, setSearchName] = useState("");
  const [inAppNotifications, setInAppNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);

  const handleSave = () => {
    onSave({
      searchName,
      inAppNotifications,
      emailNotifications,
    });
    // Reset form
    setSearchName("");
    setInAppNotifications(false);
    setEmailNotifications(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0  flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="bg-white rounded-3xl w-[416px] p-10 relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <h2 className="text-2xl font-bold text-[#262626]">Aramayı Kaydet</h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center cursor-pointer "
          >
            <img src="/popup-close-icon.png" alt="close" className="w-6 h-6" />
          </button>
        </div>

        {/* Search Name Section */}
        <div className="mb-10">
          <label className="block text-lg font-bold text-[#262626] mb-1">
            Arama Adı
          </label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Yeni aramam"
            className="w-full px-6 py-4 bg-[#FCFCFC] border border-[#D9D9D9] rounded-2xl 
                     text-[#8C8C8C] placeholder-[#8C8C8C] focus:outline-none focus:border-[#262626]
                     focus:text-[#262626] transition-colors"
          />
        </div>

        {/* Notifications Section */}
        <div className="mb-12">
          <h3 className="text-lg font-bold text-[#262626]">Bildirimler</h3>
          <p className="text-[#595959] text-sm mb-4 leading-relaxed">
            Arama kriterlerinize uygun yeni ilanları hemen öğrenmek için
            bildirimleri açabilirsiniz.
          </p>

          {/* Notification Options */}
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer border border-[#F0F0F0] rounded-2xl p-4">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={inAppNotifications}
                  onChange={(e) => setInAppNotifications(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 transition-colors ${
                    inAppNotifications
                      ? "border-[#262626] bg-[#262626]"
                      : "border-[#BFBFBF] bg-white"
                  }`}
                >
                  {inAppNotifications && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              <span className="ml-4 text-[#595959] text-base">
                Site içi bildirimler
              </span>
            </label>

            <label className="flex items-center cursor-pointer border border-[#F0F0F0] rounded-2xl p-4">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 transition-colors ${
                    emailNotifications
                      ? "border-[#262626] bg-[#262626]"
                      : "border-[#BFBFBF] bg-white"
                  }`}
                >
                  {emailNotifications && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              <span className="ml-4 text-[#595959] text-base">
                E-Posta bildirimleri
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 border-2 border-[#BFBFBF] rounded-2xl 
                     text-[#262626] font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Vazgeç
          </button>
          <button
            onClick={handleSave}
            disabled={!searchName}
            className={`flex-1 py-4 px-6 rounded-2xl font-medium transition-colors cursor-pointer ${
              searchName
                ? "bg-[#5E5691] text-[#FCFCFC] hover:bg-[#5E5691]"
                : "bg-[#F0F0F0] text-[#8C8C8C] cursor-not-allowed"
            }`}
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
