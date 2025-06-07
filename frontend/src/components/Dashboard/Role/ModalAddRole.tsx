import React, { useState, useEffect } from "react";
import Modal from "../../Modal.tsx";
import { ModalProps } from "../../../types";
import { BaseForm } from "../../../types/form.tsx";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { RoleFormData } from "../../../schema/Schema.tsx";
import FormRole from "./FormRole.tsx";

interface RoleModalProps extends ModalProps, BaseForm {
  register: UseFormRegister<RoleFormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<RoleFormData>;
  setPermissions: (permissions: string[]) => void;
  watchedValues: RoleFormData;
}

export default function ModalAddRole({
  isOpen,
  onClose,
  register,
  onSubmit,
  errors,
  setPermissions,
  watchedValues,
  isSubmitting,
  isValid,
  isDirty,
  submissionErrors,
  resetAllErrors,
}: RoleModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Sync with form state
  useEffect(() => {
    if (watchedValues.permissions) {
      setSelectedPermissions(watchedValues.permissions);
    }
  }, [watchedValues.permissions]);

  const handlePermissionsChange = (permissions: string[]) => {
    setSelectedPermissions(permissions);
    setPermissions(permissions);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Update permissions before submission
    setPermissions(selectedPermissions);
    // Call the submit handler from parent
    await onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Role">
      <FormRole
        register={register}
        errors={errors}
        onSubmit={handleFormSubmit}
        onClose={onClose}
        selectedPermissions={selectedPermissions}
        handlePermissionsChange={handlePermissionsChange}
        isSubmitting={isSubmitting}
        isValid={isValid}
        submissionErrors={submissionErrors}
      />
    </Modal>
  );
}
