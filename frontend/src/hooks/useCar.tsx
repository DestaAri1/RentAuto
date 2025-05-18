import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DeleteCar, GetAllCars } from "../services/CarServices.tsx";
import { Cars } from "../types/index.tsx";

export default function useCar() {
  const [cars, setCars] = useState<Cars[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isFetched = useRef<boolean>(false);

  const fetchCars = useCallback(async () => {
    setIsLoading(true);

    try {
      const {
        data: { data = [] },
      } = await GetAllCars();
      setCars(data);
      isFetched.current = true;
    } catch (error) {
      console.error("Error fetching cars:", error);
      isFetched.current = true;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isFetched.current) {
      fetchCars();
    }
  }, [fetchCars]);

  const memoizedCars = useMemo(() => {
    return cars;
  }, [cars]);

  const handleDelete = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await DeleteCar(id);
      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cars: memoizedCars,
    isFetched,
    isLoading,
    fetchCars,
    handleDelete,
  };
}
