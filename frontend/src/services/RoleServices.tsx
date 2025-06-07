import { RoleFormData } from "../schema/Schema.tsx";
import apiClient from "./BaseServices.tsx";

export const GetAllRole = async () => {
  const response = await apiClient.get("/admin/role");
  return response;
};

export const CreateRole = async (data: RoleFormData) => {
  try {
    const response = await apiClient.post("/admin/role", data);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const UpdateRole = async (id: string, data: RoleFormData) => {
  try {
    const response = await apiClient.patch(`/admin/role/${id}`, data);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const DeleteRole = async (id: string) => {
  try {
    const response = await apiClient.delete(`/admin/role/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
