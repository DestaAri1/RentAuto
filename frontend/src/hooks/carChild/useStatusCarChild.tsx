import { zodResolver } from "@hookform/resolvers/zod";
import useModal from "../useModal.tsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { DeleteCarChild, UpdateStatusCarChild } from "../../services/CarChildServices.tsx";

const statusSchema = z.object({
  status: z.number().min(1, "Please select a status").max(5, "Invalid status"),
});

type StatusFormData = z.infer<typeof statusSchema>;

export default function useStatusCarChild() {
  const openModal = useModal();
  const [selectedCar, setSelectedCar] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    watch,
    setValue,
    reset,
    clearErrors,
    setError,
  } = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: 0,
    },
    mode: "onChange",
  });

  // Function to open modal with selected car data
  const openStatusModal = (car: any) => {
    setSelectedCar(car);
    setValue("status", car.status, { shouldValidate: true });
    openModal.openModal(car);
  };

  // Function to handle status update
  const updateStatus = async (data: StatusFormData) => {
    if (!selectedCar) return;

    try {
      // Add your API call here to update the status
      console.log(
        `Updating car ${selectedCar.id} status from ${selectedCar.status} to ${data.status}`
      );

      // Example API call:
      await UpdateStatusCarChild(selectedCar.id, data.status);

      // Return success indicator
      return { success: true, newStatus: data.status };
    } catch (error) {
      console.error("Failed to update status:", error);
      setError("status", {
        type: "manual",
        message: "Failed to update status. Please try again.",
      });
      throw error;
    }
  };

  const deleteCarChild = async (id: string) => {
    if (!selectedCar) return;
    try {
      const success = await DeleteCarChild(id)
      if (success) {
        console.log(success);
        
        return success
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      setError("status", {
        type: "manual",
        message: "Failed to update status. Please try again.",
      });
      throw error;
    }
  }

  const closeModal = () => {
    openModal.closeModal();
    setSelectedCar(null);
    reset({
      status: 0,
    });
    clearErrors();
  };

  return {
    // Modal controls
    openModal: {
      ...openModal,
      openModal: openStatusModal,
      closeModal,
      selectedItem: selectedCar,
    },

    // Form controls
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isDirty,
    isValid,
    watch,
    setValue,
    reset,
    clearErrors,
    setError,

    // Additional data
    updateStatus,
    selectedCar,
    deleteCarChild
  };
}
