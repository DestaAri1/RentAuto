import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import { Rent } from "./pages/Home/Rent.tsx";
import { Home } from "./pages/Home/Home.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import React from "react";
import { AuthRoute, ProtectedRoute } from "./utils/RouteGuard.tsx";
import Register from "./pages/Auth/Register.tsx";
import CarsIndex from "./pages/Dashboard/Cars.tsx";
import Bookings from "./pages/Dashboard/Bookings.tsx";
import AddCar from "./pages/Dashboard/Car/AddCar.tsx";
import EditCar from "./pages/Dashboard/Car/EditCar.tsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="/rent-a-car" element={<Rent />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/my-rentals"
            element={
              <ProtectedRoute>
                <CarsIndex />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/my-rentals/add-car"
            element={
              <ProtectedRoute>
                <AddCar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/my-rentals/edit-car/:slug/:id"
            element={
              <ProtectedRoute>
                <EditCar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
