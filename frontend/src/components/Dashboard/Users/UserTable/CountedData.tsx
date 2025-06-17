import React from "react";

interface CountedDataProps {
  selectedRole: string;
  currentCount: number;
}

export default function CountedData({
  selectedRole,
  currentCount,
}: CountedDataProps) {
  if (selectedRole === "all") return null;

  return (
    <div className="bg-blue-50 px-6 py-3 border-b border-blue-200">
      <div className="flex items-center">
        <h3 className="text-lg font-semibold text-blue-900 capitalize">
          {selectedRole} Users
        </h3>
        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {currentCount} user{currentCount > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}