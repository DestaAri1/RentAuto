// Token services using js-cookie instead of localStorage
import Cookies from "js-cookie";

export const setToken = (token: string, key: string = "token"): void => {
  try {
    Cookies.set(key, token, {
      // secure: true, // Only sent over HTTPS
      sameSite: "strict", // Prevents CSRF attacks
    });
  } catch (error) {
    console.error("Failed to set token in cookie:", error);
  }
};

export const getToken = (key: string = "token"): string | null => {
  try {
    return Cookies.get(key) || null;
  } catch (error) {
    console.error("Failed to get token from cookie:", error);
    return null;
  }
};

export const removeToken = (key: string): void => {
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
    Cookies.remove(key);
  } catch (error) {
    console.error(`Error removing token for key ${key}:`, error);
  }
};

export const setTokenUser = (userData: any, key: string = "user"): void => {
  try {
    Cookies.set(key, JSON.stringify(userData), {
      secure: true,
      sameSite: "strict",
    });
  } catch (error) {
    console.error("Failed to set user data in cookie:", error);
  }
};

export const getTokenUser = (key: string = "user"): any | null => {
  try {
    const userData = Cookies.get(key);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Failed to get user data from cookie:", error);
    return null;
  }
};
