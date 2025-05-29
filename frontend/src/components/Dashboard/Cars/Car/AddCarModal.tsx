import React from "react";
import Modal from "../../../Modal.tsx";
import CarForm from "./CarForm.tsx";
import useCarType from "../../../../hooks/useCarType.tsx";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CarFormData } from "../../../../schema/Schema.tsx";
import { SubmissionError } from "../../../../types/submission.tsx";
import { CarType } from "../../../../types/index.tsx";

export interface CarModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Form props dari parent
  register: UseFormRegister<CarFormData>;
  errors: FieldErrors<CarFormData>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  submissionErrors: SubmissionError;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  watchedValues: CarFormData;
  carTypes: CarType[];
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
        carTypes={carTypes}
        mode="add"
      />
    </Modal>
  );
};

export default AddCarModal;
