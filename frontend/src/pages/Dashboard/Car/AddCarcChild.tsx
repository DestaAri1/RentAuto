import React, { FC, ReactElement } from "react";
import DashboardLayout from "../../../layout/DashboardLayout.tsx";
import useCarType from "../../../hooks/useCarType.tsx";
import FormCar from "../../../components/Dashboard/Cars/Car/FormCar.tsx";
import { useCarForms } from "../../../hooks/Car/useCarForm.tsx";

const AddCarChild: FC = (): ReactElement => {
  const breadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Cars", href: "/dashboard/my-rentals" },
    { name: "Create Car", current: true },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid, isFormSubmitted },
    preview,
    fileInputRef,
    handleImageChange,
    handleImageClick,
    additionalImages,
    additionalImagesRef,
    handleAdditionalImagesChange,
    handleAdditionalImagesClick,
    removeAdditionalImage,
    imageErrors,
    submissionErrors,
    watchedValues,
    resetAllErrors,
    isFormValid,
  } = useCarForms();

  const { carTypes, isLoading: carTypesLoading } = useCarType();

  // Function to safely stringify values for debug panel
  const safeStringify = (obj: any) => {
    try {
      // Create a safe copy of the object removing circular references and DOM elements
      const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
          // Skip DOM elements and React refs
          if (
            value instanceof Element ||
            (value && value.current) ||
            key === "fileInputRef" ||
            key === "additionalImagesRef"
          ) {
            return "[DOM Element or Ref]";
          }
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return "[Circular]";
            }
            seen.add(value);
          }
          return value;
        };
      };

      return JSON.stringify(obj, getCircularReplacer(), 2);
    } catch (error) {
      return `[Unable to stringify: ${error.message}]`;
    }
  };

  return (
    <DashboardLayout title="Create Car" breadcrumb={breadcrumbItems}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="bg-white shadow-2xl rounded-2xl p-8 mt-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Add New Car Listing
            </h2>
            <p className="text-gray-600">
              Fill in the details below to create your car rental listing
            </p>
          </div>

          {/* Car Types Loading/Error State */}
          {carTypesLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-blue-700">Loading car types...</span>
              </div>
            </div>
          )}

          {/* Form Component */}
          <FormCar
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            isSubmitting={isSubmitting}
            isValid={isValid}
            isDirty={isDirty}
            isFormSubmitted={isFormSubmitted}
            preview={preview}
            fileInputRef={fileInputRef}
            handleImageChange={handleImageChange}
            handleImageClick={handleImageClick}
            carTypes={carTypes || []}
            additionalImages={additionalImages}
            additionalImagesRef={additionalImagesRef}
            handleAdditionalImagesChange={handleAdditionalImagesChange}
            handleAdditionalImagesClick={handleAdditionalImagesClick}
            removeAdditionalImage={removeAdditionalImage}
            imageErrors={imageErrors}
            submissionErrors={submissionErrors}
            watchedValues={watchedValues}
            resetAllErrors={resetAllErrors}
          />

          {/* Development Debug Panel (remove in production) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-8 p-4 bg-gray-100 rounded-xl">
              <details className="text-sm">
                <summary className="font-semibold cursor-pointer text-gray-700">
                  Debug Information (Development Only)
                </summary>
                <div className="mt-2 space-y-2">
                  <div>
                    <strong>Form Valid:</strong> {isFormValid ? "Yes" : "No"}
                  </div>
                  <div>
                    <strong>Is Dirty:</strong> {isDirty ? "Yes" : "No"}
                  </div>
                  <div>
                    <strong>Is Submitting:</strong>{" "}
                    {isSubmitting ? "Yes" : "No"}
                  </div>
                  <div>
                    <strong>Form Submitted:</strong>{" "}
                    {isFormSubmitted ? "Yes" : "No"}
                  </div>
                  <div>
                    <strong>Errors:</strong> <pre>{safeStringify(errors)}</pre>
                  </div>
                  <div>
                    <strong>Image Errors:</strong>{" "}
                    <pre>{safeStringify(imageErrors)}</pre>
                  </div>
                  <div>
                    <strong>Submission Errors:</strong>{" "}
                    <pre>{safeStringify(submissionErrors)}</pre>
                  </div>
                  <div>
                    <strong>Current Values:</strong>{" "}
                    <pre>{safeStringify(watchedValues)}</pre>
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddCarChild;
