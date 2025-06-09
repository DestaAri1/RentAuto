import React from "react";
import { Table, TableBody, TableHead, Td, Th } from "../../../Table.tsx";
import { CarType } from "../../../../types/index.tsx";
import { PermissionWrapper } from "../../../../utils/PermissionWrapper.tsx";

interface CarTypeTableProps {
  carTypes: CarType[];
  onUpdate: (car: CarType) => void;
  onDelete: (car: CarType) => void;
}

export default function CarTypeTable({
  carTypes,
  onUpdate,
  onDelete,
}: CarTypeTableProps) {
  return (
    <Table>
      <TableHead>
        <tr>
          <Th>No</Th>
          <Th>Name</Th>
          <Th className="relative">
            <span className="sr-only">Actions</span>
          </Th>
        </tr>
      </TableHead>
      <TableBody>
        {carTypes.length > 0 ? (
          carTypes.map((car, index) => (
            <tr key={car.id}>
              <Td className="font-medium text-gray-900">{index + 1}</Td>
              <Td>{car.name}</Td>
              <Td className="text-right text-sm font-medium">
                <PermissionWrapper permission="update_car_types">
                  <button
                    onClick={() => onUpdate(car)}
                    className="text-blue-600 hover:text-blue-900"
                    type="button"
                  >
                    Update
                  </button>
                </PermissionWrapper>
                <PermissionWrapper permission="delete_car_types">
                  <button
                    onClick={() => onDelete(car)}
                    className="text-red-600 hover:text-red-900 ml-4"
                    type="button"
                  >
                    Delete
                  </button>
                </PermissionWrapper>
              </Td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={4}
              className="text-center px-6 py-4 text-sm text-gray-500"
            >
              No car types found.
            </td>
          </tr>
        )}
      </TableBody>
    </Table>
  );
}
