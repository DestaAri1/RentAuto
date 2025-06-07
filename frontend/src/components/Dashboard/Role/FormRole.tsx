import React from "react";
import InputField from "../../ui/InputField.tsx";
import PermissionSelector from "../../ui/SelectPermission.tsx";
import { BookMarkedIcon } from "lucide-react";
import { DEFAULT_PERMISSIONS } from "../../../types/data.tsx";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { RoleFormData } from "../../../schema/Schema.tsx";
import { BaseForm } from "../../../types/form.tsx";

interface FormRoleProps extends BaseForm {
  register: UseFormRegister<RoleFormData>;
  errors: FieldErrors<RoleFormData>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onClose: () => void;
  selectedPermissions: string[];
  handlePermissionsChange: (permissions: string[]) => void;
  isUpdate?: boolean;
  initialData?: any;
}

export default function FormRole({
  register,
  errors,
  onSubmit,
  onClose,
  selectedPermissions,
  handlePermissionsChange,
  isSubmitting,
  isValid,
  isUpdate = false,
}: FormRoleProps) {

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
        error={errors.permission?.message}
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
          {isSubmitting ? "Saving..." : isUpdate ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}
