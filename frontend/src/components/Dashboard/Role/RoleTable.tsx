import { Role, TriggerModalProps } from "../../../types";
import { HeaderBox } from "../Box.tsx";
import { Table, TableBody, TableHead, Td, Th } from "../../Table.tsx";
import formatPermission from "../../../helper/formatPermission.tsx";

export interface RoleProps extends TriggerModalProps {
  role: Role[];
}

export default function RoleTable({ role, onUpdate }: RoleProps) {
  return (
    <HeaderBox title="Role">
      <Table>
        <TableHead>
          <tr>
            <Th>No</Th>
            <Th>Name</Th>
            <Th>Permission</Th>
            <Th className="relative">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </TableHead>
        <TableBody>
          {role && role.length > 0 ? (
            role.map((role, index) => (
              <tr key={role.id}>
                <Td>{index + 1}</Td>
                <Td>{role.name}</Td>
                <Td>
                  {role.permission && role.permission.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {role.permission.map((perm, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                        >
                          {formatPermission(perm)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500 italic">none</span>
                  )}
                </Td>
                <Td className="text-right text-sm font-medium">
                  <button
                    onClick={() => onUpdate?.(role)}
                    className="text-blue-600 hover:text-blue-900 ml-4"
                  >
                    UPDATE
                  </button>
                  <button
                    // onClick={() => deleteModal.openModal.openModal(car)}
                    className="text-red-600 hover:text-red-900 ml-4"
                    type="button"
                  >
                    DELETE
                  </button>
                </Td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="text-center px-6 py-4 text-sm text-gray-500"
              >
                No cars found.
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </HeaderBox>
  );
}
