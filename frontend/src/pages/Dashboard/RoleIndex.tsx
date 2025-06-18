import React, { lazy, Suspense, useCallback, useMemo } from "react";
import { RoleProvider, useRole } from "../../context/RoleContext.tsx";
import DashboardLayout from "../../layout/DashboardLayout.tsx";
import useModal from "../../hooks/useModal.tsx";
import ModalAddRole from "../../components/Dashboard/Role/ModalAddRole.tsx";
import useRoleForm from "../../hooks/useRoleForm.tsx";
import ModalUpdateRole from "../../components/Dashboard/Role/ModalUpdateRole.tsx";
import ModalDeleteRole from "../../components/Dashboard/Role/ModalDeleteRole.tsx";
import Loading from "../../components/Loading.tsx";

const RoleTable = lazy(
  () => import("../../components/Dashboard/Role/RoleTable.tsx")
);

function RoleContent({
  createModal,
  updateModal,
  deleteModal,
}: {
  createModal: ReturnType<typeof useModal>;
  updateModal: ReturnType<typeof useModal>;
  deleteModal: ReturnType<typeof useModal>;
}) {
  const { role, fetchRole } = useRole();
  const [selectedRole, setSelectedRole] = React.useState<any>(null);

  // Memoize initial data for update form
  const updateInitialData = useMemo(() => {
    if (!selectedRole) return undefined;

    // Helper function untuk memproses permissions
    const processPermissions = (data: any): string[] => {
      // Cek field 'permission' terlebih dahulu (dari server)
      let permissionsData = data.permission || data.permissions;

      if (!permissionsData) return [];

      // Jika permissions adalah string JSON
      if (typeof permissionsData === "string") {
        try {
          return JSON.parse(permissionsData);
        } catch (error) {
          console.error("Error parsing permissions JSON:", error);
          return [];
        }
      }

      // Jika sudah array
      if (Array.isArray(permissionsData)) {
        return permissionsData;
      }

      return [];
    };

    const processedData = {
      name: selectedRole.name || "",
      permissions: processPermissions(selectedRole), // Ubah ini untuk handle kedua field
    };

    return processedData;
  }, [selectedRole]);

  // Memoized callbacks - always call at top level
  const handleFetchRole = useCallback(async () => {
    await fetchRole();
  }, [fetchRole]);

  const handleCreateSuccess = useCallback(async () => {
    createModal.closeModal();
    await handleFetchRole();
  }, [createModal, handleFetchRole]);

  const handleUpdateSuccess = useCallback(async () => {
    updateModal.closeModal();
    setSelectedRole(null);
    await handleFetchRole();
  }, [updateModal, handleFetchRole]);

  const handleDeleteSuccess = useCallback(async () => {
    deleteModal.closeModal();
    setSelectedRole(null);
    await handleFetchRole();
  }, [deleteModal, handleFetchRole]);

  const handleCreateError = useCallback((error: any) => {
    console.error("Failed to create role:", error);
  }, []);

  const handleUpdateError = useCallback((error: any) => {
    console.error("Failed to update role:", error);
  }, []);

  const handleDeleteError = useCallback((error: any) => {
    console.error("Failed to delete role:", error);
    // Tambahkan notifikasi error ke user jika perlu
  }, []);

  // Create role form
  const addRole = useRoleForm({
    onSuccess: handleCreateSuccess,
    onError: handleCreateError,
  });

  // Update role form
  const updateRole = useRoleForm({
    isUpdate: true,
    roleId: selectedRole?.id,
    initialData: updateInitialData,
    onSuccess: handleUpdateSuccess,
    onError: handleUpdateError,
  });

  const deleteRole = useRoleForm({
    isDelete: true,
    roleId: selectedRole?.id,
    onSuccess: handleDeleteSuccess, // Ganti dari handleUpdateSuccess
    onError: handleDeleteError, // Ganti dari handleUpdateError
  });

  const handleUpdateRole = useCallback(
    (roleData: any) => {
      setSelectedRole(roleData);
      updateModal.openModal();
    },
    [updateModal]
  );

  const handleDeleteRole = useCallback(
    (roleData: any) => {
      setSelectedRole(roleData);
      deleteModal.openModal();
    },
    [deleteModal]
  );

  const handleCloseAddModal = useCallback(() => {
    createModal.closeModal();
    addRole.reset();
    addRole.resetAllErrors?.();
  }, [createModal, addRole]);

  const handleCloseUpdateModal = useCallback(() => {
    updateModal.closeModal();
    setSelectedRole(null);
    updateRole.reset(); // Reset form terlebih dahulu
    updateRole.resetAllErrors?.(); // Kemudian reset errors
  }, [updateModal, updateRole]);

  const handleCloseDeleteModal = useCallback(() => {
    deleteModal.closeModal();
    deleteRole.reset();
    deleteRole.resetAllErrors?.();
  }, [deleteModal, deleteRole]);

  if (!role) return null;

  const breadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "User Role", current: true },
  ];

  return (
    <DashboardLayout
      title="User Roles"
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
        <Suspense fallback={<Loading name="Load Car" />}>
          <RoleTable
            role={role}
            onUpdate={handleUpdateRole}
            onDelete={handleDeleteRole}
          />
        </Suspense>
      </div>

      {/* Add Role Modal */}
      <ModalAddRole
        isOpen={createModal.isOpen}
        onClose={handleCloseAddModal}
        register={addRole.register}
        onSubmit={addRole.onSubmit}
        errors={addRole.formState.errors}
        setPermissions={addRole.setPermissions}
        watchedValues={addRole.watchedValues}
        isSubmitting={addRole.formState.isSubmitting}
        isValid={addRole.formState.isValid}
        isDirty={addRole.formState.isDirty}
        submissionErrors={addRole.submissionErrors}
        resetAllErrors={addRole.resetAllErrors}
      />

      {/* Update Role Modal */}
      {updateModal.isOpen && selectedRole && (
        <ModalUpdateRole
          isOpen={updateModal.isOpen}
          onClose={handleCloseUpdateModal}
          register={updateRole.register}
          onSubmit={updateRole.onSubmit}
          errors={updateRole.formState.errors}
          setPermission={updateRole.setPermissions}
          watchedValues={updateRole.watchedValues}
          isSubmitting={updateRole.formState.isSubmitting}
          isValid={updateRole.formState.isValid}
          isDirty={updateRole.formState.isDirty}
          submissionErrors={updateRole.submissionErrors}
          resetAllErrors={updateRole.resetAllErrors}
          initialData={selectedRole}
        />
      )}

      {deleteModal.isOpen && (
        <ModalDeleteRole
          isOpen={deleteModal.isOpen}
          onClose={handleCloseDeleteModal}
          data={selectedRole}
          onSubmit={deleteRole.onSubmit}
        />
      )}
    </DashboardLayout>
  );
}

export default function RoleIndex() {
  const createModal = useModal();
  const updateModal = useModal();
  const deleteModal = useModal();

  return (
    <RoleProvider>
      <RoleContent
        createModal={createModal}
        updateModal={updateModal}
        deleteModal={deleteModal}
      />
    </RoleProvider>
  );
}
