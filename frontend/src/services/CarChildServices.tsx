import apiClient from "./BaseServices.tsx";

export const GetAllCarChild = async (slug: string): Promise<any> => {
  const response = await apiClient.get(`/admin/cars/children/${slug}`);
  return response;
};

export const GetOneCarChild = async (slug: string): Promise<any> => {
  const response = await apiClient.get(`/admin/cars/children/view/${slug}`);
  // console.log(response);
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

export const UpdateCarChild = async (id: string, childData: FormData) => {
  try {
    const response = await apiClient.patch(
      `/admin/cars/children/${id}`,
      childData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const UpdateStatusCarChild = async (id: string, status: number) => {
  try {
    const response = await apiClient.patch(
      `/admin/cars/children/update-status/${id}`,
      {
        status: status
      }
    );

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export const DeleteCarChild = async (id: string) => {
  try {
    const response = await apiClient.delete(`/admin/cars/children/${id}`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
