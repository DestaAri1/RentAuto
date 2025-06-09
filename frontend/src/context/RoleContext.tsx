import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChildProps, Role } from "../types";
import { GetAllRole } from "../services/RoleServices.tsx";

interface RoleContextType {
  role: Role[] | null;
  setRole: (data: Role[]) => void;
  isLoading: boolean;
  fetchRole: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  setRole: () => {},
  isLoading: true,
  fetchRole: async () => {},
});

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }: ChildProps) => {
  const [role, setRole] = useState<Role[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const hasFetched = useRef<boolean>(false);
  const isFetching = useRef<boolean>(false);

  const fetchRole = async () => {
    // Prevent multiple simultaneous requests
    if (isFetching.current) {
      return;
    }

    isFetching.current = true;
    setIsLoading(true);

    try {
      const response = await GetAllRole();
      const data = (response.data.data || []).filter(
        (r: Role) => r.name.toLowerCase() !== "administrator"
      );
      setRole(data);
      hasFetched.current = true;
    } catch (error) {
      console.error("Fetch role failed:", error);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  // Initial fetch only
  useEffect(() => {
    if (!hasFetched.current && !isFetching.current) {
      fetchRole();
    }
  }, []); // Empty dependency array for initial fetch only

  const contextValue = useMemo(
    () => ({
      fetchRole,
      role,
      setRole,
      isLoading,
    }),
    [role, isLoading]
  );

  return (
    <RoleContext.Provider value={contextValue}>{children}</RoleContext.Provider>
  );
};
