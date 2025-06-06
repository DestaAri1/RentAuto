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
  fetchRole: async () => {}
});

export const useRole = () => useContext(RoleContext);

// Global flag untuk mencegah multiple requests
let isRoleFetching = false;
let rolePromise: Promise<any> | null = null;

export const RoleProvider = ({ children }: ChildProps) => {
  const [role, setRole] = useState<Role[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const hasFetched = useRef<boolean>(false);

  const fetchRole = async () => {
    // Jika sudah ada request yang berjalan, tunggu promise yang sama
    if (isRoleFetching && rolePromise) {
      try {
        const result = await rolePromise;
        setRole(result);
        setIsLoading(false);
      } catch (error) {
        console.error("Fetch role failed:", error);
        setIsLoading(false);
      }
      return;
    }

    // Jika sudah pernah fetch dan berhasil, skip
    if (role !== null) {
      setIsLoading(false);
      return;
    }

    // Mulai fetch baru
    isRoleFetching = true;
    setIsLoading(true);

    rolePromise = GetAllRole().then((response) => {
      const data = response.data.data || [];
      return data;
    });

    try {
      const data = await rolePromise;
      setRole(data);
    } catch (error) {
      console.error("Fetch role failed:", error);
    } finally {
      setIsLoading(false);
      isRoleFetching = false;
      rolePromise = null;
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    fetchRole();
  }, [role, isLoading]); // Include role in dependency untuk check

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
