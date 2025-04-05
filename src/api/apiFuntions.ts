import { API_URL } from "@/constant/apiUrl";
import axios from "axios";
import axiosInstance from ".";

export const Login = async (data: any) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, data);

    // Extract tokens from response
    const { accessToken, refreshToken } = response.data;

    // Return both the tokens and the full response data
    return {
      success: true,
      accessToken,
      refreshToken,
      data: response.data,
    };
  } catch (error: any) {
    // Handle different types of errors
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      return {
        success: false,
        message: error.response.data?.message || "Authentication failed",
        status: error.response.status,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        success: false,
        message: "No response from server. Please check your connection.",
        status: 0,
      };
    } else {
      // Something happened in setting up the request
      return {
        success: false,
        message: error.message || "An unexpected error occurred",
        status: 0,
      };
    }
  }
};

export const Logout = async () => {
  try {
    const response = await axiosInstance.post(`${API_URL}/user/logout`);

    return response.data;
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};

export const fetchStoreData = async () => {
  try {
    const response = await axiosInstance.get(`stores`);
    console.log(response?.data, "store data");
    return response?.data ?? [];
  } catch (error) {
    console.error("Error fetching tenants data:", error);
    throw error;
  }
};

export const updateStoreData = async (
  id: string,
  updateStoreDto: any,
  file?: File
) => {
  try {
    const formData = new FormData();

    // Append all DTO fields individually to formData instead of wrapping them in 'updateStoreDto'
    Object.entries(updateStoreDto).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    // Append the file if it exists
    if (file) {
      formData.append("file", file);
    }

    const response = await axiosInstance.put(`stores/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error updating store data:", error);
    throw error;
  }
};

export const fetchUsers = async (params?: {
  search?: string;
  role?: string;
  isActive?: boolean;
  storeId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  try {
    const query = new URLSearchParams();

    if (params?.search) query.append("search", params.search);
    if (params?.role) query.append("role", params.role);
    if (params?.isActive !== undefined)
      query.append("isActive", String(params.isActive));
    if (params?.storeId) query.append("storeId", params.storeId);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.sortBy) query.append("sortBy", params.sortBy);
    if (params?.sortOrder) query.append("sortOrder", params.sortOrder);

    const res = await axiosInstance.get(`/user?${query.toString()}`);
    return res?.data; // Return the complete response object
  } catch (error) {
    // console.error("Error fetching users:", error);
    return { users: [], total: 0, page: 1, limit: 10, totalPages: 1 };
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const res = await axiosInstance.delete(`/user/${userId}`);
    console.log("res for delete user");
    return res;
  } catch (error) {
    console.log(error);
  }
};
