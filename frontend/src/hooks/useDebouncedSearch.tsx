// src/hooks/useDebouncedSearch.ts
import { useEffect, useState } from "react";

export function useDebouncedSearch<T>(
  data: T[],
  keyword: string,
  filterFn: (item: T, lowerKeyword: string) => boolean,
  delay: number = 500
) {
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [result, setResult] = useState<T[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword.toLowerCase());
    }, delay);

    return () => clearTimeout(timer);
  }, [keyword, delay]);

  useEffect(() => {
    if (!debouncedKeyword) {
      setResult(data);
    } else {
      const filtered = data.filter((item) => filterFn(item, debouncedKeyword));
      setResult(filtered);
    }
  }, [debouncedKeyword, data, filterFn]);

  return result;
}
