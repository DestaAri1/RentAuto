import React, { FC, ReactElement, ReactNode } from "react";
import { FieldError } from "react-hook-form";

interface SelectFieldProps {
  data: any[];
  label: string;
  name: string;
  placeholder: string;
  icon: ReactNode;
  required?: boolean;
  className?: string;
  error?: FieldError;
  register: any;
  disabled?: boolean;
  onBlur?: () => void;
  helperText?: string;
  value?: string | number; // ✅ Tambahkan prop value untuk controlled component
}

export const SelectField: FC<SelectFieldProps> = ({
  data,
  label,
  name,
  placeholder,
  icon,
  required = false,
  className = "",
  error,
  register,
  disabled = false,
  onBlur,
  helperText,
  value, // ✅ Destructure value prop
}): ReactElement => {
  const hasError = !!error;
  const hasData = data && data.length > 0;

  return (
    <div className={`relative ${className}`}>
      <label
        className={`block font-medium mb-2 ${
          hasError ? "text-red-700" : "text-gray-700"
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        className={`flex items-center border-2 rounded-xl px-4 py-3 transition-all duration-200 ${
          hasError
            ? "border-red-500 bg-red-50 focus-within:border-red-600"
            : disabled
            ? "border-gray-200 bg-gray-50"
            : "border-gray-300 focus-within:border-indigo-500 focus-within:bg-white"
        }`}
      >
        <div className={`mr-3 ${hasError ? "text-red-500" : "text-gray-500"}`}>
          {icon}
        </div>
        <select
          {...register(name)}
          disabled={disabled || !hasData}
          onBlur={onBlur}
          value={value || ""}
          className={`w-full outline-none bg-transparent ${
            hasError
              ? "text-red-900"
              : disabled || !hasData
              ? "text-gray-500"
              : "text-gray-800"
          }`}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${name}-error`
              : helperText
              ? `${name}-helper`
              : undefined
          }
        >
          <option value="" disabled>
            {!hasData ? "Loading..." : placeholder}
          </option>
          {hasData ? (
            data?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No data available
            </option>
          )}
        </select>
      </div>

      {/* Error message */}
      {hasError && (
        <div id={`${name}-error`} className="mt-2 flex items-start">
          <svg
            className="w-4 h-4 text-red-500 mr-2 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-red-600 font-medium">
            {error.message}
          </span>
        </div>
      )}

      {/* Helper text */}
      {!hasError && helperText && (
        <div id={`${name}-helper`} className="mt-2 text-sm text-gray-500">
          {helperText}
        </div>
      )}

      {/* Data loading status */}
      {!hasError && !hasData && (
        <div className="mt-2 flex items-center text-sm text-amber-600">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading car types...
        </div>
      )}
    </div>
  );
};

export default SelectField;
