import axios from "axios";
import { getAuthToken } from "../cookie-service/CookieService";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4001",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; 
});



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