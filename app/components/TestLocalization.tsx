"use client";

import { useTranslations } from "next-intl";

export default function TestLocalization() {
  const commonT = useTranslations("common");
  const headerT = useTranslations("header");
  const filterT = useTranslations("filter");
  const propertyTypesT = useTranslations("propertyTypes");
  const mapT = useTranslations("map");

  return (
    <div className="p-8 bg-gray-50 rounded-lg max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6">Localization Test</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Common section */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Common</h3>
          <ul className="space-y-2">
            <li>
              <span className="font-medium">loading:</span> {commonT("loading")}
            </li>
            <li>
              <span className="font-medium">loadingMap:</span>{" "}
              {commonT("loadingMap")}
            </li>
          </ul>
        </div>

        {/* Header section */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Header</h3>
          <ul className="space-y-2">
            <li>
              <span className="font-medium">title:</span> {headerT("title")}
            </li>
            <li>
              <span className="font-medium">login:</span> {headerT("login")}
            </li>
            <li>
              <span className="font-medium">register:</span>{" "}
              {headerT("register")}
            </li>
            <li>
              <span className="font-medium">language:</span>{" "}
              {headerT("language")}
            </li>
            <li>
              <span className="font-medium">english:</span> {headerT("english")}
            </li>
            <li>
              <span className="font-medium">turkish:</span> {headerT("turkish")}
            </li>
          </ul>
        </div>

        {/* Filter section */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">Filter</h3>
          <ul className="space-y-2">
            <li>
              <span className="font-medium">title:</span> {filterT("title")}
            </li>
            <li>
              <span className="font-medium">location:</span>{" "}
              {filterT("location")}
            </li>
            <li>
              <span className="font-medium">price:</span> {filterT("price")}
            </li>
            <li>
              <span className="font-medium">type:</span> {filterT("type")}
            </li>
            <li>
              <span className="font-medium">rooms:</span> {filterT("rooms")}
            </li>
            <li>
              <span className="font-medium">applyFilter:</span>{" "}
              {filterT("applyFilter")}
            </li>
            <li>
              <span className="font-medium">clearFilter:</span>{" "}
              {filterT("clearFilter")}
            </li>
          </ul>
        </div>

        {/* Property Types section */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            Property Types
          </h3>
          <ul className="space-y-2">
            <li>
              <span className="font-medium">apartment:</span>{" "}
              {propertyTypesT("apartment")}
            </li>
            <li>
              <span className="font-medium">house:</span>{" "}
              {propertyTypesT("house")}
            </li>
            <li>
              <span className="font-medium">villa:</span>{" "}
              {propertyTypesT("villa")}
            </li>
            <li>
              <span className="font-medium">office:</span>{" "}
              {propertyTypesT("office")}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
