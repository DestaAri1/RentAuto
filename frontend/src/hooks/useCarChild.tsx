import { useCallback, useRef, useState } from "react";
import { CarChild } from "../types";
import {
  GetAllCarChild,
  GetOneCarChild,
} from "../services/CarChildServices.tsx";

export default function useCarChild() {
  const [carChildren, setCarChildren] = useState<CarChild[]>([]);
  const [carChild, setCarChild] = useState<CarChild | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isFetched = useRef<boolean>(false);

  const fetchCarChild = useCallback(
    async ({ slug, mode = "all" }: { slug: string; mode?: "all" | "one" }) => {
      setIsLoading(true);
      try {
        let result;

        if (mode === "one") {
          const {
            data: { data = [] },
          } = await GetOneCarChild(slug);
          setCarChild(data);
          result = data;
        } else {
          const {
            data: { data = [] },
          } = await GetAllCarChild(slug);
          setCarChildren(data);
          result = data;
        }

        isFetched.current = true;
        return result;
      } catch (error) {
        console.error(error);
        isFetched.current = true;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    carChildren,
    carChild,
    isFetched,
    isLoading,
    fetchCarChild,
  };
}
