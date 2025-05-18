// hooks/useGetCar.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Cars } from "../../types";
import useCar from "../useCar.tsx";

export default function useGetCar() {
  const { id } = useParams();
  const { getOneCar, isLoading } = useCar();
  const [car, setCar] = useState<Cars>();

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;

      try {
        const response = await getOneCar(id);
        if (response && response.data) {
          setCar(response.data);
        }
      } catch (error) {
        console.error("Error fetching car:", error);
      }
    };

    fetchCar();
  }, [id, getOneCar]);

  return {
    car,
    isLoading,
  };
}
