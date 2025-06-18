import { useForm } from "react-hook-form";
import { UserFormData, userFormSchema } from "../../schema/Schema.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useSubmissionErrorHandler } from "../useSubmissionErrorHandler.tsx";

export default function useUserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    watch,
    setValue,
    reset,
    clearErrors,
    setError,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role_id: "",
    },
    mode: "onChange",
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const {
    submissionErrors,
    handleSubmissionError,
    resetSubmissionErrors,
    setSubmissionErrors,
  } = useSubmissionErrorHandler(setError);
  return {
    //
  };
}
