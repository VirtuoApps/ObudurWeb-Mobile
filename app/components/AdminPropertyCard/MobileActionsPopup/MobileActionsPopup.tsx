import React, { useState } from "react";
import GeneralLayout from "./GeneralLayout/GeneralLayout";
import PauseConfirm from "./PauseConfim/PauseConfirm";

interface Price {
  amount: number;
  currency: string;
}

interface Translation {
  tr: string;
  en: string;
}

interface Property {
  _id: string;
  no: number;
  slug: string;
  title: Translation;
  description: Translation;
  address: Translation;
  city: Translation;
  state: Translation;
  country: Translation;
  floorCount: number;
  price: Price[];
  images: string[];
  roomAsText: string;
  housingType: Translation;
  listingType: Translation;
  isPublished: boolean;
  isConfirmedByAdmin?: boolean;
  status: string;
  updatedAt: string;
  createdAt: string;
  totalMessageCount: number;
  viewCount: number;
  favoriteCount: number;
  location: {
    type: string;
    coordinates: number[];
  };
  totalSize: number;
}

interface MobileActionsPopupProps {
  property: Property;
  onEdit: (propertyId: string) => void;
  onDelete: (propertyId: string) => void;
  onPublish: (propertyId: string) => void;
  onUnpublish: (propertyId: string) => void;
  onViewMessages: (propertyId: string) => void;
  onShare: () => void;
  onLocationClick: () => void;
  onClose: () => void;
}

export default function MobileActionsPopup({
  property,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onViewMessages,
  onShare,
  onLocationClick,
  onClose,
}: MobileActionsPopupProps) {
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-end justify-end w-full h-full"
      style={{
        backgroundColor: "rgba(0,0,0,0.1)",
      }}
    >
      <div className="bg-[#FCFCFC] h-[60%]  w-full z-50 rounded-t-[32px] px-4 pt-8 flex flex-col pb-6">
        {!showPauseConfirm && !showDeleteConfirm && (
          <GeneralLayout
            property={property}
            onEdit={onEdit}
            onDelete={() => setShowDeleteConfirm(true)}
            onPause={() => setShowPauseConfirm(true)}
            onShare={onShare}
            onLocationClick={onLocationClick}
            onClose={onClose}
            onViewMessages={onViewMessages}
          />
        )}
        {showPauseConfirm && (
          <PauseConfirm
            property={property}
            onPublish={onPublish}
            onUnpublish={onUnpublish}
            onClose={onClose}
            onBack={() => setShowPauseConfirm(false)}
          />
        )}
        {showDeleteConfirm && (
          <div className="flex flex-col h-full">
            <div className="flex flex-row items-center justify-between">
              <p className="font-bold text-2xl text-[#262626]">İlanı Sil</p>
              <img
                src="/close-button-ani.png"
                className="w-6 h-6 cursor-pointer"
                onClick={onClose}
              />
            </div>

            <p className="text-[#262626] font-bold text-base mt-6">
              Bu ilanı silmek istediğinize emin misiniz?
            </p>
            <p className="text-[#595959] font-medium mt-4">
              Bu işlem geri alınamaz.
            </p>

            <div className="mt-auto flex flex-row items-center gap-3">
              <button
                className="bg-[#FCFCFC] rounded-2xl border border-[#BFBFBF] h-[54px] w-1/2"
                onClick={() => setShowDeleteConfirm(false)}
              >
                <p className="text-[#262626] text-base font-medium">Vazgeç</p>
              </button>
              <button
                className="bg-[#F24853] rounded-2xl h-[54px] w-1/2"
                onClick={() => {
                  onDelete(property._id);
                  onClose();
                }}
              >
                <p className="text-white text-base font-medium">Sil</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
