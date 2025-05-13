import apiClient from "./BaseServices.tsx";

export interface FormCarType {
  id?: string;
  name: string;
}

export const GetAllCarTypes = async (): Promise<any> => {
  const response = await apiClient.get("/admin/car-types");
  return response.data;
};

export const CreateCarType = async (
  payload: FormCarType
): Promise<FormCarType> => {
  const response = await apiClient.post("/admin/car-types", payload);
  return response.data;
};

export const UpdateCarType = async (
  id: string,
  payload: FormCarType
): Promise<FormCarType> => {
  const response = await apiClient.patch(`/admin/car-types/${id}`, payload);
  return response.data;
};

export const DeleteCarType = async (id: string): Promise<any> => {
  const response = await apiClient.delete(`/admin/car-types/${id}`);
  return response.data;
};
