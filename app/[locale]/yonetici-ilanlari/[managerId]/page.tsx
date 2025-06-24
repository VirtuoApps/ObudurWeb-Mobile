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
import { toast, Toaster } from "react-hot-toast";

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
  estateAgency: string;
}

interface ManagerHotelsResponse {
  manager: Manager;
  hotels: Hotel[];
}

export default function ManagerPage() {
  const router = useRouter();
  const params = useParams();
  const managerId = params.managerId as string;

  const [managerData, setManagerData] = useState<ManagerHotelsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<
    "ascending" | "descending" | "newest" | "oldest" | null
  >(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [phoneCopied, setPhoneCopied] = useState(false);

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
        const response = await axiosInstance.get(
          `/hotels/manager/${managerId}`
        );
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

  const copyPhoneToClipboard = async () => {
    if (managerData?.manager.phoneNumber) {
      try {
        await navigator.clipboard.writeText(managerData.manager.phoneNumber);
        setPhoneCopied(true);
        toast.success("Telefon numarası kopyalandı");
        // Hide the success message after 2 seconds
        setTimeout(() => {
          setPhoneCopied(false);
        }, 2000);
      } catch (error) {
        console.error("Failed to copy phone number:", error);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = managerData?.manager.phoneNumber || "";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          setPhoneCopied(true);
          setTimeout(() => {
            setPhoneCopied(false);
          }, 2000);
        } catch (fallbackError) {
          console.error("Fallback copy failed:", fallbackError);
        }
        document.body.removeChild(textArea);
      }
    }
  };

  const handlePhoneAction = () => {
    if (!managerData?.manager.phoneNumber) return;
    // Check if device is mobile (iOS or Android)
    const isMobile =
      /iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile|WPDesktop/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      // On mobile devices, initiate phone call
      window.location.href = `tel:${managerData?.manager.phoneNumber}`;
    } else {
      // On desktop, copy to clipboard
      copyPhoneToClipboard();
    }
  };

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
            Yönetici ilanları yüklenirken bir hata oluştu. Lütfen daha sonra
            tekrar deneyin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />

      {managerData?.manager && (
        <div className="mb-8 bg-[#362C75] p-6 rounded-lg shadow-sm border">
          <div className="flex lg:flex-row flex-col lg:items-center items-start justify-between gap-4 container mx-auto">
            <div className="flex items-center gap-4">
              <img
                src={managerData.manager.profilePicture}
                alt={`${managerData.manager.firstName} ${managerData.manager.lastName}`}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold text-[#FCFCFC]">
                  {managerData.manager.firstName} {managerData.manager.lastName}
                </h2>
                <p className="text-[#FCFCFC] text-sm">
                  {managerData.manager.estateAgency}
                </p>
              </div>
            </div>

            <button
              onClick={handlePhoneAction}
              className="bg-[#EC755D] w-[211px] rounded-2xl flex flex-row items-center justify-center h-[56px] text-[#FCFCFC] cursor-pointer transition-all duration-200 lg:w-auto w-full"
            >
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.8715 6.32632C14.0713 6.52742 15.1613 7.09414 16.0315 7.9625C16.9016 8.83087 17.4649 9.91861 17.671 11.116M13.0547 2.40039C15.1888 2.76145 17.1352 3.77149 18.6831 5.3117C20.2311 6.85647 21.2386 8.79887 21.6004 10.9286M19.9333 19.4021C19.9333 19.4021 18.7747 20.5401 18.4907 20.8737C18.0282 21.3673 17.4832 21.6004 16.7688 21.6004C16.7001 21.6004 16.6268 21.6004 16.5581 21.5958C15.1979 21.509 13.9339 20.9788 12.9859 20.5264C10.3938 19.2741 8.11773 17.4962 6.22631 15.243C4.66463 13.3646 3.62046 11.6279 2.92893 9.76321C2.50302 8.62519 2.34731 7.73854 2.416 6.90217C2.4618 6.36744 2.66789 5.92412 3.048 5.54478L4.60968 3.9863C4.83408 3.77606 5.07223 3.6618 5.30579 3.6618C5.59431 3.6618 5.82788 3.83547 5.97443 3.98173C5.97901 3.9863 5.98359 3.99087 5.98817 3.99544C6.26753 4.25595 6.53315 4.5256 6.81251 4.81353C6.95448 4.95978 7.10103 5.10603 7.24758 5.25685L8.49784 6.50455C8.98329 6.98901 8.98329 7.4369 8.49784 7.92136C8.36503 8.0539 8.2368 8.18644 8.10399 8.31441C7.71929 8.70746 8.02149 8.40587 7.62306 8.76236C7.6139 8.7715 7.60474 8.77607 7.60016 8.78521C7.2063 9.17826 7.27958 9.56217 7.36201 9.82268C7.36659 9.83639 7.37117 9.8501 7.37575 9.86381C7.70091 10.6499 8.15888 11.3903 8.855 12.2724L8.85958 12.277C10.1236 13.8309 11.4563 15.042 12.9263 15.9698C13.1141 16.0886 13.3065 16.1846 13.4896 16.276C13.6545 16.3583 13.8102 16.436 13.943 16.5182C13.9614 16.5274 13.9797 16.5411 13.998 16.5502C14.1537 16.6279 14.3003 16.6645 14.4514 16.6645C14.8315 16.6645 15.0696 16.4268 15.1475 16.3491L16.0452 15.4533C16.2009 15.2979 16.4482 15.1105 16.7367 15.1105C17.0207 15.1105 17.2542 15.2887 17.3962 15.4441C17.4008 15.4487 17.4008 15.4487 17.4054 15.4533L19.9288 17.9715C20.4005 18.4377 19.9333 19.4021 19.9333 19.4021Z"
                  stroke="#FCFCFC"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="ml-4">{managerData.manager.phoneNumber}</span>
            </button>
          </div>
        </div>
      )}
      <div className="container mx-auto p-8 pb-0 px-2">
        {/* Manager Information Section */}

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
          <h1 className="text-[#262626] font-bold text-2xl">
            Yönetici İlanları
          </h1>
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
              Diğer İlanlara Göz At
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 -mx-3">
            {sortedHotels.map((hotel) => (
              <ResidentBox
                key={hotel._id}
                hotelId={hotel._id}
                slug={hotel.slug}
                type={getLocalizedText(hotel.listingType, selectedLanguage)}
                isOptinable={false}
                residentTypeName={getLocalizedText(
                  hotel.housingType,
                  selectedLanguage
                )}
                title={getLocalizedText(hotel.title, selectedLanguage)}
                price={getDisplayPrice(hotel.price, selectedCurrency)}
                bedCount={hotel.bedRoomCount?.toString() || "0"}
                floorCount={hotel.floorCount?.toString()}
                area={`${hotel.projectArea}m2`}
                locationText={formatAddress(hotel, selectedLanguage)}
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
    </>
  );
}
