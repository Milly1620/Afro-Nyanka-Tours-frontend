export type PublishStatus = "draft" | "published" | "scheduled";

export type BookingStatus = "pending" | "confirmed" | "paid" | "cancelled";

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

export interface ListingExtra {
  extra_id: number;
  name: string;
  description: string | null;
  price_ghs: number;
  is_active?: boolean;
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
  main_image_url: string | null;
  gallery_images?: string[];
  price_ghs: number | null;
  duration_days: number | null;
  capacity: number | null;
  highlights: string[];
  extras: ListingExtra[];
  is_popular?: boolean;
}

export interface Event {
  id: number;
  name: string;
  description: string | null;
  country: string;
  region: string | null;
  destination: string | null;
  start_date: string;
  end_date: string;
  duration_days: number | null;
  price_ghs: number | null;
  capacity: number | null;
  seats_left: number | null;
  highlights: string[];
  main_image_url: string | null;
  gallery_images: string[];
  locations: Location[];
  extras: ListingExtra[];
}

export interface PublicSettings {
  company_name: string;
  logo_url: string | null;
  contact_email: string | null;
  phone: string | null;
  location: string | null;
}

export interface ApiResponse {
  data: Tour[];
}

export interface BookingTourSelection {
  tour_id: number;
  locations: number[];
  order: number;
}

export interface BookingExtraSelection {
  extra_id: number;
  tour_id?: number;
}

export interface BookingPayload {
  customer_name: string;
  customer_email: string;
  customer_age?: number;
  customer_country?: string;
  start_date?: string;
  end_date?: string;
  number_of_people: number;
  additional_services?: string;
  tour_selections?: BookingTourSelection[];
  event_id?: number;
  extras?: BookingExtraSelection[];
}

export interface BookingRecord {
  id: number;
  reference: string;
  status: BookingStatus;
  amount_ghs: number | null;
  customer_name: string;
  customer_email: string;
  customer_age: number | null;
  customer_country: string | null;
  number_of_people: number;
  start_date: string | null;
  end_date: string | null;
  additional_services: string | null;
  created_at: string;
}

export interface BookingSummaryLocation {
  location_id: number;
  location_name: string;
  order: number;
}

export interface BookingSummaryTour {
  tour_id: number;
  tour_name: string;
  country?: string;
  region?: string;
  selected_locations: BookingSummaryLocation[];
}

export interface BookingSummaryExtra {
  name: string;
  price_ghs: number;
}

export interface BookingSummaryEvent {
  id?: number;
  name: string;
  start_date: string;
  end_date: string;
  destination?: string | null;
}

export interface BookingSummary {
  reference: string;
  status: BookingStatus;
  amount_ghs: number | null;
  extras: BookingSummaryExtra[];
  event: BookingSummaryEvent | null;
  tours_and_locations: BookingSummaryTour[];
}

export interface BookingCreateResponse {
  booking: BookingRecord;
  message: string;
  summary: BookingSummary;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember_me: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
}

export interface AdminProfile {
  id: number;
  email: string;
}

export type StatusCounts = Partial<Record<string, number>> & { all: number };

export interface ListResponse<T> {
  items: T[];
  counts: StatusCounts;
}

export interface ListParams {
  status?: string;
  skip?: number;
  limit?: number;
}

export interface AdminTour extends Tour {
  status: PublishStatus;
  publish_at: string | null;
}

export interface AdminEvent extends Omit<Event, "locations"> {
  status: PublishStatus;
  publish_at: string | null;
  seats_booked: number;
  is_popular?: boolean;
  locations: Location[];
}

export interface TourInput {
  name: string;
  country: string;
  region: string;
  description: string;
  price_ghs: number | null;
  duration_days: number | null;
  capacity: number | null;
  highlights: string[];
  status: PublishStatus;
  publish_at: string | null;
  is_popular: boolean;
  location_ids: number[];
}

export interface EventInput extends Omit<TourInput, "is_popular" | "location_ids"> {
  destination: string;
  start_date: string;
  end_date: string;
  location_ids?: number[];
  is_popular?: boolean;
}

export interface AdminExtra {
  id: number;
  name: string;
  description: string | null;
  default_price_ghs: number;
  is_active: boolean;
}

export interface ExtraInput {
  name: string;
  description: string;
  default_price_ghs: number;
}

export interface LocationInput {
  name: string;
  country: string;
  region: string;
  description: string;
}

export interface AdminBookingRow {
  id: number;
  reference: string;
  customer_name: string;
  customer_email: string;
  tour_or_event_name: string | null;
  start_date: string | null;
  number_of_people: number;
  amount_ghs: number | null;
  status: BookingStatus;
  created_at: string;
}

export interface AdminBookingDetail {
  booking: BookingRecord;
  summary: BookingSummary;
}

export interface AdminSettings {
  company_name: string;
  contact_email: string;
  phone: string;
  location: string;
  logo_url?: string | null;
  notify_new_inquiry: boolean;
  notify_booking_confirmation: boolean;
  notify_weekly_summary: boolean;
}

export interface DashboardInquiry {
  booking_id: number;
  reference: string;
  customer_name: string;
  tour_or_event_name: string | null;
  number_of_people: number;
  created_at: string;
}

export interface DashboardUpcomingEvent {
  event_id: number;
  name: string;
  start_date: string;
  seats_booked: number;
  capacity: number | null;
}

export interface DashboardActivity {
  type: string;
  reference: string;
  customer_name: string;
  to_status: BookingStatus | null;
  created_at: string;
}

export interface Dashboard {
  new_inquiries: { count: number; delta_7d: number };
  upcoming_departures: { count: number; next_14d: number };
  revenue_ghs: { total: number; delta_pct_vs_prev_30d: number | null };
  avg_occupancy_pct: { value: number | null };
  inquiries: DashboardInquiry[];
  upcoming: DashboardUpcomingEvent[];
  recent_activity: DashboardActivity[];
}
