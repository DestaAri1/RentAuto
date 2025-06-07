import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

// Types
export interface PermissionSection {
  label: string;
  permissions: string[];
}

export interface PermissionData {
  [key: string]: PermissionSection;
}

export interface PermissionSelectorProps {
  permissions: PermissionData;
  selectedPermissions: string[];
  onPermissionsChange: (permissions: string[]) => void;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  initialExpandedSections?: string[];
  showSelectAll?: boolean;
  showSectionCounters?: boolean;
  showSelectedSummary?: boolean;
}

export default function PermissionSelector({
  permissions,
  selectedPermissions,
  onPermissionsChange,
  label = "Permissions",
  required = false,
  error,
  className = "",
  initialExpandedSections = [],
  showSelectAll = true,
  showSectionCounters = true,
  showSelectedSummary = true,
}: PermissionSelectorProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    initialExpandedSections
  );

  // Pastikan selectedPermissions adalah array
  const safeSelectedPermissions = Array.isArray(selectedPermissions) ? selectedPermissions : [];

  // Handle individual permission toggle
  const togglePermission = (permission: string) => {
    
    const newPermissions = safeSelectedPermissions.includes(permission)
      ? safeSelectedPermissions.filter((p) => p !== permission)
      : [...safeSelectedPermissions, permission];
    
    onPermissionsChange(newPermissions);
  };

  // Handle section select all
  const toggleSectionAll = (sectionKey: string) => {
    const sectionPermissions = permissions[sectionKey].permissions;
    const allSelected = sectionPermissions.every((p) =>
      safeSelectedPermissions.includes(p)
    );

    let newPermissions: string[];
    if (allSelected) {
      // Remove all section permissions
      newPermissions = safeSelectedPermissions.filter(
        (p) => !sectionPermissions.includes(p)
      );
    } else {
      // Add all section permissions
      newPermissions = [...safeSelectedPermissions];
      sectionPermissions.forEach((p) => {
        if (!newPermissions.includes(p)) {
          newPermissions.push(p);
        }
      });
    }
    onPermissionsChange(newPermissions);
  };

  // Handle select all permissions
  const toggleSelectAll = () => {
    const allPermissions = Object.values(permissions).flatMap(
      (section) => section.permissions
    );

    const allSelected = allPermissions.every((p) =>
      safeSelectedPermissions.includes(p)
    );

    onPermissionsChange(allSelected ? [] : allPermissions);
  };

  // Toggle section expansion
  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionKey)
        ? prev.filter((s) => s !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  // Check if section is fully selected
  const isSectionFullySelected = (sectionKey: string) => {
    const sectionPermissions = permissions[sectionKey].permissions;
    return (
      sectionPermissions.length > 0 &&
      sectionPermissions.every((p) => safeSelectedPermissions.includes(p))
    );
  };

  // Check if section is partially selected
  const isSectionPartiallySelected = (sectionKey: string) => {
    const sectionPermissions = permissions[sectionKey].permissions;
    return (
      sectionPermissions.some((p) => safeSelectedPermissions.includes(p)) &&
      !sectionPermissions.every((p) => safeSelectedPermissions.includes(p))
    );
  };

  // Calculate totals
  const allPermissions = Object.values(permissions).flatMap(
    (section) => section.permissions
  );
  const isAllSelected =
    allPermissions.length > 0 &&
    allPermissions.every((p) => safeSelectedPermissions.includes(p));
  const isPartiallySelected = safeSelectedPermissions.length > 0 && !isAllSelected;

  // Format permission name for display
  const formatPermissionName = (permission: string) => {
    return permission
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Select All Button */}
      {showSelectAll && allPermissions.length > 0 && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(input) => {
                if (input) input.indeterminate = isPartiallySelected;
              }}
              onChange={toggleSelectAll}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="font-semibold text-gray-900">
              Select All Permissions
            </span>
            {showSectionCounters && (
              <span className="text-sm text-gray-600">
                ({safeSelectedPermissions.length}/{allPermissions.length})
              </span>
            )}
          </label>
        </div>
      )}

      {/* Permission Sections */}
      <div className="border rounded-lg divide-y divide-gray-200">
        {Object.entries(permissions).map(([sectionKey, section]) => {
          const isExpanded = expandedSections.includes(sectionKey);
          const isFullySelected = isSectionFullySelected(sectionKey);
          const isPartiallySelected = isSectionPartiallySelected(sectionKey);
          const selectedCount = section.permissions.filter((p) =>
            safeSelectedPermissions.includes(p)
          ).length;

          return (
            <div key={sectionKey} className="bg-white">
              {/* Section Header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(sectionKey)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <input
                    type="checkbox"
                    checked={isFullySelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isPartiallySelected;
                    }}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSectionAll(sectionKey);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="font-medium text-gray-900">
                    {section.label}
                  </span>
                  {showSectionCounters && (
                    <span className="text-sm text-gray-500">
                      ({selectedCount}/{section.permissions.length})
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection(sectionKey);
                  }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronUpIcon className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>

              {/* Section Permissions */}
              {isExpanded && (
                <div className="px-4 pb-4 pl-11 space-y-2">
                  {section.permissions.map((permission) => (
                    <label
                      key={permission}
                      className="flex items-center space-x-3 cursor-pointer py-1 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={safeSelectedPermissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {formatPermissionName(permission)}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected permissions summary */}
      {showSelectedSummary && safeSelectedPermissions.length > 0 && (
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>Selected permissions ({safeSelectedPermissions.length}):</strong>
          <div className="mt-1 text-xs">
            {safeSelectedPermissions.map(formatPermissionName).join(", ")}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
