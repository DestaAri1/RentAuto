import React, { useEffect } from "react";
import Modal from "../../../Modal.tsx";
import CarForm from "./CarForm.tsx";
import useCarType from "../../../../hooks/useCarType.tsx";
import { CarModalProps } from "./AddCarModal.tsx";
import { Cars } from "../../../../types/index.tsx";

// ✅ Extend interface untuk include selectedCar
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
  selectedCar, // ✅ Terima selectedCar sebagai prop
}) => {
  const { carTypes } = useCarType();

  // ✅ Effect untuk populate form ketika modal dibuka dengan data yang dipilih
  useEffect(() => {
    if (isOpen && selectedCar) {
      // Form sudah di-populate di parent component (CarsIndex)
      // Jadi kita tidak perlu melakukan apa-apa di sini
      // Effect ini hanya untuk memastikan form ter-update jika ada perubahan selectedCar
    }
  }, [isOpen, selectedCar]);

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
