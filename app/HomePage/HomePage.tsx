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
}: {
  features: Feature[];
  hotels: Hotel[];
}) {
  const [currentView, setCurrentView] = useState<"map" | "list">("map");
  return (
    <div className="bg-white">
      <Header />
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
