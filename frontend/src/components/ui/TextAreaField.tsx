import React, { FC, ReactElement, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { BaseInputField } from "../../types/form";

interface TinyMCEFieldProps extends Omit<BaseInputField, "register"> {
  register: any;
  setValue: (name: string, value: string) => void;
  watch: (name: string) => string;
  height?: number;
  toolbar?: string;
  plugins?: string[];
}

export const TinyMCEField: FC<TinyMCEFieldProps> = ({
  label,
  name,
  placeholder,
  icon,
  required = false,
  className = "",
  error,
  register,
  setValue,
  watch,
  disabled = false,
  helperText,
  height = 300,
  toolbar = "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
  plugins = [
    "advlist",
    "autolink",
    "lists",
    "link",
    "image",
    "charmap",
    "preview",
    "anchor",
    "searchreplace",
    "visualblocks",
    "code",
    "fullscreen",
    "insertdatetime",
    "media",
    "table",
    "code",
    "help",
    "wordcount",
  ],
  ...props
}): ReactElement => {
  const editorRef = useRef<any>(null);
  const hasError = !!error;
  const currentValue = watch(name) || "";

  // Register field dengan react-hook-form
  useEffect(() => {
    register(name);
  }, [register, name]);

  const handleEditorChange = (content: string) => {
    setValue(name, content);
  };

  return (
    <div className={`relative ${className}`}>
      <label
        className={`block font-medium mb-2 ${
          hasError ? "text-red-700" : "text-gray-700"
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        className={`border-2 rounded-xl overflow-hidden transition-all duration-200 ${
          hasError
            ? "border-red-500 bg-red-50"
            : disabled
            ? "border-gray-200 bg-gray-50"
            : "border-gray-300 focus-within:border-indigo-500"
        }`}
      >
        {/* Icon Header */}
        <div
          className={`flex items-center px-4 py-2 bg-gray-50 border-b ${
            hasError ? "border-red-200" : "border-gray-200"
          }`}
        >
          <div
            className={`mr-2 ${hasError ? "text-red-500" : "text-gray-500"}`}
          >
            {icon}
          </div>
          <span
            className={`text-sm font-medium ${
              hasError ? "text-red-700" : "text-gray-700"
            }`}
          >
            {label}
          </span>
        </div>

        {/* TinyMCE Editor */}
        <div className="tinymce-wrapper">
          <Editor
            apiKey="yeu7arqzfw1dfoqczd4ojygw8qh052dnho1v1r2mxdfhxw9k"
            onInit={(evt, editor) => (editorRef.current = editor)}
            value={currentValue}
            onEditorChange={handleEditorChange}
            disabled={disabled}
            init={{
              height: height,
              menubar: false,
              plugins: plugins,
              toolbar: toolbar,
              content_style: `
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
                  font-size: 14px; 
                  line-height: 1.6;
                  color: #374151;
                }
                p { margin: 8px 0; }
              `,
              placeholder: placeholder,
              branding: false,
              elementpath: false,
              statusbar: false,
              resize: false,
              skin: hasError ? "oxide-dark" : undefined,
              setup: (editor) => {
                editor.on("focus", () => {
                  const container = editor.getContainer();
                  if (container) {
                    container.style.boxShadow = hasError
                      ? "0 0 0 2px rgba(239, 68, 68, 0.2)"
                      : "0 0 0 2px rgba(99, 102, 241, 0.2)";
                  }
                });
                editor.on("blur", () => {
                  const container = editor.getContainer();
                  if (container) {
                    container.style.boxShadow = "none";
                  }
                });
              },
            }}
          />
        </div>
      </div>

      {hasError && (
        <div className="mt-2 flex items-start">
          <svg
            className="w-4 h-4 text-red-500 mr-2 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-red-600 font-medium">
            {error.message}
          </span>
        </div>
      )}

      {!hasError && helperText && (
        <div className="mt-2 text-sm text-gray-500">{helperText}</div>
      )}
    </div>
  );
};

export default TinyMCEField;
