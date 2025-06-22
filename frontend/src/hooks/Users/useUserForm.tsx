import { useForm } from "react-hook-form";
import { UserFormData, userFormSchema } from "../../schema/Schema.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useSubmissionErrorHandler } from "../useSubmissionErrorHandler.tsx";

export default function useUserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    watch,
    reset,
    clearErrors,
    setError,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role_id: "",
    },
    mode: "onChange",
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const {
    submissionErrors,
    handleSubmissionError,
    resetSubmissionErrors,
    setSubmissionErrors,
  } = useSubmissionErrorHandler(setError);

  const watchedValue = watch();

  const createUser = async (
    data: UserFormData,
    onSuccess?: (data: UserFormData) => Promise<void>
  ) => {
    try {
      setSubmissionErrors({});
      setIsFormSubmitted(true);
      // Log data untuk debugging
      console.log("User Form Data:", data);

      // Jika ada callback onSuccess, panggil callback tersebut
      if (onSuccess) {
        await onSuccess(data);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      handleSubmissionError(error);
    }
  };

  // Helper function to get error message for a field
  const getFieldError = (fieldName: keyof UserFormData) => {
    return errors[fieldName]?.message;
  };

  // Helper function to check if field has error
  const hasFieldError = (fieldName: keyof UserFormData) => {
    return !!errors[fieldName];
  };

  // Clear specific errors
  const clearFieldError = (fieldName: keyof UserFormData) => {
    clearErrors(fieldName);
  };

  // Reset all errors
  const resetAllErrors = () => {
    clearErrors();
    resetSubmissionErrors();
    setIsFormSubmitted(false);
    reset(); // Reset form values
  };

  // Function to handle submit with callback
  const handleCreateUserWithCallback = (
    onSuccess?: (data: UserFormData) => Promise<void>
  ) => {
    return handleSubmit((data) => createUser(data, onSuccess));
  };

  return {
    register,
    handleCreateUserWithCallback,
    formState: {
      errors,
      isSubmitting,
      isDirty,
      isValid,
      isFormSubmitted,
    },

    //formData
    watchedValue,

    // Error handling
    getFieldError,
    hasFieldError,
    clearFieldError,
    resetAllErrors,
    submissionErrors,
  };
}
