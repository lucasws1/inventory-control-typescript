// components/Pagination.tsx
import React from "react";
import { usePagination } from "./usePagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "./ui/button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  paginationItemsToDisplay?: number;
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  paginationItemsToDisplay = 5,
}) => {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay,
  });

  return (
    <nav className="flex items-center justify-center gap-2">
      {/* Previous */}
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeftIcon className="h-4 w-4" /> Voltar
      </Button>

      {/* Left Ellipsis */}
      {showLeftEllipsis && <span className="px-2">...</span>}

      {/* Page Numbers */}
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "outline" : "ghost"}
          className="cursor-pointer"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {/* Right Ellipsis */}
      {showRightEllipsis && <span className="px-2">...</span>}

      {/* Next */}
      <Button
        variant="ghost"
        className="cursor-pointer"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Avançar <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </nav>
  );
};
