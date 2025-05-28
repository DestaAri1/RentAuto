import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useImageUpload } from "../useImageUpload";
import { CreateCar } from "../../services/CarServices";

// Validation schema with complex error messages
const carFormSchema = z.object({
  name: z
    .string()
    .min(1, "Car name is required")
    .min(2, "Car name must be at least 2 characters long")
    .max(100, "Car name cannot exceed 100 characters")
    .regex(
      /^[a-zA-Z0-9\s\-'\.]+$/,
      "Car name can only contain letters, numbers, spaces, hyphens, apostrophes, and periods"
    )
    .refine(
      (value) => !value.match(/^\s+|\s+$/),
      "Car name cannot start or end with spaces"
    )
    .refine(
      (value) => !value.match(/\s{2,}/),
      "Car name cannot contain consecutive spaces"
    ),

  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a valid number",
    })
    .positive("Price must be greater than 0")
    .min(1, "Minimum price is $1 per day")
    .max(10000, "Maximum price is $10,000 per day")
    .multipleOf(0.01, "Price can only have up to 2 decimal places")
    .refine(
      (value) => Number.isFinite(value),
      "Price must be a valid finite number"
    ),

  type_id: z
    .string()
    .min(1, "Please select a car type")
    .uuid("Invalid car type selection")
    .refine(
      (value) => value !== "placeholder",
      "Please select a valid car type"
    ),

  seats: z
    .number({
      required_error: "Number of seats is required",
      invalid_type_error: "Seats must be a valid number",
    })
    .int("Number of seats must be a whole number")
    .min(1, "Car must have at least 1 seat")
    .max(14, "Maximum number of seats is 15 ")
    .refine(
      (value) =>
        [1, 2, 4, 5, 6, 7, 8, 9, 12, 15].includes(
          value
        ),
      "Please enter a realistic number of seats"
    ),

  unit: z
    .number({
      required_error: "Available amount is required",
      invalid_type_error: "Available amount must be a valid number",
    })
    .int("Available amount must be a whole number")
    .min(1, "Must have at least 1 car available")
    .max(1000, "Maximum available amount is 1000 cars")
    .refine((value) => value > 0, "Available amount must be greater than 0"),

  rating: z
    .number({
      required_error: "Rating is required",
      invalid_type_error: "Rating must be a valid number",
    })
    .min(1, "Minimum rating is 1 star")
    .max(5, "Maximum rating is 5 stars")
    .multipleOf(0.1, "Rating can have up to 1 decimal place")
    .refine(
      (value) => value >= 1 && value <= 5,
      "Rating must be between 1 and 5 stars"
    ),
});

// Form data type
export type CarFormDatas = z.infer<typeof carFormSchema>;

// Custom error types for better error handling
interface ImageError {
  mainImage?: string;
  additionalImages?: string;
}

interface SubmissionError {
  general?: string;
  network?: string;
  validation?: string;
}

export const useCarForms = () => {
  // React Hook Form setup with validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    watch,
    setValue,
    reset,
    clearErrors,
    setError,
  } = useForm<CarFormDatas>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      name: "",
      price: 0,
      type_id: "",
      seats: 1,
      unit: 1,
      rating: 5,
    },
    mode: "onChange", // Validate on change for better UX
  });

  // Additional error states
  const [imageErrors, setImageErrors] = useState<ImageError>({});
  const [submissionErrors, setSubmissionErrors] = useState<SubmissionError>({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Use the image upload hook
  const imageUpload = useImageUpload();

  // Watch form values for dynamic validation
  const watchedValues = watch();

  // Validate images before submission
  const validateImages = (): boolean => {
    const errors: ImageError = {};

    if (!imageUpload.mainImage && !imageUpload.preview) {
      errors.mainImage = "Main car image is required";
    } else if (imageUpload.mainImage) {
      // Validate main image
      const file = imageUpload.mainImage;
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
      ];

      if (file.size > maxSize) {
        errors.mainImage = "Main image must be smaller than 10MB";
      } else if (!allowedTypes.includes(file.type)) {
        errors.mainImage = "Main image must be in JPEG, PNG, or WebP format";
      }
    }

    // Validate additional images
    if (imageUpload.additionalImages.length > 0) {
      const maxAdditionalImages = 10;
      const maxSize = 5 * 1024 * 1024; // 5MB per additional image
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
      ];

      if (imageUpload.additionalImages.length > maxAdditionalImages) {
        errors.additionalImages = `Maximum ${maxAdditionalImages} additional images allowed`;
      } else {
        for (let i = 0; i < imageUpload.additionalImages.length; i++) {
          const file = imageUpload.additionalImages[i].file;
          if (file.size > maxSize) {
            errors.additionalImages = `Additional image ${
              i + 1
            } must be smaller than 5MB`;
            break;
          } else if (!allowedTypes.includes(file.type)) {
            errors.additionalImages = `Additional image ${
              i + 1
            } must be in JPEG, PNG, or WebP format`;
            break;
          }
        }
      }
    }

    setImageErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enhanced form submission with comprehensive error handling
  const onSubmit = async (data: CarFormDatas) => {
    setIsFormSubmitted(true);
    setSubmissionErrors({});

    try {
      // Validate images first
      if (!validateImages()) {
        throw new Error("Please fix image validation errors");
      }

      // Additional business logic validations
      if (data.price < 10 && data.rating > 4) {
        setError("price", {
          type: "manual",
          message: "High-rated cars typically cost more than $10 per day",
        });
        return;
      }

      if (data.seats > 8 && data.unit > 50) {
        setError("unit", {
          type: "manual",
          message:
            "Large capacity vehicles are typically available in smaller quantities",
        });
        return;
      }

      // Create FormData for submission
      const formDataObj = new FormData();

      // Add form fields
      formDataObj.append("name", data.name.trim());
      formDataObj.append("price", data.price.toString());
      formDataObj.append("typeId", data.type_id);
      formDataObj.append("seats", data.seats.toString());
      formDataObj.append("unit", data.unit.toString());
      formDataObj.append("rating", data.rating.toString());

      // Add main image
      if (imageUpload.mainImage) {
        formDataObj.append("image", imageUpload.mainImage);
      }

      // Add additional images
      imageUpload.additionalImages.forEach((img, index) => {
        formDataObj.append(`additional_images[${index}]`, img.file);
      });

      // Submit to API
      const response = await CreateCar(formDataObj);

      if (response.message != null) {
        // Success
        reset();
        setImageErrors({});
        setSubmissionErrors({});
        window.location.replace("/dashboard/my-rentals");
      } else {
        throw new Error("Server responded with an error");
      }
    } catch (error: any) {
      console.error("Error creating car:", error);

      // Handle different types of errors
      if (error.name === "NetworkError" || error.message.includes("fetch")) {
        setSubmissionErrors({
          network:
            "Network error. Please check your internet connection and try again.",
        });
      } else if (error.response?.status === 422) {
        // Validation errors from server
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach((field) => {
          setError(field as keyof CarFormDatas, {
            type: "server",
            message: serverErrors[field][0],
          });
        });
      } else if (error.response?.status === 413) {
        setSubmissionErrors({
          general:
            "Upload size too large. Please reduce image file sizes and try again.",
        });
      } else if (error.response?.status >= 500) {
        setSubmissionErrors({
          general:
            "Server error. Please try again later or contact support if the problem persists.",
        });
      } else {
        setSubmissionErrors({
          general:
            error.message || "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  // Helper function to get error message for a field
  const getFieldError = (fieldName: keyof CarFormDatas) => {
    return errors[fieldName]?.message;
  };

  // Helper function to check if field has error
  const hasFieldError = (fieldName: keyof CarFormDatas) => {
    return !!errors[fieldName];
  };

  // Clear specific errors
  const clearFieldError = (fieldName: keyof CarFormDatas) => {
    clearErrors(fieldName);
  };

  // Reset all errors
  const resetAllErrors = () => {
    clearErrors();
    setImageErrors({});
    setSubmissionErrors({});
    setIsFormSubmitted(false);
  };

  return {
    // Form state and methods
    register,
    handleSubmit: handleSubmit(onSubmit),
    formState: {
      errors,
      isSubmitting,
      isDirty,
      isValid,
      isFormSubmitted,
    },

    // Form data
    watchedValues,
    setValue,
    reset,

    // Error handling
    getFieldError,
    hasFieldError,
    clearFieldError,
    resetAllErrors,
    imageErrors,
    submissionErrors,

    // Image upload functionality
    ...imageUpload,
    validateImages,

    // Helper methods
    isFormValid: isValid && Object.keys(imageErrors).length === 0,
  };
};
