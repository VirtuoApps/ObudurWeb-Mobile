import React from "react";
import PaginationBox from "@/app/HomePage/ListView/PaginationBox/PaginationBox";

export default function Pagination({
  currentPage,
  totalPages,
  goToPrevPage,
  goToNextPage,
  indexOfFirstItem,
  indexOfLastItem,
  paginate,
  filteredProperties,
}: {
  currentPage: number;
  totalPages: number;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  paginate: (pageNumber: number) => void;
  filteredProperties: any[];
}) {
  return (
    <div className="flex flex-col gap-4 items-center justify-between py-4 border-t border-gray-200 -mt-4">
      <PaginationBox
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={paginate}
      />
    </div>
  );
}
