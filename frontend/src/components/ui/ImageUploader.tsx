import React, { FC, ReactElement } from "react";
import { ImagePlus, Edit } from "lucide-react";

interface ImageUploaderProps {
  preview: string | null;
  handleImageClick: () => void;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  height?: string;
}

export const ImageUploader: FC<ImageUploaderProps> = ({
  preview,
  handleImageClick,
  imageInputRef,
  handleImageChange,
  placeholder = "Click to upload image",
  height = "h-80",
}): ReactElement => {
  return (
    <div className="relative group">
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      {preview ? (
        <div className="relative cursor-pointer" onClick={handleImageClick}>
          <img
            src={preview}
            alt="Preview of selected file"
            className={`w-full ${height} object-cover rounded-2xl transition-all duration-300 group-hover:opacity-70`}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-30 rounded-2xl">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <Edit className="w-6 h-6 text-gray-800" />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`flex items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl ${height} hover:border-indigo-500 transition-colors duration-300 cursor-pointer`}
          onClick={handleImageClick}
        >
          <div className="flex flex-col items-center text-gray-500">
            <ImagePlus className="w-12 h-12 mb-4 text-indigo-500" />
            <span className="text-lg font-medium">{placeholder}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
