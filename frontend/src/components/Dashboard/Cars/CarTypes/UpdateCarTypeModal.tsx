import { useEffect, useState } from "react";
import Modal from "../../../Modal.tsx";
import Input from "../../../ui/Input.tsx";

interface CarType {
  id: string;
  name: string;
}

interface UpdateCarTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CarType) => void;
  carType: CarType | null;
}

export const UpdateCarTypeModal: React.FC<UpdateCarTypeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  carType,
}) => {
  const [carTypeName, setCarTypeName] = useState<string>("");

  useEffect(() => {
    if (carType) {
      setCarTypeName(carType.name || "");
    }
  }, [carType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (carType) {
      onSubmit({ ...carType, name: carTypeName });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Car Type">
      <form onSubmit={handleSubmit}>
        <Input
          name="Name"
          id="name"
          value={carTypeName}
          onChange={(e) => setCarTypeName(e.target.value)}
          placeholder="e.g Sedan"
        />
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update
          </button>
        </div>
      </form>
    </Modal>
  );
};
