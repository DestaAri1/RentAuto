import { useCallback, useRef, useState } from "react";
import { CarChild } from "../types";
import { GetAllCarChild } from "../services/CarChildServices.tsx";

export default function useCarChild() {
  const [carChildren, setCarChildren] = useState<CarChild[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isFetched = useRef<boolean>(false);

  const fetchCarChildren = useCallback(async (slug: string) => {
    setIsLoading(true);

    try {
      const {
        data: { data = [] },
      } = await GetAllCarChild(slug);
      setCarChildren(data)
      isFetched.current = true;

      return data;
    } catch (error) {
      console.log(error);
      isFetched.current = true;
    } finally {
      setIsLoading(false);
    }
  }, []);
  return {
    carChildren,
    isFetched,
    isLoading,
    fetchCarChildren,
  };
}
