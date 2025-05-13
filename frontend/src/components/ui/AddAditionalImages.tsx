import React, { FC, ReactElement } from "react";
import { X, Plus } from "lucide-react";
import { ImageItem } from "../../hooks/useCarForm.tsx";

interface AdditionalImagesProps {
  additionalImages: ImageItem[];
  additionalImagesRef: React.RefObject<HTMLInputElement | null>;
  handleAdditionalImagesChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleAdditionalImagesClick: () => void;
  removeAdditionalImage: (index: number) => void;
}

export const AdditionalImages: FC<AdditionalImagesProps> = ({
  additionalImages,
  additionalImagesRef,
  handleAdditionalImagesChange,
  handleAdditionalImagesClick,
  removeAdditionalImage,
}): ReactElement => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Additional Images
      </h3>

      <input
        type="file"
        ref={additionalImagesRef}
        accept="image/*"
        onChange={handleAdditionalImagesChange}
        className="hidden"
        multiple
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
        {additionalImages.map((img, index) => (
          <div key={index} className="relative group">
            <img
              src={img.preview}
              alt={`Additional ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeAdditionalImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        <div
          onClick={handleAdditionalImagesClick}
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32 hover:border-indigo-500 transition-colors cursor-pointer"
        >
          <Plus className="w-8 h-8 text-indigo-500 mb-1" />
          <span className="text-sm text-gray-500">Add More Images</span>
        </div>
      </div>
    </div>
  );
};

export default AdditionalImages;
