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
    console.log(response?.data,'store data')
    return response?.data ?? [];
  } catch (error) {
    console.error("Error fetching tenants data:", error);
    throw error;
  }
};
