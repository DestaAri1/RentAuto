import apiClient from "./BaseServices.tsx"

export const GetAllUsers = async () => {
    const response = await apiClient.get("/admin/user-management")
    return response
}