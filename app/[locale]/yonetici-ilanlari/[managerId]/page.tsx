"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Hotel } from "@/types/hotel.type";
import ResidentBox from "@/app/HomePage/ListView/ResidentBox/ResidentBox";
import axiosInstance from "@/axios";
import { formatAddress } from "@/app/utils/addressFormatter";
import { getDisplayPrice } from "@/app/utils/priceFormatter";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// Helper function to get localized text
export const getLocalizedText = (textObj: any, selectedLanguage: string) => {
  return textObj && textObj[selectedLanguage]
    ? textObj[selectedLanguage]
    : textObj?.en || "";
};

interface Manager {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePicture: string;
}

interface ManagerHotelsResponse {
  manager: Manager;
  hotels: Hotel[];
}

export default function ManagerPage() {
  const router = useRouter();
  const params = useParams();
  const managerId = params.managerId as string;
  
  const [managerData, setManagerData] = useState<ManagerHotelsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<
    "ascending" | "descending" | "newest" | "oldest" | null
  >(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");

  const selectedLanguage = useLocale();
  const t = useTranslations("favoritesPage");

  // Get selected currency from localStorage
  useEffect(() => {
    const storedCurrency = localStorage.getItem("selectedCurrency");

    if (storedCurrency) {
      setSelectedCurrency(storedCurrency);
    }

    // Setup listener for currency changes
    const handleStorageChange = () => {
      const currency = localStorage.getItem("selectedCurrency");

      if (currency && currency !== selectedCurrency) {
        setSelectedCurrency(currency);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [selectedCurrency]);

  // Fetch manager hotels data
  useEffect(() => {
    const fetchManagerHotels = async () => {
      if (!managerId) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(`/hotels/manager/${managerId}`);
        setManagerData(response.data);
      } catch (error) {
        console.error("Error fetching manager hotels:", error);
        setError("Error fetching manager hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchManagerHotels();
  }, [managerId]);

  const handleSortSelection = (
    option: "ascending" | "descending" | "newest" | "oldest"
  ) => {
    setSortOption(option);
    setIsSortOpen(false);
  };

  const getSortDisplayText = () => {
    switch (sortOption) {
      case "ascending":
        return "En Düşük Fiyat";
      case "descending":
        return "En Yüksek Fiyat";
      case "newest":
        return "Önce En Yeni İlan";
      case "oldest":
        return "Önce En Eski İlan";
      default:
        return t("sort");
    }
  };

  const hotelCount = managerData?.hotels?.length || 0;

  // Sort hotels based on selected option
  const sortedHotels = React.useMemo(() => {
    if (!sortOption || !managerData?.hotels) return managerData?.hotels || [];

    const sorted = [...managerData.hotels];

    switch (sortOption) {
      case "ascending":
        return sorted.sort((a, b) => {
          const priceA = a.price?.[0]?.amount || 0;
          const priceB = b.price?.[0]?.amount || 0;
          return priceA - priceB;
        });
      case "descending":
        return sorted.sort((a, b) => {
          const priceA = a.price?.[0]?.amount || 0;
          const priceB = b.price?.[0]?.amount || 0;
          return priceB - priceA;
        });
      case "newest":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
      case "oldest":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateA.getTime() - dateB.getTime();
        });
      default:
        return sorted;
    }
  }, [managerData?.hotels, sortOption]);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">Yönetici İlanları</h1>
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">Yönetici İlanları</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>
            Yönetici ilanları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar
            deneyin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 pb-0 px-2">
      {/* Manager Information Section */}
      {managerData?.manager && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-4">
            <img
              src={managerData.manager.profilePicture}
              alt={`${managerData.manager.firstName} ${managerData.manager.lastName}`}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-[#262626]">
                {managerData.manager.firstName} {managerData.manager.lastName}
              </h2>
              <p className="text-[#595959] text-sm">
                {managerData.manager.phoneNumber}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header with sorting - matching SortAndSaveFiltering design */}
      {hotelCount > 0 && (
        <div className="justify-between items-start mb-8 hidden lg:flex">
          <div>
            <h1 className="text-[#262626] font-bold text-2xl">
              Yönetici İlanları
            </h1>
            <p className="text-[#595959] text-sm">
              {hotelCount} adet ilan bulundu.
            </p>
          </div>

          <div className="flex flex-row items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="border bg-transparent flex flex-row items-center justify-between rounded-xl px-5 py-3 cursor-pointer min-w-[240px]"
              >
                <p className="text-sm text-gray-500 font-semibold mr-12">
                  {getSortDisplayText()}
                </p>
                <img
                  src="/chevron-down.png"
                  className={`w-6 h-6 transition-transform duration-200 ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                  alt="arrow-down"
                />
              </button>

              {isSortOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg z-10">
                  <div
                    className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 font-semibold"
                    onClick={() => handleSortSelection("ascending")}
                  >
                    <p className="text-sm">En Düşük Fiyat</p>
                  </div>
                  <div
                    className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 font-semibold"
                    onClick={() => handleSortSelection("descending")}
                  >
                    <p className="text-sm">En Yüksek Fiyat</p>
                  </div>
                  <div
                    className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 font-semibold"
                    onClick={() => handleSortSelection("newest")}
                  >
                    <p className="text-sm">Önce En Yeni İlan</p>
                  </div>
                  <div
                    className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-gray-700 font-semibold"
                    onClick={() => handleSortSelection("oldest")}
                  >
                    <p className="text-sm">Önce En Eski İlan</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile header - without sorting for now */}
      <div className="block lg:hidden mb-8">
        <h1 className="text-[#262626] font-bold text-2xl">Yönetici İlanları</h1>
        <p className="text-[#595959] text-sm">
          {hotelCount} adet ilan bulundu.
        </p>
      </div>

      {hotelCount === 0 ? (
        <div
          className={`w-full flex flex-col items-center justify-center text-gray-500`}
        >
          <p className="text-center text-[#362C75] font-bold text-[24px]">
            Henüz İlan Yok
          </p>
          <p className="text-center text-[#262626] font-medium text-[16px] mt-4">
            Bu yöneticinin henüz aktiflestiriŽmiş ilanı bulunmuyor.
          </p>
          <button
            onClick={() => {
              localStorage.setItem("currentView", "list");
              router.push(`/`);
            }}
            className="bg-[#5E5691] rounded-2xl py-4 px-6 flex items-center justify-center text-white mt-5"
          >
            DiŽer İlanlara Göz At
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 -mx-3">
          {sortedHotels.map((hotel) => (
            <ResidentBox
              key={hotel._id}
              hotelId={hotel._id}
              slug={hotel.slug}
              type={getLocalizedText(
                hotel.listingType,
                selectedLanguage
              )}
              isOptinable={false}
              residentTypeName={getLocalizedText(
                hotel.housingType,
                selectedLanguage
              )}
              title={getLocalizedText(
                hotel.title,
                selectedLanguage
              )}
              price={getDisplayPrice(
                hotel.price,
                selectedCurrency
              )}
              bedCount={
                hotel.bedRoomCount?.toString() || "0"
              }
              floorCount={hotel.floorCount?.toString()}
              area={`${hotel.projectArea}m2`}
              locationText={formatAddress(
                hotel,
                selectedLanguage
              )}
              image={hotel.images?.[0] || ""}
              images={hotel.images || []}
              isFavorite={false}
              isListView={true}
              roomCount={hotel.roomCount || 0}
              entranceType={hotel.entranceType}
              priceAsNumber={hotel.price[0]?.amount || 0}
              areaAsNumber={+hotel.projectArea || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
