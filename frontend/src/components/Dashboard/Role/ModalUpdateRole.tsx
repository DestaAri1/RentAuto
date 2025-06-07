import React, { useState, useEffect, useCallback, useMemo } from "react";
import Modal from "../../Modal.tsx";
import { ModalProps } from "../../../types";
import { BaseForm } from "../../../types/form.tsx";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { RoleFormData } from "../../../schema/Schema.tsx";
import FormRole from "./FormRole.tsx";

interface UpdateRoleModalProps extends ModalProps, BaseForm {
  register: UseFormRegister<RoleFormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<RoleFormData>;
  setPermission: (permission: string[]) => void;
  watchedValues: RoleFormData;
  initialData?: any;
}

export default function ModalUpdateRole({
  isOpen,
  onClose,
  register,
  onSubmit,
  errors,
  setPermission,
  watchedValues,
  isSubmitting,
  isValid,
  submissionErrors,
  resetAllErrors,
  initialData,
}: UpdateRoleModalProps) {
  const [selectedPermission, setSelectedPermission] = useState<string[]>([]);

  // Memoize initial permission dengan pengecekan yang lebih robust
  const initialPermission = useMemo(() => {
    if (!initialData) {
      return [];
    }

    // Cek field 'permission' terlebih dahulu (dari server), kemudian 'permission'
    let permissionData = initialData.permission || initialData.permission;

    // Handle jika permission adalah string JSON
    if (typeof permissionData === "string") {
      try {
        const parsed = JSON.parse(permissionData);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error("Error parsing permission JSON:", error);
        return [];
      }
    }

    // Handle jika permission sudah berupa array
    if (Array.isArray(permissionData)) {
      return permissionData;
    }

    // Fallback ke array kosong
    return [];
  }, [initialData]);

  // Initialize permission saat modal dibuka
  useEffect(() => {
    if (isOpen && initialData && initialPermission.length >= 0) {
      // Set selected permission di local state
      setSelectedPermission(initialPermission);

      // Set permission di form
      setPermission(initialPermission);
    }
  }, [isOpen, initialData, initialPermission, setPermission]);

  // Reset state saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setSelectedPermission([]);
    }
  }, [isOpen]);

  // Sync dengan watchedValues jika ada perubahan dari form
  useEffect(() => {
    if (
      watchedValues?.permission &&
      Array.isArray(watchedValues.permission)
    ) {
      if (
        JSON.stringify(watchedValues.permission) !==
        JSON.stringify(selectedPermission)
      ) {
        setSelectedPermission(watchedValues.permission);
      }
    }
  }, [watchedValues?.permission, selectedPermission]);

  // Memoized permission change handler
  const handlePermissionChange = useCallback(
    (permission: string[]) => {
      setSelectedPermission(permission);
      setPermission(permission);
    },
    [setPermission]
  );

  // Memoized form submit handler
  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await onSubmit();
    },
    [onSubmit, selectedPermission]
  );

  // Jangan render modal jika tidak ada initial data
  if (isOpen && !initialData) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Role">
      {/* Debug info - hanya tampil di development */}
      {/* {process.env.NODE_ENV === "development" && isOpen && (
        <div className="mb-4 p-3 bg-gray-100 rounded-lg text-xs">
          <h4 className="font-bold mb-2">DEBUG INFO:</h4>
          <div>Initial Data: {JSON.stringify(initialData, null, 2)}</div>
          <div>
            Selected Permission: {JSON.stringify(selectedPermission, null, 2)}
          </div>
          <div>
            Form Permission:{" "}
            {JSON.stringify(watchedValues?.permission, null, 2)}
          </div>
          <div>Is Initialized: {isInitialized.toString()}</div>
          <div>
            Initial Permission: {JSON.stringify(initialPermission, null, 2)}
          </div>
        </div>
      )} */}
      <FormRole
        register={register}
        errors={errors}
        onSubmit={handleFormSubmit}
        onClose={onClose}
        selectedPermissions={selectedPermission}
        handlePermissionsChange={handlePermissionChange}
        isSubmitting={isSubmitting}
        isValid={isValid}
        submissionErrors={submissionErrors}
        resetAllErrors={resetAllErrors}
        isUpdate={true}
        initialData={initialData}
      />
    </Modal>
  );
}
