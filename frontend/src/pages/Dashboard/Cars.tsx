import React, { useState, useMemo } from "react";
import DashboardLayout from "../../layout/DashboardLayout.tsx";
import { Link } from "react-router-dom";
import { Cars } from "../../types/index.tsx";
import { useDebouncedSearch } from "../../hooks/useDebouncedSearch.tsx";
import CarTypes from "../../components/Dashboard/Cars/CarTypes/CarTypes.tsx";
import { DashBoxes } from "../../components/DashboardComponents.tsx";
import CarData from "../../components/Dashboard/Cars/Car/CarData.tsx";
import useModal from "../../hooks/useModal.tsx";

export default function CarsIndex() {
  const breadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Cars", current: true },
  ];

  const [searchTerm, setSearchTerm] = useState("");

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
      {
        id: 4,
        name: "Toyota Camry",
        image: "/images/camry.jpg",
        price: 35000,
        type: "Sedan",
        seats: 5,
        rating: 4.5,
        amount: 3,
      },
      {
        id: 5,
        name: "Honda CR-V",
        image: "/images/crv.jpg",
        price: 32000,
        type: "SUV",
        seats: 7,
        rating: 4.7,
        amount: 5,
      },
      {
        id: 6,
        name: "Tesla Model 3",
        image: "/images/model3.jpg",
        price: 45000,
        type: "Electric",
        seats: 5,
        rating: 4.9,
        amount: 2,
      },
      {
        id: 7,
        name: "Toyota Camry",
        image: "/images/camry.jpg",
        price: 35000,
        type: "Sedan",
        seats: 5,
        rating: 4.5,
        amount: 3,
      },
      {
        id: 8,
        name: "Honda CR-V",
        image: "/images/crv.jpg",
        price: 32000,
        type: "SUV",
        seats: 7,
        rating: 4.7,
        amount: 5,
      },
      {
        id: 9,
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

  const filteredCars = useDebouncedSearch<Cars>(
    carsData,
    searchTerm,
    (car, keyword) =>
      car.name.toLowerCase().includes(keyword) ||
      car.type.toLowerCase().includes(keyword) ||
      car.seats.toString().includes(keyword)
  );

  const typeModal = useModal();

  return (
    <DashboardLayout
      title="My Rentals"
      breadcrumb={breadcrumbItems}
      actionButton={
        <Link
          to={"/dashboard/my-rentals/add-car"}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Add Car
        </Link>
      }
      onSearch={(text) => setSearchTerm(text)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <CarData cars={filteredCars} />
        <DashBoxes>
          <CarTypes
            openModal={typeModal.openModal}
            isOpen={typeModal.isOpen}
            closeModal={typeModal.closeModal}
            modalType={typeModal.modalType}
            selectedItem={typeModal.selectedItem}
          />
        </DashBoxes>
      </div>
    </DashboardLayout>
  );
}
