import { User } from "../../../../types";
import { Td } from "../../../Table.tsx";
import ActionButton from "../../../ui/ActionButton.tsx";

interface UserRowProps {
  user: User;
  index: number;
  showRole: boolean;
  onUpdate?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export default function UserRow({
  user,
  index,
  showRole,
  onUpdate,
  onDelete,
}: UserRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <Td className="font-medium text-gray-900">{index + 1}</Td>
      <Td>
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-800">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
          </div>
        </div>
      </Td>
      <Td>
        <div className="text-sm text-gray-900">{user.email}</div>
      </Td>
      {showRole && (
        <Td>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {user.role?.name.toUpperCase() || "NO ROLE"}
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
          <ActionButton type="edit" onClick={() => onUpdate?.(user)} />
          <ActionButton type="delete" onClick={() => onDelete?.(user)} />
        </div>
      </Td>
    </tr>
  );
}
