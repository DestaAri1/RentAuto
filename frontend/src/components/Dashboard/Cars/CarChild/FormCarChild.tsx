import React, { useMemo, useCallback } from "react";
import ImageUploader from "../../../ui/ImageUploader.tsx";
import InputField from "../../../ui/InputField.tsx";
import { Car, CarFront, NotebookText, Palette, Type, UserCheck } from "lucide-react";
import AdditionalImages from "../../../ui/AddAditionalImages.tsx";
import SelectField from "../../../ui/SelectField.tsx";
import useFormCarChild from "../../../../hooks/useFormCarChild.tsx";
import TextAreaField from "../../../ui/TextAreaField.tsx";

export default function FormCarChild() {
  const {
    register,
    wrappedHandleSubmit,
    formState: { errors, isSubmitting, isDirty },
    preview,
    handleImageClick,
    fileInputRef,
    handleImageChange,
    additionalImages,
    additionalImagesRef,
    handleAdditionalImagesChange,
    handleAdditionalImagesClick,
    removeAdditionalImage,
    imageErrors,
    submissionErrors,
    watchedValues,
    isFormValid,
    hasMainImage,
  } = useFormCarChild();

  const formCarChild = useMemo(
    () => [
      {
        label: "Name",
        name: "name" as const,
        placeholder: "Enter car name",
        register: register,
        error: errors.name,
        icon: <Car className="w-5 h-5 text-gray-500" />,
      },
      {
        label: "Alias",
        name: "alias" as const,
        placeholder: "Enter alias name",
        register: register,
        error: errors.alias,
        icon: <UserCheck className="w-5 h-5 text-gray-500" />,
      },
      {
        label: "Color",
        name: "color" as const,
        placeholder: "Enter car color",
        register: register,
        error: errors.color,
        icon: <Palette className="w-5 h-5 text-gray-500" />,
      },
      {
        label: "Car Parent",
        name: "car_parent",
        register: register,
        placeholder: "hehe",
        error: errors.car_parent,
        icon: <CarFront className="w-5 h-5 text-gray-500" />,
        disabled: true,
      },
    ],
    [register, errors.name, errors.alias, errors.color, errors.car_parent]
  );

  // Memoize status options
  const statusInfo = useMemo(
    () => [
      { id: 1, name: "Active" },
      { id: 2, name: "Maintenance" },
      { id: 3, name: "Used By Owner" },
      { id: 4, name: "Inactive" },
      { id: 5, name: "Reserved" },
    ],
    []
  );

  // Memoize button disabled state
  const isButtonDisabled = useMemo(() => {
    return isSubmitting || !isFormValid || !isDirty;
  }, [isSubmitting, isFormValid, isDirty]);

  // Memoize form submit handler
  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      wrappedHandleSubmit(e);
    },
    [wrappedHandleSubmit]
  );

  // Memoize debug info untuk development
  const debugInfo = useMemo(() => {
    if (process.env.NODE_ENV !== "development") return null;

    return (
      <div className="bg-gray-100 p-3 rounded text-xs">
        <p>Debug: isFormValid: {isFormValid.toString()}</p>
        <p>Debug: hasMainImage: {hasMainImage.toString()}</p>
        <p>Debug: isDirty: {isDirty.toString()}</p>
        <p>Debug: isSubmitting: {isSubmitting.toString()}</p>
        <p>Debug: imageErrors: {JSON.stringify(imageErrors)}</p>
      </div>
    );
  }, [isFormValid, hasMainImage, isDirty, isSubmitting, imageErrors]);

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

      {imageErrors.mainImage && (
        <p className="text-red-500 text-sm mt-1">{imageErrors.mainImage}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formCarChild.map((item) => (
          <InputField
            key={item.name}
            label={item.label}
            name={item.name}
            placeholder={item.placeholder}
            register={item.register}
            error={item.error}
            icon={item.icon}
            disabled={item.disabled}
          />
        ))}
      </div>
      <SelectField
        data={statusInfo}
        icon={<Type className="w-5 h-5 text-gray-500" />}
        label="Status"
        name="status"
        placeholder="Choose your car status"
        register={register}
        error={errors.status}
        value={watchedValues.status}
        required
      />

      <TextAreaField
        icon={<NotebookText className="w-5 h-5 text-gray-500" />}
        label="Description"
        name="description"
        placeholder="Input your description"
        register={register}
        error={errors.description}
        rows={5}
      />

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

      {/* Debug info - remove in production */}
      {debugInfo}

      <button
        type="submit"
        disabled={isButtonDisabled}
        className={`w-full bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
          isButtonDisabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
        }`}
      >
        {isSubmitting ? "Creating..." : "Create Car Listing"}
      </button>
    </form>
  );
}
