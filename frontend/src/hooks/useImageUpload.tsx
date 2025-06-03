import { useState, useRef, useCallback } from "react";

// Define the ImageItem type for uploaded images
export interface ImageItem {
  file: File;
  preview: string;
}

export interface ImageUploadHookResult {
  // Main image state and handlers
  mainImage: File | null;
  preview: string | null;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageClick: () => void;

  // Additional images state and handlers
  additionalImages: ImageItem[];
  additionalImagesRef: React.RefObject<HTMLInputElement | null>;
  handleAdditionalImagesChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleAdditionalImagesClick: () => void;
  removeAdditionalImage: (index: number) => void;
}

export const useImageUpload = (): ImageUploadHookResult => {
  // Main image state
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Additional images state
  const [additionalImages, setAdditionalImages] = useState<ImageItem[]>([]);
  const additionalImagesRef = useRef<HTMLInputElement | null>(null);

  // Handle main image selection
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];
        setMainImage(selectedFile);

        // Create preview URL
        const previewUrl = URL.createObjectURL(selectedFile);
        setPreview(previewUrl);

        console.log("Main image selected:", selectedFile.name);
      }
    },
    []
  );

  // Handle main image upload click
  const handleImageClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Handle additional images selection
  const handleAdditionalImagesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newImages: ImageItem[] = [];

        Array.from(e.target.files).forEach((file) => {
          newImages.push({
            file,
            preview: URL.createObjectURL(file),
          });
        });

        setAdditionalImages((prev) => [...prev, ...newImages]);
      }
    },
    []
  );

  // Handle additional images upload click
  const handleAdditionalImagesClick = useCallback(() => {
    if (additionalImagesRef.current) {
      additionalImagesRef.current.click();
    }
  }, []);

  // Remove additional image
  const removeAdditionalImage = useCallback((index: number) => {
    setAdditionalImages((prev) => {
      const newImages = [...prev];
      // Release the object URL to avoid memory leaks
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  }, []);

  return {
    setPreview,
    mainImage,
    preview,
    fileInputRef,
    handleImageChange,
    handleImageClick,
    additionalImages,
    additionalImagesRef,
    handleAdditionalImagesChange,
    handleAdditionalImagesClick,
    removeAdditionalImage,
  };
};
