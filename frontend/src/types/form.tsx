import { ReactNode } from "react";
import { ImageItem } from "../hooks/useImageUpload";
import { FieldError } from "react-hook-form";

export interface BaseInputField {
  label: string;
  name: string;
  placeholder: string;
  icon: ReactNode;
  required?: boolean;
  className?: string;
  error?: FieldError;
  register: any;
  disabled?: boolean;
  onBlur?: () => void;
  helperText?: string;
}

export interface CarChildFormData {
  name: string;
  alias: string;
  status: number;
  color: string;
  description: string;
  car_parent: string;
}

export interface BaseForm {
  // We need register, errors, and watcheValues
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  submissionErrors: {
    general?: string;
    network?: string;
    validation?: string;
  };
  resetAllErrors: () => void;
}

export interface ImageProps {
  preview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageClick: () => void;
}

export interface AdditionalImageProps {
  additionalImages: ImageItem[];
  additionalImagesRef: React.RefObject<HTMLInputElement | null>;
  handleAdditionalImagesChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleAdditionalImagesClick: () => void;
  removeAdditionalImage: (index: number) => void;
  imageErrors: {
    mainImage?: string;
    additionalImages?: string;
  };
}
