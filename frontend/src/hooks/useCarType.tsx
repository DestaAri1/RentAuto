import { useCallback, useEffect, useRef, useState } from "react";
import { CarType } from "../types";
import {
  CreateCarType,
  DeleteCarType,
  GetAllCarTypes,
  UpdateCarType,
} from "../services/CarTypeServices.tsx";

export default function useCarType() {
  const [carTypes, setCarTypes] = useState<CarType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isFetched = useRef<boolean>(false);

  const fetchCarTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data = [] } = await GetAllCarTypes();

      setCarTypes(data);
    } catch (error) {
      console.error("Failed to fetch car types:", error);
    } finally {
      isFetched.current = true;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isFetched.current) {
      fetchCarTypes();
    }
  }, [fetchCarTypes]);

  const handleCreate = async (payload) => {
    setIsLoading(true);
    try {
      const response = await CreateCarType(payload);
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id, payload) => {
    setIsLoading(true);
    const data = {
      name: payload,
    };
    try {
      const response = await UpdateCarType(id, data);
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const response = await DeleteCarType(id);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    carTypes,
    isFetched,
    isLoading,
    fetchCarTypes,
    setCarTypes,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
