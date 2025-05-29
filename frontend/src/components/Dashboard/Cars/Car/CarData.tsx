import React, { useMemo } from "react";
import { Table, TableBody, TableHead, Td, Th } from "../../../Table.tsx";
import { Link } from "react-router-dom";
import { Cars, CarsProps } from "../../../../types/index.tsx";
import { DashBoxTitle } from "../../../DashboardComponents.tsx";
import { Star } from "lucide-react";
import { usePagination } from "../../../../hooks/usePagination.tsx";
import { setLocalStorage } from "../../../../services/TokenServices.tsx";

interface CarModalProps {
  onUpdate: (car: Cars) => void;
  onDelete: (car: Cars) => void;
}

type CombinedProps = CarsProps & CarModalProps;

export default function CarData({ cars, onUpdate, onDelete }: CombinedProps) {
  const itemsPerPage = 5;

  // Menggunakan generics untuk tipe car
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToNextPage,
    goToPreviousPage,
    isFirstPage,
    isLastPage,
  } = usePagination<any>({
    totalItems: cars.length,
    itemsPerPage,
  });

  // Menggunakan useMemo untuk mencegah re-render yang tidak perlu
  const currentCars = useMemo(
    () => paginatedItems(cars),
    [cars, paginatedItems]
  );

  // Menghitung indeks awal untuk penomoran
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="mt-8">
      <div className="bg-white shadow rounded-lg">
        <DashBoxTitle title="Car List" />
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="py-2 align-middle inline-block min-w-full">
              <Table>
                <TableHead>
                  <tr>
                    <Th>No</Th>
                    <Th>Name</Th>
                    <Th>Types</Th>
                    <Th>Seats</Th>
                    <Th>Price</Th>
                    <Th>Owned</Th>
                    <Th>Available</Th>
                    <Th>Remains</Th>
                    <Th className="relative">
                      <span className="sr-only">Actions</span>
                    </Th>
                  </tr>
                </TableHead>
                <TableBody>
                  {cars.length > 0 ? (
                    currentCars.map((car, index) => (
                      <tr key={car.id}>
                        <Td className="font-medium text-gray-900">
                          {startIndex + index + 1}
                        </Td>
                        <Td className="group relative hover:bg-gray-100 transition-colors duration-200">
                          {car.name}
                          <div className="absolute left-2 top-full -translate-y-1/2 ml-3 hidden group-hover:flex items-center gap-1 bg-white text-blue-600 px-3 py-1.5 rounded-lg shadow-lg z-10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {car.rating ?? "-"} <Star size={14} />
                          </div>
                        </Td>
                        <Td>{car.Type.name}</Td>
                        <Td>{car.seats}</Td>
                        <Td>${car.price.toLocaleString()} / day</Td>
                        <Td>{car.unit}</Td>
                        <Td>{car.available}</Td>
                        <Td>{car.available}</Td>
                        <Td className="text-right text-sm font-medium">
                          <Link
                            to={`/dashboard/my-rentals/${car.slug}`}
                            className="text-yellow-600 hover:text-yellow-900"
                            onClick={() =>
                              setLocalStorage(
                                "car_parent",
                                JSON.stringify({
                                  title: car.name,
                                  route: `/dashboard/my-rentals/${car.slug}`,
                                })
                              )
                            }
                          >
                            VIEW
                          </Link>
                          <button
                            onClick={() => onUpdate(car)}
                            className="text-blue-600 hover:text-blue-900 ml-4"
                            type="button"
                          >
                            UPDATE
                          </button>
                          <button
                            onClick={() => onDelete(car)}
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
                        colSpan={10}
                        className="text-center px-6 py-4 text-sm text-gray-500"
                      >
                        No cars found.
                      </td>
                    </tr>
                  )}
                </TableBody>
                <tfoot>
                  <tr>
                    <td colSpan={10}></td>
                  </tr>
                </tfoot>
              </Table>
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={isFirstPage}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="px-3 py-1 text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={goToNextPage}
                  disabled={isLastPage}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
