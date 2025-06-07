import { PermissionData } from "../components/ui/SelectPermission.tsx";

export const statusInfo = [
  { id: 1, name: "Active" },
  { id: 2, name: "Maintenance" },
  { id: 3, name: "Used By Owner" },
  { id: 4, name: "Inactive" },
  { id: 5, name: "Reserved" },
];

export const DEFAULT_PERMISSIONS: PermissionData = {
  car: {
    label: "Car Management",
    permissions: [
      "view_cars",
      "edit_cars",
      "create_car",
      "update_car",
      "delete_car",
    ],
  },
  carType: {
    label: "Car Type",
    permissions: [
      "create_car_types",
      "update_car_types",
      "delete_car_types",
    ],
  },
};
