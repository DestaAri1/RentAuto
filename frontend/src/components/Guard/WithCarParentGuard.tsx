import { useEffect } from "react";
import { getLocalStorage } from "../../services/TokenServices.tsx";

interface WithCarParentGuardProps {
  children: React.ReactNode;
}

export default function WithCarParentGuard({
  children,
}: WithCarParentGuardProps) {
  const parent = getLocalStorage("car_parent");

  useEffect(() => {
    if (!parent) {
      document.location.href = "/dashboard/my-rentals";
    }
  }, [parent]);

  if (!parent) return null;

  return <>{children}</>;
}
