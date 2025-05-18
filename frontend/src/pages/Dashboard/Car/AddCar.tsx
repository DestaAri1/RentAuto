import React, { FC, ReactElement } from "react";
import DashboardLayout from "../../../layout/DashboardLayout.tsx";

import { useCarForm } from "../../../hooks/useCarForm.tsx";
import useCarType from "../../../hooks/useCarType.tsx";
import FormCar from "../../../components/Dashboard/Cars/Car/FormCar.tsx";

const AddCar: FC = (): ReactElement => {
  const breadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Cars", href: "/dashboard/my-rentals" },
    { name: "Create Car", current: true },
  ];

  const {
    formData,
    handleChange,
    handleFormSubmit,
    preview,
    fileInputRef,
    handleImageChange,
    handleImageClick,
    additionalImages,
    additionalImagesRef,
    handleAdditionalImagesChange,
    handleAdditionalImagesClick,
    removeAdditionalImage,
  } = useCarForm();

  const { carTypes } = useCarType();

  return (
    <DashboardLayout title="Create Car" breadcrumb={breadcrumbItems}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="bg-white shadow-2xl rounded-2xl p-8 mt-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Add New Car
          </h2>

          <FormCar
            formData={formData}
            handleChange={handleChange}
            handleFormSubmit={handleFormSubmit}
            preview={preview}
            fileInputRef={fileInputRef}
            handleImageChange={handleImageChange}
            handleImageClick={handleImageClick}
            carTypes={carTypes}
            additionalImages={additionalImages}
            additionalImagesRef={additionalImagesRef}
            handleAdditionalImagesChange={handleAdditionalImagesChange}
            handleAdditionalImagesClick={handleAdditionalImagesClick}
            removeAdditionalImage={removeAdditionalImage}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddCar;
