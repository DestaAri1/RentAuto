import React, { useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout.tsx";
import { Link } from "react-router-dom";
import { Cars } from "../../types/index.tsx";
import { useDebouncedSearch } from "../../hooks/useDebouncedSearch.tsx";
import CarTypes from "../../components/Dashboard/Cars/CarTypes/CarTypes.tsx";
import { DashBoxes } from "../../components/DashboardComponents.tsx";
import CarData from "../../components/Dashboard/Cars/Car/CarData.tsx";
import useCar from "../../hooks/useCar.tsx";
import DeleteCarModal from "../../components/Dashboard/Cars/Car/DeleteCarModal.tsx";
import useModal from "../../hooks/useModal.tsx";

export default function CarsIndex() {
  const breadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Cars", current: true },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const { cars, handleDelete, fetchCars } = useCar();

  const filteredCars = useDebouncedSearch<Cars>(
    cars,
    searchTerm,
    (car, keyword) =>
      car.name.toLowerCase().includes(keyword) ||
      car.car_type.name.toLowerCase().includes(keyword) ||
      car.seats.toString().includes(keyword)
  );

  const deleteModal = useModal();

  const openDeleteModal = (car: Cars) => {
    if (car && car.id) {
      deleteModal.openModal(car);
    } else {
      console.error("Cannot update: Invalid car type data", car);
    }
  };

  const handleDeleteConfirm = async () => {
    if (await handleDelete(deleteModal.selectedItem.id)) {
      fetchCars()
      deleteModal.closeModal()
    }
  };

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
        <CarData cars={filteredCars} onDelete={openDeleteModal} />
        <DashBoxes>
          <CarTypes />
        </DashBoxes>
      </div>
      <DeleteCarModal
        car={deleteModal.selectedItem}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDeleteConfirm}
      />
    </DashboardLayout>
  );
}
