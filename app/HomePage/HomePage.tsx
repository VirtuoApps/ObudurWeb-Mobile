"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Header from "./Header/Header";
import FilterList from "./FilterList/FilterList";
import { useTranslations } from "next-intl";
import ViewSwitcher from "./ViewSwitcher/ViewSwitcher";
import ListView from "./ListView/ListView";
import { Feature } from "@/types/feature.type";
import { Hotel } from "@/types/hotel.type";
import { FilterType } from "@/types/filter.type";
import { FilterOptions } from "@/types/filter-options.type";
const MapView = dynamic(() => import("./MapView/MapView"), {
  ssr: false,
  loading: () => {
    // We need to use a client component for translations in a dynamic component
    return <MapLoadingIndicator />;
  },
});

function MapLoadingIndicator() {
  const t = useTranslations("common");

  return (
    <div className="w-full h-[calc(100vh-155px)] bg-gray-100 flex items-center justify-center">
      {t("loadingMap")}
    </div>
  );
}

export default function HomePage({
  features,
  hotels,
  filterOptions,
}: {
  features: Feature[];
  hotels: Hotel[];
  filterOptions: FilterOptions;
}) {
  const [currentView, setCurrentView] = useState<"map" | "list">("map");
  const [filters, setFilters] = useState<FilterType | null>(null);

  return (
    <div className="bg-white">
      <Header setFilters={setFilters} filterOptions={filterOptions} />
      <FilterList
        features={features}
        currentView={currentView}
        onChangeCurrentView={() => {
          if (currentView === "map") {
            setCurrentView("list");
          } else {
            setCurrentView("map");
          }
        }}
      />
      {currentView === "map" ? (
        <MapView hotels={hotels} />
      ) : (
        <ListView hotels={hotels} />
      )}
      {/* <ViewSwitcher currentView={currentView} setCurrentView={setCurrentView} /> */}
    </div>
  );
}
