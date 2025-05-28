import { useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout.tsx";
import { Cars } from "../../types/index.tsx";
import { useDebouncedSearch } from "../../hooks/useDebouncedSearch.tsx";
import CarTypes from "../../components/Dashboard/Cars/CarTypes/CarTypes.tsx";
import { DashBoxes } from "../../components/DashboardComponents.tsx";
import CarData from "../../components/Dashboard/Cars/Car/CarData.tsx";
import useCar from "../../hooks/useCar.tsx";
import DeleteCarModal from "../../components/Dashboard/Cars/Car/DeleteCarModal.tsx";
import useModal from "../../hooks/useModal.tsx";
import AddCarModal from "../../components/Dashboard/Cars/Car/AddCarModal.tsx";
import { useCarForm } from "../../hooks/useCarForm.tsx";

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

  const createModal = useModal();
  const deleteModal = useModal();

  // Form logic untuk add car
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    submissionErrors,
    resetAllErrors,
    watchedValues,
  } = useCarForm();

  const openDeleteModal = (car: Cars) => {
    if (car && car.id) {
      deleteModal.openModal(car);
    } else {
      console.error("Cannot update: Invalid car type data", car);
    }
  };

  const handleDeleteConfirm = async () => {
    if (await handleDelete(deleteModal.selectedItem.id)) {
      fetchCars();
      deleteModal.closeModal();
    }
  };

  // Handle create car modal close
  const handleCreateModalClose = () => {
    resetAllErrors(); // Reset form ketika modal ditutup
    createModal.closeModal();
  };

  // Handle form submission dari modal
  const onFormSubmit = handleSubmit(async (data) => {
    try {
      console.log("Form submitted from parent:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success
      console.log("Car created successfully!");

      // Refresh car list
      // await fetchCars();

      // Close modal after success
      handleCreateModalClose();

      // Show success message (optional)
      alert("Car added successfully!");
    } catch (error) {
      console.error("Error in parent component:", error);
      // Error handling sudah dilakukan di useCarForm hook
    }
  });

  return (
    <DashboardLayout
      title="My Rentals"
      breadcrumb={breadcrumbItems}
      actionButton={
        <button
          onClick={createModal.openModal}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Add Car
        </button>
      }
      onSearch={(text) => setSearchTerm(text)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <CarData cars={filteredCars} onDelete={openDeleteModal} />
        <DashBoxes>
          <CarTypes />
        </DashBoxes>
      </div>

      <AddCarModal
        isOpen={createModal.isOpen}
        onClose={handleCreateModalClose}
        // Pass form props ke modal
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
        isDirty={isDirty}
        isValid={isValid}
        submissionErrors={submissionErrors}
        onSubmit={onFormSubmit}
        watchedValues={watchedValues}
      />

      <DeleteCarModal
        car={deleteModal.selectedItem}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDeleteConfirm}
      />
    </DashboardLayout>
  );
}
