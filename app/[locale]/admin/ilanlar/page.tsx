"use client";

import Header from "../Header/Header";
import { useEffect, useState, useRef } from "react";
import {
  EyeIcon,
  HeartIcon,
  EnvelopeIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  MapPinIcon,
  LinkIcon,
  TrashIcon,
  PauseIcon,
  PlayIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import axiosInstance, { mainWebsiteUrl } from "@/axios";
import { useRouter } from "@/app/utils/router";
import { useAppSelector } from "@/app/store/hooks";
import { toast, Toaster } from "react-hot-toast";
import Pagination from "./Pagination/Pagination";
import SimpleFooter from "@/app/components/SimpleFooter/SimpleFooter";
import SimpleHeader from "@/app/components/SimpleHeader/SimpleHeader";

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
}

interface Message {
  _id: string;
  senderUserId: string;
  hotelId: string;
  message: string;
  isInitialMessage: boolean;
  iWantToSeeProperty: boolean;
  from: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [unpublishModalOpen, setUnpublishModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [updateLoading, setUpdateLoading] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  const { user } = useAppSelector((state) => state.user);

  const router = useRouter();

  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedPropertyMessages, setSelectedPropertyMessages] = useState<
    Message[]
  >([]);
  const [activeMessageTab, setActiveMessageTab] = useState("unseen");
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node) &&
        statusDropdownOpen
      ) {
        setStatusDropdownOpen(false);
      }

      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target as Node) &&
        typeDropdownOpen
      ) {
        setTypeDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [statusDropdownOpen, typeDropdownOpen]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/hotels/mine");
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

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

  // Handle property publish/unpublish
  const handleUpdatePublishStatus = async (isPublished: boolean) => {
    if (!selectedPropertyId) return;

    try {
      setUpdateLoading(true);
      await axiosInstance.patch(`/admin/hotels/${selectedPropertyId}`, {
        isPublished,
      });

      // Close modals
      setPublishModalOpen(false);
      setUnpublishModalOpen(false);

      // Refetch properties
      await fetchProperties();
    } catch (error) {
      console.error("Error updating property publish status:", error);
    } finally {
      setUpdateLoading(false);
      setSelectedPropertyId(null);
    }
  };

  // Handle property delete
  const handleDeleteProperty = async () => {
    if (!selectedPropertyId) return;

    try {
      setUpdateLoading(true);
      await axiosInstance.delete(`/admin/hotels/${selectedPropertyId}`);

      // Close modal
      setDeleteModalOpen(false);

      // Refetch properties
      await fetchProperties();
    } catch (error) {
      console.error("Error deleting property:", error);
    } finally {
      setUpdateLoading(false);
      setSelectedPropertyId(null);
    }
  };

  // Handle property status update
  const handleUpdateStatus = async () => {
    if (!selectedPropertyId || !selectedStatus) return;

    try {
      setUpdateLoading(true);
      await axiosInstance.patch(`/admin/hotels/${selectedPropertyId}`, {
        status: selectedStatus,
      });

      // Close modal
      setStatusModalOpen(false);

      // Refetch properties
      await fetchProperties();
    } catch (error) {
      console.error("Error updating property status:", error);
    } finally {
      setUpdateLoading(false);
      setSelectedPropertyId(null);
      setSelectedStatus("");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "#1EB173";
      case "inactive":
        return "#EF1A28";
      case "optioned":
        return "#E75234";
      case "stopped":
        return "#FA9441";
      case "sold":
        return "#362C75";
      default:
        return "#1EB173";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Aktif";
      case "inactive":
        return "Aktif Değil";
      case "optioned":
        return "Opsiyonlandı";
      case "stopped":
        return "Durduruldu";
      case "sold":
        return "Satıldı";
      default:
        return "Aktif";
    }
  };

  // Sorting handler
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if already sorting by this field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.6001 5.59995L8.0001 3.19995L10.4001 5.59995"
            stroke="#8C8C8C"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="round"
          />
          <path
            d="M10.4001 10.3984L8.0001 12.7984L5.6001 10.3984"
            stroke="#8C8C8C"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    return sortDirection === "asc" ? (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.6001 5.59995L8.0001 3.19995L10.4001 5.59995"
          stroke="#595959"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
        <path
          d="M10.4001 10.3984L8.0001 12.7984L5.6001 10.3984"
          stroke="#BFBFBF"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.6001 5.59995L8.0001 3.19995L10.4001 5.59995"
          stroke="#BFBFBF"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
        <path
          d="M10.4001 10.3984L8.0001 12.7984L5.6001 10.3984"
          stroke="#595959"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  // Filter properties based on status and type filters
  const filteredProperties = properties
    .filter((property) => {
      // Status filter
      if (statusFilter !== "all") {
        const statusKey = {
          Aktif: "active",
          "Aktif Değil": "inactive",
          Opsiyonlandı: "optioned",
          Durduruldu: "stopped",
          Satıldı: "sold",
        }[statusFilter];

        if (property.status !== statusKey) {
          return false;
        }
      }

      // Type filter
      if (typeFilter !== "all") {
        if (property.listingType?.tr !== typeFilter) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      let comparison = 0;
      switch (sortField) {
        case "price":
          const aPrice = a.price && a.price.length > 0 ? a.price[0].amount : 0;
          const bPrice = b.price && b.price.length > 0 ? b.price[0].amount : 0;
          comparison = aPrice - bPrice;
          break;
        case "date":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "views":
          comparison = (a.viewCount || 0) - (b.viewCount || 0);
          break;
        case "favorites":
          comparison = (a.favoriteCount || 0) - (b.favoriteCount || 0);
          break;
        case "messages":
          comparison = (a.totalMessageCount || 0) - (b.totalMessageCount || 0);
          break;
        default:
          return 0;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProperties.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Go to previous page
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Go to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, typeFilter]);

  // Fetch messages for a property
  const fetchPropertyMessages = async (propertyId: string) => {
    try {
      setMessagesLoading(true);
      const response = await axiosInstance.get(`/hotel-messages/${propertyId}`);
      setSelectedPropertyMessages(response.data);
    } catch (error) {
      console.error("Error fetching property messages:", error);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Update message seen status
  const updateMessageSeenStatus = async (
    messageId: string,
    isSeen: boolean
  ) => {
    try {
      await axiosInstance.patch(`/hotel-messages/${messageId}`, {
        isSeen,
      });

      // Update local state
      setSelectedPropertyMessages((prevMessages) =>
        prevMessages.map((message) =>
          message._id === messageId ? { ...message, isSeen } : message
        )
      );
    } catch (error) {
      console.error("Error updating message seen status:", error);
    }
  };

  // Mark all messages as seen
  const markAllAsSeen = async () => {
    try {
      const unseenMessages = selectedPropertyMessages.filter(
        (message) => !message.isSeen
      );

      for (const message of unseenMessages) {
        await updateMessageSeenStatus(message._id, true);
      }
    } catch (error) {
      console.error("Error marking all messages as seen:", error);
    }
  };

  const renderStatusByProperty = (property: any) => {
    if (property.isPublished && property.isConfirmedByAdmin) {
      return (
        <span
          className=" rounded-md py-0.5 text-xs font-semibold text-white cursor-pointer w-[100px] flex items-center justify-center"
          style={{
            backgroundColor: "#1EB173",
          }}
        >
          Aktif
        </span>
      );
    }

    if (property.isPublished && !property.isConfirmedByAdmin) {
      return (
        <span
          className=" rounded-md py-0.5 text-xs font-semibold text-white cursor-pointer w-[100px] flex items-center justify-center"
          style={{
            backgroundColor: "#FA9441",
          }}
        >
          Onay Bekliyor
        </span>
      );
    }

    if (!property.isPublished) {
      return (
        <span
          className=" rounded-md py-0.5 text-xs font-semibold text-white cursor-pointer w-[100px] flex items-center justify-center"
          style={{
            backgroundColor: "#362C75",
          }}
        >
          Duraklatıldı
        </span>
      );
    }

    return null;
  };

  return (
    <>
      <div className="bg-[#ebeaf1] w-full h-full min-h-screen pb-6">
        <SimpleHeader customRedirectUrl="/" />
        <Toaster position="top-center" />
        <main className="max-w-[1440px] mx-auto py-8">
          {/* Header section with filters */}
          <div className="  rounded-xl p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl  text-gray-800 font-bold">
                  {user?.role === "super-admin"
                    ? "Tüm İlanlar"
                    : "Benim İlanlarım"}
                </h1>
                <p className="text-sm text-[#8F8F99] ">
                  {filteredProperties.length} ilan listeleniyor
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {/* Status filter dropdown */}
                <div className="relative" ref={statusDropdownRef}>
                  <button
                    className="flex items-center justify-between gap-2 bg-white  rounded-2xl w-[240px] py-4 px-4 text-sm text-gray-700  border border-gray-200  "
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  >
                    <span>
                      {statusFilter === "all" ? "Durum" : statusFilter}
                    </span>
                    <img
                      src="/chevron-down.png"
                      alt="arrow-down"
                      className="w-6 h-6"
                    />
                  </button>
                  {statusDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-[240px] bg-white  rounded-lg shadow-lg z-50 border border-gray-200 text-gray-700">
                      <ul className="py-1">
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            setStatusFilter("all");
                            setStatusDropdownOpen(false);
                          }}
                        >
                          Tümü
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            setStatusFilter("Aktif");
                            setStatusDropdownOpen(false);
                          }}
                        >
                          Aktif
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            setStatusFilter("Satıldı");
                            setStatusDropdownOpen(false);
                          }}
                        >
                          Satıldı
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            setStatusFilter("Durduruldu");
                            setStatusDropdownOpen(false);
                          }}
                        >
                          Durduruldu
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            setStatusFilter("Aktif Değil");
                            setStatusDropdownOpen(false);
                          }}
                        >
                          Aktif Değil
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Listing type filter dropdown */}
                <div className="relative" ref={typeDropdownRef}>
                  <button
                    className="flex items-center justify-between gap-2 bg-white rounded-2xl w-[240px] py-4 px-4 text-sm text-gray-700  border border-gray-200 "
                    onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                  >
                    <span>
                      {typeFilter === "all" ? "İlan Türü" : typeFilter}
                    </span>
                    <img
                      src="/chevron-down.png"
                      alt="arrow-down"
                      className="w-6 h-6"
                    />
                  </button>
                  {typeDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-[240px] bg-white  rounded-lg shadow-lg z-50 border border-gray-200 text-gray-700 ">
                      <ul className="py-1">
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            setTypeFilter("all");
                            setTypeDropdownOpen(false);
                          }}
                        >
                          Tümü
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            setTypeFilter("Satılık");
                            setTypeDropdownOpen(false);
                          }}
                        >
                          Satılık
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => {
                            setTypeFilter("Kiralık");
                            setTypeDropdownOpen(false);
                          }}
                        >
                          Kiralık
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Table/card section */}
          <div className="bg-white  rounded-2xl shadow-md p-6 px-0 overflow-auto pt-0">
            {loading ? (
              <div className="flex justify-center items-center h-screen">
                <span className="text-gray-500 ">Yükleniyor...</span>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Hiç ilanınız yok
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  İlk ilanınızı oluşturarak başlayın
                </p>
                <button
                  onClick={() => router.push("/admin/ilan-olustur")}
                  className="flex items-center justify-center gap-2 bg-[#1EB173] rounded-lg py-2 px-4 text-sm font-medium text-white hover:bg-[#19935f] transition"
                >
                  <span>İlk İlanını Oluştur</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 4.16667V15.8333"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.16669 10H15.8334"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <table
                  className="w-full min-w-full divide-y divide-gray-200"
                  style={{ borderCollapse: "separate", borderSpacing: 0 }}
                >
                  <thead className="bg-white  sticky top-0 z-10">
                    <tr>
                      <th className="py-4 px-4 text-left text-sm   tracking-wide text-[#595959] font-bold border-r border-[#F0F0F0]">
                        No
                      </th>
                      <th className="py-4 px-4 text-left text-sm font-bold  tracking-wide text-[#595959] border-r border-[#F0F0F0]">
                        İlan Özeti
                      </th>
                      <th
                        className="py-4 px-4 text-left text-sm font-bold  tracking-wide text-[#595959] cursor-pointer border-r border-[#F0F0F0]"
                        onClick={() => handleSort("price")}
                      >
                        <div className="flex items-center gap-1">
                          Fiyat {getSortIcon("price")}
                        </div>
                      </th>
                      <th
                        className="py-4 px-4 text-left text-sm font-bold  tracking-wide text-[#595959] cursor-pointer border-r border-[#F0F0F0]"
                        onClick={() => handleSort("views")}
                      >
                        <div className="flex items-center gap-1">
                          Görüldü {getSortIcon("views")}
                        </div>
                      </th>
                      <th
                        className="py-4 px-4 text-left text-sm font-bold  tracking-wide text-[#595959] cursor-pointer border-r border-[#F0F0F0]"
                        onClick={() => handleSort("favorites")}
                      >
                        <div className="flex items-center gap-1">
                          Favori {getSortIcon("favorites")}
                        </div>
                      </th>
                      <th
                        className="py-4 px-4 text-left text-sm font-bold  tracking-wide text-[#595959] cursor-pointer border-r border-[#F0F0F0]"
                        onClick={() => handleSort("messages")}
                      >
                        <div className="flex items-center gap-1">
                          Mesaj {getSortIcon("messages")}
                        </div>
                      </th>
                      <th className="py-4 px-4 text-left text-sm font-bold  tracking-wide text-[#595959] border-r border-[#F0F0F0]">
                        Durum
                      </th>

                      <th className="py-4 px-4 text-left text-sm font-bold  tracking-wide text-[#595959]">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 ">
                    {currentItems.map((property, index) => (
                      <tr
                        key={property._id}
                        className="hover:bg-gray-50"
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#F5F5F566" : "#fff",
                        }}
                      >
                        <td
                          className="py-4 px-4 text-sm font-medium text-gray-700 border-r border-[#F0F0F0]"
                          data-label="No"
                        >
                          #{property.no}
                        </td>
                        <td
                          className="py-4 px-4 text-sm text-gray-500 border-r border-[#F0F0F0]"
                          data-label="İlan Özeti"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={
                                property.images[0] ||
                                "https://placehold.co/96x96"
                              }
                              alt={property.title.tr}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <p className=" text-[#8C8C8C]  text-[14px]">
                                {property.listingType.tr}
                              </p>
                              <h3
                                className="text-sm font-bold text-[#262626] cursor-pointer "
                                onClick={() => {
                                  window.open(
                                    `/resident/${property.slug}`,
                                    "_blank"
                                  );
                                }}
                              >
                                {property.title.tr}
                              </h3>
                            </div>
                          </div>
                        </td>
                        <td
                          className="py-4 px-4 text-sm font-semibold text-gray-900 border-r border-[#F0F0F0]"
                          data-label="Fiyat"
                        >
                          {formatPrice(property.price)}
                        </td>
                        <td
                          className="py-4 px-4 text-sm text-gray-700 border-r border-[#F0F0F0]"
                          data-label="Görüldü"
                        >
                          <div className="flex items-center gap-1">
                            <EyeIcon className="h-4 w-4 text-gray-500 " />
                            <span className="text-sm font-medium">
                              {property.viewCount || 0}
                            </span>
                          </div>
                        </td>
                        <td
                          className="py-4 px-4 text-sm text-gray-700 border-r border-[#F0F0F0]"
                          data-label="Favori"
                        >
                          <div className="flex items-center gap-1">
                            <HeartIcon className="h-4 w-4 text-gray-500 " />
                            <span className="text-sm font-medium">
                              {property.favoriteCount || 0}
                            </span>
                          </div>
                        </td>
                        <td
                          className="py-4 px-4 text-sm text-gray-700 border-r border-[#F0F0F0]"
                          data-label="Mesaj"
                        >
                          <div
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => {
                              setSelectedProperty(property);
                              setSelectedPropertyId(property._id);
                              fetchPropertyMessages(property._id);
                              setMessageModalOpen(true);
                            }}
                          >
                            <EnvelopeIcon className="h-4 w-4 text-gray-500 " />
                            <span className="text-sm font-medium">
                              {property.totalMessageCount}
                            </span>
                          </div>
                        </td>
                        <td
                          className="py-4 px-4 text-sm border-r border-[#F0F0F0]"
                          data-label="Durum"
                        >
                          {renderStatusByProperty(property)}
                        </td>

                        <td
                          className="py-4 px-4 text-right w-[240px]"
                          data-label="İşlemler"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <img
                              src="/edit-icon.png"
                              alt="edit"
                              className="w-8 h-8 text-gray-500 hover:scale-110  cursor-pointer transition"
                              onClick={() => {
                                router.push(
                                  `/admin/ilani-duzenle/${property._id}`
                                );
                              }}
                            />
                            <img
                              src="/location-icon.png"
                              alt="location"
                              className="w-5 h-5 text-gray-500 hover:scale-110 cursor-pointer transition"
                              onClick={() => {
                                if (
                                  property.location &&
                                  property.location.coordinates
                                ) {
                                  const [lng, lat] =
                                    property.location.coordinates;
                                  window.open(
                                    `https://www.google.com/maps?q=${lat},${lng}`,
                                    "_blank"
                                  );
                                }
                              }}
                            />
                            <img
                              src="/share-icon.png"
                              alt="share"
                              className="w-4 h-4 text-gray-500 hover:scale-110 cursor-pointer transition"
                              onClick={() => {
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
                              }}
                            />
                            {property.isPublished && (
                              <button
                                className="flex items-center justify-center gap-2 w-[102px] h-[36px] border border-[#D9D9D9] rounded-lg py-2 px-2.5 text-xs font-medium text-[#FA9441] transition cursor-pointer"
                                onClick={() => {
                                  setSelectedPropertyId(property._id);
                                  setUnpublishModalOpen(true);
                                }}
                              >
                                <img
                                  src="/pause-icon.png"
                                  alt="pause"
                                  className="w-4 h-4"
                                />
                                Duraklat
                              </button>
                            )}

                            {!property.isPublished && (
                              <button
                                className="flex items-center justify-center gap-2 w-[102px] h-[36px] border border-[#D9D9D9] rounded-lg py-2 px-2.5 text-xs font-medium text-[#1EB173] transition cursor-pointer"
                                onClick={() => {
                                  setSelectedPropertyId(property._id);
                                  setPublishModalOpen(true);
                                }}
                              >
                                <img
                                  src="/publish-icon.png"
                                  alt="publish"
                                  className="w-4 h-4"
                                />
                                Yayınla
                              </button>
                            )}

                            <TrashIcon
                              className="w-5 h-5 text-[#EF1A28] hover:text-red-600 cursor-pointer transition"
                              onClick={() => {
                                setSelectedPropertyId(property._id);
                                setDeleteModalOpen(true);
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </main>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPrevPage={goToPrevPage}
          goToNextPage={goToNextPage}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
          paginate={paginate}
          filteredProperties={filteredProperties}
        />

        {/* Publish confirmation modal */}
        {publishModalOpen && (
          <div
            className="fixed inset-0  flex items-center justify-center z-50"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Onay</h3>
              <p className="mb-6 text-gray-700">
                Yayınlamak istediğinize emin misiniz?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => {
                    setPublishModalOpen(false);
                    setSelectedPropertyId(null);
                  }}
                  disabled={updateLoading}
                >
                  İptal
                </button>
                <button
                  className="px-4 py-2 bg-[#1EB173] text-white rounded-lg hover:bg-[#19935f] transition"
                  onClick={() => handleUpdatePublishStatus(true)}
                  disabled={updateLoading}
                >
                  {updateLoading ? "Yükleniyor..." : "Yayınla"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Unpublish confirmation modal */}
        {unpublishModalOpen && (
          <div
            className="fixed inset-0  flex items-center justify-center z-50"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Onay</h3>
              <p className="mb-6 text-gray-700">
                Yayından kaldırmak istediğinize emin misiniz?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => {
                    setUnpublishModalOpen(false);
                    setSelectedPropertyId(null);
                  }}
                  disabled={updateLoading}
                >
                  İptal
                </button>
                <button
                  className="px-4 py-2 bg-[#FA9441] text-white rounded-lg hover:bg-[#e5863b] transition"
                  onClick={() => handleUpdatePublishStatus(false)}
                  disabled={updateLoading}
                >
                  {updateLoading ? "Yükleniyor..." : "Duraklat"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete confirmation modal */}
        {deleteModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Onay</h3>
              <p className="mb-6 text-gray-700">
                Bu ilanı silmek istediğinize emin misiniz? Bu işlem geri
                alınamaz.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setSelectedPropertyId(null);
                  }}
                  disabled={updateLoading}
                >
                  İptal
                </button>
                <button
                  className="px-4 py-2 bg-[#EF1A28] text-white rounded-lg hover:bg-red-700 transition"
                  onClick={handleDeleteProperty}
                  disabled={updateLoading}
                >
                  {updateLoading ? "Yükleniyor..." : "Sil"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status update modal */}
        {statusModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Durum Güncelle
              </h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durum
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Aktif Değil</option>
                  <option value="optioned">Opsiyonlandı</option>
                  <option value="stopped">Durduruldu</option>
                  <option value="sold">Satıldı</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => {
                    setStatusModalOpen(false);
                    setSelectedPropertyId(null);
                    setSelectedStatus("");
                  }}
                  disabled={updateLoading}
                >
                  İptal
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  onClick={handleUpdateStatus}
                  disabled={updateLoading}
                >
                  {updateLoading ? "Yükleniyor..." : "Güncelle"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages modal */}
        {messageModalOpen && selectedProperty && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  <span>{selectedProperty.title.tr}</span> -{" "}
                  <span className="text-sm text-gray-500">
                    #{selectedProperty.no}
                  </span>
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setMessageModalOpen(false);
                    setSelectedPropertyId(null);
                    setSelectedProperty(null);
                    setSelectedPropertyMessages([]);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Message tabs */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeMessageTab === "unseen"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveMessageTab("unseen")}
                >
                  Görülmemiş (
                  {selectedPropertyMessages.filter((m) => !m.isSeen).length})
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm ${
                    activeMessageTab === "seen"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveMessageTab("seen")}
                >
                  Görüldü (
                  {selectedPropertyMessages.filter((m) => m.isSeen).length})
                </button>
                {activeMessageTab === "unseen" &&
                  selectedPropertyMessages.filter((m) => !m.isSeen).length >
                    0 && (
                    <button
                      className="ml-auto px-4 py-2 text-xs font-medium text-blue-600 hover:text-blue-800"
                      onClick={markAllAsSeen}
                    >
                      Tümünü Okundu Olarak İşaretle
                    </button>
                  )}
              </div>

              {/* Message content */}
              <div className="flex-1 overflow-y-auto">
                {messagesLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <span className="text-gray-500">Yükleniyor...</span>
                  </div>
                ) : selectedPropertyMessages.length === 0 ? (
                  <div className="flex justify-center items-center h-40">
                    <span className="text-gray-500">
                      Bu ilanla ilgili henüz mesaj yok
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedPropertyMessages
                      .filter((message) =>
                        activeMessageTab === "seen"
                          ? message.isSeen
                          : !message.isSeen
                      )
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((message) => (
                        <div
                          key={message._id}
                          className={`p-4 rounded-lg ${
                            message.isSeen ? "bg-gray-50" : "bg-blue-50"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {message.firstName} {message.lastName}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {new Date(message.createdAt).toLocaleString(
                                  "tr-TR"
                                )}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <button
                                className={`p-1 rounded-full ${
                                  message.isSeen
                                    ? "text-gray-400 hover:text-gray-600"
                                    : "text-blue-500 hover:text-blue-700"
                                }`}
                                onClick={() =>
                                  updateMessageSeenStatus(
                                    message._id,
                                    !message.isSeen
                                  )
                                }
                                title={
                                  message.isSeen
                                    ? "Okunmadı Olarak İşaretle"
                                    : "Okundu Olarak İşaretle"
                                }
                              >
                                <CheckCircleIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">
                            {message.message}
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div>
                              <span className="font-medium">E-posta:</span>{" "}
                              {message.email}
                            </div>
                            <div>
                              <span className="font-medium">Telefon:</span>{" "}
                              {message.phoneNumber}
                            </div>
                            {message.iWantToSeeProperty && (
                              <div className="col-span-2 mt-2">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                  Müşteriyle görüşme talebi
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <SimpleFooter />
    </>
  );
}
