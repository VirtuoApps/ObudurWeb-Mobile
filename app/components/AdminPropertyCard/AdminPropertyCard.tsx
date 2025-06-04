import React, { useState } from "react";
import {
  EyeIcon,
  HeartIcon,
  EnvelopeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "@/app/utils/router";
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

interface AdminPropertyCardProps {
  property: Property;
  onEdit: (propertyId: string) => void;
  onDelete: (propertyId: string) => void;
  onPublish: (propertyId: string) => void;
  onUnpublish: (propertyId: string) => void;
  onViewMessages: (propertyId: string) => void;
}

export default function AdminPropertyCard({
  property,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onViewMessages,
}: AdminPropertyCardProps) {
  const router = useRouter();

  // Format price for display
  const formatPrice = (price: Price[]) => {
    if (!price || price.length === 0) return "N/A";

    const primaryPrice = price[0];
    const formatter = new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: primaryPrice.currency,
      maximumFractionDigits: 0,
    });

    return formatter.format(primaryPrice.amount);
  };

  const renderStatusBadge = () => {
    if (property.isPublished && property.isConfirmedByAdmin) {
      return (
        <div
          className="rounded-md py-1 px-2 text-xs font-semibold text-white"
          style={{ backgroundColor: "#1EB173" }}
        >
          Aktif
        </div>
      );
    }

    if (property.isPublished && !property.isConfirmedByAdmin) {
      return (
        <div
          className="rounded-md py-1 px-2 text-xs font-semibold text-white"
          style={{ backgroundColor: "#FA9441" }}
        >
          Onay Bekliyor
        </div>
      );
    }

    if (!property.isPublished) {
      return (
        <div
          className="rounded-md py-1 px-2 text-xs font-semibold text-white"
          style={{ backgroundColor: "#362C75" }}
        >
          Duraklatıldı
        </div>
      );
    }

    return null;
  };

  const handleShare = () => {
    const url = `https://obudur-website.vercel.app/resident/${property.slug}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Link kopyalandı");
      })
      .catch((err) => {
        console.error("Kopyalama hatası:", err);
        toast.error("Kopyalama işlemi başarısız");
      });
  };

  const handleLocationClick = () => {
    if (property.location && property.location.coordinates) {
      const [lng, lat] = property.location.coordinates;
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
    }
  };

  return (
    <div className="w-full overflow-hidden bg-white rounded-2xl transition-shadow duration-300 ">
      {/* Image container with badges */}
      <div className="relative">
        <img
          src={property.images[0] || "https://placehold.co/400x200"}
          alt={property.title.tr}
          className="w-full h-48 object-cover"
        />

        {/* Property number badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-white border border-[#D9D9D9] text-[#5E5691] text-xs font-semibold px-3 py-1 rounded-lg">
            {property.listingType.tr}
          </div>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 right-3">{renderStatusBadge()}</div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Property type */}
        <p className="text-base text-[#8C8C8C] font-medium">
          İlan No: {property.no}
        </p>

        <div className="flex flex-row items-start justify-between">
          {/* Title */}
          <h3
            className="text-base font-bold text-[#262626] cursor-pointer hover:text-[#362C75] transition-colors flex-1 mr-2"
            onClick={() => {
              window.open(`/resident/${property.slug}`, "_blank");
            }}
          >
            {property.title.tr}
          </h3>

          {/* Price */}
          <p className="text-base font-bold text-[#362C75] flex-shrink-0">
            {formatPrice(property.price)}
          </p>
        </div>

        <div className="flex items-start space-x-1 text-[14px] text-[#8C8C8C] mb-4">
          <span
            className="flex-1 overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {property?.city?.tr}, {property?.state?.tr},{" "}
            {property.housingType.tr}, {property?.roomAsText},{" "}
            {property.floorCount} Kat {property.totalSize}m2
          </span>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center">
          <div className="flex flex-row items-center gap-3">
            <div className="flex flex-row items-center gap-2">
              <img src="/eye-open.png" className="w-6 h-6" />
              <p className="text-[#262626] text-sm font-medium">
                {property.viewCount}
              </p>
            </div>

            <div className="flex flex-row items-center gap-2">
              <img src="/heart_resident.png" className="w-6 h-6" />
              <p className="text-[#262626] text-sm font-medium">
                {property.favoriteCount}
              </p>
            </div>

            <div className="flex flex-row items-center gap-2">
              <img src="/mail_resident.png" className="w-6 h-6" />
              <p className="text-[#262626] text-sm font-medium">
                {property.totalMessageCount}
              </p>
            </div>
          </div>

          <div>
            <img src="/dot-horizontal-2.png" className="w-6 h-6" />
          </div>
        </div>

        {/* Location */}
      </div>
    </div>
  );
}
