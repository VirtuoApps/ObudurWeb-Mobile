"use client";

import React, { useEffect, useState } from "react";
import Header from "../admin/Header/Header";
import Footer from "../resident/[slug]/Footer/Footer";
import FilterBox from "./FilterBox/FilterBox";
import FilterBoxSkeleton from "./FilterBoxSkeleton";
import HeaderSection from "./HeaderSection/HeaderSection";
import { savedFiltersApi, SavedFilter } from "../api/savedFilters";
import SimpleHeader from "@/app/components/SimpleHeader/SimpleHeader";

export default function FavoriAramalarPage() {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedFilters();
  }, []);

  const fetchSavedFilters = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = await savedFiltersApi.getMySavedFilters();
      setSavedFilters(filters);
    } catch (err) {
      setError("Favori aramalar yüklenirken bir hata oluştu.");
      console.error("Error fetching saved filters:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (filterId: string) => {
    // TODO: Implement update functionality
    console.log("Update filter:", filterId);
  };

  const handleDelete = async (filterId: string) => {
    // TODO: Implement delete functionality
    console.log("Delete filter:", filterId);
    // After deletion, refresh the list
    // await fetchSavedFilters();
  };

  return (
    <div className="w-full">
      <SimpleHeader showBackButton backUrl="/" />

      <div className="w-full bg-[#ebeaf1] min-h-screen px-4 sm:px-6 lg:px-0">
        <HeaderSection />
        <div className="w-full max-w-[1440px] mx-auto pb-8">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <FilterBoxSkeleton />
              <FilterBoxSkeleton />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-red-600 text-sm sm:text-base">{error}</div>
            </div>
          ) : savedFilters.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-gray-600 text-sm sm:text-base">
                Henüz favori aramanız bulunmuyor.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {savedFilters.map((filter) => (
                <FilterBox
                  key={filter._id}
                  filter={filter}
                  onUpdate={() => handleUpdate(filter._id || "")}
                  onDelete={() => handleDelete(filter._id || "")}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
