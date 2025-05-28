import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CarFormData, carFormSchema } from "../schema/Schema.tsx";
import { useState } from "react";
import { SubmissionError } from "../types/submission.tsx";

export const useCarForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    watch,
    setValue,
    reset,
    clearErrors,
    setError,
  } = useForm<CarFormData>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      name: "",
      price: 0,
      type_id: "",
      seats: 1,
    },
    mode: "onChange", // Validate on change for better UX
  });

  const [submissionErrors, setSubmissionErrors] = useState<SubmissionError>({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const watchedValues = watch();

  // Validation function yang bisa dipanggil dari luar
  const validateForm = (data: CarFormData): boolean => {
    let isValid = true;
    setSubmissionErrors({});

    // Client-side validation examples
    if (data.price < 10) {
      setError("price", {
        type: "manual",
        message: "High-rated cars typically cost more than $10 per day",
      });
      isValid = false;
    }

    if (data.name.length < 2) {
      setError("name", {
        type: "manual",
        message: "Car name must be at least 2 characters long",
      });
      isValid = false;
    }

    if (data.seats < 1 || data.seats > 50) {
      setError("seats", {
        type: "manual",
        message: "Number of seats must be between 1 and 50",
      });
      isValid = false;
    }

    if (!data.type_id) {
      setError("type_id", {
        type: "manual",
        message: "Please select a car type",
      });
      isValid = false;
    }

    return isValid;
  };

  // Error handler yang bisa dipanggil dari parent
  const handleSubmissionError = (error: any) => {
    console.error("Error creating car:", error);

    // Handle different types of errors
    if (
      error.name === "NetworkError" ||
      error.message.includes("fetch") ||
      error.message.includes("Network")
    ) {
      setSubmissionErrors({
        network:
          "Network error. Please check your internet connection and try again.",
      });
    } else if (error.response?.status === 422) {
      // Validation errors from server
      const serverErrors = error.response.data.errors;
      Object.keys(serverErrors).forEach((field) => {
        setError(field as keyof CarFormData, {
          type: "server",
          message: serverErrors[field][0],
        });
      });
    } else if (error.response?.status === 413) {
      setSubmissionErrors({
        general:
          "Upload size too large. Please reduce image file sizes and try again.",
      });
    } else if (error.response?.status >= 500) {
      setSubmissionErrors({
        general:
          "Server error. Please try again later or contact support if the problem persists.",
      });
    } else {
      setSubmissionErrors({
        general:
          error.message || "An unexpected error occurred. Please try again.",
      });
    }
  };

  // Helper function to get error message for a field
  const getFieldError = (fieldName: keyof CarFormData) => {
    return errors[fieldName]?.message;
  };

  // Helper function to check if field has error
  const hasFieldError = (fieldName: keyof CarFormData) => {
    return !!errors[fieldName];
  };

  // Clear specific errors
  const clearFieldError = (fieldName: keyof CarFormData) => {
    clearErrors(fieldName);
  };

  // Reset all errors
  const resetAllErrors = () => {
    clearErrors();
    setSubmissionErrors({});
    setIsFormSubmitted(false);
    reset(); // Also reset form values
  };

  return {
    // Form state and methods
    register,
    handleSubmit, // Raw handleSubmit dari react-hook-form
    formState: {
      errors,
      isSubmitting,
      isDirty,
      isValid,
      isFormSubmitted,
    },
    // Form data
    watchedValues,
    setValue,
    reset,

    // Error handling
    getFieldError,
    hasFieldError,
    clearFieldError,
    resetAllErrors,
    submissionErrors,

    // New utility functions
    validateForm,
    handleSubmissionError,

    // Helper methods
    isFormValid: isValid,
  };
};
