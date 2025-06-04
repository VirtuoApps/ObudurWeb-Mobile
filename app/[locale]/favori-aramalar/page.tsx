"use client";

import React, { useEffect, useState } from "react";
import Header from "../admin/Header/Header";
import Footer from "../resident/[slug]/Footer/Footer";
import FilterBox from "./FilterBox/FilterBox";
import FilterBoxSkeleton from "./FilterBoxSkeleton";
import HeaderSection from "./HeaderSection/HeaderSection";
import { savedFiltersApi, SavedFilter } from "../api/savedFilters";
import SimpleHeader from "@/app/components/SimpleHeader/SimpleHeader";
import { FilterOptions } from "@/types/filter-options.type";
import { Hotel } from "@/types/hotel.type";
import { Feature } from "@/types/feature.type";
import axiosInstance from "@/axios";

export default function FavoriAramalarPage() {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [allQuickFilters, setAllQuickFilters] = useState<Feature[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setDataLoading(true);
      setError(null);

      // Fetch all required data in parallel
      const [
        filtersResponse,
        filterOptionsResponse,
        hotelsResponse,
        quickFiltersResponse,
      ] = await Promise.all([
        savedFiltersApi.getMySavedFilters(),
        axiosInstance.get("/hotels/filter-options"),
        axiosInstance.get("/hotels"),
        axiosInstance.get("/features/all-quick-filters"),
      ]);

      setSavedFilters(filtersResponse);
      setFilterOptions(filterOptionsResponse.data);
      setHotels(hotelsResponse.data);
      setAllQuickFilters(quickFiltersResponse.data);
    } catch (err) {
      setError("Favori aramalar yüklenirken bir hata oluştu.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
      setDataLoading(false);
    }
  };

  const handleUpdate = () => {
    // Refresh saved filters after update
    fetchData();
  };

  const handleDelete = async (filterId: string) => {
    try {
      await savedFiltersApi.deleteSavedFilter(filterId);
      // Refresh the list after deletion
      await fetchData();
    } catch (error) {
      console.error("Error deleting filter:", error);
      setError("Filtre silinirken bir hata oluştu.");
    }
  };

  return (
    <div className="w-full">
      <SimpleHeader showBackButton backUrl="/" />

      <div className="w-full bg-[#ebeaf1] min-h-screen  sm:px-6 lg:px-0">
        <HeaderSection />
        <div className="w-full max-w-[1440px] mx-auto pb-8 px-4">
          {loading || dataLoading ? (
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
          ) : !filterOptions ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-red-600 text-sm sm:text-base">
                Filtre seçenekleri yüklenemedi.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {savedFilters.map((filter) => (
                <FilterBox
                  key={filter._id}
                  filter={filter}
                  onUpdate={handleUpdate}
                  onDelete={() => handleDelete(filter._id || "")}
                  filterOptions={filterOptions}
                  hotels={hotels}
                  selectedCurrency="USD" // Default currency
                  searchRadius={5} // Default search radius in km
                  allQuickFilters={allQuickFilters}
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
