import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import CarsIndex from "./pages/Dashboard/Cars.tsx";
import Bookings from "./pages/Dashboard/Bookings.tsx";
import CarChild from "./pages/Dashboard/CarChild.tsx";
import AddCarChild from "./pages/Dashboard/CarChild/AddCarChild.tsx";
import UpdateCarChild from "./pages/Dashboard/CarChild/UpdateCarChild.tsx";
import RoleIndex from "./pages/Dashboard/RoleIndex.tsx";
import { Rent } from "./pages/Home/Rent.tsx";
import { Home } from "./pages/Home/Home.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import {
  AuthRoute,
  DashboardRoute,
  OnlyAdminRoute,
} from "./utils/RouteGuard.tsx";
import RouteWrapper from "./utils/Wrapper.tsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/rent-a-car" element={<Rent />} />

          {/* Auth Routes - redirect to home if already logged in */}
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

          {/* Dashboard Routes - require authentication and appropriate role */}
          <Route
            path="/dashboard"
            element={
              <DashboardRoute>
                <RouteWrapper />
              </DashboardRoute>
            }
          >
            {/* Dashboard Home */}
            <Route index element={<Dashboard />} />

            {/* Nested Dashboard Routes */}
            <Route path="my-rentals" element={<CarsIndex />} />
            <Route path="my-rentals/:slug" element={<CarChild />} />
            <Route
              path="my-rentals/:slug/create-car"
              element={<AddCarChild />}
            />
            <Route
              path="my-rentals/:slug/:carId"
              element={<UpdateCarChild />}
            />
            <Route path="bookings" element={<Bookings />} />

            <Route
              path="user-management/roles"
              element={
                <OnlyAdminRoute>
                  <RoleIndex />
                </OnlyAdminRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
