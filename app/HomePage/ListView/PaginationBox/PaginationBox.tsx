import React from "react";

interface PaginationBoxProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function PaginationBox({
  currentPage = 1,
  totalPages = 10,
  onPageChange,
}: PaginationBoxProps) {
  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageButton = (pageNumber: number, isActive: boolean = false) => (
    <button
      key={pageNumber}
      onClick={() => handlePageChange(pageNumber)}
      className={`w-9 h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-all duration-200 cursor-pointer text-[#262626] ${
        isActive
          ? " bg-white border border-[#D9D9D9]"
          : "bg-[#fff] border border-transparent   hover:bg-gray-50"
      }`}
    >
      {pageNumber}
    </button>
  );

  const renderArrowButton = (
    direction: "prev" | "next",
    disabled: boolean = false
  ) => (
    <button
      onClick={() => {
        if (direction === "prev") {
          handlePageChange(currentPage - 1);
        } else {
          handlePageChange(currentPage + 1);
        }
      }}
      disabled={disabled}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
        disabled
          ? "bg-[#F0F0F0] cursor-not-allowed"
          : "bg-[#5E5691] hover:bg-[#4a4578] cursor-pointer"
      }`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="flex-shrink-0"
      >
        {direction === "prev" ? (
          <path
            d="M10 12L6 8L10 4"
            stroke={disabled ? "#8C8C8C" : "#FCFCFC"}
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6 4L10 8L6 12"
            stroke={disabled ? "#8C8C8C" : "#FCFCFC"}
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );

  const renderEllipsis = () => (
    <div className="w-9 h-9 flex items-center justify-center text-[#262626] text-sm font-medium">
      ...
    </div>
  );

  // Helper function to generate valid page numbers
  const generatePageNumbers = (start: number, end: number) => {
    const pages = [];
    for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center gap-1 py-2">
      {/* Previous Arrow */}
      {renderArrowButton("prev", currentPage === 1)}

      {/* Page Numbers */}
      {totalPages <= 7 ? (
        // Show all pages if total is 7 or less
        generatePageNumbers(1, totalPages).map((page) =>
          renderPageButton(page, page === currentPage)
        )
      ) : currentPage <= 4 ? (
        // Show first 5 pages when on early pages
        <>
          {generatePageNumbers(1, 5).map((page) =>
            renderPageButton(page, page === currentPage)
          )}
          {renderEllipsis()}
          {renderPageButton(totalPages, false)}
        </>
      ) : currentPage >= totalPages - 3 ? (
        // Show last 5 pages when on later pages
        <>
          {renderPageButton(1, false)}
          {renderEllipsis()}
          {generatePageNumbers(totalPages - 4, totalPages).map((page) =>
            renderPageButton(page, page === currentPage)
          )}
        </>
      ) : (
        // Show current page with context
        <>
          {renderPageButton(1, false)}
          {renderEllipsis()}
          {generatePageNumbers(currentPage - 1, currentPage + 1).map((page) =>
            renderPageButton(page, page === currentPage)
          )}
          {renderEllipsis()}
          {renderPageButton(totalPages, false)}
        </>
      )}

      {/* Next Arrow */}
      {renderArrowButton("next", currentPage === totalPages)}
    </div>
  );
}
