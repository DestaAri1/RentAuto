import { useState } from "react";
import { Path, UseFormSetError, FieldValues } from "react-hook-form";
import { SubmissionError } from "../types/submission";

export const useSubmissionErrorHandler = <T extends FieldValues>(
  setError: UseFormSetError<T>
) => {
  const [submissionErrors, setSubmissionErrors] = useState<SubmissionError>({});

  const handleSubmissionError = (error: any) => {
    console.error("Submission Error:", error);

    if (
      error.name === "NetworkError" ||
      error.message?.includes("fetch") ||
      error.message?.includes("Network")
    ) {
      setSubmissionErrors({
        network:
          "Network error. Please check your internet connection and try again.",
      });
    } else if (error.response?.status === 422) {
      const serverErrors = error.response.data.errors;
      Object.keys(serverErrors).forEach((field) => {
        setError(field as Path<T>, {
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
  };

  const resetSubmissionErrors = () => setSubmissionErrors({});

  return {
    submissionErrors,
    setSubmissionErrors,
    handleSubmissionError,
    resetSubmissionErrors,
  };
};
