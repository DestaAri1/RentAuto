import capitalize from "../../../../helper/capitalize.tsx";
import { User } from "../../../../types";


interface RoleFilterProps {
  selectedRole: string;
  isDropdownOpen: boolean;
  groupedUsers: Record<string, User[]>;
  onRoleSelect: (role: string) => void;
  onToggleDropdown: () => void;
}

export default function RoleFilter({
  selectedRole,
  isDropdownOpen,
  groupedUsers,
  onRoleSelect,
  onToggleDropdown,
}: RoleFilterProps) {
  const roleNames = Object.keys(groupedUsers).sort();

  const getCurrentRoleDisplay = () => {
    if (selectedRole === "all") return "All Roles";
    return capitalize(selectedRole);
  };

  return (
    <div className="flex items-center space-x-3 ml-5">
      {/* All Button */}
      <button
        onClick={() => onRoleSelect("all")}
        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
          selectedRole === "all"
            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        }`}
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        All Users
      </button>

      {/* Role Dropdown */}
      <div className="relative">
        <button
          onClick={onToggleDropdown}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
            selectedRole !== "all"
              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          {getCurrentRoleDisplay()}
          <svg
            className={`w-4 h-4 ml-2 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
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
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="py-1">
              {roleNames.map((roleName) => (
                <button
                  key={roleName}
                  onClick={() => onRoleSelect(roleName)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 flex items-center justify-between ${
                    selectedRole === roleName
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="capitalize">{roleName}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {groupedUsers[roleName].length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}