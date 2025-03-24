import { API_URL } from './../constant/apiUrl';
import axios from 'axios';
import Cookies from 'js-cookie';
const axiosInstance = axios.create({
  baseURL: API_URL || 'http://localhost:4000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response) {
      const { status, data } = response;
      if (status >= 400 && status < 500) {
        // Handle client errors (4xx)
        return Promise.reject(data);
      } else if (status >= 500) {
        // Handle server errors (5xx)
        return Promise.reject(data);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
