import React, { useState } from "react";
import { Table, TableBody, TableHead, Td, Th } from "../../../Table.tsx";
import { CarType } from "../../../../types/index.tsx";
import { DashBoxTitle } from "../../../DashboardComponents.tsx";
import { CreateCarTypeModal } from "./CreateCarTypeModal.tsx";
import { UpdateCarTypeModal } from "./UpdateCarTypeModal.tsx";
import { DeleteCarTypeModal } from "./DeleteCarTypeModal.tsx";

type ModalType = "create" | "update" | "delete";

interface CarTypesProps {
  openModal: (data: any, type: ModalType) => void;
  isOpen: boolean;
  closeModal: () => void;
  modalType: ModalType;
  selectedItem: CarType | null;
}

export default function CarTypes({
  openModal,
  isOpen,
  closeModal,
  modalType,
  selectedItem,
}: CarTypesProps) {
  const [carTypes, setCarTypes] = useState<CarType[]>([
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
  ]);

  // Handle create car type
  const handleCreateCarType = (newCarType: { name: string }) => {
    const newId = Math.random().toString(36).substring(2, 15);
    setCarTypes([...carTypes, { id: newId, name: newCarType.name }]);
  };

  // Handle update car type
  const handleUpdateCarType = (updatedCarType: CarType) => {
    setCarTypes(
      carTypes.map((carType) =>
        carType.id === updatedCarType.id ? updatedCarType : carType
      )
    );
  };

  // Handle delete car type
  const handleDeleteCarType = (carType: CarType) => {
    setCarTypes(carTypes.filter((type) => type.id !== carType.id));
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <DashBoxTitle title="Car Types">
        <button
          onClick={() => openModal(null, "create")}
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Add Type
        </button>
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
                {carTypes.map((car, index) => (
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
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Create Car Type Modal */}
      <CreateCarTypeModal
        isOpen={isOpen && modalType === "create"}
        onClose={closeModal}
        onSubmit={handleCreateCarType}
      />

      {/* Update Car Type Modal */}
      <UpdateCarTypeModal
        isOpen={isOpen && modalType === "update"}
        onClose={closeModal}
        onSubmit={handleUpdateCarType}
        carType={selectedItem}
      />

      {/* Delete Car Type Modal */}
      <DeleteCarTypeModal
        isOpen={isOpen && modalType === "delete"}
        onClose={closeModal}
        onConfirm={handleDeleteCarType}
        carType={selectedItem}
      />
    </div>
  );
}
