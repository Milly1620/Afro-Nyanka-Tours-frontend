import axios from "axios";
import { Tour } from "@/types/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
});

export const toursApi = {
  getCountries: async (): Promise<string[]> => {
    try {
      const response = await api.get(`/api/tours/tours/countries`);
      return response.data.countries;
    } catch (error) {
      console.error("Error fetching countries:", error);
      return [];
    }
  },

  getToursByCountry: async (country: string, is_popular: boolean = true): Promise<Tour[]> => {
    try {
      const response = await api.get(
        `/api/tours/country/${country}?is_popular=${is_popular}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching tours:", error);
      return [];
    }
  },

  createBooking: async (booking: any): Promise<any> => {
    try {
      const response = await api.post(`/api/bookings/`, booking);
      return response.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },
};

export default api;
