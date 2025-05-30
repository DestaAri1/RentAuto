import { useState, useMemo, useEffect } from "react";

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  paginatedItems: (items: T[]) => T[];
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export const usePagination = <T,>({
  totalItems,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn<T> => {
  const totalPages = useMemo(() => {
    if (totalItems === 0) return 0;
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  const [currentPage, setCurrentPage] = useState(
    totalPages === 0 ? 0 : Math.min(initialPage, totalPages)
  );

  // Perbaiki currentPage jika totalPages berubah
  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(0);
    } else if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const paginatedItems = (items: T[]): T[] => {
    if (totalPages === 0 || currentPage === 0) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    isFirstPage: currentPage <= 1,
    isLastPage: currentPage === totalPages || totalPages === 0,
  };
};

export default usePagination;
