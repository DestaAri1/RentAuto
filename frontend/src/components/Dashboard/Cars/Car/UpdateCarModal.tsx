import React from "react";
import Modal from "../../../Modal.tsx";
import CarForm from "./CarForm.tsx";
import useCarType from "../../../../hooks/useCarType.tsx";
import { CarModalProps } from "./AddCarModal.tsx";
import { Cars } from "../../../../types/index.tsx";

export interface UpdateCarModalProps extends CarModalProps {
  selectedCar?: Cars;
}

export const UpdateCarModal: React.FC<UpdateCarModalProps> = ({
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
    <Modal isOpen={isOpen} onClose={onClose} title="Update Car">
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
        mode="update"
      />
    </Modal>
  );
};

export default UpdateCarModal;
