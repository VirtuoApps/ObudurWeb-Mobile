import React, { useState, useEffect } from "react";
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
  onShare,
  onLocationClick,
  onClose,
}: MobileActionsPopupProps) {
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Prevent body scroll when popup is open and handle opening animation
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Start opening animation
    setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY;
    
    // Only allow downward movement
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (translateY > 100) {
      // Close if dragged more than 100px down
      handleClose();
    } else {
      // Reset position
      setTranslateY(0);
    }
    setTouchStartY(null);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-end justify-end w-full h-full"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)",
      }}
      onClick={handleClose}
    >
      <div 
        className="bg-[#FCFCFC] h-[60%] w-full z-50 rounded-t-[32px] px-4 pt-8 flex flex-col pb-6"
        style={{
          transform: `translateY(${isVisible ? translateY : 100}%)`,
          transition: touchStartY ? "none" : "transform 0.3s ease-out",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-14 h-1.5 bg-gray-300 rounded-full"></div>

        {!showPauseConfirm && !showDeleteConfirm && (
          <GeneralLayout
            property={property}
            onEdit={onEdit}
            onDelete={() => setShowDeleteConfirm(true)}
            onPause={() => setShowPauseConfirm(true)}
            onShare={onShare}
            onLocationClick={onLocationClick}
            onClose={handleClose}
          />
        )}
        {showPauseConfirm && (
          <PauseConfirm
            property={property}
            onPublish={onPublish}
            onUnpublish={onUnpublish}
            onClose={handleClose}
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
                onClick={handleClose}
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
                  handleClose();
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

