import apiClient from "./BaseServices.tsx";

interface AuthInput {
  email: string;
  password: string;
  name?: string;
  role?: string;
}

interface AuthResponse {
  token: string;
  user: any;
  data: any;
}

// Login
export const login = async (data: AuthInput): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("auth/login", data);
  return response.data;
};

// Register
export const register = async (data: AuthInput): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("auth/register", data);
  return response.data;
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post("auth/logout");
  } catch (error) {
    console.warn("Logout API gagal, tapi tetap lanjut hapus token", error);
  }
};

// Get user (dari endpoint yang butuh token)
export const getUser = async (): Promise<any> => {
  const response = await apiClient.get("auth/user");
  return response.data;
};
