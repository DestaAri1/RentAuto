import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useCallback, useEffect, useMemo } from "react";
import { RoleFormData, roleFormSchema } from "../schema/Schema.tsx";
import {
  CreateRole,
  DeleteRole,
  UpdateRole,
} from "../services/RoleServices.tsx";

interface UseRoleFormProps {
  onSuccess?: () => Promise<void> | void;
  onError?: (error: any) => void;
  isUpdate?: boolean;
  isDelete?: boolean;
  roleId?: string;
  initialData?: {
    name: string;
    permissions: string[] | string;
  };
}

interface UseRoleFormReturn {
  register: any;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  formState: any;
  setPermissions: (permissions: string[]) => void;
  watchedValues: RoleFormData;
  submissionErrors: {
    general?: string;
    network?: string;
    validation?: string;
  };
  resetAllErrors: () => void;
  reset: () => void;
}

export default function useRoleForm(
  props: UseRoleFormProps = {}
): UseRoleFormReturn {
  const {
    onSuccess,
    onError,
    isUpdate = false,
    roleId,
    initialData,
    isDelete = false,
  } = props;

  const [submissionErrors, setSubmissionErrors] = useState<{
    general?: string;
    network?: string;
    validation?: string;
  }>({});

  // Helper function untuk memproses permissions
  const processPermissions = useCallback(
    (permissions: string[] | string): string[] => {
      if (!permissions) return [];

      // Jika permissions adalah string (JSON), parse terlebih dahulu
      if (typeof permissions === "string") {
        try {
          return JSON.parse(permissions);
        } catch (error) {
          console.error("Error parsing permissions:", error);
          return [];
        }
      }

      // Jika sudah array, return langsung
      if (Array.isArray(permissions)) {
        return permissions;
      }

      return [];
    },
    []
  );

  // Memoize default values dengan penanganan permissions yang lebih baik
  const defaultValues = useMemo(
    () => ({
      name: initialData?.name || "",
      permission: processPermissions(initialData?.permissions || []), // Gunakan 'permission' sesuai schema
    }),
    [initialData?.name, initialData?.permissions, processPermissions]
  );

  const {
    register,
    handleSubmit,
    formState,
    setValue,
    watch,
    reset,
    clearErrors,
    trigger,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema), // Tambahkan Zod resolver
    defaultValues,
    mode: "onChange", // Validasi real-time
  });

  const watchedValues = watch();

  // Reset form ketika initialData berubah (untuk update mode)
  useEffect(() => {
    if (isUpdate && initialData) {
      const processedPermissions = processPermissions(
        initialData.permissions || []
      );

      // Reset dengan data yang benar
      reset({
        name: initialData.name || "",
        permission: processedPermissions,
      });
    }
  }, [isUpdate, initialData, reset, processPermissions]);

  // Memoized setPermissions dengan validasi trigger
  const setPermissions = useCallback(
    (permissions: string[]) => {
      setValue("permission", permissions, {
        shouldValidate: true,
        shouldDirty: true,
      });
      // Trigger validasi manual untuk memastikan form state ter-update
      trigger("permission");
    },
    [setValue, trigger]
  );

  // Memoized resetAllErrors
  const resetAllErrors = useCallback(() => {
    setSubmissionErrors({});
    clearErrors();
  }, [clearErrors]);

  // Success handler
  const handleSuccess = useCallback(async () => {
    if (onSuccess) {
      await onSuccess();
    }
  }, [onSuccess]);

  // Error handler
  const handleError = useCallback(
    (error: any) => {
      if (onError) {
        onError(error);
      }
    },
    [onError]
  );

  // Form submission handler
  const onSubmit = useCallback(
    handleSubmit(async (data: RoleFormData) => {
      try {
        setSubmissionErrors({});

        // Validasi manual sebelum submit
        const isValid = await trigger();
        if (!isValid) {
          console.log("Form validation failed");
          return;
        }

        if (isDelete && roleId) {
          await DeleteRole(roleId);
        } else if (isUpdate && roleId) {
          await UpdateRole(roleId, data);
        } else {
          await CreateRole(data);
        }

        // Call success callback
        await handleSuccess();
      } catch (error: any) {
        console.error("Form submission error:", error);

        // Handle different types of errors
        if (error.response?.status === 422) {
          setSubmissionErrors({
            validation: error.response.data.message || "Validation failed",
          });
        } else if (error.code === "NETWORK_ERROR") {
          setSubmissionErrors({
            network: "Network error. Please check your connection.",
          });
        } else {
          setSubmissionErrors({
            general: error.message || "An unexpected error occurred",
          });
        }

        // Call error callback
        handleError(error);
      }
    }),
    [
      handleSubmit,
      isUpdate,
      isDelete,
      roleId,
      handleSuccess,
      handleError,
      trigger,
    ]
  );

  // Reset function
  const resetForm = useCallback(() => {
    reset(defaultValues);
    setSubmissionErrors({});
  }, [reset, defaultValues]);

  return {
    register,
    onSubmit,
    formState,
    setPermissions,
    watchedValues,
    submissionErrors,
    resetAllErrors,
    reset: resetForm,
  };
}
