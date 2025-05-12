import React from 'react'

interface InputProps {
    name: string;
    value: string;
    onChange: (e: any) => void;
    placeholder?: string
    id: string
    type?: string
}

export default function Input({name, value, onChange, placeholder, id, type = 'text'}: InputProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {name}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      />
    </div>
  );
}
