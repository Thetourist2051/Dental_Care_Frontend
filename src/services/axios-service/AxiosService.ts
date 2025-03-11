import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4001",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
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
