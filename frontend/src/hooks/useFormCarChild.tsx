import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldError } from "react-hook-form";
import { CarChildFormData, carChildFormSchema } from "../schema/Schema.tsx";
import { useCallback, useState, useMemo } from "react";
import { ImageError } from "../types/submission.tsx";
import { useImageUpload } from "./useImageUpload.tsx";
import { useSubmissionErrorHandler } from "./useSubmissionErrorHandler.tsx";
import { CreateCarChild } from "../services/CarChildServices.tsx";
import { getLocalStorage } from "../services/TokenServices.tsx";

export default function useFormCarChild() {
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
      name: "",
      alias: "",
      color: "",
      status: 0,
      description: "",
      car_parent: parent?.title,
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
  const watchedValues = watch();

  // Memoize untuk mencegah rerendering berlebihan
  const memoizedWatchedValues = useMemo(() => watchedValues, [watchedValues]);

  // Enhanced onSubmit dengan memoization
  const onSubmit = useCallback(
    async (payload: CarChildFormData) => {
      setIsFormSubmitted(true);

      try {
        setSubmissionErrors({});

        // Simple validation first
        if (!imageUpload.mainImage && !imageUpload.preview) {
          console.log("❌ Main image missing");
          throw new Error("Main image is required");
        }

        const formData = new FormData();
        formData.append("name", payload.name.trim());
        formData.append("alias", payload.alias.trim());
        formData.append("color", payload.color.trim());
        formData.append("status", payload.status.toString());
        formData.append("car_parent", parent?.id)

        if (payload.description) {
          formData.append("description", payload.description.trim());
        }

        if (imageUpload.mainImage) {
          formData.append("image", imageUpload.mainImage);
        }

        imageUpload.additionalImages.forEach((imageItem, index) => {
          formData.append(`additionalImages`, imageItem.file);
        });
        
        const success = await CreateCarChild(formData)

        if (success) {
          document.location.href = parent?.route;
        }
      } catch (error) {
        console.error("🔴 Error in submission:", error);
        handleSubmissionError(error);
      } finally {
        setIsFormSubmitted(false);
      }
    },
    [
      imageUpload.mainImage,
      imageUpload.preview,
      imageUpload.additionalImages,
      setSubmissionErrors,
      handleSubmissionError,
      parent?.id,
      parent?.route,
    ]
  );

  // Memoized wrapped submit handler
  const wrappedHandleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const requiredFields = ["name", "alias", "color"];
      const missingFields = requiredFields.filter((field) => {
        const value = memoizedWatchedValues[field as keyof CarChildFormData];
        return (
          !value || (typeof value === "string" && value.trim().length === 0)
        );
      });

      if (missingFields.length > 0) {
        console.log("❌ Missing required fields:", missingFields);
        alert(`Missing required fields: ${missingFields.join(", ")}`);
        return;
      }

      if (!imageUpload.mainImage && !imageUpload.preview) {
        console.log("❌ Main image missing");
        alert("Main image is required");
        return;
      }

      // Call the actual submit
      onSubmit(memoizedWatchedValues);
    },
    [
      memoizedWatchedValues,
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
    reset();
  }, [clearErrors, resetSubmissionErrors, reset]);

  // Memoized form validation
  const isFormValid = useMemo(() => {
    const hasRequiredFields =
      memoizedWatchedValues.name?.trim() &&
      memoizedWatchedValues.alias?.trim() &&
      memoizedWatchedValues.color?.trim();
    const hasMainImage = !!(imageUpload.mainImage || imageUpload.preview);

    return hasRequiredFields && hasMainImage && !isSubmitting;
  }, [
    memoizedWatchedValues.name,
    memoizedWatchedValues.alias,
    memoizedWatchedValues.color,
    imageUpload.mainImage,
    imageUpload.preview,
    isSubmitting,
  ]);

  const hasMainImage = useMemo(() => {
    return !!(imageUpload.mainImage || imageUpload.preview);
  }, [imageUpload.mainImage, imageUpload.preview]);

  // Memoized return object untuk mencegah rerendering
  return useMemo(
    () => ({
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

      watchedValues: memoizedWatchedValues,
      setValue,
      reset,
      trigger,

      getFieldError,
      hasFieldError,
      clearFieldError,
      resetAllErrors,
      imageErrors,
      submissionErrors,
      onSubmitSuccess,

      ...imageUpload,

      // Simplified validation
      isFormValid,
      hasMainImage,

      // Export imageUpload for debug
      imageUpload,
    }),
    [
      register,
      handleSubmit,
      onSubmit,
      wrappedHandleSubmit,
      errors,
      isSubmitting,
      isDirty,
      isValid,
      isFormSubmitted,
      memoizedWatchedValues,
      setValue,
      reset,
      trigger,
      getFieldError,
      hasFieldError,
      clearFieldError,
      resetAllErrors,
      imageErrors,
      submissionErrors,
      onSubmitSuccess,
      imageUpload,
      isFormValid,
      hasMainImage,
    ]
  );
}
