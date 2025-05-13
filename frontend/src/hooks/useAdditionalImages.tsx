import { useState, useRef } from "react";
import { ImageItem } from "./useCarForm";

interface UseAdditionalImagesReturn {
  additionalImages: ImageItem[];
  additionalImagesRef: React.RefObject<HTMLInputElement | null>;
  handleAdditionalImagesChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleAdditionalImagesClick: () => void;
  removeAdditionalImage: (index: number) => void;
  setAdditionalImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
}

export const useAdditionalImages = (): UseAdditionalImagesReturn => {
  const [additionalImages, setAdditionalImages] = useState<ImageItem[]>([]);
  const additionalImagesRef = useRef<HTMLInputElement>(null);

  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const files = Array.from(e.target.files || []);

    if (files.length > 0) {
      // Process each file and create preview
      const newImages = files.map((file) => {
        return new Promise<ImageItem>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = (): void => {
            resolve({
              file,
              preview: reader.result as string,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      // Add all new images to the state
      Promise.all(newImages).then((processedImages) => {
        setAdditionalImages([...additionalImages, ...processedImages]);
      });
    }
  };

  const handleAdditionalImagesClick = (): void => {
    additionalImagesRef.current?.click();
  };

  const removeAdditionalImage = (index: number): void => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  return {
    additionalImages,
    additionalImagesRef,
    handleAdditionalImagesChange,
    handleAdditionalImagesClick,
    removeAdditionalImage,
    setAdditionalImages,
  };
};
