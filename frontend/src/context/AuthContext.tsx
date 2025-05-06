import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
// import { authAPI } from "../services/AuthServices.tsx";
import { getToken, setToken, removeToken } from "../services/TokenServices.tsx";
import { login as loginWeb, register as registerWeb} from "../services/AuthServices.tsx";
import { AuthContextType, RegisterData, User } from "../types/index.tsx";


// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

// Props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Storage key for user data
const USER_KEY = "user_data";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing token and user on mount
  useEffect(() => {
    const token = getToken();
    const storedUser = localStorage.getItem(USER_KEY);

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginWeb({ email, password });

      // Extract token and user from response
      const { data:{token, user} } = response;

      // Save token to cookies and user to local storage
      setToken(token, "token");
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      // Update state
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    removeToken("token");
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  // Register function
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await registerWeb(data);

      // If registration automatically logs in, handle the token and user
      if (response.token && response.user) {
        setToken(response.token, "token");
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        setUser(response.user);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create the context value
  const value = {
    user,
    isAuthenticated: !!getToken(),
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
