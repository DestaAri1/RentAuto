import apiClient from "./BaseServices.tsx";

export const GetAllRole = async () => {
  const response = await apiClient.get("/admin/role");
  return response;
};

export const CreateRole = async (data: FormData) => {
  try {
    const response = await apiClient.post("/admin/role", data);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
