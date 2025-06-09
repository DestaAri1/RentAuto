import { useAuth } from "../context/AuthContext.tsx";
import { ChildProps } from "../types";

interface PermissionProps extends ChildProps {
  permission: string;
}

const PermissionWrapper = ({ permission, children }: PermissionProps) => {
  const { user } = useAuth();

  const hasPermission = user?.role?.permission.includes(permission);

  if (!hasPermission && user?.role?.name !== "administrator") return null;

  return <>{children}</>;
};

export { PermissionWrapper };
