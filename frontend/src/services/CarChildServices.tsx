import apiClient from "./BaseServices.tsx";

export const GetAllCarChild = async (slug: string): Promise<any> => {
  const response = await apiClient.get(`/admin/cars/children/${slug}`);
  return response;
};

export const CreateCarChild = async (childData: FormData) => {
  try {
    const response = await apiClient.post("/admin/cars/children/", childData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
