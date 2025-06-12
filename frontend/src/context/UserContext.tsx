import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChildProps, User } from "../types";
import { GetAllUsers } from "../services/UserServices.tsx";

interface UserContextType {
  users: User[] | null;
  setUsers: (data: User[]) => void;
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  users: null,
  setUsers: () => {},
  isLoading: true,
  fetchUsers: async () => {},
});

export const useUser = () => useContext(UserContext);

export default function UserProvider({ children }: ChildProps) {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isFetching = useRef<boolean>(false);
  const hasFetched = useRef<boolean>(false);

  const fetchUsers = async () => {
    if (isFetching.current) {
      return;
    }

    isFetching.current = true;
    setIsLoading(true);

    try {
      const response = await GetAllUsers();
      const data = response.data.data || [];
      setUsers(data);
      hasFetched.current = true;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    if (!hasFetched.current && !isFetching.current) {
      fetchUsers();
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      fetchUsers,
      users,
      setUsers,
      isLoading,
    }),
    [users, isLoading]
  );
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
