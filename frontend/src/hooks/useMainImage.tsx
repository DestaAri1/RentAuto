import { useState, useRef } from "react";

interface UseMainImageReturn {
  preview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageClick: () => void;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useMainImage = (
  onImageSelect: (file: File) => void
): UseMainImageReturn => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onloadend = (): void => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (): void => {
    fileInputRef.current?.click();
  };

  return {
    preview,
    fileInputRef,
    handleImageChange,
    handleImageClick,
    setPreview,
  };
};
