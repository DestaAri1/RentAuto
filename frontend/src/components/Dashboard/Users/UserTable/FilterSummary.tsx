interface FilterSummaryProps {
  selectedRole: string;
  currentCount: number;
}

export default function FilterSummary({
  selectedRole,
  currentCount,
}: FilterSummaryProps) {
  return (
    <div className="flex items-center space-x-4 text-sm text-gray-600">
      <span>
        Showing:{" "}
        <span className="font-medium text-gray-900">{currentCount}</span> users
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
  );
}