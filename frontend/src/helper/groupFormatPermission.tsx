import { JSX } from "react";
import formatPermission from "./formatPermission.tsx";

interface GroupedPermissions {
  [key: string]: string[];
}

export default function groupFormatPermissions(
  permissions: string[]
): JSX.Element[] {
  const grouped: GroupedPermissions = {};

  permissions.forEach((perm) => {
    const [action, ...rest] = perm.split("_");
    const resource = rest.join("_");

    if (!grouped[resource]) {
      grouped[resource] = [];
    }

    grouped[resource].push(action);
  });

  const actionOrder = ["view", "edit", "create", "update", "delete"];

  return Object.entries(grouped).map(([resource, actions]) => {
    const formattedResource = resource
      .split("_")
      .map((r) => r.charAt(0).toUpperCase() + r.slice(1))
      .join(" ");

    const sortedActions = actionOrder.filter((a) => actions.includes(a));
    const formattedActions = sortedActions
      .map((action) => formatPermission(`${action}_${resource}`).split(" ")[0]) // Ambil hanya action-nya
      .join(", ");

    return (
      <div key={resource}>
        <strong>{formattedResource}:</strong> {formattedActions}
      </div>
    );
  });
}
