import axios from "axios";
import { getAuthToken, getRefreshToken, setAuthToken } from "../cookie-service/CookieService";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4001",
  headers: {
    "Content-Type": "application/json",
  },
});


const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Function to refresh the token
const refreshToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post("http://localhost:4001/auth/refresh", { refreshToken });
    const newToken = response.data.token;
    setAuthToken(newToken);
    return newToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};

axiosInstance.interceptors.request.use(
  async (config: any) => {
    const token = getAuthToken();
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
        const newToken = await refreshToken();
        config.headers["Authorization"] = "Bearer " + newToken;
      } else {
        config.headers["Authorization"] = "Bearer " + token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers["Authorization"] = "Bearer " + newToken;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

export default class AxiosService {
  async getRequest(url: string, config?: {}) {
    try {
      const response = await axiosInstance.get(url, config);
      return response?.data;
    } catch (error) {
      throw error;
    }
  }

  async postRequest(url: string, data: any, config?: {}) {
    try {
      const response = await axiosInstance.post(url, data, config);
      return response?.data;
    } catch (error) {
      throw error;
    }
  }

  async putRequest(url: string, data: any, config?: {}) {
    try {
      const response = await axiosInstance.put(url, data, config);
      return response?.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteRequest(url: string, config?: {}) {
    try {
      const response = await axiosInstance.delete(url, config);
      return response?.data;
    } catch (error) {
      throw error;
    }
  }
}