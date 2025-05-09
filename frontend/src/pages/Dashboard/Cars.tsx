import React, { useState, useEffect, useCallback, useMemo } from "react";
import DashboardLayout from "../../layout/DashboardLayout.tsx";
import { Link } from "react-router-dom";
import { Cars } from "../../types/index.tsx";

export default function CarsIndex() {
  const breadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Cars", current: true },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredCars, setFilteredCars] = useState<Cars[]>([]);

  // Gunakan useMemo untuk memastikan carsData tidak dibuat ulang pada setiap render
  const carsData = useMemo<Cars[]>(
    () => [
      {
        id: 1,
        name: "Toyota Camry",
        image: "/images/camry.jpg",
        price: 35000,
        type: "Sedan",
        seats: 5,
        rating: 4.5,
        amount: 3,
      },
      {
        id: 2,
        name: "Honda CR-V",
        image: "/images/crv.jpg",
        price: 32000,
        type: "SUV",
        seats: 7,
        rating: 4.7,
        amount: 5,
      },
      {
        id: 3,
        name: "Tesla Model 3",
        image: "/images/model3.jpg",
        price: 45000,
        type: "Electric",
        seats: 5,
        rating: 4.9,
        amount: 2,
      },
    ],
    []
  );

  // Fungsi pencarian yang hanya dijalankan setelah debounce
  const performSearch = useCallback(() => {
    const filtered = carsData.filter(
      (car) =>
        car.name?.toLowerCase().includes(debouncedSearchTerm) ||
        car.type?.toLowerCase().includes(debouncedSearchTerm) ||
        car.seats?.toString().includes(debouncedSearchTerm)
    );
    setFilteredCars(filtered);
  }, [debouncedSearchTerm, carsData]);

  // Effect untuk menangani debounce
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.toLowerCase());
    }, 500); // Tunggu 500ms setelah user berhenti mengetik

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Effect untuk menjalankan pencarian setelah debouncedSearchTerm berubah
  useEffect(() => {
    performSearch();
  }, [debouncedSearchTerm, performSearch]);

  // Effect untuk inisialisasi data
  useEffect(() => {
    setFilteredCars(carsData);
  }, [carsData]);

  // Handler untuk update searchTerm saat user mengetik
  const handleSearch = (keyword: string) => {
    setSearchTerm(keyword);
  };

  return (
    <DashboardLayout
      breadcrumb={breadcrumbItems}
      actionButton={
        <Link
          to={"#"}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Add Car
        </Link>
      }
      onSearch={handleSearch}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Seats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCars.map((car) => (
                <tr key={car.id}>
                  <td className="px-6 py-4">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-16 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {car.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {car.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {car.seats}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    ${car.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-yellow-500">
                    {car.rating ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {car.amount ?? 0}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
