// src/hooks/useDebouncedSearch.ts
import { useEffect, useState, useCallback, useMemo } from "react";

export function useDebouncedSearch<T>(
  data: T[],
  keyword: string,
  filterFn: (item: T, lowerKeyword: string) => boolean,
  delay: number = 500
) {
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  // Menggunakan useCallback untuk memastikan referensi fungsi filter tetap sama
  const memoizedFilterFn = useCallback(filterFn, [filterFn]);

  // Menggunakan useEffect hanya untuk debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword.toLowerCase());
    }, delay);

    return () => clearTimeout(timer);
  }, [keyword, delay]);

  // Menggunakan useMemo untuk menghitung hasil filter tanpa memperbarui state
  // Ini mencegah re-render tambahan
  const result = useMemo(() => {
    if (!debouncedKeyword) {
      return data;
    } else {
      return data.filter((item) => memoizedFilterFn(item, debouncedKeyword));
    }
  }, [data, debouncedKeyword, memoizedFilterFn]);

  return result;
}
