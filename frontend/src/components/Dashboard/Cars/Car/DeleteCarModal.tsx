import React from "react";
import { Cars } from "../../../../types";
import Modal from "../../../Modal.tsx";

interface DeleteCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (car: Cars) => void;
  car: Cars | null;
}

export const DeleteCarModal: React.FC<DeleteCarModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  car,
}) => {
  const handleDelete = () => {
    if (car) {
      onConfirm(car);
    }
    onClose();
  };    
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Car Type">
      <div>
        <p className="text-sm text-gray-500">
          Are you sure you want to delete car "{car?.name}"? This
          action cannot be undone.
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
};

export default DeleteCarModal;
