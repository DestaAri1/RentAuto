import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  login as loginWeb,
  register as registerWeb,
} from "../services/AuthServices.tsx";
import {
  getToken,
  setToken,
  removeToken,
  getTokenUser,
  setTokenUser,
} from "../services/TokenServices.tsx";
import { AuthContextType, RegisterData, User } from "../types/index.tsx";
import { decrypt, encrypt } from "../utils/Crypto.tsx";

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

// Cookie key for user data
const USER_KEY = "user_data";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing token and user on mount
  useEffect(() => {
    const token = getToken();
    const storedUser = getTokenUser(USER_KEY);

    if (token && storedUser) {
      setUser(decrypt<User>(storedUser));
    }

    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await loginWeb({ email, password });

      // Extract token and user from response
      const {
        data: { token, user },
      } = response;

      // Save token and user to cookies (only user data is encrypted)
      setToken(token, "token");
      setTokenUser(encrypt(user), USER_KEY);

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
    removeToken(USER_KEY);
    setUser(null);
  };

  // Register function
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await registerWeb(data);
      // Extract token and user from response
      const {
        data: { token, user },
      } = response;

      // Save token and user to cookies (only user data is encrypted)
      setToken(token, "token");
      setTokenUser(encrypt(user), USER_KEY);

      // Update state
      setUser(user);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create the context value with decrypted token check
  const value = {
    user,
    isAuthenticated: !!getToken(), // This will check if token exists
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
