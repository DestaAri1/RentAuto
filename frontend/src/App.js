import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import { Rent } from "./pages/Home/Rent.tsx";
import { Home } from "./pages/Home/Home.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { AuthRoute, ProtectedRoute } from "./utils/RouteGuard.tsx";
import Register from "./pages/Auth/Register.tsx";
import CarsIndex from "./pages/Dashboard/Cars.tsx";
import Bookings from "./pages/Dashboard/Bookings.tsx";
import CarChild from "./pages/Dashboard/CarChild.tsx";
import AddCarChild from "./pages/Dashboard/CarChild/AddCarChild.tsx";
import UpdateCarChild from "./pages/Dashboard/CarChild/UpdateCarChild.tsx";
import RoleIndex from "./pages/Dashboard/RoleIndex.tsx";

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
            path="/dashboard/my-rentals/:slug"
            element={
              <ProtectedRoute>
                <CarChild />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/my-rentals/:slug/create-car"
            element={
              <ProtectedRoute>
                <AddCarChild />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/my-rentals/:slug/:slug"
            element={
              <ProtectedRoute>
                <UpdateCarChild />
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
          <Route
            path="/dashboard/roles"
            element={
              <ProtectedRoute>
                <RoleIndex />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
