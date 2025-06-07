import React from "react";
import { ModalProps } from "../../../types";
import Modal from "../../Modal.tsx";

interface DeleteModalProps extends ModalProps {
  data: any;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export default function ModalDeleteRole({
  isOpen,
  onClose,
  data,
  onSubmit,
}: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!data?.id) {
      console.error("No role ID found for deletion");
      return;
    }

    try {
      setIsDeleting(true);

      // Call onSubmit tanpa parameter, karena useRoleForm sudah memiliki roleId
      await onSubmit();
    } catch (error) {
      console.error("Error deleting role:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Role">
      <div>
        <p className="text-sm text-gray-500">
          Are you sure you want to delete role "<b>{data?.name}</b>"? This
          action cannot be undone. <br />
        </p>
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              isDeleting
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
