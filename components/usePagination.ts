// components/usePagination.ts
type UsePaginationProps = {
  currentPage: number;
  totalPages: number;
  paginationItemsToDisplay?: number;
};

type UsePaginationReturn = {
  pages: number[];
  showLeftEllipsis: boolean;
  showRightEllipsis: boolean;
};

export function usePagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay = 5,
}: UsePaginationProps): UsePaginationReturn {
  const showLeftEllipsis = currentPage - 1 > paginationItemsToDisplay / 2;
  const showRightEllipsis =
    totalPages - currentPage > Math.floor(paginationItemsToDisplay / 2);

  function calculatePaginationRange(): number[] {
    if (totalPages <= paginationItemsToDisplay) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfDisplay = Math.floor(paginationItemsToDisplay / 2);
    let start = Math.max(1, currentPage - halfDisplay);
    let end = Math.min(totalPages, currentPage + halfDisplay);

    if (start === 1) {
      end = paginationItemsToDisplay;
    }
    if (end === totalPages) {
      start = totalPages - paginationItemsToDisplay + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  const pages = calculatePaginationRange();

  return {
    pages,
    showLeftEllipsis,
    showRightEllipsis,
  };
}
