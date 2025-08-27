export interface Location {
  name: string;
  description: string | null;
  country: string;
  region: string;
  id: number;
  created_at: string;
}

export interface TourLocation {
  location_id: number;
  order: number;
  id: number;
  location: Location;
}

export interface Tour {
  name: string;
  description: string;
  country: string;
  region: string;
  is_active: boolean;
  id: number;
  created_at: string;
  updated_at: string | null;
  tour_locations: TourLocation[];
}

export interface ApiResponse {
  data: Tour[];
}
