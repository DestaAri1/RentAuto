import React from "react";
import Modal from "../../../Modal.tsx";
import CarForm from "./CarForm.tsx";
import useCarType from "../../../../hooks/useCarType.tsx";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CarFormData } from "../../../../schema/Schema.tsx";
import { SubmissionError } from "../../../../types/submission.tsx";
import { CarType, ModalProps } from "../../../../types/index.tsx";

export interface CarModalProps extends ModalProps {
  // Form props dari parent
  register: UseFormRegister<CarFormData>;
  errors: FieldErrors<CarFormData>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  submissionErrors: SubmissionError;
  onSubmit: () => Promise<void>;
  watchedValues: CarFormData;
  carTypes: CarType[]; // This will be ignored in favor of useCarType hook
}

export const AddCarModal: React.FC<CarModalProps> = ({
  isOpen,
  onClose,
  register,
  errors,
  isSubmitting,
  isDirty,
  isValid,
  submissionErrors,
  onSubmit,
  watchedValues,
  // carTypes prop is ignored - we use hook instead
}) => {
  const { carTypes } = useCarType();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Car">
      <CarForm
        onClose={onClose}
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
        isDirty={isDirty}
        isValid={isValid}
        submissionErrors={submissionErrors}
        onSubmit={onSubmit}
        watchedValues={watchedValues}
        carTypes={carTypes || []} // Provide fallback empty array
        mode="add"
      />
    </Modal>
  );
};

export default AddCarModal;
