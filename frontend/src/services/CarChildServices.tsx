import apiClient from "./BaseServices.tsx"

export const GetAllCarChild = async(slug: string): Promise<any> => {
    const response = await apiClient.get(`/admin/cars/children/${slug}`);
    return response
}