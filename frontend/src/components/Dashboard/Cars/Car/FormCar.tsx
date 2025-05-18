import React from "react";
import AdditionalImages from "../../../ui/AddAditionalImages.tsx";
import InputField from "../../../ui/InputField.tsx";
import SelectField from "../../../ui/SelectField.tsx";
import ImageUploader from "../../../ui/ImageUploader.tsx";
import { Car, DollarSign, Hash, Star, Type, Users } from "lucide-react";
import { ImageItem } from "../../../../hooks/useImageUpload.tsx";

interface FormCarProps {
  formData: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  preview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageClick: () => void;
  carTypes: any[];
  additionalImages: ImageItem[];
  additionalImagesRef: React.RefObject<HTMLInputElement | null>;
  handleAdditionalImagesChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleAdditionalImagesClick: () => void;
  removeAdditionalImage: (index: number) => void;
}

export default function FormCar({
  formData,
  handleChange,
  handleFormSubmit,
  preview,
  fileInputRef,
  handleImageChange,
  handleImageClick,
  carTypes,
  additionalImages,
  additionalImagesRef,
  handleAdditionalImagesChange,
  handleAdditionalImagesClick,
  removeAdditionalImage,
}: FormCarProps) {
  return (
    <form className="space-y-8" onSubmit={handleFormSubmit}>
      <ImageUploader
        preview={preview}
        handleImageClick={handleImageClick}
        imageInputRef={fileInputRef}
        handleImageChange={handleImageChange}
        placeholder="Click to upload main car image"
        height="h-80"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Name"
          name="name"
          placeholder="Enter car name"
          value={formData.name}
          onChange={handleChange}
          icon={<Car className="w-5 h-5 text-gray-500" />}
          required
        />
        <InputField
          label="Price / Day"
          name="price"
          placeholder="Enter price"
          value={formData.price}
          onChange={handleChange}
          type="number"
          min="0"
          icon={<DollarSign className="w-5 h-5 text-gray-500" />}
          required
        />
        <SelectField
          data={carTypes}
          icon={<Type className="w-5 h-5 text-gray-500" />}
          label="Car Type"
          name="type_id"
          placeholder="Choose your car type"
          value={formData.type_id}
          onChange={handleChange}
          required
        />
        <InputField
          label="Number of Seats"
          name="seats"
          placeholder="Enter seat count"
          value={formData.seats}
          onChange={handleChange}
          type="number"
          min="1"
          max="100"
          icon={<Users className="w-5 h-5 text-gray-500" />}
          required
        />
        <InputField
          label="Available Amount"
          name="unit"
          placeholder="How many cars are available"
          value={formData.unit}
          onChange={handleChange}
          type="number"
          min="1"
          icon={<Hash className="w-5 h-5 text-gray-500" />}
          required
        />
        <InputField
          label="Rating"
          name="rating"
          placeholder="Enter rating (1-5)"
          value={formData.rating}
          onChange={handleChange}
          type="number"
          min="1"
          max="5"
          icon={<Star className="w-5 h-5 text-gray-500" />}
          required
        />
      </div>

      <AdditionalImages
        additionalImages={additionalImages}
        additionalImagesRef={additionalImagesRef}
        handleAdditionalImagesChange={handleAdditionalImagesChange}
        handleAdditionalImagesClick={handleAdditionalImagesClick}
        removeAdditionalImage={removeAdditionalImage}
      />

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
      >
        Create Car Listing
      </button>
    </form>
  );
}
