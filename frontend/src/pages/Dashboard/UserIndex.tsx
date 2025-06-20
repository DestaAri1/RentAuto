import React from "react";
import useModal from "../../hooks/useModal.tsx";
import UserProvider, { useUser } from "../../context/UserContext.tsx";
import DashboardLayout from "../../layout/DashboardLayout.tsx";
import UserTable from "../../components/Dashboard/Users/UserTable.tsx";
import ModalAddUser from "../../components/Dashboard/Users/ModalAddUser.tsx";

function UserContent({
  createModal,
}: {
  createModal: ReturnType<typeof useModal>;
}) {
  const { users } = useUser();
  const breadcrumItem = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Users", current: true },
  ];
  return (
    <DashboardLayout
      title="User Management"
      breadcrumb={breadcrumItem}
      actionButton={
        <button
          onClick={createModal.openModal}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add User
        </button>
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <UserTable user={users} />
      </div>
      <ModalAddUser isOpen={createModal.isOpen} onClose={createModal.closeModal} />
    </DashboardLayout>
  );
}

export default function UserIndex() {
  const createModal = useModal();
  const updateModal = useModal();
  const deleteModal = useModal();
  return (
    <UserProvider>
      <UserContent createModal={createModal} />
    </UserProvider>
  );
}
