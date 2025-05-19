"use client";

import Header from "../Header/Header";
import { useEffect, useState, useRef } from "react";
import {
  ArrowsUpDownIcon,
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
} from "@heroicons/react/24/outline";
import axiosInstance from "@/axios";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/store/hooks";

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

  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  const { user } = useAppSelector((state) => state.user);

  const router = useRouter();

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

  // Filter properties based on status and type filters
  const filteredProperties = properties.filter((property) => {
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
  });

  return (
    <div className="bg-[#ebeaf1] w-full h-full min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header section with filters */}
        <div className="  rounded-xl p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 font-bold">
                {user?.role === "super-admin"
                  ? "Tüm İlanlar"
                  : "Benim İlanlarım"}
              </h1>
              <p className="text-sm text-[#8F8F99] ">
                {filteredProperties.length} ilan listeleniyor
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Create listing button */}
              <button
                onClick={() => router.push("/admin/ilan-olustur")}
                className="flex items-center justify-center gap-2 bg-[#1EB173] rounded-lg py-2 px-4 text-sm font-medium text-white hover:bg-[#19935f] transition"
              >
                <span>İlan Oluştur</span>
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
              {/* Status filter dropdown */}
              <div className="relative" ref={statusDropdownRef}>
                <button
                  className="flex items-center justify-between gap-2 bg-white  rounded-lg w-[180px] py-2 px-4 text-sm text-gray-700  border border-gray-200  "
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                >
                  <span>{statusFilter === "all" ? "Durum" : statusFilter}</span>
                  <img
                    src="/chevron-down.png"
                    alt="arrow-down"
                    className="w-6 h-6"
                  />
                </button>
                {statusDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white  rounded-lg shadow-lg z-50 border border-gray-200 text-gray-700">
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
                  className="flex items-center justify-between gap-2 bg-white w-[180px]  rounded-lg px-4 py-2 text-sm text-gray-700  border border-gray-200 "
                  onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                >
                  <span>{typeFilter === "all" ? "İlan Türü" : typeFilter}</span>
                  <img
                    src="/chevron-down.png"
                    alt="arrow-down"
                    className="w-6 h-6"
                  />
                </button>
                {typeDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white  rounded-lg shadow-lg z-50 border border-gray-200 text-gray-700 ">
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
        <div className="bg-white  rounded-2xl shadow-md p-6 overflow-auto">
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
            <table className="w-full min-w-full divide-y divide-gray-200 ">
              <thead className="bg-white  sticky top-0 z-10">
                <tr>
                  <th className="py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 ">
                    No
                  </th>
                  <th className="py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 ">
                    İlan Özeti
                  </th>
                  <th className="py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 ">
                    Fiyat
                  </th>
                  <th className="py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 ">
                    Görüldü
                  </th>
                  <th className="py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 ">
                    Favori
                  </th>
                  <th className="py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 ">
                    Mesaj
                  </th>
                  <th className="py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 ">
                    Durum
                  </th>
                  <th className="py-4 text-right text-xs font-medium uppercase tracking-wide text-gray-500 ">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 ">
                {filteredProperties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50 ">
                    <td
                      className="py-4 first:pl-0 text-sm font-medium text-gray-700 "
                      data-label="No"
                    >
                      #{property.no}
                    </td>
                    <td
                      className="py-4 text-sm text-gray-500 "
                      data-label="İlan Özeti"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            property.images[0] || "https://placehold.co/96x96"
                          }
                          alt={property.title.tr}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 ">
                            {property.title.tr}
                          </h3>
                          <p className="line-clamp-2 text-gray-600  text-xs">
                            {property.description.tr}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      className="py-4 text-sm font-semibold text-gray-900 "
                      data-label="Fiyat"
                    >
                      {formatPrice(property.price)}
                    </td>
                    <td
                      className="py-4 text-sm text-gray-700 "
                      data-label="Görüldü"
                    >
                      <div className="flex items-center gap-1">
                        <EyeIcon className="h-4 w-4 text-gray-500 " />
                        <span className="text-sm font-medium">
                          {Math.floor(Math.random() * 1000)}
                        </span>
                      </div>
                    </td>
                    <td
                      className="py-4 text-sm text-gray-700 "
                      data-label="Favori"
                    >
                      <div className="flex items-center gap-1">
                        <HeartIcon className="h-4 w-4 text-gray-500 " />
                        <span className="text-sm font-medium">
                          {Math.floor(Math.random() * 100)}
                        </span>
                      </div>
                    </td>
                    <td
                      className="py-4 text-sm text-gray-700 "
                      data-label="Mesaj"
                    >
                      <div className="flex items-center gap-1">
                        <EnvelopeIcon className="h-4 w-4 text-gray-500 " />
                        <span className="text-sm font-medium">
                          {Math.floor(Math.random() * 50)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-sm" data-label="Durum">
                      <span
                        className=" rounded-md py-0.5 text-xs font-semibold text-white cursor-pointer w-[100px] flex items-center justify-center"
                        style={{
                          backgroundColor: getStatusBadgeColor(
                            property.status || "active"
                          ),
                        }}
                        onClick={() => {
                          setSelectedPropertyId(property._id);
                          setSelectedStatus(property.status || "active");
                          setStatusModalOpen(true);
                        }}
                      >
                        {getStatusText(property.status || "active")}
                      </span>
                    </td>
                    <td
                      className="py-4 last:pr-0 text-right w-[240px]"
                      data-label="İşlemler"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <img
                          src="/edit-icon.png"
                          alt="edit"
                          className="w-8 h-8 text-gray-500 hover:scale-110  cursor-pointer transition"
                          onClick={() => {
                            router.push(`/admin/ilani-duzenle/${property._id}`);
                          }}
                        />
                        <img
                          src="/message-details-icon.png"
                          alt="message-details"
                          className="w-4 h-4 text-gray-500 hover:scale-110  cursor-pointer transition"
                        />
                        <img
                          src="/location-icon.png"
                          alt="location"
                          className="w-5 h-5 text-gray-500 hover:scale-110  cursor-pointer transition"
                        />
                        <img
                          src="/share-icon.png"
                          alt="share"
                          className="w-4 h-4 text-gray-500 hover:scale-110  cursor-pointer transition"
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
          )}
        </div>
      </main>

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
              Bu ilanı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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
    </div>
  );
}
