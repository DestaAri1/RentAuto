import { useEffect, useState } from "react";
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
import UpdateCarModal from "../../components/Dashboard/Cars/Car/UpdateCarModal.tsx";
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
      car.Type.name.toLowerCase().includes(keyword) ||
      car.seats.toString().includes(keyword)
  );

  const createModal = useModal();
  const updateModal = useModal();
  const deleteModal = useModal();

  const addCarForm = useCarForm();
  const updateCarForm = useCarForm();

  const openUpdateModal = (car: Cars) => {
    if (car && car.id) {
      updateCarForm.populateForm(car);
      updateModal.openModal(car);
    } else {
      console.error("Cannot update: Invalid car data", car);
    }
  };

  const openDeleteModal = (car: Cars) => {
    if (car && car.id) {
      deleteModal.openModal(car);
    } else {
      console.error("Cannot delete: Invalid car data", car);
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
    addCarForm.resetAllErrors();
    createModal.closeModal();
  };

  // Handle update car modal close
  const handleUpdateModalClose = () => {
    updateCarForm.resetAllErrors();
    updateModal.closeModal();
  };

  const handleCreateCarSubmit = async () => {
    const formData = addCarForm.watchedValues;

    try {
      // Call onSubmit dari useCarForm
      await addCarForm.onSubmit(formData);
      await fetchCars()
    } catch (error) {
      console.error("❌ Error in handleCreateCarSubmit:", error);
    }
  };

  const handleUpdateCarSubmit = async () => {
    const formData = updateCarForm.watchedValues;
    const carId = updateModal.selectedItem?.id;

    try {
      // Call onUpdate dari useCarForm
      await updateCarForm.onUpdate(formData, carId);
      await fetchCars()
    } catch (error) {
      console.error("❌ Error in handleUpdateCarSubmit:", error);
    }
  };

  useEffect(() => {
    updateCarForm.onSubmitSuccess(() => {
      fetchCars();
      handleUpdateModalClose();
    });
  }, [updateCarForm.onSubmitSuccess, fetchCars]);

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
        <CarData
          cars={filteredCars}
          onUpdate={openUpdateModal}
          onDelete={openDeleteModal}
        />
        <DashBoxes>
          <CarTypes />
        </DashBoxes>
      </div>

      {/* Add Car Modal */}
      <AddCarModal
        isOpen={createModal.isOpen}
        onClose={handleCreateModalClose}
        register={addCarForm.register}
        errors={addCarForm.formState.errors}
        isSubmitting={addCarForm.formState.isSubmitting}
        isDirty={addCarForm.formState.isDirty}
        isValid={addCarForm.formState.isValid}
        submissionErrors={addCarForm.submissionErrors}
        onSubmit={handleCreateCarSubmit}
        watchedValues={addCarForm.watchedValues}
        carTypes={[]}
      />

      {/* Update Car Modal */}
      {updateModal.isOpen && (
        <UpdateCarModal
          isOpen={updateModal.isOpen}
          onClose={handleUpdateModalClose}
          register={updateCarForm.register}
          errors={updateCarForm.formState.errors}
          isSubmitting={updateCarForm.formState.isSubmitting}
          isDirty={updateCarForm.formState.isDirty}
          isValid={updateCarForm.formState.isValid}
          submissionErrors={updateCarForm.submissionErrors}
          onSubmit={handleUpdateCarSubmit}
          watchedValues={updateCarForm.watchedValues}
          carTypes={[]}
          selectedCar={updateModal.selectedItem}
        />
      )}

      {/* Delete Car Modal */}
      <DeleteCarModal
        car={deleteModal.selectedItem}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDeleteConfirm}
      />
    </DashboardLayout>
  );
}
