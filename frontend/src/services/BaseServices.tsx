import axios from "axios";
import { getToken } from "./TokenServices.tsx";

const API_URL = "http://127.0.0.1:3000/api/";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors globally
    if (error.response && error.response.status === 401) {
      // You might want to redirect to login or show a notification
      console.error("Unauthorized access, please login again");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
