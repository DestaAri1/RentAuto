import React, { FC, ReactElement } from "react";
import DashboardLayout from "../../../layout/DashboardLayout.tsx";
import { Car, DollarSign, Type, Users, Hash } from "lucide-react";

// Import custom hooks
import { useCarForm } from "../../../hooks/useCarForm.tsx";
import { useMainImage } from "../../../hooks/useMainImage.tsx";
import { useAdditionalImages } from "../../../hooks/useAdditionalImages.tsx";
import ImageUploader from "../../../components/ui/ImageUploader.tsx";
import InputField from "../../../components/ui/InputField.tsx";
import AdditionalImages from "../../../components/ui/AddAditionalImages.tsx";

const AddCar: FC = (): ReactElement => {
  const breadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Cars", href: "/dashboard/my-rentals" },
    { name: "Create Car", current: true },
  ];

  // Initialize car form hook
  const { formData, handleChange, setFormData, handleSubmit } = useCarForm();

  // Initialize main image hook
  const {
    preview,
    fileInputRef,
    handleImageChange,
    handleImageClick,
    setPreview,
  } = useMainImage((file) => {
    setFormData((prev) => ({ ...prev, image: file }));
  });

  // Initialize additional images hook
  const {
    additionalImages,
    additionalImagesRef,
    handleAdditionalImagesChange,
    handleAdditionalImagesClick,
    removeAdditionalImage,
    setAdditionalImages,
  } = useAdditionalImages();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    handleSubmit(e, additionalImages);
    setPreview(null);
    setAdditionalImages([]);
  };
  return (
    <DashboardLayout title="Create Car" breadcrumb={breadcrumbItems}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="bg-white shadow-2xl rounded-2xl p-8 mt-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Add New Car
          </h2>

          <form className="space-y-8" onSubmit={handleFormSubmit}>
            {/* Main Image Upload Section */}
            <ImageUploader
              preview={preview}
              handleImageClick={handleImageClick}
              imageInputRef={fileInputRef}
              handleImageChange={handleImageChange}
              placeholder="Click to upload main car image"
              height="h-80"
            />

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Car Name */}
              <InputField
                label="Name"
                name="name"
                placeholder="Enter car name"
                value={formData.name}
                onChange={handleChange}
                icon={<Car className="w-5 h-5 text-gray-500" />}
                required
              />

              {/* Price */}
              <InputField
                label="Price / Day"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                type="number"
                min="0"
                icon={<DollarSign className="w-5 h-5 text-gray-500"/>}
                required
              />

              {/* Type */}
              <InputField
                label="Car Type"
                name="type"
                placeholder="SUV, Sedan, etc."
                value={formData.type}
                onChange={handleChange}
                icon={<Type className="w-5 h-5 text-gray-500" />}
                required
              />

              {/* Seats */}
              <InputField
                label="Number of Seats"
                name="seats"
                placeholder="Enter seat count"
                value={formData.seats}
                onChange={handleChange}
                type="number"
                min="1"
                icon={<Users className="w-5 h-5 text-gray-500" />}
                required
              />

              {/* Amount */}
              <InputField
                label="Available Amount"
                name="amount"
                placeholder="How many cars are available"
                value={formData.amount}
                onChange={handleChange}
                type="number"
                min="1"
                icon={<Hash className="w-5 h-5 text-gray-500" />}
                required
                className="col-span-1 md:col-span-2"
              />
            </div>

            {/* Additional Images Section */}
            <AdditionalImages
              additionalImages={additionalImages}
              additionalImagesRef={additionalImagesRef}
              handleAdditionalImagesChange={handleAdditionalImagesChange}
              handleAdditionalImagesClick={handleAdditionalImagesClick}
              removeAdditionalImage={removeAdditionalImage}
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
            >
              Create Car Listing
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddCar;
