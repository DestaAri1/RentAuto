import React, { FC, ReactElement, ReactNode } from "react";

interface InputFieldProps {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  min?: string;
  icon: ReactNode;
  required?: boolean;
  className?: string;
}

export const InputField: FC<InputFieldProps> = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  min,
  icon,
  required = false,
  className = "",
}): ReactElement => {
  return (
    <div className={`relative ${className}`}>
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <div className="flex items-center border-2 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
        <div className="mr-3">{icon}</div>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          className={`w-full outline-none text-gray-800 placeholder-gray-400 ${
            type === "number" ? "appearance-none" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default InputField;
