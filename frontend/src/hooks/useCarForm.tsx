import { useState, useCallback } from "react";
import { CreateCar } from "../services/CarServices.tsx";
import { useImageUpload } from "./useImageUpload.tsx";

// Define the form data structure matching the backend requirements
export interface CarFormData {
  name: string;
  price: number;
  type_id: string;
  seats: number;
  unit: number;
  rating: number;
}

export const useCarForm = () => {
  // Form data state matching the backend requirements
  const [formData, setFormData] = useState<CarFormData>({
    name: "",
    price: 0,
    type_id: "",
    seats: 1,
    unit: 1,
    rating: 5, // Default rating value
  });

  // Use the separate image upload hook
  const imageUpload = useImageUpload();

  // Handle form input changes
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;

      // Convert numeric fields from string to numbers
      if (["price", "seats", "unit", "rating"].includes(name)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value === "" ? "" : Number(value),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    },
    []
  );

  // Form submission using FormData to handle both JSON and file uploads
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create FormData object to handle both text fields and file uploads
      const formDataObj = new FormData();

      // Add all the text fields
      formDataObj.append("name", formData.name);
      formDataObj.append("price", formData.price.toString());
      formDataObj.append("typeId", formData.type_id);
      formDataObj.append("seats", formData.seats.toString());
      formDataObj.append("unit", formData.unit.toString());
      formDataObj.append("rating", formData.rating.toString());

      // Add the main image if available
      if (imageUpload.mainImage) {
        formDataObj.append("image", imageUpload.mainImage);
      }

      // Add any additional images if available
      if (imageUpload.additionalImages.length > 0) {
        imageUpload.additionalImages.forEach((img, index) => {
          formDataObj.append(`additional_images[${index}]`, img.file);
        });
      }

      // Send the form data to your API
      const response = await CreateCar(formDataObj);
      
      if (response.message != null) {
        window.location.replace("/dashboard/my-rentals")
      }

      // Reset form
      setFormData({
        name: "",
        price: 0,
        type_id: "",
        seats: 1,
        unit: 1,
        rating: 5,
      });

      // You might also want to reset the images
      // However, that functionality isn't exposed by useImageUpload currently
    } catch (error) {
      console.error("Error creating car:", error);
      alert("Failed to create car. Please try again.");
    }
  };

  // Return everything needed by the component
  return {
    formData,
    handleChange,
    handleFormSubmit,
    // Spread the image upload functionality
    ...imageUpload,
  };
};
