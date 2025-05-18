import React, { FC, ReactElement, ReactNode } from "react";

interface SelectFieldProps {
  data: any;
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  icon: ReactNode;
  required?: boolean;
  className?: string;
}

export const SelectField: FC<SelectFieldProps> = ({
  data,
  label,
  name,
  placeholder,
  value,
  onChange,
  icon,
  required = false,
  className = "",
}): ReactElement => {
  return (
    <div className={`relative ${className}`}>
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <div className="flex items-center border-2 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
        <div className="mr-3">{icon}</div>
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full outline-none text-gray-800 placeholder-gray-400"
          style={{ color: value === "" ? "#888" : "#000" }}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {data.length > 0 ? (
            data.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              Tidak ada data
            </option>
          )}
        </select>
      </div>
    </div>
  );
};

export default SelectField;
