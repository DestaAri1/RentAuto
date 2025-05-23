import apiClient from "./BaseServices.tsx";

export const GetAllCars = async (): Promise<any> => {
  const response = await apiClient.get("/admin/cars");
  return response;
};

export const GetOneCar = async (id: string): Promise<any> => {
  if (!id) {
    console.error("GetOneCar called with invalid ID");
    throw new Error("Invalid ID provided to GetOneCar");
  }

  try {
    const response = await apiClient.get(`/admin/cars/${id}`);
    return response.data;
  } catch (error) {
    console.error(`API error in GetOneCar for ID ${id}:`, error);
    throw error;
  }
};

export const CreateCar = async (carData: FormData): Promise<any> => {
  try {
    const response = await apiClient.post("/admin/cars", carData, {
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

export const UpdateCar = async (
  id: string,
  payload: FormData // Using FormData to handle file uploads
): Promise<any> => {
  const response = await apiClient.put(`/admin/cars/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data", // Set content type for file uploads
    },
  });
  return response.data;
};

export const DeleteCar = async (id: string): Promise<any> => {
  const response = await apiClient.delete(`/admin/cars/${id}`);
  return response.data;
};
