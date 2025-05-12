import { useState } from "react";
import Modal from "../../../Modal.tsx";
import Input from "../../../ui/Input.tsx";

interface CreateCarTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => void;
}

export const CreateCarTypeModal: React.FC<CreateCarTypeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [carTypeName, setCarTypeName] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name: carTypeName });
    setCarTypeName("");
    onClose();
  };

  const closeModal = () => {
    onClose();
    setCarTypeName("");
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Add Car Type"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Field */}
        <Input
          name="Name"
          id="name"
          value={carTypeName}
          onChange={(e) => setCarTypeName(e.target.value)}
          placeholder="e.g Sedan"
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};
