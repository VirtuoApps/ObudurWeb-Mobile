"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Header from "./Header/Header";
import FilterList from "./FilterList/FilterList";
import { useTranslations } from "next-intl";
import ViewSwitcher from "./ViewSwitcher/ViewSwitcher";
import ListView from "./ListView/ListView";

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

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"map" | "list">("map");
  return (
    <div className="bg-white">
      <Header />
      <FilterList />
      {currentView === "map" ? <MapView /> : <ListView />}
      <ViewSwitcher currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
}
