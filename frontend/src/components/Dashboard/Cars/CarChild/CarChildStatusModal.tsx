import React from "react";
import { ModalProps } from "../../../../types";
import Modal from "../../../Modal.tsx";
import SelectField from "../../../ui/SelectField.tsx";
import { statusInfo } from "../../../../types/data.tsx";
import { Type } from "lucide-react";

interface StatusModal extends ModalProps {
  status: number;
  onSubmit: (data: { status: number }) => void;
  register: any;
  handleSubmit: any;
  errors: any;
  watch: any;
  setValue: any;
  selectedCar: any;
}

export default function CarChildStatusModal({
  isOpen,
  onClose,
  status,
  onSubmit,
  register,
  handleSubmit,
  errors,
  watch,
  setValue,
}: StatusModal) {
  const watchedStatus = watch("status");

  const getStatusText = (statusValue: number) => {
    switch (statusValue) {
      case 1:
        return "Active";
      case 2:
        return "Inactive";
      case 3:
        return "Maintenance";
      case 4:
        return "Reserved";
      case 5:
        return "Out of Service";
      default:
        return "Unknown";
    }
  };

  const handleFormSubmit = handleSubmit((data: { status: number }) => {
    onSubmit(data);
    onClose();
  });

  const handleStatusChange = (value: string | number) => {
    setValue("status", parseInt(value.toString()), { shouldValidate: true });
  };

  React.useEffect(() => {
    if (isOpen && status) {
      setValue("status", status);
    }
  }, [isOpen, status, setValue]);

  const disabled = !watchedStatus || watchedStatus === status;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Status">
      <form onSubmit={handleFormSubmit}>
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to change from{" "}
          <strong>{getStatusText(status)}</strong> to{" "}
          <strong>{getStatusText(watchedStatus || status)}</strong>?
        </p>

        <SelectField
          data={statusInfo}
          label="Select Status"
          name="status"
          icon={<Type className="w-5 h-5" />}
          placeholder="Choose status..."
          value={watchedStatus?.toString() || status?.toString() || ""}
          onChange={handleStatusChange}
          register={register}
          error={errors.status}
          required
        />

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md ${
              disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={disabled}
          >
            Update Status
          </button>
        </div>
      </form>
    </Modal>
  );
}
