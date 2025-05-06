import React, { useState } from "react";
import {
  Calendar,
  Car,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  Star,
  Users,
} from "lucide-react";
import HomeLayout from "../../layout/HomeLayout.tsx";

// Car data
const carData = [
  {
    id: 1,
    name: "Tesla Model 3",
    price: 100,
    image: "/api/placeholder/500/300",
    rating: 4.9,
    type: "Electric",
    seats: 5,
  },
  {
    id: 2,
    name: "BMW X5",
    price: 150,
    image: "/api/placeholder/500/300",
    rating: 4.8,
    type: "SUV",
    seats: 7,
  },
  {
    id: 3,
    name: "Mercedes-Benz C-Class",
    price: 130,
    image: "/api/placeholder/500/300",
    rating: 4.7,
    type: "Sedan",
    seats: 5,
  },
  {
    id: 4,
    name: "Toyota Camry",
    price: 80,
    image: "/api/placeholder/500/300",
    rating: 4.5,
    type: "Sedan",
    seats: 5,
  },
  {
    id: 5,
    name: "Porsche 911",
    price: 250,
    image: "/api/placeholder/500/300",
    rating: 5.0,
    type: "Sports",
    seats: 2,
  },
  {
    id: 6,
    name: "Audi Q7",
    price: 170,
    image: "/api/placeholder/500/300",
    rating: 4.6,
    type: "SUV",
    seats: 7,
  },
];

// Popular locations
const popularLocations = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Miami",
  "Las Vegas",
  "San Francisco",
];

// Filter options
const filterOptions = {
  carTypes: ["All", "Sedan", "SUV", "Sports", "Electric", "Hybrid"],
  seating: ["All", "2", "4", "5", "7+"],
};

export function Rent() {
  const [selectedCarType, setSelectedCarType] = useState("All");
  const [selectedSeating, setSelectedSeating] = useState("All");
  const [activeTab, setActiveTab] = useState("popular");

  // Filter cars based on selections
  const filteredCars = carData.filter((car) => {
    const matchesType =
      selectedCarType === "All" || car.type === selectedCarType;
    const matchesSeating =
      selectedSeating === "All" ||
      (selectedSeating === "7+"
        ? car.seats >= 7
        : car.seats === parseInt(selectedSeating));
    return matchesType && matchesSeating;
  });

  return (
    <HomeLayout title="Rent a Car">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Ride
            </h1>
            <p className="text-lg mb-8 text-blue-100">
              Experience premium car rentals with ease. Choose from our wide
              selection of vehicles for any occasion.
            </p>

            {/* Search Form */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <div className="flex flex-wrap md:flex-nowrap gap-4 mb-4">
                <div className="w-full md:w-1/3">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Pick-up Location
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-3 top-3 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Enter city or airport"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/3">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Pick-up Date
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-3 text-gray-400"
                      size={18}
                    />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/3">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Return Date
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-3 text-gray-400"
                      size={18}
                    />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <button className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center">
                <Search size={18} className="mr-2" />
                Search Available Cars
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto py-12 px-4">
        {/* Filters and Result Count */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Available Cars
            </h2>
            <p className="text-gray-600">{filteredCars.length} cars found</p>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            <div className="relative">
              <select
                className="pl-4 pr-10 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCarType}
                onChange={(e) => setSelectedCarType(e.target.value)}
              >
                {filterOptions.carTypes.map((type) => (
                  <option key={type} value={type}>
                    {type} Type
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                size={16}
              />
            </div>
            <div className="relative">
              <select
                className="pl-4 pr-10 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedSeating}
                onChange={(e) => setSelectedSeating(e.target.value)}
              >
                {filterOptions.seating.map((seat) => (
                  <option key={seat} value={seat}>
                    {seat === "All" ? "All Seats" : `${seat} Seats`}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                size={16}
              />
            </div>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <span>Sort by</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "popular"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("popular")}
            >
              Popular Cars
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "trending"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("trending")}
            >
              Trending Now
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "featured"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("featured")}
            >
              Featured
            </button>
          </div>
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-lg text-sm font-medium">
                  ${car.price}/day
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    {car.name}
                  </h3>
                  <div className="flex items-center">
                    <Star
                      className="text-yellow-500 fill-yellow-500"
                      size={16}
                    />
                    <span className="ml-1 text-sm font-medium">
                      {car.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <span className="bg-gray-100 px-2 py-1 rounded mr-2">
                    {car.type}
                  </span>
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    <span>{car.seats} Seats</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg">
                  Rent Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-10">
          <nav className="flex items-center space-x-1">
            <button className="px-3 py-2 rounded-md hover:bg-gray-100">
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-md">
              1
            </button>
            <button className="px-3 py-2 rounded-md hover:bg-gray-100">
              2
            </button>
            <button className="px-3 py-2 rounded-md hover:bg-gray-100">
              3
            </button>
            <button className="px-3 py-2 rounded-md hover:bg-gray-100">
              ...
            </button>
            <button className="px-3 py-2 rounded-md hover:bg-gray-100">
              10
            </button>
            <button className="px-3 py-2 rounded-md hover:bg-gray-100">
              <ChevronRight size={16} />
            </button>
          </nav>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Popular Rental Locations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularLocations.map((location, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow"
              >
                <MapPin className="mx-auto mb-2 text-blue-600" size={24} />
                <p className="font-medium">{location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Why Choose RentAuto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Calendar size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Flexible Bookings</h3>
            <p className="text-gray-600">
              Change or cancel your reservation with no extra fees.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Car size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Quality Vehicles</h3>
            <p className="text-gray-600">
              All our vehicles are thoroughly inspected and well-maintained.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Star size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Exceptional Service</h3>
            <p className="text-gray-600">
              Our customer service team is available 24/7 to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-blue-600 py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
          <p className="mb-6 max-w-lg mx-auto">
            Subscribe to our newsletter for exclusive deals and updates on new
            vehicles.
          </p>
          <div className="flex flex-col md:flex-row max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-white text-blue-600 font-medium px-6 py-2 rounded-lg hover:bg-gray-100">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
};
