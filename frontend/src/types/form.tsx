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
  imageUrl?: string; // For update mode - existing image URL
  id?: string; // For update mode - car child ID
}

export interface BaseForm {
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty?: boolean;
  submissionErrors?: {
    general?: string;
    network?: string;
    validation?: string;
  };
  resetAllErrors?: () => void;
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
  imageErrors: ImageError;
}

// Image error interface
export interface ImageError {
  mainImage?: string;
  additionalImages?: string;
}

// Form mode type
export type FormMode = "create" | "update";

// Props for FormCarChild component
export interface FormCarChildProps {
  mode?: FormMode;
  initialData?: Partial<CarChildFormData>;
  carChildId?: string;
}

// Props for useFormCarChild hook
export interface UseFormCarChildProps {
  mode?: FormMode;
  initialData?: Partial<CarChildFormData>;
  carChildId?: string;
}

// Extended car child data for API responses
export interface CarChildData extends CarChildFormData {
  id: string;
  imageUrl?: string;
  additionalImageUrls?: string[];
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
}

export interface RoleForm {
  name: string;
  permission: string[];
}
