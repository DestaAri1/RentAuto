import React from "react";
import { Table, TableBody, TableHead, Td, Th } from "../../../Table.tsx";
import { CarType } from "../../../../types/index.tsx";

interface CarTypeTableProps {
  carTypes: CarType[];
  openModal: (car: CarType, action: "update" | "delete") => void;
}

export default function CarTypeTable({
  carTypes,
  openModal,
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
                <button
                  onClick={() => openModal(car, "update")}
                  className="text-blue-600 hover:text-blue-900"
                  type="button"
                >
                  Update
                </button>
                <button
                  onClick={() => openModal(car, "delete")}
                  className="text-red-600 hover:text-red-900 ml-4"
                  type="button"
                >
                  Delete
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
              No car types found.
            </td>
          </tr>
        )}
      </TableBody>
    </Table>
  );
}
