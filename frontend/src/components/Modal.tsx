import React, { useEffect, useRef, ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div
        className="relative bg-white rounded-2xl shadow-xl shadow-black/10 w-full max-w-md mx-4 sm:mx-0 animate-fade-in-up"
        ref={modalRef}
      >
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Konten Modal */}
        <div className="px-6 py-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
          <div className="text-gray-600">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
