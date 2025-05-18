import { CarType } from "../../../../types/index.tsx";
import { DashBoxTitle } from "../../../DashboardComponents.tsx";
import { CreateCarTypeModal } from "./CreateCarTypeModal.tsx";
import { UpdateCarTypeModal } from "./UpdateCarTypeModal.tsx";
import { DeleteCarTypeModal } from "./DeleteCarTypeModal.tsx";
import useCarType from "../../../../hooks/useCarType.tsx";
import { lazy, Suspense } from "react";
import Loading from "../../../Loading.tsx";
import useModal from "../../../../hooks/useModal.tsx";

const CarTypeTable = lazy(() => import("./CarTypeTable.tsx"));

export default function CarTypes() {
  const { carTypes, handleCreate, handleUpdate, handleDelete, fetchCarTypes } =
    useCarType();

  const createTypeModal = useModal();
  const updateTypeModal = useModal();
  const deleteTypeModal = useModal();

  // Handle create car type
  const handleCreateCarType = async (newCarType: { name: string }) => {
    if (await handleCreate(newCarType)) {
      fetchCarTypes();
      createTypeModal.closeModal();
    }
  };

  // Handle opening update modal with proper data
  const openUpdateModal = (carType: CarType) => {
    if (carType && carType.id) {
      updateTypeModal.openModal(carType);
    } else {
      console.error("Cannot update: Invalid car type data", carType);
    }
  };

  // Handle update car type
  const handleUpdateCarType = async (updatedCarType: CarType) => {
    if (
      updatedCarType &&
      updatedCarType.id &&
      (await handleUpdate(updatedCarType.id, updatedCarType.name))
    ) {
      fetchCarTypes();
      updateTypeModal.closeModal();
    }
  };

  // // Handle delete car type
  const handleDeleteCarType = async () => {
    if (await handleDelete(deleteTypeModal.selectedItem.id)) {
      fetchCarTypes();
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <DashBoxTitle title="Car Types">
        <button
          onClick={() => createTypeModal.openModal()}
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Add Type
        </button>
      </DashBoxTitle>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="py-2 align-middle inline-block min-w-full">
            <Suspense fallback={<Loading name="Loading car types" />}>
              <CarTypeTable
                carTypes={carTypes}
                onUpdate={openUpdateModal}
                onDelete={(car) => deleteTypeModal.openModal(car)}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Create Car Type Modal */}
      <CreateCarTypeModal
        isOpen={createTypeModal.isOpen}
        onClose={createTypeModal.closeModal}
        onSubmit={handleCreateCarType}
      />

      {/* Update Car Type Modal */}
      <UpdateCarTypeModal
        isOpen={updateTypeModal.isOpen}
        onClose={updateTypeModal.closeModal}
        onSubmit={handleUpdateCarType}
        carType={updateTypeModal.selectedItem}
      />

      {/* Delete Car Type Modal */}
      <DeleteCarTypeModal
        isOpen={deleteTypeModal.isOpen}
        onClose={deleteTypeModal.closeModal}
        onConfirm={handleDeleteCarType}
        carType={deleteTypeModal.selectedItem}
      />
    </div>
  );
}
