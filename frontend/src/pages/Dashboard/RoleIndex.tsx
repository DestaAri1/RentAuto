import { RoleProvider, useRole } from "../../context/RoleContext.tsx";
import DashboardLayout from "../../layout/DashboardLayout.tsx";
import RoleTable from "../../components/Dashboard/Role/RoleTable.tsx";
import useModal from "../../hooks/useModal.tsx";
import ModalAddRole from "../../components/Dashboard/Role/ModalAddRole.tsx";
import useRoleForm from "../../hooks/useRoleForm.tsx";

function RoleContent({
  createModal,
}: {
  createModal: ReturnType<typeof useModal>;
}) {
  const { role, fetchRole } = useRole();

  const addRole = useRoleForm({
    onSuccess: async (result) => {
      createModal.closeModal();
      console.log("Role created successfully!", result);
      await fetchRole(); // fetch ulang role setelah berhasil tambah
    },
    onError: (error) => {
      console.error("Failed to create role:", error);
    },
  });

  if (!role) return null;

  const breadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "User Role", current: true },
  ];

  // You can choose between default submit or custom submit
  const handleSubmit = addRole.onSubmit; // Uses default /api/roles endpoint
  // OR
  // const handleSubmit = addRole.submitWithCustomFetch(customCreateRole); // Uses custom function

  return (
    <DashboardLayout
      title="My Rentals"
      breadcrumb={breadcrumbItems}
      actionButton={
        <button
          onClick={createModal.openModal}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Role
        </button>
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <RoleTable role={role} />
      </div>

      <ModalAddRole
        isOpen={createModal.isOpen}
        onClose={() => {
          createModal.closeModal();
          addRole.reset();
          if (addRole.resetSubmissionErrors) {
            addRole.resetSubmissionErrors();
          }
        }}
        register={addRole.register}
        onSubmit={handleSubmit}
        errors={addRole.formState.errors}
        setPermissions={addRole.setPermissions}
        watchedValues={addRole.watchedValues}
        isSubmitting={addRole.formState.isSubmitting}
        isValid={addRole.formState.isValid}
        isDirty={addRole.formState.isDirty}
        submissionErrors={addRole.submissionErrors || []}
      />
    </DashboardLayout>
  );
}

export default function RoleIndex() {
  const createModal = useModal();
  return (
    <RoleProvider>
      <RoleContent createModal={createModal} />
    </RoleProvider>
  );
}
