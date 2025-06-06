import React, { useState, useEffect } from "react";
import Modal from "../../Modal.tsx";
import { ModalProps } from "../../../types";
import InputField from "../../ui/InputField.tsx";
import { BaseForm } from "../../../types/form.tsx";
import {
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { BookMarkedIcon } from "lucide-react";
import { RoleFormData } from "../../../schema/Schema.tsx";
import PermissionSelector from "../../ui/SelectPermission.tsx";
import { DEFAULT_PERMISSIONS } from "../../../types/data.tsx";

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
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Name Input Field */}
        <InputField
          label="Name"
          name="name"
          placeholder="Enter role name"
          register={register}
          error={errors.name}
          icon={<BookMarkedIcon className="w-5 h-5" />}
          required
        />

        {/* Permission Selector */}
        <PermissionSelector
          permissions={DEFAULT_PERMISSIONS}
          selectedPermissions={selectedPermissions}
          onPermissionsChange={handlePermissionsChange}
          required
          error={errors.permissions?.message}
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
