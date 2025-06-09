import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { getToken } from "../services/TokenServices.tsx";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const token = getToken("token");

  if (token) {
    // Jika sudah login (token ada), arahkan ke dashboard
    return <Navigate to="/" replace />;
  }

  // Jika belum login, izinkan akses ke halaman login/register
  return <>{children}</>;
};

const DashboardRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role.name === "User") return <Navigate to="/" replace />;

  return <>{children}</>;
};

export { ProtectedRoute, AuthRoute, DashboardRoute };
