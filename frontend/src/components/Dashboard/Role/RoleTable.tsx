import { Role } from "../../../types";
import { HeaderBox } from "../Box.tsx";
import { Table, TableBody, TableHead, Td, Th } from "../../Table.tsx";
import { Link } from "react-router-dom";

export interface RoleProps {
  role: Role[];
}

export default function RoleTable({ role }: RoleProps) {
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
                <Td>{role.permission || "none"}</Td>
                <Td className="text-right text-sm font-medium">
                  <Link
                    to={""}
                    className="text-blue-600 hover:text-blue-900 ml-4"
                  >
                    UPDATE
                  </Link>
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
