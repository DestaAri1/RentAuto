import { CarType } from "../../../../types/index.tsx";
import { DashBoxTitle } from "../../../DashboardComponents.tsx";
import { CreateCarTypeModal } from "./CreateCarTypeModal.tsx";
import { UpdateCarTypeModal } from "./UpdateCarTypeModal.tsx";
import { DeleteCarTypeModal } from "./DeleteCarTypeModal.tsx";
import useCarType from "../../../../hooks/useCarType.tsx";
import { lazy, Suspense } from "react";
import Loading from "../../../Loading.tsx";

const CarTypeTable = lazy(() => import("./CarTypeTable.tsx"));

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
  const { carTypes, handleCreate, handleUpdate, handleDelete, fetchCarTypes } =
    useCarType();

  // // Handle create car type
  const handleCreateCarType = async (newCarType: { name: string }) => {
    if (await handleCreate(newCarType)) {
      fetchCarTypes();
    }
  };

  // // Handle update car type
  const handleUpdateCarType = async (updatedCarType: CarType) => {
    if (await handleUpdate(selectedItem?.id, updatedCarType.name)) {
      fetchCarTypes();
    }
  };

  // // Handle delete car type
  const handleDeleteCarType = async () => {
    if (await handleDelete(selectedItem?.id)) {
      fetchCarTypes()
    }
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
            <Suspense fallback={<Loading name="Loading car types" />}>
              <CarTypeTable carTypes={carTypes} openModal={openModal} />
            </Suspense>
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
