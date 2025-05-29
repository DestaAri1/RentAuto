import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CarFormData, carFormSchema } from "../schema/Schema.tsx";
import { useState, useCallback, useEffect } from "react";
import { CreateCar } from "../services/CarServices.tsx";
import { useSubmissionErrorHandler } from "./useSubmissionErrorHandler.tsx";
import { Cars } from "../types/index.tsx";

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

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const {
    submissionErrors,
    handleSubmissionError,
    resetSubmissionErrors,
    setSubmissionErrors,
  } = useSubmissionErrorHandler(setError);

  // ✅ Tambahkan callback untuk success handling
  const [successCallback, setSuccessCallback] = useState<(() => void) | null>(
    null
  );

  const watchedValues = watch();

  // ✅ Function untuk populate form dengan data yang akan di-update
  const populateForm = useCallback(
    (car: Cars) => {
      setValue("name", car.name);
      setValue("price", car.price);
      setValue("type_id", car.Type.id);
      setValue("seats", car.seats);

      // Clear errors when populating
      clearErrors();
      resetSubmissionErrors();
    },
    [setValue, clearErrors, resetSubmissionErrors]
  );

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

  const onSubmit = async (data: CarFormData) => {
    try {
      // Clear previous errors
      setSubmissionErrors({});

      // Validate form
      const validated = validateForm(data);

      if (!validated) {
        return;
      }

      // Prepare data untuk API
      const carData = {
        name: data.name,
        price: Number(data.price),
        type_id: data.type_id,
        seats: Number(data.seats),
      };

      // Call API
      const result = await CreateCar(carData);

      if (result) {
        setIsFormSubmitted(true);
        if (successCallback) {
          successCallback();
        }
        reset();
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      handleSubmissionError(error);
    }
  };

  // ✅ Function untuk set success callback
  const onSubmitSuccess = useCallback((callback: () => void) => {
    setSuccessCallback(() => callback);
  }, []);

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
    resetSubmissionErrors(); // Tambahan baru
    setIsFormSubmitted(false);
    reset(); // Reset form values
  };

  return {
    // Form state and methods
    register,
    handleSubmit: handleSubmit(onSubmit),
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

    validateForm,
    handleSubmissionError,
    onSubmitSuccess,
    populateForm,

    // Helper methods
    isFormValid: isValid,
  };
};
