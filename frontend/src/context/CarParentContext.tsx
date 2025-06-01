import { createContext, useContext, useEffect, useState } from "react";
import { ChildProps } from "../types";
import {
  getLocalStorage,
  setLocalStorage,
} from "../services/TokenServices.tsx";

interface CarParent {
  id: string;
  title: string;
  route: string;
}

interface CarParentContextType {
  parent: CarParent | null;
  setParent: (data: CarParent) => void;
  isLoading: boolean; // ✅ Tambahkan loading state
}

const CarParentContext = createContext<CarParentContextType>({
  parent: null,
  setParent: () => {},
  isLoading: true,
});

export const useCarParent = () => useContext(CarParentContext);

export const CarParentProvider = ({ children }: ChildProps) => {
  const [parent, setParentState] = useState<CarParent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fungsi untuk set parent dan simpan ke localStorage
  const setParent = (data: CarParent) => {
    setParentState(data);
    setLocalStorage("car_parent", JSON.stringify(data));
  };

  useEffect(() => {
    try {
      const rawData = localStorage.getItem("car_parent");

      if (rawData) {
        const parsedData = JSON.parse(rawData);

        if (
          parsedData &&
          typeof parsedData === "object" &&
          parsedData.id &&
          parsedData.title &&
          parsedData.route
        ) {
          setParentState(parsedData);
        } else {
          console.log("❌ Invalid parent data structure");
        }
      } else {
        console.log("❌ No data in localStorage");
      }
    } catch (error) {
      console.error("❌ Error reading localStorage:", error);
    }
    setIsLoading(false);
  }, []);

  return (
    <CarParentContext.Provider value={{ parent, setParent, isLoading }}>
      {children}
    </CarParentContext.Provider>
  );
};
