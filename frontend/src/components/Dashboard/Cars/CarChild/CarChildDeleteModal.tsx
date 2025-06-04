import React from "react";
import { CarChild, ModalProps } from "../../../../types";
import Modal from "../../../Modal.tsx";

interface DeleteModalProps extends ModalProps {
  car: CarChild;
  onSubmit: (car: CarChild) => void;
}

export default function CarChildDeleteModal({
  isOpen,
  onClose,
  car,
  onSubmit,
}: DeleteModalProps) {
  const handleDelete = () => {
    onSubmit(car);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Car Child">
      <div>
        <p className="text-sm text-gray-500">
          Are you sure you want to delete car "<b>{car?.name}</b>"? This action
          cannot be undone. <br />
          <b className="text-red-600">WARNING </b>
          all of the contents inside will be deleted.
        </p>
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
