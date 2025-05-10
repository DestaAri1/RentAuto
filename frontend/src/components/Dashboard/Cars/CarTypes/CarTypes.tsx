import React, { useMemo } from "react";
import { Table, TableBody, TableHead, Td, Th } from "../../../Table.tsx";
import { Link } from "react-router-dom";
import { CarType} from "../../../../types/index.tsx";
import { DashBoxTitle } from "../../../DashboardComponents.tsx";

export default function CarTypes() {
    const carsTypesData = useMemo<CarType[]>(
      () => [
        {
          id: "dsadasdas",
          name: "Sedan",
        },
        {
          id: "12adasdsa",
          name: "SUV",
        },
        {
          id: "daszcxzdas",
          name: "Electric",
        },
      ],
      []
    );
  return (
    <div className="bg-white shadow rounded-lg">
      <DashBoxTitle title="Car Types">
        <Link
          to="#"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Add Type
        </Link>
      </DashBoxTitle>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="py-2 align-middle inline-block min-w-full">
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
                {carsTypesData.map((car) => (
                  <tr key={car.id}>
                    <Td className="font-medium text-gray-900">{car.id}</Td>
                    <Td>{car.name}</Td>
                    <Td className="text-right text-sm font-medium">
                      <Link
                        to="#"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Update
                      </Link>
                      <Link
                        to="#"
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        Delete
                      </Link>
                    </Td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
