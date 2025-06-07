import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
import { RoleFormData, roleFormSchema } from "../schema/Schema.tsx";
import {
  CreateRole,
  DeleteRole,
  UpdateRole,
} from "../services/RoleServices.tsx";
import { useSubmissionErrorHandler } from "../hooks/useSubmissionErrorHandler.tsx";

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
  submissionErrors: any;
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

  // Helper function untuk memproses permissions
  const processPermissions = useCallback(
    (permissions: string[] | string): string[] => {
      if (!permissions) return [];

      if (typeof permissions === "string") {
        try {
          return JSON.parse(permissions);
        } catch (error) {
          console.error("Error parsing permissions:", error);
          return [];
        }
      }

      if (Array.isArray(permissions)) {
        return permissions;
      }

      return [];
    },
    []
  );

  // Default values
  const defaultValues = useMemo(() => {
    if (isDelete) {
      return {
        name: "",
        permission: [],
      };
    }

    return {
      name: initialData?.name || "",
      permission: processPermissions(initialData?.permissions || []),
    };
  }, [
    initialData?.name,
    initialData?.permissions,
    processPermissions,
    isDelete,
  ]);

  const {
    register,
    handleSubmit,
    formState,
    setValue,
    watch,
    reset,
    clearErrors,
    trigger,
    setError,
  } = useForm<RoleFormData>({
    resolver: isDelete ? undefined : zodResolver(roleFormSchema),
    defaultValues,
    mode: isDelete ? "onSubmit" : "onChange",
  });

  // Gunakan submission error handler
  const { submissionErrors, handleSubmissionError, resetSubmissionErrors } =
    useSubmissionErrorHandler(setError);

  const watchedValues = watch();

  // Reset form ketika initialData berubah (untuk update mode)
  useEffect(() => {
    if (isUpdate && initialData && !isDelete) {
      const processedPermissions = processPermissions(
        initialData.permissions || []
      );

      reset({
        name: initialData.name || "",
        permission: processedPermissions,
      });
    }
  }, [isUpdate, initialData, reset, processPermissions, isDelete]);

  const setPermissions = useCallback(
    (permissions: string[]) => {
      if (isDelete) return;

      setValue("permission", permissions, {
        shouldValidate: true,
        shouldDirty: true,
      });
      trigger("permission");
    },
    [setValue, trigger, isDelete]
  );

  const resetAllErrors = useCallback(() => {
    resetSubmissionErrors();
    clearErrors();
  }, [resetSubmissionErrors, clearErrors]);

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

  // Delete operation handler
  const handleDeleteSubmit = useCallback(async () => {
    if (!roleId) {
      const error = new Error("Role ID is required for delete operation");
      handleSubmissionError(error);
      handleError(error);
      return;
    }

    try {
      resetSubmissionErrors();
      await DeleteRole(roleId);
      await handleSuccess();
    } catch (error: any) {
      handleSubmissionError(error);
      handleError(error);
    }
  }, [
    roleId,
    handleSuccess,
    handleError,
    handleSubmissionError,
    resetSubmissionErrors,
  ]);

  // Form submission handler untuk create/update
  const handleFormSubmit = useCallback(
    handleSubmit(async (data: RoleFormData) => {
      try {
        resetSubmissionErrors();

        // Validasi manual sebelum submit
        const isValid = await trigger();
        if (!isValid) {
          return;
        }

        if (isUpdate && roleId) {
          await UpdateRole(roleId, data);
        } else {
          await CreateRole(data);
        }

        await handleSuccess();
      } catch (error: any) {
        console.error("💥 Form submission error:", error);
        handleSubmissionError(error);
        handleError(error);
      }
    }),
    [
      handleSubmit,
      isUpdate,
      roleId,
      handleSuccess,
      handleError,
      trigger,
      handleSubmissionError,
      resetSubmissionErrors,
    ]
  );

  // Tentukan onSubmit function berdasarkan operation type
  const onSubmit = useMemo(() => {
    if (isDelete) {
      return handleDeleteSubmit;
    } else {
      return handleFormSubmit;
    }
  }, [isDelete, handleDeleteSubmit, handleFormSubmit]);

  // Reset function
  const resetForm = useCallback(() => {
    reset(defaultValues);
    resetSubmissionErrors();
  }, [reset, defaultValues, resetSubmissionErrors]);

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
