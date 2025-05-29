import React from "react";
import InputField from "../../../ui/InputField.tsx";
import { Car, DollarSign, Type, Users } from "lucide-react";
import SelectField from "../../../ui/SelectField.tsx";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CarFormData } from "../../../../schema/Schema.tsx";
import { SubmissionError } from "../../../../types/submission.tsx";
import { CarType } from "../../../../types/index.tsx";

export interface CarFormProps {
  onClose: () => void;
  register: UseFormRegister<CarFormData>;
  errors: FieldErrors<CarFormData>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  submissionErrors: SubmissionError;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  watchedValues: CarFormData;
  carTypes: CarType[];
  // New props for flexibility
  mode?: "add" | "update";
  submitButtonText?: string;
  submittingText?: string;
}

export const CarForm: React.FC<CarFormProps> = ({
  onClose,
  register,
  errors,
  isSubmitting,
  isDirty,
  isValid,
  submissionErrors,
  onSubmit,
  watchedValues,
  carTypes,
  mode = "add",
  submitButtonText,
  submittingText,
}) => {
  // Default button texts based on mode
  const defaultSubmitText =
    mode === "add" ? "Create Car Listing" : "Update Car Listing";
  const defaultSubmittingText = mode === "add" ? "Creating..." : "Updating...";

  const finalSubmitText = submitButtonText || defaultSubmitText;
  const finalSubmittingText = submittingText || defaultSubmittingText;

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Display general submission errors */}
      {submissionErrors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error occurred
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {submissionErrors.general}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Network error */}
      {submissionErrors.network && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Network Error
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                {submissionErrors.network}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show current form values for debugging */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs">
          <h4 className="font-semibold text-blue-800 mb-2">
            Form Values (Dev Mode):
          </h4>
          <pre className="text-blue-700">
            {JSON.stringify(watchedValues, null, 2)}
          </pre>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Name"
          name="name"
          placeholder="Enter car name"
          register={register}
          error={errors.name}
          icon={<Car className="w-5 h-5" />}
          required
        />
        <InputField
          label="Price / Day"
          name="price"
          placeholder="Enter price"
          register={register}
          error={errors.price}
          type="number"
          min="1"
          step="0.01"
          icon={<DollarSign className="w-5 h-5" />}
          required
        />
        <SelectField
          data={carTypes}
          icon={<Type className="w-5 h-5" />}
          label="Car Type"
          name="type_id"
          placeholder="Choose your car type"
          register={register}
          error={errors.type_id}
          value={watchedValues.type_id} // ✅ Pass watched value to SelectField
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
          max="50"
          icon={<Users className="w-5 h-5" />}
          required
        />
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className={`flex-1 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-gray-700 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isValid || (mode === "add" && !isDirty)}
          className={`flex-1 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
            isSubmitting || !isValid || (mode === "add" && !isDirty)
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {isSubmitting ? finalSubmittingText : finalSubmitText}
        </button>
      </div>

      {/* Form status indicator */}
      <div className="text-xs text-gray-500 text-center">
        Form Status:{" "}
        {!isDirty && mode === "add"
          ? "No changes"
          : !isValid
          ? "Invalid"
          : "Ready to submit"}
      </div>
    </form>
  );
};

export default CarForm;
