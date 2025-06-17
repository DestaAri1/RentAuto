
import Modal from "../../Modal.tsx";
import { ModalProps } from "../../../types";
import FormUser from "./FormUser.tsx";

export default function ModalAddUser({ isOpen, onClose }: ModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="max-w-lg" title="Add User">
      <FormUser />
    </Modal>
  );
}
