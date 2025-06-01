import React, { FC, ReactElement } from "react";
import { BaseInputField } from "../../types/form";

interface TextAreaFieldProps extends BaseInputField{
  rows?: number;
}

export const TextAreaField: FC<TextAreaFieldProps> = ({
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
  rows = 4,
  ...props
}): ReactElement => {
  const hasError = !!error;

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
        className={`flex items-start border-2 rounded-xl px-4 py-3 transition-all duration-200 ${
          hasError
            ? "border-red-500 bg-red-50 focus-within:border-red-600"
            : disabled
            ? "border-gray-200 bg-gray-50"
            : "border-gray-300 focus-within:border-indigo-500 focus-within:bg-white"
        }`}
      >
        <div
          className={`mr-3 mt-1 ${hasError ? "text-red-500" : "text-gray-500"}`}
        >
          {icon}
        </div>
        <textarea
          {...register(name)}
          placeholder={placeholder}
          disabled={disabled}
          onBlur={onBlur}
          rows={rows}
          className={`w-full outline-none bg-transparent resize-none ${
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
          {...props}
        />
      </div>

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

      {!hasError && helperText && (
        <div id={`${name}-helper`} className="mt-2 text-sm text-gray-500">
          {helperText}
        </div>
      )}
    </div>
  );
};

export default TextAreaField;
