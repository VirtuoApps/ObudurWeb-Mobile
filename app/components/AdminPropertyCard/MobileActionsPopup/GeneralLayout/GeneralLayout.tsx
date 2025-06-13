import React from "react";

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

interface GeneralLayoutProps {
  property: Property;
  onEdit: (propertyId: string) => void;
  onDelete: () => void;
  onPause: () => void;
  onShare: () => void;
  onLocationClick: () => void;
  onClose: () => void;
}

export default function GeneralLayout({
  property,
  onEdit,
  onDelete,
  onPause,
  onShare,
  onLocationClick,
  onClose,
}: GeneralLayoutProps) {
  const shouldShowPause = property.isPublished;
  const shouldShowPublish = !property.isPublished;

  console.log({
    isPublished: property.isPublished,
    shouldShowPause,
    shouldShowPublish,
  });

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <p className="font-bold text-2xl text-[#262626]">İşlemler</p>

        <img
          src="/close-button-ani.png"
          className="w-6 h-6 cursor-pointer"
          onClick={onClose}
        />
      </div>

      <div className="flex flex-row items-center gap-2 mt-6">
        {shouldShowPause && (
          <div
            className="bg-[#F5F5F5] rounded-2xl flex flex-col items-center justify-center w-1/3 h-[80px] cursor-pointer"
            onClick={onPause}
          >
            <img src="/pause-icon.png" className="w-6 h-6" />
            <p className="text-base font-medium text-[#FA9441]">Duraklat</p>
          </div>
        )}

        {shouldShowPublish && (
          <div
            className="bg-[#F5F5F5] rounded-2xl flex flex-col items-center justify-center w-1/3 h-[80px] cursor-pointer"
            onClick={onPause}
          >
            <img src="/publish-icon.png" className="w-6 h-6" />
            <p className="text-base font-medium text-[#1EB173]">Yayınla</p>
          </div>
        )}

        <div
          className="bg-[#F5F5F5] rounded-2xl flex flex-col items-center justify-center w-1/3 h-[80px] cursor-pointer"
          onClick={() => onEdit(property._id)}
        >
          <img src="/edit-contained.png" className="w-6 h-6" />
          <p className="text-base font-medium text-[#262626]">Düzenle</p>
        </div>

        <div
          className="bg-[#F5F5F5] rounded-2xl flex flex-col items-center justify-center w-1/3 h-[80px] cursor-pointer"
          onClick={onShare}
        >
          <img src="/share.png" className="w-6 h-6" />
          <p className="text-base font-medium text-[#262626]">Paylaş</p>
        </div>
      </div>

      <div
        className="w-full bg-[#F5F5F5] h-[56px] rounded-2xl flex flex-row items-center justify-start mt-2 pl-5 cursor-pointer"
        onClick={onLocationClick}
      >
        <img src="/marker-02.png" className="w-6 h-6" />
        <p className="text-base font-medium text-[#262626] ml-4">
          Haritada Gör
        </p>
      </div>

      <div
        className="w-full bg-[#F5F5F5] h-[56px] rounded-2xl flex flex-row items-center justify-start mt-2 pl-5 cursor-pointer"
        onClick={onDelete}
      >
        <img src="/trash-01.png" className="w-6 h-6" />
        <p className="text-base font-medium text-[#F24853] ml-4">İlanı Sil</p>
      </div>

      <div className="mt-auto flex flex-row items-center gap-3">
        <button
          className="bg-[#FCFCFC] rounded-2xl border border-[#BFBFBF] h-[54px] w-full"
          onClick={onClose}
        >
          <p className="text-[#262626] text-base font-medium">Kapat</p>
        </button>
      </div>
    </>
  );
}
