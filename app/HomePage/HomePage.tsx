"use client";

import React from "react";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-100px)] bg-gray-100 flex items-center justify-center">
      Loading map...
    </div>
  ),
});

export default function HomePage() {
  return (
    <div className="">
      <MapView />
    </div>
  );
}
