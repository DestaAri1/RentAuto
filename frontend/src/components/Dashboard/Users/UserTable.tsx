import React, { useState } from "react";
import { TriggerModalProps, User } from "../../../types";
import { HeaderBox } from "../Box.tsx";
import { Table, TableBody, TableHead, Td, Th } from "../../Table.tsx";
import ActionButton from "../../ui/ActionButton.tsx";

interface UserProps extends TriggerModalProps {
  user: User[] | null;
  onUpdate?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export default function UserTable({ user, onUpdate, onDelete }: UserProps) {
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Group users by role
  const groupedUsers = React.useMemo(() => {
    if (!user || user.length === 0) return {};

    return user.reduce((groups: Record<string, User[]>, currentUser) => {
      const roleName = currentUser.Role?.name || "No Role";
      if (!groups[roleName]) {
        groups[roleName] = [];
      }
      groups[roleName].push(currentUser);
      return groups;
    }, {});
  }, [user]);

  const roleNames = Object.keys(groupedUsers).sort();

  // Get filtered users based on selected role
  const filteredUsers = React.useMemo(() => {
    if (!user) return [];
    if (selectedRole === "all") return user;
    return user.filter((u) => (u.Role?.name || "No Role") === selectedRole);
  }, [user, selectedRole]);

  if (!user || user.length === 0) {
    return (
      <HeaderBox title="User Management">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="text-center px-6 py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-2.952l3.536 3.536m0 0l-3.536 3.536m0 0l3.536-3.536m3.536 3.536L21 12"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new user.
            </p>
          </div>
        </div>
      </HeaderBox>
    );
  }

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setIsDropdownOpen(false);
  };

  const getCurrentRoleDisplay = () => {
    if (selectedRole === "all") return "All Roles";
    return selectedRole;
  };

  const getCurrentCount = () => {
    if (selectedRole === "all") return user.length;
    return groupedUsers[selectedRole]?.length || 0;
  };

  return (
    <HeaderBox title="User Management">
      {/* Filter Buttons */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* All Button */}
          <button
            onClick={() => setSelectedRole("all")}
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
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                      onClick={() => handleRoleSelect(roleName)}
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

        {/* Summary Info */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>
            Showing:{" "}
            <span className="font-medium text-gray-900">
              {getCurrentCount()}
            </span>{" "}
            users
          </span>
          {selectedRole !== "all" && (
            <span>
              Role:{" "}
              <span className="font-medium text-gray-900 capitalize">
                {selectedRole}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        {selectedRole !== "all" && (
          <div className="bg-blue-50 px-6 py-3 border-b border-blue-200">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-blue-900 capitalize">
                {selectedRole} Users
              </h3>
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {getCurrentCount()} user{getCurrentCount() > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}

        <Table>
          <TableHead>
            <tr className="bg-gray-50">
              <Th className="w-16">No</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              {selectedRole === "all" && <Th>Role</Th>}
              <Th>Status</Th>
              <Th className="relative w-32">
                <span className="sr-only">Actions</span>
              </Th>
            </tr>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((currentUser, index) => (
                <tr
                  key={currentUser.id || index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <Td className="font-medium text-gray-900">{index + 1}</Td>
                  <Td>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-800">
                            {currentUser.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {currentUser.name}
                        </div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div className="text-sm text-gray-900">
                      {currentUser.email}
                    </div>
                  </Td>
                  {selectedRole === "all" && (
                    <Td>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {currentUser.Role?.name.toUpperCase() || "NO ROLE"}
                      </span>
                    </Td>
                  )}
                  <Td>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <ActionButton
                        type="edit"
                        onClick={() => onUpdate?.(currentUser)}
                      />
                      <ActionButton
                        type="delete"
                        onClick={() => onDelete?.(currentUser)}
                      />
                    </div>
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={selectedRole === "all" ? 6 : 5}
                  className="text-center px-6 py-8 text-sm text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-8 h-8 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-2.952l3.536 3.536m0 0l-3.536 3.536m0 0l3.536-3.536m3.536 3.536L21 12"
                      />
                    </svg>
                    No users found for{" "}
                    {selectedRole === "all"
                      ? "this filter"
                      : `role "${selectedRole}"`}
                    .
                  </div>
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </HeaderBox>
  );
}
