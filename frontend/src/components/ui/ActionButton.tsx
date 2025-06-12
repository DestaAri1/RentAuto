import React from "react";

type ActionType = "show" | "edit" | "delete";

interface ActionButtonProps {
  type: ActionType;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ type, onClick }) => {
  const config = {
    show: {
      label: "Show",
      color: "text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
        />
      ),
    },
    edit: {
      label: "Edit",
      color: "text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5
             m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      ),
    },
    delete: {
      label: "Delete",
      color: "text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862
             a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6
             m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      ),
    },
  };

  const { label, color, icon } = config[type];

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md 
        ${color} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150`}
    >
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
      {label}
    </button>
  );
};

export default ActionButton;
