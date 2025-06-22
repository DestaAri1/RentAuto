import React from "react";
import { BaseForm } from "../../../types/form";
import { UserFormData } from "../../../schema/Schema.tsx";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import InputField from "../../ui/InputField.tsx";
import { UserPen, Mail, Lock, Shield } from "lucide-react";
import SelectField from "../../ui/SelectField.tsx";
import { Role } from "../../../types/index.tsx";

interface FormUserProps extends BaseForm {
  register: UseFormRegister<UserFormData>;
  errors: FieldErrors<UserFormData>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onClose?: () => void;
  selectedPermissions?: string[];
  handlePermissionsChange?: (permissions: string[]) => void;
  role: Role[];
  isUpdate?: boolean;
  initialData?: any;
  watchedValue: UserFormData;
}

export default function FormUser({
  register,
  onSubmit,
  isSubmitting,
  isValid,
  isDirty,
  errors,
  onClose,
  role,
  watchedValue,
}: FormUserProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <InputField
        label="Username"
        name="username"
        placeholder="Enter Username"
        register={register}
        error={errors.username}
        icon={<UserPen className="w-5 h-5 text-gray-500" />}
      />

      <InputField
        label="Email"
        name="email"
        type="email"
        placeholder="Enter Email"
        register={register}
        error={errors.email}
        icon={<Mail className="w-5 h-5 text-gray-500" />}
      />

      <InputField
        label="Password"
        name="password"
        type="password"
        placeholder="Enter Password"
        register={register}
        error={errors.password}
        icon={<Lock className="w-5 h-5 text-gray-500" />}
      />

      <SelectField
        data={role}
        icon={<Shield className="w-5 h-5 text-gray-500" />}
        label="Role"
        name="role_id"
        register={register}
        placeholder="Choose the role"
        value={watchedValue.role_id}
      />

      <div className="flex gap-3 pt-4">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-gray-700 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ease-in-out"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isValid || !isDirty}
          className={`flex-1 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white py-3 rounded-xl font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
            isSubmitting || !isValid || !isDirty
              ? "opacity-50 cursor-not-allowed transform-none"
              : ""
          }`}
        >
          {isSubmitting ? "Creating..." : "Create User"}
        </button>
      </div>
    </form>
  );
}
