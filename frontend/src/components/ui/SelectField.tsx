import React, {
  FC,
  ReactElement,
  ReactNode,
  useState,
  useRef,
  useEffect,
} from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

interface SelectFieldProps {
  data: any[];
  label: string;
  name: string;
  placeholder: string;
  icon: ReactNode;
  required?: boolean;
  className?: string;
  error?: FieldError;
  register: UseFormRegister<any>;
  disabled?: boolean;
  onBlur?: () => void;
  helperText?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
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
  value,
  onChange,
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasError = !!error;
  const hasData = data && data.length > 0;

  // Use value prop if provided, otherwise use empty string
  const selectedValue = value || "";

  // Filter data berdasarkan search term
  const filteredData = hasData
    ? data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Get selected item untuk display
  const selectedItem = hasData
    ? data.find((item) => item.id.toString() === selectedValue.toString())
    : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selection
  const handleSelect = (item: any) => {
    setIsOpen(false);
    setSearchTerm("");

    // Trigger onChange if provided
    if (onChange) {
      onChange(item.id);
    }

    // Trigger react-hook-form onChange
    const event = {
      target: {
        name,
        value: item.id,
      },
    };
    register(name).onChange(event);

    if (onBlur) {
      onBlur();
    }
  };

  // Handle input click
  const handleInputClick = () => {
    if (!disabled && hasData) {
      setIsOpen(!isOpen);
    }
  };

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  // Get register props
  const registerProps = register(name, { required });

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Hidden input for react-hook-form */}
      <input {...registerProps} type="hidden" value={selectedValue} />

      <label
        className={`block font-medium mb-2 ${
          hasError ? "text-red-700" : "text-gray-700"
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        className={`flex items-center border-2 rounded-xl px-4 py-3 transition-all duration-200 cursor-pointer ${
          hasError
            ? "border-red-500 bg-red-50 focus-within:border-red-600"
            : disabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : isOpen
            ? "border-indigo-500 bg-white shadow-lg"
            : "border-gray-300 hover:border-gray-400 focus-within:border-indigo-500 focus-within:bg-white"
        }`}
        onClick={handleInputClick}
      >
        <div className={`mr-3 ${hasError ? "text-red-500" : "text-gray-500"}`}>
          {icon}
        </div>

        <div className="flex-1">
          {isOpen && hasData ? (
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="w-full outline-none bg-transparent text-gray-800"
              autoFocus
            />
          ) : (
            <div
              className={`${
                hasError
                  ? "text-red-900"
                  : disabled || !hasData
                  ? "text-gray-500"
                  : selectedItem
                  ? "text-gray-800"
                  : "text-gray-500"
              }`}
            >
              {!hasData
                ? "Loading..."
                : selectedItem
                ? selectedItem.name
                : placeholder}
            </div>
          )}
        </div>

        <div
          className={`ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Custom Dropdown */}
      {isOpen && hasData && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center ${
                    selectedValue.toString() === item.id.toString()
                      ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500"
                      : "hover:bg-gray-50 text-gray-800"
                  } ${index === 0 ? "rounded-t-xl" : ""} ${
                    index === filteredData.length - 1 ? "rounded-b-xl" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-sm text-gray-500">
                        {item.description}
                      </div>
                    )}
                  </div>
                  {selectedValue.toString() === item.id.toString() && (
                    <svg
                      className="w-5 h-5 text-indigo-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">
                No results found for "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}

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
            {error?.message}
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
          Loading data...
        </div>
      )}
    </div>
  );
};

export default SelectField;
