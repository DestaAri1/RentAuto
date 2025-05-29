import React, { FC, ReactElement, ReactNode } from "react";
import { FieldError } from "react-hook-form";

interface InputFieldProps {
  label: string;
  name: string;
  placeholder: string;
  icon: ReactNode;
  type?: string;
  min?: string;
  max?: string;
  step?: string;
  required?: boolean;
  className?: string;
  error?: FieldError;
  register: any;
  disabled?: boolean;
  onBlur?: () => void;
  helperText?: string;
}

export const InputField: FC<InputFieldProps> = ({
  label,
  name,
  placeholder,
  icon,
  type = "text",
  min,
  max,
  step,
  required = false,
  className = "",
  error,
  register,
  disabled = false,
  onBlur,
  helperText,
}): ReactElement => {
  const hasError = !!error;

  // Convert type to appropriate register options
  const registerOptions: any = {};

  if (type === "number") {
    registerOptions.valueAsNumber = true;
  }

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
        <input
          {...register(name, registerOptions)}
          type={type}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onBlur={onBlur}
          className={`w-full outline-none bg-transparent ${
            hasError
              ? "text-red-900 placeholder-red-400"
              : disabled
              ? "text-gray-500 placeholder-gray-400"
              : "text-gray-800 placeholder-gray-400"
          }`}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${name}-error`
              : helperText
              ? `${name}-helper`
              : undefined
          }
        />
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

      {/* Field-specific validation hints */}
      {!hasError && (
        <>
          {name === "name" && (
            <div className="mt-1 text-xs text-gray-400">
              2-100 characters, letters, numbers, spaces, hyphens only
            </div>
          )}
          {name === "price" && (
            <div className="mt-1 text-xs text-gray-400">
              $1 - $10,000 per day
            </div>
          )}
          {name === "seats" && (
            <div className="mt-1 text-xs text-gray-400">
              1-14 seats (realistic numbers preferred)
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InputField;
