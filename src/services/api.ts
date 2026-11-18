import axios, { AxiosError } from "axios";
import { clearAdminSession, getAdminToken } from "@/lib/adminSession";
import type {
  BookingCreateResponse,
  BookingPayload,
  Event,
  PublicSettings,
  Testimonial,
  Tour,
} from "@/types/api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const LOGIN_PATH = "/api/admin/auth/login";

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
});

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

api.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const hadToken = Boolean(error.config?.headers?.get?.("Authorization"));
    if (status === 401 && hadToken && error.config?.url !== LOGIN_PATH) {
      clearAdminSession();
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);

interface ValidationIssue {
  loc?: (string | number)[];
  msg?: string;
}

export function getErrorStatus(error: unknown): number | null {
  return axios.isAxiosError(error) ? (error.response?.status ?? null) : null;
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (!axios.isAxiosError(error)) return fallback;
  if (!error.response) return "Network error. Please check your connection and try again.";
  const detail = (error.response.data as { detail?: unknown } | undefined)?.detail;
  if (typeof detail === "string" && detail) return detail;
  if (Array.isArray(detail)) {
    const messages = (detail as ValidationIssue[])
      .map((issue) => {
        const field = issue.loc?.filter((part) => part !== "body").join(".");
        return issue.msg ? (field ? `${field}: ${issue.msg}` : issue.msg) : null;
      })
      .filter((message): message is string => Boolean(message));
    if (messages.length) return messages.join("; ");
  }
  return fallback;
}

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
        `/api/tours/country/${encodeURIComponent(country)}?is_popular=${is_popular}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching tours:", error);
      return [];
    }
  },

  list: async (skip = 0, limit = 100): Promise<Tour[]> => {
    const response = await api.get<Tour[]>(`/api/tours/`, { params: { skip, limit } });
    return response.data;
  },

  get: async (id: number): Promise<Tour> => {
    const response = await api.get<Tour>(`/api/tours/${id}`);
    return response.data;
  },
};

export const eventsApi = {
  list: async (): Promise<Event[]> => {
    const response = await api.get<Event[]>(`/api/events/`);
    return response.data;
  },

  get: async (id: number): Promise<Event> => {
    const response = await api.get<Event>(`/api/events/${id}`);
    return response.data;
  },
};

export const testimonialsApi = {
  list: async (): Promise<Testimonial[]> => {
    const response = await api.get<Testimonial[]>(`/api/testimonials/`);
    return response.data;
  },
};

export const settingsApi = {
  getPublic: async (): Promise<PublicSettings> => {
    const response = await api.get<PublicSettings>(`/api/settings/public`);
    return response.data;
  },
};

export const bookingsApi = {
  create: async (booking: BookingPayload): Promise<BookingCreateResponse> => {
    const response = await api.post<BookingCreateResponse>(`/api/bookings/`, booking);
    return response.data;
  },
};

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactApi = {
  sendMessage: async (payload: ContactPayload): Promise<any> => {
    try {
      const response = await api.post(`/api/contact/`, payload);
      return response.data;
    } catch (error) {
      console.error("Error sending contact message:", error);
      throw error;
    }
  },
};

export default api;
