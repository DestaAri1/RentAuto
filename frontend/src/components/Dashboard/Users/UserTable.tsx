import React, { useState } from "react";
import { TriggerModalProps, User } from "../../../types";
import { HeaderBox } from "../Box.tsx";
import { Table, TableBody, TableHead, Th } from "../../Table.tsx";
import EmptyState from "./UserTable/EmptyState.tsx";
import RoleFilter from "./UserTable/RoleFilter.tsx";
import FilterSummary from "./UserTable/FilterSummary.tsx";
import CountedData from "./UserTable/CountedData.tsx";
import UserRow from "./UserTable/UserRow.tsx";

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
      const roleName = currentUser.role?.name || "No Role";
      if (!groups[roleName]) {
        groups[roleName] = [];
      }
      groups[roleName].push(currentUser);
      return groups;
    }, {});
  }, [user]);

  // Get filtered users based on selected role
  const filteredUsers = React.useMemo(() => {
    if (!user) return [];
    if (selectedRole === "all") return user;
    return user.filter((u) => (u.role?.name || "No Role") === selectedRole);
  }, [user, selectedRole]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setIsDropdownOpen(false);
  };

  const getCurrentCount = () => {
    if (selectedRole === "all") return user?.length || 0;
    return groupedUsers[selectedRole]?.length || 0;
  };

  if (!user || user.length === 0) {
    return (
      <HeaderBox title="User Management">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <EmptyState selectedRole={selectedRole} colSpan={6} type="no-users" />
        </div>
      </HeaderBox>
    );
  }

  return (
    <HeaderBox title="User Management">
      {/* Filter Controls */}
      <div className="mb-6 flex items-center justify-between">
        <RoleFilter
          selectedRole={selectedRole}
          isDropdownOpen={isDropdownOpen}
          groupedUsers={groupedUsers}
          onRoleSelect={handleRoleSelect}
          onToggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
        />

        <FilterSummary
          selectedRole={selectedRole}
          currentCount={getCurrentCount()}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <CountedData
          selectedRole={selectedRole}
          currentCount={getCurrentCount()}
        />

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
                <UserRow
                  key={currentUser.id || index}
                  user={currentUser}
                  index={index}
                  showRole={selectedRole === "all"}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <EmptyState
                selectedRole={selectedRole}
                colSpan={selectedRole === "all" ? 6 : 5}
                type="no-filtered-users"
              />
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
