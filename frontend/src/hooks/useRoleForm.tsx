import { useForm } from "react-hook-form";
import { RoleFormData, roleFormSchema } from "../schema/Schema.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useSubmissionErrorHandler } from "./useSubmissionErrorHandler.tsx";
import { CreateRole } from "../services/RoleServices.tsx";

interface UseRoleFormOptions {
  onSuccess?: (data: RoleFormData) => void;
  onError?: (error: any) => void;
}

export default function useRoleForm(options: UseRoleFormOptions = {}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    watch,
    setValue,
    reset,
    setError,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      permissions: [],
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

  const watchedValues = watch();

  // Helper function to set permissions
  const setPermissions = (permissions: string[]) => {
    setValue("permissions", permissions, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Submit handler yang menangani API call
  const onSubmit = handleSubmit(async (data: RoleFormData) => {
    try {
      setIsFormSubmitted(true);
      // API call - customize this endpoint as needed
      const formData = {
        name: data.name,
        permission: data.permissions
      }
      const response = await CreateRole(formData);

      // Reset form on success
      reset();
      resetSubmissionErrors();

      return response.data;
    } catch (error) {
      console.error("Error creating role:", error);
      handleSubmissionError(error);

      // Call error callback if provided
      if (options.onError) {
        options.onError(error);
      }

      throw error; // Re-throw to prevent form from closing
    }
  });

  // Custom submit handler for external API calls
  const submitWithCustomFetch = (
    fetchFunction: (data: RoleFormData) => Promise<any>
  ) => {
    return handleSubmit(async (data: RoleFormData) => {
      try {
        setIsFormSubmitted(true);
        console.log("Submitting role data:", data);

        const result = await fetchFunction(data);
        console.log("Role created successfully:", result);

        // Reset form on success
        reset();
        resetSubmissionErrors();

        // Call success callback if provided
        if (options.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (error) {
        console.error("Error creating role:", error);
        handleSubmissionError(error);

        // Call error callback if provided
        if (options.onError) {
          options.onError(error);
        }

        throw error; // Re-throw to prevent form from closing
      }
    });
  };

  return {
    register,
    handleSubmit,
    onSubmit, // Default submit handler with built-in fetch
    submitWithCustomFetch, // For custom fetch functions
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
    setPermissions,
    reset,
    submissionErrors,
    handleSubmissionError,
    resetSubmissionErrors,
    setSubmissionErrors,
  };
}
