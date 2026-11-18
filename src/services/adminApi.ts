import api from "@/services/api";
import type {
  AdminBookingDetail,
  AdminBookingRow,
  AdminEvent,
  AdminExtra,
  AdminProfile,
  AdminSettings,
  AdminTour,
  BookingStatus,
  Dashboard,
  EventInput,
  ExtraInput,
  ListParams,
  ListResponse,
  Location,
  LocationInput,
  LoginPayload,
  LoginResponse,
  TourInput,
} from "@/types/api";

const ADMIN = "/api/admin";

export const adminAuthApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(`${ADMIN}/auth/login`, payload);
    return response.data;
  },

  me: async (): Promise<AdminProfile> => {
    const response = await api.get<AdminProfile>(`${ADMIN}/auth/me`);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post(`${ADMIN}/auth/forgot-password`, { email });
  },

  setPassword: async (token: string, password: string): Promise<void> => {
    await api.post(`${ADMIN}/auth/set-password`, { token, password });
  },
};

export const adminDashboardApi = {
  get: async (): Promise<Dashboard> => {
    const response = await api.get<Dashboard>(`${ADMIN}/dashboard`);
    return response.data;
  },
};

function imageForm(field: string, files: File[]): FormData {
  const form = new FormData();
  files.forEach((file) => form.append(field, file));
  return form;
}

function removeImageForm(imageUrl: string): FormData {
  const form = new FormData();
  form.append("image_url", imageUrl);
  return form;
}

export const adminToursApi = {
  list: async (params: ListParams = {}): Promise<ListResponse<AdminTour>> => {
    const response = await api.get<ListResponse<AdminTour>>(`${ADMIN}/tours`, { params });
    return response.data;
  },

  get: async (id: number): Promise<AdminTour> => {
    const response = await api.get<AdminTour>(`${ADMIN}/tours/${id}`);
    return response.data;
  },

  create: async (input: TourInput): Promise<AdminTour> => {
    const response = await api.post<AdminTour>(`${ADMIN}/tours`, input);
    return response.data;
  },

  update: async (id: number, changes: Partial<TourInput>): Promise<AdminTour> => {
    const response = await api.patch<AdminTour>(`${ADMIN}/tours/${id}`, changes);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`${ADMIN}/tours/${id}`);
  },

  attachExtra: async (id: number, extraId: number, priceGhs?: number): Promise<void> => {
    await api.put(`${ADMIN}/tours/${id}/extras/${extraId}`, priceGhs === undefined ? {} : { price_ghs: priceGhs });
  },

  detachExtra: async (id: number, extraId: number): Promise<void> => {
    await api.delete(`${ADMIN}/tours/${id}/extras/${extraId}`);
  },

  uploadMainImage: async (id: number, file: File): Promise<void> => {
    await api.post(`/api/tours/${id}/upload-main-image`, imageForm("file", [file]));
  },

  uploadGalleryImages: async (id: number, files: File[]): Promise<void> => {
    await api.post(`/api/tours/${id}/upload-gallery-images`, imageForm("files", files));
  },

  removeGalleryImage: async (id: number, imageUrl: string): Promise<void> => {
    await api.delete(`/api/tours/${id}/remove-gallery-image`, { data: removeImageForm(imageUrl) });
  },
};

export const adminEventsApi = {
  list: async (params: ListParams = {}): Promise<ListResponse<AdminEvent>> => {
    const response = await api.get<ListResponse<AdminEvent>>(`${ADMIN}/events`, { params });
    return response.data;
  },

  get: async (id: number): Promise<AdminEvent> => {
    const response = await api.get<AdminEvent>(`${ADMIN}/events/${id}`);
    return response.data;
  },

  create: async (input: EventInput): Promise<AdminEvent> => {
    const response = await api.post<AdminEvent>(`${ADMIN}/events`, input);
    return response.data;
  },

  update: async (id: number, changes: Partial<EventInput>): Promise<AdminEvent> => {
    const response = await api.patch<AdminEvent>(`${ADMIN}/events/${id}`, changes);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`${ADMIN}/events/${id}`);
  },

  attachExtra: async (id: number, extraId: number, priceGhs?: number): Promise<void> => {
    await api.put(`${ADMIN}/events/${id}/extras/${extraId}`, priceGhs === undefined ? {} : { price_ghs: priceGhs });
  },

  detachExtra: async (id: number, extraId: number): Promise<void> => {
    await api.delete(`${ADMIN}/events/${id}/extras/${extraId}`);
  },

  uploadMainImage: async (id: number, file: File): Promise<void> => {
    await api.post(`${ADMIN}/events/${id}/upload-main-image`, imageForm("file", [file]));
  },

  uploadGalleryImages: async (id: number, files: File[]): Promise<void> => {
    await api.post(`${ADMIN}/events/${id}/upload-gallery-images`, imageForm("files", files));
  },

  removeGalleryImage: async (id: number, imageUrl: string): Promise<void> => {
    await api.delete(`${ADMIN}/events/${id}/remove-gallery-image`, { data: removeImageForm(imageUrl) });
  },
};

export function normaliseExtrasList(data: AdminExtra[] | ListResponse<AdminExtra>): ListResponse<AdminExtra> {
  if (!Array.isArray(data)) return data;
  return { items: data, counts: { all: data.length } };
}

export const adminExtrasApi = {
  list: async (params: ListParams = {}): Promise<ListResponse<AdminExtra>> => {
    const response = await api.get<AdminExtra[] | ListResponse<AdminExtra>>(`${ADMIN}/extras`, { params });
    return normaliseExtrasList(response.data);
  },

  create: async (input: ExtraInput): Promise<AdminExtra> => {
    const response = await api.post<AdminExtra>(`${ADMIN}/extras`, input);
    return response.data;
  },

  update: async (id: number, changes: Partial<ExtraInput> & { is_active?: boolean }): Promise<AdminExtra> => {
    const response = await api.patch<AdminExtra>(`${ADMIN}/extras/${id}`, changes);
    return response.data;
  },
};

export const adminLocationsApi = {
  list: async (): Promise<Location[]> => {
    const response = await api.get<Location[]>(`/api/tours/locations/`);
    return response.data;
  },

  create: async (input: LocationInput): Promise<Location> => {
    const response = await api.post<Location>(`/api/tours/locations/`, input);
    return response.data;
  },
};

export const adminBookingsApi = {
  list: async (params: ListParams = {}): Promise<ListResponse<AdminBookingRow>> => {
    const response = await api.get<ListResponse<AdminBookingRow>>(`${ADMIN}/bookings`, { params });
    return response.data;
  },

  get: async (id: number): Promise<AdminBookingDetail> => {
    const response = await api.get<AdminBookingDetail>(`${ADMIN}/bookings/${id}`);
    return response.data;
  },

  updateStatus: async (id: number, status: BookingStatus): Promise<void> => {
    await api.patch(`${ADMIN}/bookings/${id}/status`, { status });
  },
};

export function normaliseSettings(settings: AdminSettings): AdminSettings {
  return {
    ...settings,
    company_name: settings.company_name ?? "",
    contact_email: settings.contact_email ?? "",
    phone: settings.phone ?? "",
    location: settings.location ?? "",
  };
}

export const adminSettingsApi = {
  get: async (): Promise<AdminSettings> => {
    const response = await api.get<AdminSettings>(`${ADMIN}/settings`);
    return normaliseSettings(response.data);
  },

  update: async (settings: AdminSettings): Promise<AdminSettings> => {
    const { logo_url: _logoUrl, updated_at: _updatedAt, ...body } = settings as AdminSettings & { updated_at?: string };
    const response = await api.put<AdminSettings>(`${ADMIN}/settings`, body);
    return response.data;
  },

  uploadLogo: async (file: File): Promise<void> => {
    await api.post(`${ADMIN}/settings/logo`, imageForm("file", [file]));
  },
};
