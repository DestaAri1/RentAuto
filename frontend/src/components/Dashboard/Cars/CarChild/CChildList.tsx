import { Link, useParams } from "react-router-dom";
import { Table, TableBody, TableHead, Td, Th } from "../../../Table.tsx";
import useCarChild from "../../../../hooks/useCarChild.tsx";
import { useEffect } from "react";
import CarChildStatusBadge from "./CarChildStatusBadge.tsx";
import CarChildAvailable from "./CarChildAvailable.tsx";
import useStatusCarChild from "../../../../hooks/carChild/useStatusCarChild.tsx";
import CarChildStatusModal from "./CarChildStatusModal.tsx";
import CarChildDeleteModal from "./CarChildDeleteModal.tsx";
import { CarChild } from "../../../../types/index.tsx";
import { PermissionWrapper } from "../../../../utils/PermissionWrapper.tsx";

interface Props {
  route: string;
}

export default function CChildList({ route }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const { fetchCarChild, carChildren, isFetched } = useCarChild();
  const statusModal = useStatusCarChild();
  const deleteModal = useStatusCarChild();

  useEffect(() => {
    if (slug && !isFetched.current) {
      fetchCarChild({ slug, mode: "all" });
    }
  }, [slug, fetchCarChild, isFetched]);

  // Handle status update dengan react-hook-form
  const handleStatusUpdate = async (data: { status: number }) => {
    try {
      const result = await statusModal.updateStatus(data);

      if (result?.success) {
        // Refresh the car list after successful status update
        if (slug) {
          fetchCarChild({ slug, mode: "all" });
          statusModal.openModal.closeModal();
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      // Error sudah di-handle di dalam hook
    }
  };

  // Handle delete action
  const handleDelete = async (car: CarChild) => {
    if (await deleteModal.deleteCarChild(car.id)) {
      if (slug) {
        fetchCarChild({ slug, mode: "all" });
        deleteModal.openModal.closeModal();
      }
    }
  };

  return (
    <>
      <Table>
        <TableHead>
          <tr>
            <Th>No</Th>
            <Th>Name</Th>
            <Th>Alias</Th>
            <Th>Status</Th>
            <Th>Color</Th>
            <Th>Available</Th>
            <Th className="relative">
              <span className="sr-only">Actions</span>
            </Th>
          </tr>
        </TableHead>
        <TableBody>
          {carChildren?.length > 0 ? (
            carChildren.map((car, index) => (
              <tr key={car.id}>
                <Td>{index + 1}</Td>
                <Td>{car.name}</Td>
                <Td>{car.alias}</Td>
                <Td>
                  <CarChildStatusBadge status={car.status} />
                </Td>
                <Td>{car.color}</Td>
                <Td>
                  <CarChildAvailable status={car.is_active} />
                </Td>
                <Td className="text-right text-sm font-medium">
                  <PermissionWrapper permission="update_car">
                    <button
                      onClick={() => statusModal.openModal.openModal(car)}
                      className="text-yellow-600 hover:text-yellow-900"
                      disabled={statusModal.isSubmitting}
                    >
                      {statusModal.isSubmitting ? "UPDATING..." : "STATUS"}
                    </button>
                    <Link
                      to={`${route}/${car.slug}`}
                      className="text-blue-600 hover:text-blue-900 ml-4"
                    >
                      UPDATE
                    </Link>
                  </PermissionWrapper>
                  <PermissionWrapper permission="delete_car">
                    <button
                      onClick={() => deleteModal.openModal.openModal(car)}
                      className="text-red-600 hover:text-red-900 ml-4"
                      type="button"
                    >
                      DELETE
                    </button>
                  </PermissionWrapper>
                </Td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
                className="text-center px-6 py-4 text-sm text-gray-500"
              >
                No cars found.
              </td>
            </tr>
          )}
        </TableBody>
      </Table>

      {statusModal.openModal.isOpen && statusModal.selectedCar && (
        <CarChildStatusModal
          isOpen={statusModal.openModal.isOpen}
          onClose={statusModal.openModal.closeModal}
          status={statusModal.selectedCar.status}
          onSubmit={handleStatusUpdate}
          register={statusModal.register}
          handleSubmit={statusModal.handleSubmit}
          errors={statusModal.errors}
          watch={statusModal.watch}
          setValue={statusModal.setValue}
          selectedCar={statusModal.selectedCar}
        />
      )}

      {deleteModal.openModal.isOpen && deleteModal.selectedCar && (
        <CarChildDeleteModal
          isOpen={deleteModal.openModal.isOpen}
          onClose={deleteModal.openModal.closeModal}
          car={deleteModal.openModal.selectedItem}
          onSubmit={handleDelete}
        />
      )}
    </>
  );
}
