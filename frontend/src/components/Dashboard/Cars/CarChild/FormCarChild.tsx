import ImageUploader from '../../../ui/ImageUploader.tsx';
import InputField from "../../../ui/InputField.tsx";
import { Car, DollarSign, Hash, Star, Users } from 'lucide-react';
import AdditionalImages from "../../../ui/AddAditionalImages.tsx";

export default function FormCarChild() {
  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <ImageUploader
        preview={preview}
        handleImageClick={handleImageClick}
        imageInputRef={fileInputRef}
        handleImageChange={handleImageChange}
        placeholder="Click to upload main car image"
        height="h-80"
      />

      {imageErrors.mainImage && (
        <p className="text-red-500 text-sm mt-1">{imageErrors.mainImage}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Name"
          name="name"
          placeholder="Enter car name"
          register={register}
          error={errors.name}
          icon={<Car className="w-5 h-5 text-gray-500" />}
          required
        />
        <InputField
          label="Price / Day"
          name="price"
          placeholder="Enter price"
          register={register}
          error={errors.price}
          type="number"
          min="0"
          icon={<DollarSign className="w-5 h-5 text-gray-500" />}
          required
        />
        <InputField
          label="Number of Seats"
          name="seats"
          placeholder="Enter seat count"
          register={register}
          error={errors.seats}
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
          register={register}
          error={errors.unit}
          type="number"
          min="1"
          icon={<Hash className="w-5 h-5 text-gray-500" />}
          required
        />
        <InputField
          label="Rating"
          name="rating"
          placeholder="Enter rating (1-5)"
          register={register}
          error={errors.rating}
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

      {imageErrors.additionalImages && (
        <p className="text-red-500 text-sm mt-1">
          {imageErrors.additionalImages}
        </p>
      )}

      {submissionErrors.general && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">{submissionErrors.general}</p>
        </div>
      )}

      {submissionErrors.network && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">{submissionErrors.network}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !isValid || !isDirty}
        className={`w-full bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
          isSubmitting || !isValid || !isDirty
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        {isSubmitting ? "Creating..." : "Create Car Listing"}
      </button>
    </form>
  );
}
