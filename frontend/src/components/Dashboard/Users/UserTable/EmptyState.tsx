interface EmptyStateProps {
  selectedRole: string;
  colSpan: number;
  type: "no-users" | "no-filtered-users";
}

export default function EmptyState({
  selectedRole,
  colSpan,
  type,
}: EmptyStateProps) {
  if (type === "no-users") {
    return (
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
    );
  }

  return (
    <tr>
      <td
        colSpan={colSpan}
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
          {selectedRole === "all" ? "this filter" : `role "${selectedRole}"`}.
        </div>
      </td>
    </tr>
  );
}