import { useState } from "react";

export interface CarFormData {
  name: string;
  price: string;
  type: string;
  seats: string;
  amount: string;
  image: File | null;
}

interface UseCarFormReturn {
  formData: CarFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<CarFormData>>;
  resetForm: () => void;
  validateForm: () => boolean;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    additionalImages: ImageItem[]
  ) => void;
}

export interface ImageItem {
  file: File;
  preview: string;
}

export const useCarForm = (): UseCarFormReturn => {
  const [formData, setFormData] = useState<CarFormData>({
    name: "",
    price: "",
    type: "",
    seats: "",
    amount: "",
    image: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = (): void => {
    setFormData({
      name: "",
      price: "",
      type: "",
      seats: "",
      amount: "",
      image: null,
    });
  };

  const validateForm = (): boolean => {
    if (
      !formData.name ||
      !formData.price ||
      !formData.type ||
      !formData.seats ||
      !formData.amount
    ) {
      alert("Harap isi semua field");
      return false;
    }
    return true;
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    additionalImages: ImageItem[]
  ): void => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Proses form data
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("price", formData.price);
    submitData.append("type", formData.type);
    submitData.append("seats", formData.seats);
    submitData.append("amount", formData.amount);

    // Tambahkan gambar utama jika ada
    if (formData.image) {
      submitData.append("mainImage", formData.image);
    }

    // Tambahkan gambar tambahan jika ada
    additionalImages.forEach((img, index) => {
      submitData.append(`additionalImage${index}`, img.file);
    });

    try {
      console.log("Form Data:", {
        ...Object.fromEntries(submitData),
        additionalImages: additionalImages.length,
      });

      // Reset form setelah submit
      resetForm();

      // Bisa tambahkan notifikasi sukses
      alert("Mobil berhasil ditambahkan!");
    } catch (error) {
      console.error("Gagal menambahkan mobil:", error);
      alert("Gagal menambahkan mobil. Silakan coba lagi.");
    }
  };

  return {
    formData,
    handleChange,
    setFormData,
    resetForm,
    validateForm,
    handleSubmit,
  };
};
