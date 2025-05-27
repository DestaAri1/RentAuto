import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Tipe data car_parent yang disimpan di localStorage
interface CarParent {
  title: string;
  route: string;
}

export default function useValidateCarParent() {
  const location = useLocation();

  useEffect(() => {
    const raw = localStorage.getItem("car_parent");

    if (!raw) return;

    try {
      const parent: CarParent = JSON.parse(raw);

      // Validasi struktur data
      if (!parent?.route || typeof parent.route !== "string") {
        localStorage.removeItem("car_parent");
        return;
      }

      const currentPath = location.pathname;

      const isValid =
        currentPath === parent.route ||
        currentPath.startsWith(`${parent.route}/`);

      if (!isValid) {
        localStorage.removeItem("car_parent");
      }
    } catch (error) {
      // JSON parse error atau data tidak valid
      localStorage.removeItem("car_parent");
    }
  }, [location.pathname]);
}
