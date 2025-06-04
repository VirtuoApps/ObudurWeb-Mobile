import React, { useState } from "react";
import axiosInstance from "@/axios";
import { toast } from "react-hot-toast";

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

interface PauseConfirmProps {
  property: Property;
  onPublish: (propertyId: string) => void;
  onUnpublish: (propertyId: string) => void;
  onClose: () => void;
  onBack: () => void;
}

export default function PauseConfirm({
  property,
  onPublish,
  onUnpublish,
  onClose,
  onBack,
}: PauseConfirmProps) {
  const [isPauseSuccess, setIsPauseSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isCurrentlyPublished = property.isPublished;
  const actionText = isCurrentlyPublished ? "Duraklat" : "Yayınla";
  const actionColor = isCurrentlyPublished ? "#F24853" : "#1EB173";

  const handleAction = async () => {
    setIsLoading(true);
    try {
      if (isCurrentlyPublished) {
        await onUnpublish(property._id);
        toast.success("İlan durduruldu");
      } else {
        await onPublish(property._id);
        toast.success("İlan yayınlandı");
      }
      setIsPauseSuccess(true);
    } catch (error) {
      console.error("Error updating property status:", error);
      toast.error("İşlem başarısız oldu");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPauseSuccess) {
    const successTitle = isCurrentlyPublished
      ? "Yayın Durduruldu"
      : "İlan Yayınlandı";
    const successText = isCurrentlyPublished
      ? "İlanın yayınlanması durduruldu."
      : "İlanınız başarıyla yayınlandı.";
    const successSubText = isCurrentlyPublished
      ? "Dilediğiniz zaman ilanı yeniden yayınlamaya başlayabilirsiniz."
      : "İlanınız artık potansiyel müşteriler tarafından görülebilir.";

    return (
      <>
        <div className="flex flex-row items-center justify-between">
          <p className="font-bold text-2xl text-[#262626]">{successTitle}</p>

          <img
            src="/close-button-ani.png"
            className="w-6 h-6 cursor-pointer"
            onClick={onClose}
          />
        </div>

        <p className="text-[#262626] font-bold text-base mt-6">{successText}</p>
        <p className="text-[#595959] font-medium mt-4">{successSubText}</p>

        <div className="mt-auto flex flex-row items-center">
          <button
            className="bg-[#5E5691] rounded-2xl h-[54px] w-full"
            onClick={onClose}
          >
            <p className="text-white text-base font-medium">Tamam</p>
          </button>
        </div>
      </>
    );
  }

  const confirmTitle = isCurrentlyPublished
    ? "Yayını Duraklat"
    : "İlanı Yayınla";
  const confirmText = isCurrentlyPublished
    ? "İlanın yayınlanmasını durdurmak istediğinize emin misiniz?"
    : "İlanı yayınlamak istediğinize emin misiniz?";
  const confirmSubText = isCurrentlyPublished
    ? "Dilediğiniz zaman ilanı yeniden yayınlamaya başlayabilirsiniz."
    : "İlan yayınlandıktan sonra potansiyel müşteriler tarafından görülebilir olacak.";

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <p className="font-bold text-2xl text-[#262626]">{confirmTitle}</p>

        <img
          src="/close-button-ani.png"
          className="w-6 h-6 cursor-pointer"
          onClick={onClose}
        />
      </div>

      <p className="text-[#262626] font-bold text-base mt-6">{confirmText}</p>
      <p className="text-[#595959] font-medium mt-4">{confirmSubText}</p>

      <div className="mt-auto flex flex-row items-center gap-3">
        <button
          className="bg-[#FCFCFC] rounded-2xl border border-[#BFBFBF] h-[54px] w-1/2"
          onClick={onBack}
          disabled={isLoading}
        >
          <p className="text-[#262626] text-base font-medium">Vazgeç</p>
        </button>
        <button
          className="rounded-2xl h-[54px] w-1/2"
          style={{ backgroundColor: actionColor }}
          onClick={handleAction}
          disabled={isLoading}
        >
          <p className="text-white text-base font-medium">
            {isLoading ? "Yükleniyor..." : actionText}
          </p>
        </button>
      </div>
    </>
  );
}
