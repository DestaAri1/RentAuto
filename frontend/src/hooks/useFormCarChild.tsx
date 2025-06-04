import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldError } from "react-hook-form";
import { CarChildFormData, carChildFormSchema } from "../schema/Schema.tsx";
import { useCallback, useState, useMemo } from "react";
import { ImageError } from "../types/submission.tsx";
import { useImageUpload } from "./useImageUpload.tsx";
import { useSubmissionErrorHandler } from "./useSubmissionErrorHandler.tsx";
import {
  CreateCarChild,
  UpdateCarChild,
} from "../services/CarChildServices.tsx";
import { getLocalStorage } from "../services/TokenServices.tsx";

interface UseFormCarChildProps {
  mode?: "create" | "update";
  initialData?: Partial<CarChildFormData>;
  carChildId?: string | undefined;
}

export default function useFormCarChild({
  mode = "create",
  initialData = {},
  carChildId,
}: UseFormCarChildProps = {}) {
  const parent = getLocalStorage("car_parent");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    watch,
    setValue,
    reset,
    clearErrors,
    setError,
    trigger,
  } = useForm<CarChildFormData>({
    resolver: zodResolver(carChildFormSchema),
    defaultValues: {
      name: initialData.name || "",
      alias: initialData.alias || "",
      color: initialData.color || "",
      status: initialData.status || 0,
      description: initialData.description || "",
      car_parent: initialData.car_parent || parent?.title || "",
      imageUrl: initialData.imageUrl,
    },
    mode: "onChange",
  });

  const [imageErrors, setImageErrors] = useState<ImageError>({});
  const {
    submissionErrors,
    handleSubmissionError,
    resetSubmissionErrors,
    setSubmissionErrors,
  } = useSubmissionErrorHandler(setError);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [successCallback, setSuccessCallback] = useState<(() => void) | null>(
    null
  );

  const imageUpload = useImageUpload();

  // Stabilize imageUpload object references
  const stableImageUpload = useMemo(
    () => ({
      ...imageUpload,
      // Only include the functions and values we actually need
      mainImage: imageUpload.mainImage,
      preview: imageUpload.preview,
      additionalImages: imageUpload.additionalImages,
      setPreview: imageUpload.setPreview,
    }),
    [
      imageUpload.mainImage,
      imageUpload.preview,
      imageUpload.additionalImages,
      imageUpload.setPreview,
    ]
  );

  // Specific watched values to avoid unnecessary re-renders
  const watchedName = watch("name");
  const watchedAlias = watch("alias");
  const watchedColor = watch("color");
  const watchedStatus = watch("status");
  const watchedDescription = watch("description");

  // Initialize form with existing data - simplified to avoid circular deps
  const initializeForm = useCallback(
    (data: Partial<CarChildFormData>) => {
      // Reset form first
      reset({
        name: data.name || "",
        alias: data.alias || "",
        color: data.color || "",
        status: data.status || 0,
        description: data.description || "",
        car_parent: data.car_parent || parent?.title || "",
      });

      // If there's an existing image URL, set it as preview
      if (data.imageUrl && stableImageUpload.setPreview) {
        stableImageUpload.setPreview(data.imageUrl);
      }
    },
    [reset, parent?.title, stableImageUpload.setPreview]
  );

  // Enhanced onSubmit dengan memoization untuk create dan update
  const onSubmit = useCallback(
    async (payload: CarChildFormData) => {
      setIsFormSubmitted(true);

      try {
        setSubmissionErrors({});

        // Validation untuk main image - lebih fleksibel untuk update
        if (
          mode === "create" &&
          !imageUpload.mainImage &&
          !imageUpload.preview
        ) {
          console.log("❌ Main image missing for create mode");
          throw new Error("Main image is required");
        }

        const formData = new FormData();
        formData.append("name", payload.name.trim());
        formData.append("alias", payload.alias.trim());
        formData.append("color", payload.color.trim());
        formData.append("status", payload.status.toString());
        formData.append("car_parent", parent?.id);

        if (payload.description) {
          formData.append("description", payload.description.trim());
        }

        // Hanya append image jika ada file baru
        if (imageUpload.mainImage) {
          formData.append("image", imageUpload.mainImage);
        }

        // Append additional images
        imageUpload.additionalImages.forEach((imageItem, index) => {
          formData.append(`additionalImages`, imageItem.file);
        });

        let success;
        if (mode === "create") {
          success = await CreateCarChild(formData);
        } else {
          success = await UpdateCarChild(carChildId!,formData);
        }

        if (success) {
          if (successCallback) {
            successCallback();
          } else {
            // Default redirect behavior
            document.location.href = parent?.route || "/dashboard/my-rentals";
          }
        }
      } catch (error) {
        console.error(`🔴 Error in ${mode} submission:`, error);
        handleSubmissionError(error);
      } finally {
        setIsFormSubmitted(false);
      }
    },
    [
      mode,
      carChildId,
      imageUpload.mainImage,
      imageUpload.preview,
      imageUpload.additionalImages,
      setSubmissionErrors,
      handleSubmissionError,
      parent?.id,
      parent?.route,
      successCallback,
    ]
  );

  // Memoized wrapped submit handler
  const wrappedHandleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Basic validation
      const requiredFields = ["name", "alias", "color"];
      const currentValues = {
        name: watchedName,
        alias: watchedAlias,
        color: watchedColor,
        status: watchedStatus,
        description: watchedDescription,
        car_parent: parent?.title || "",
      };

      const missingFields = requiredFields.filter((field) => {
        const value = currentValues[field as keyof typeof currentValues];
        return (
          !value || (typeof value === "string" && value.trim().length === 0)
        );
      });

      if (missingFields.length > 0) {
        console.log("❌ Missing required fields:", missingFields);
        alert(`Missing required fields: ${missingFields.join(", ")}`);
        return;
      }

      // Image validation - lebih fleksibel untuk update
      if (
        mode === "create" &&
        !stableImageUpload.mainImage &&
        !stableImageUpload.preview
      ) {
        console.log("❌ Main image missing for create mode");
        alert("Main image is required");
        return;
      }

      // Call the actual submit with current form values
      onSubmit(currentValues as CarChildFormData);
    },
    [
      mode,
      watchedName,
      watchedAlias,
      watchedColor,
      watchedStatus,
      watchedDescription,
      parent?.title,
      imageUpload.mainImage,
      imageUpload.preview,
      onSubmit,
    ]
  );

  const onSubmitSuccess = useCallback((callback: () => void) => {
    setSuccessCallback(() => callback);
  }, []);

  // Fix type error dengan explicit casting
  const getFieldError = useCallback(
    (fieldName: keyof CarChildFormData): string | undefined => {
      const error = errors[fieldName];
      if (!error) return undefined;

      // Handle nested error objects
      if (typeof error === "object" && "message" in error) {
        return (error as FieldError).message;
      }

      return undefined;
    },
    [errors]
  );

  const hasFieldError = useCallback(
    (fieldName: keyof CarChildFormData): boolean => {
      return !!errors[fieldName];
    },
    [errors]
  );

  const clearFieldError = useCallback(
    (fieldName: keyof CarChildFormData) => {
      clearErrors(fieldName);
    },
    [clearErrors]
  );

  const resetAllErrors = useCallback(() => {
    clearErrors();
    resetSubmissionErrors();
    setImageErrors({});
    setIsFormSubmitted(false);
    if (mode === "create") {
      reset();
    }
  }, [mode, clearErrors, resetSubmissionErrors, reset]);

  // Memoized form validation - berbeda untuk create dan update
  const isFormValid = useMemo(() => {
    const hasRequiredFields =
      watchedName?.trim() && watchedAlias?.trim() && watchedColor?.trim();

    const hasMainImage = !!(
      stableImageUpload.mainImage || stableImageUpload.preview
    );

    // Untuk create mode, semua field + image harus ada
    if (mode === "create") {
      return hasRequiredFields && hasMainImage && !isSubmitting;
    }

    // Untuk update mode, cukup required fields saja (image opsional)
    return hasRequiredFields && !isSubmitting;
  }, [
    mode,
    watchedName,
    watchedAlias,
    watchedColor,
    stableImageUpload.mainImage,
    stableImageUpload.preview,
    isSubmitting,
  ]);

  const hasMainImage = useMemo(() => {
    return !!(stableImageUpload.mainImage || stableImageUpload.preview);
  }, [stableImageUpload.mainImage, stableImageUpload.preview]);

  // Return object tanpa useMemo untuk menghindari circular dependency
  return {
    // Form methods
    register,
    handleSubmit: handleSubmit(onSubmit),
    wrappedHandleSubmit,
    formState: {
      errors,
      isSubmitting,
      isDirty,
      isValid,
      isFormSubmitted,
    },

    // Form values and setters
    watchedValues: {
      name: watchedName,
      alias: watchedAlias,
      color: watchedColor,
      status: watchedStatus,
      description: watchedDescription,
      car_parent: parent?.title || "",
    },
    setValue,
    watch,
    reset,
    trigger,
    initializeForm,

    // Error handling
    getFieldError,
    hasFieldError,
    clearFieldError,
    resetAllErrors,
    imageErrors,
    submissionErrors,
    onSubmitSuccess,

    // Image upload - gunakan destructuring untuk menghindari re-render
    ...imageUpload,

    // Validation
    isFormValid,
    hasMainImage,

    // Mode info
    mode,
    carChildId,

    // Export imageUpload for debug
    imageUpload,
  };
}
