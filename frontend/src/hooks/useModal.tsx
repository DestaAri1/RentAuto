import { useState } from "react";

type ModalType = "create" | "update" | "delete";

export default function useModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>("create");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const openModal = (data: any = null, type: ModalType = "create") => {
    setIsOpen(true);
    setSelectedItem(data);
    setModalType(type);
  };

  const closeModal = () => {
    setIsOpen(false);
    if (modalType === "update" || modalType === "delete") {
      setSelectedItem(null);
    }
    // Reset modal type to create when closing
    setModalType("create");
  };

  return {
    isOpen,
    modalType,
    openModal,
    selectedItem,
    closeModal,
  };
}
