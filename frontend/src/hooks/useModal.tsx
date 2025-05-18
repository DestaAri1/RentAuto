import { useState } from "react";

export default function useModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const openModal = (data: any = null) => {
    setIsOpen(true);
    setSelectedItem(data);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedItem(null);
  };

  return {
    isOpen,
    openModal,
    selectedItem,
    closeModal,
  };
}
