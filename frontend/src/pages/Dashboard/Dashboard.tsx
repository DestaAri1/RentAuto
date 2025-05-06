import React, { useState } from "react";
import {
  Car,
  Users,
  Calendar,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Map,
  FileText,
  BarChart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";

// Sample data for dashboard
const recentBookings = [
  {
    id: "B1234",
    car: "Tesla Model 3",
    date: "2025-04-24",
    duration: "3 days",
    status: "Active",
    amount: 300,
  },
  {
    id: "B1235",
    car: "BMW X5",
    date: "2025-04-20",
    duration: "5 days",
    status: "Completed",
    amount: 750,
  },
  {
    id: "B1236",
    car: "Mercedes C-Class",
    date: "2025-04-15",
    duration: "2 days",
    status: "Completed",
    amount: 260,
  },
  {
    id: "B1237",
    car: "Audi Q7",
    date: "2025-05-01",
    duration: "7 days",
    status: "Upcoming",
    amount: 1190,
  },
];

const availableCars = [
  {
    id: 1,
    name: "Tesla Model 3",
    type: "Electric",
    availability: "87%",
    price: 100,
  },
  { id: 2, name: "BMW X5", type: "SUV", availability: "65%", price: 150 },
  {
    id: 3,
    name: "Toyota Camry",
    type: "Sedan",
    availability: "92%",
    price: 80,
  },
  {
    id: 4,
    name: "Porsche 911",
    type: "Sports",
    availability: "45%",
    price: 250,
  },
  { id: 5, name: "Audi Q7", type: "SUV", availability: "78%", price: 170 },
];

const rentalStats = [
  { label: "Total Bookings", value: "182", change: "+12%", icon: Calendar },
  { label: "Active Rentals", value: "24", change: "+5%", icon: Car },
  { label: "Total Revenue", value: "$8,942", change: "+18%", icon: CreditCard },
  { label: "Customer Ratings", value: "4.8/5", change: "+0.2", icon: Users },
];

const Dashboard: React.FC = () => {
  const {user} = useAuth()
  console.log(user);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 flex z-40 md:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="flex items-center space-x-2">
                <Car className="text-blue-600" size={24} />
                <span className="text-xl font-bold text-blue-600">
                  RentAuto
                </span>
              </div>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              <Link
                to="#"
                className="bg-blue-50 text-blue-700 group flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <BarChart className="mr-3 h-6 w-6 text-blue-500" />
                Dashboard
              </Link>
              <Link
                to="#"
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <Car className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                My Rentals
              </Link>
              <Link
                to="#"
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <Calendar className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                Bookings
              </Link>
              <Link
                to="#"
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <Map className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                Locations
              </Link>
              <Link
                to="#"
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <FileText className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                Invoices
              </Link>
              <Link
                to="#"
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <Settings className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                Settings
              </Link>
              <Link
                to="#"
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <HelpCircle className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                Help & Support
              </Link>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Link to="#" className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-10 w-10 rounded-full"
                    src="/api/placeholder/40/40"
                    alt="Profile"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                    Alex Johnson
                  </p>
                  <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                    View Profile
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <div className="flex items-center space-x-2">
                  <Car className="text-blue-600" size={24} />
                  <span className="text-xl font-bold text-blue-600">
                    RentAuto
                  </span>
                </div>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                <Link
                  to="#"
                  className="bg-blue-50 text-blue-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <BarChart className="mr-3 h-6 w-6 text-blue-500" />
                  Dashboard
                </Link>
                <Link
                  to="#"
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <Car className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  My Rentals
                </Link>
                <Link
                  to="#"
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <Calendar className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Bookings
                </Link>
                <Link
                  to="#"
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <Map className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Locations
                </Link>
                <Link
                  to="#"
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <FileText className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Invoices
                </Link>
                <Link
                  to="#"
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <Settings className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Settings
                </Link>
                <Link
                  to="#"
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <HelpCircle className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  Help & Support
                </Link>
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <Link to="#" className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                  <div>
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src="/api/placeholder/40/40"
                      alt="Profile"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      Alex Johnson
                    </p>
                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                      View profile
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    id="search-field"
                    className="block w-full h-full pl-10 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                    placeholder="Search cars, bookings..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Bell className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <img
                      className="h-8 w-8 rounded-full"
                      src="/api/placeholder/40/40"
                      alt="User profile"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-100">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Dashboard
                </h1>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Rent a Car
                </button>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Stats */}
              <div className="mt-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {rentalStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white overflow-hidden shadow rounded-lg"
                    >
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <stat.icon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                {stat.label}
                              </dt>
                              <dd>
                                <div className="flex items-baseline">
                                  <div className="text-2xl font-semibold text-gray-900">
                                    {stat.value}
                                  </div>
                                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                    {stat.change}
                                  </div>
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="mt-8">
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Recent Bookings
                    </h3>
                    <Link
                      to="#"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="flex flex-col">
                    <div className="overflow-x-auto">
                      <div className="py-2 align-middle inline-block min-w-full">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Booking ID
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Car
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Date
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Duration
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Amount
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Status
                              </th>
                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {recentBookings.map((booking) => (
                              <tr key={booking.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {booking.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {booking.car}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {booking.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {booking.duration}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ${booking.amount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                      booking.status
                                    )}`}
                                  >
                                    {booking.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Link
                                    to="#"
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    Details
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Cars */}
              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Available Cars Section */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Available Cars
                    </h3>
                    <Link
                      to="#"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="p-4">
                    <ul className="divide-y divide-gray-200">
                      {availableCars.map((car) => (
                        <li
                          key={car.id}
                          className="py-4 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div className="bg-gray-100 rounded-md p-2 mr-4">
                              <Car className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {car.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {car.type} • ${car.price}/day
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-green-600 font-medium mr-4">
                              {car.availability} available
                            </span>
                            <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                              Book Now
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Upcoming Activity */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Upcoming Activity
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute inset-0 flex items-center justify-center h-full w-6">
                        <div className="h-full w-0.5 bg-gray-200"></div>
                      </div>

                      <ul className="relative space-y-6">
                        <li className="flex items-start">
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 z-10">
                            <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                          </div>
                          <div className="ml-4 bg-blue-50 rounded-lg p-4 shadow-sm w-full">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="text-sm font-medium text-blue-800">
                                Car Return
                              </h4>
                              <span className="text-xs text-blue-700">
                                Today, 5:00 PM
                              </span>
                            </div>
                            <p className="text-sm text-blue-700">
                              Return Tesla Model 3 to Downtown Location
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-300 z-10">
                            <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                          </div>
                          <div className="ml-4 bg-gray-50 rounded-lg p-4 shadow-sm w-full">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="text-sm font-medium text-gray-800">
                                Car Pickup
                              </h4>
                              <span className="text-xs text-gray-700">
                                Apr 30, 10:00 AM
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              Pickup Audi Q7 from Airport Location
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-300 z-10">
                            <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                          </div>
                          <div className="ml-4 bg-gray-50 rounded-lg p-4 shadow-sm w-full">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="text-sm font-medium text-gray-800">
                                Reserved Vehicle Service
                              </h4>
                              <span className="text-xs text-gray-700">
                                May 5, 2:00 PM
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              Vehicle service appointment scheduled
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 mb-8">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  <button className="bg-white shadow-sm rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                    <Car className="mx-auto h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">
                      New Rental
                    </span>
                  </button>
                  <button className="bg-white shadow-sm rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                    <Calendar className="mx-auto h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">
                      Reservations
                    </span>
                  </button>
                  <button className="bg-white shadow-sm rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                    <FileText className="mx-auto h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">
                      Invoice
                    </span>
                  </button>
                  <button className="bg-white shadow-sm rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                    <Map className="mx-auto h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">
                      Locations
                    </span>
                  </button>
                  <button className="bg-white shadow-sm rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                    <HelpCircle className="mx-auto h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">
                      Support
                    </span>
                  </button>
                  <button className="bg-white shadow-sm rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                    <Settings className="mx-auto h-6 w-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-900">
                      Settings
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
