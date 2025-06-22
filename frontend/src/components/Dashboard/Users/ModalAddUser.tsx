import Modal from "../../Modal.tsx";
import { ModalProps } from "../../../types";
import FormUser from "./FormUser.tsx";
import { UserFormData } from "../../../schema/Schema.tsx";
import useUserForm from "../../../hooks/Users/useUserForm.tsx";
import { RoleProvider, useRole } from "../../../context/RoleContext.tsx";

interface ModalAddUserProps extends ModalProps {
  onUserCreated?: (data: UserFormData) => Promise<void>;
}

function CreateModalContent({
  isOpen,
  onClose,
  onUserCreated,
}: ModalAddUserProps) {
  const { role } = useRole();

  const {
    register,
    handleCreateUserWithCallback,
    formState: { errors, isSubmitting, isDirty, isValid },
    resetAllErrors,
    watchedValue
  } = useUserForm();

  const handleSubmit = handleCreateUserWithCallback(
    async (data: UserFormData) => {
      // Panggil callback dari parent (UserIndex)
      if (onUserCreated) {
        await onUserCreated(data);
      }

      // Reset form dan tutup modal setelah berhasil
      resetAllErrors();
      onClose();
    }
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="max-w-lg" title="Add User">
      <FormUser
        register={register}
        onSubmit={handleSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
        isDirty={isDirty}
        isValid={isValid}
        onClose={onClose}
        role={role!}
        watchedValue={watchedValue}
      />
    </Modal>
  );
}

export default function ModalAddUser({
  isOpen,
  onClose,
  onUserCreated,
}: ModalAddUserProps) {
  return (
    <RoleProvider>
      <CreateModalContent isOpen={isOpen} onClose={onClose} onUserCreated={onUserCreated}/>
    </RoleProvider>
  );
}
