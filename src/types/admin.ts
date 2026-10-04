export type PublishStatus = "published" | "draft";

export type BookingStatus = "paid" | "pending" | "confirmed" | "cancelled";

export type InquiryStatus = "new" | "replied";

export type StatusChipVariant = InquiryStatus | BookingStatus;

export type AvatarTone = 1 | 2 | 3 | 4 | 5;

export type HighlightIcon = "users" | "bed" | "bus";

export type StatIcon = "inbox" | "plane" | "trending-up" | "users";

export type ActivityTone = "green" | "orange";

export type PublishMode = "now" | "schedule";

export interface ListingActivity {
  id: string;
  name: string;
  price: string;
}

export interface Highlight {
  id: string;
  icon: HighlightIcon;
  label: string;
}

export interface AdminEvent {
  id: string;
  name: string;
  country: string;
  durationDays: number;
  price: number;
  coverImage: string | null;
  status: PublishStatus;
}

export interface AdminTour {
  id: string;
  name: string;
  location: string;
  durationDays: number;
  price: number;
  activitiesCount: number;
  coverImage: string | null;
  status: PublishStatus;
}

export interface Booking {
  reference: string;
  customer: string;
  avatarTone: AvatarTone;
  tour: string;
  departure: string;
  amount: number;
  status: BookingStatus;
}

export interface Inquiry {
  id: string;
  customer: string;
  avatarTone: AvatarTone;
  tour: string;
  guests: number;
  status: InquiryStatus;
}

export interface Departure {
  id: string;
  tour: string;
  departs: string;
  booked: number;
  capacity: number;
}

export interface RecentActivity {
  id: string;
  message: string;
  time: string;
  tone: ActivityTone;
}

export interface DashboardStat {
  label: string;
  value: string;
  delta: string;
  icon: StatIcon;
}

export interface ListingDraft {
  name: string;
  destination: string;
  durationDays: string;
  capacity: string;
  price: string;
  firstDeparture: string;
  description: string;
  highlights: Highlight[];
  activities: ListingActivity[];
  coverImage: string | null;
  publishMode: PublishMode;
  publishOn: string;
}

export interface CompanyProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface NotificationPreferences {
  inquiryAlerts: boolean;
  bookingConfirmations: boolean;
  weeklySummary: boolean;
}

export interface AdminUser {
  name: string;
  role: string;
  email: string;
  avatarTone: AvatarTone;
}
