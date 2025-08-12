import axios from "axios";
import { Tour } from "@/types/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
});

export const toursApi = {
  getToursByCountry: async (country: string): Promise<Tour[]> => {
    try {
      const response = await api.get(`/api/tours/country/${country}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tours:", error);
      return [];
    }
  },
};

export default api;
