import serengetiPlains from "@/assets/admin/serengeti-plains.jpg";
import zanzibarElephant from "@/assets/admin/zanzibar-elephant.jpg";
import capeCoastBoats from "@/assets/admin/cape-coast-boats.jpg";
import type {
  AdminEvent,
  AdminTour,
  AdminUser,
  Booking,
  CompanyProfile,
  DashboardStat,
  Departure,
  Inquiry,
  ListingDraft,
  NotificationPreferences,
  RecentActivity,
} from "@/types/admin";

export const adminUser: AdminUser = {
  name: "Amara Boateng",
  role: "Operations lead",
  email: "amara@afronyanka.com",
  avatarTone: 1,
};

export const dashboardStats: DashboardStat[] = [
  { label: "New inquiries", value: "3", delta: "+3 today", icon: "inbox" },
  { label: "Upcoming departures", value: "4", delta: "next 14 days", icon: "plane" },
  { label: "Revenue (30d)", value: "GHS 142,300", delta: "+18% vs prev", icon: "trending-up" },
  { label: "Avg occupancy", value: "78%", delta: "+6% vs last", icon: "users" },
];

export const inquiries: Inquiry[] = [
  { id: "inq-1", customer: "Daniel Osei", avatarTone: 1, tour: "Serengeti Migration", guests: 2, status: "new" },
  { id: "inq-2", customer: "Fatima Bello", avatarTone: 2, tour: "Zanzibar Beach Escape", guests: 4, status: "new" },
  { id: "inq-3", customer: "Lena Fischer", avatarTone: 3, tour: "Cape Coast Heritage", guests: 6, status: "new" },
  { id: "inq-4", customer: "Kwame Mensah", avatarTone: 4, tour: "Kilimanjaro Trek", guests: 1, status: "replied" },
];

export const upcomingDepartures: Departure[] = [
  { id: "dep-1", tour: "Serengeti Explorer", departs: "Mar 14", booked: 14, capacity: 16 },
  { id: "dep-2", tour: "Zanzibar Beach Escape", departs: "Mar 18", booked: 10, capacity: 12 },
  { id: "dep-3", tour: "Cape Coast Heritage", departs: "Mar 22", booked: 6, capacity: 10 },
  { id: "dep-4", tour: "Kilimanjaro Trek", departs: "Apr 2", booked: 8, capacity: 8 },
];

export const recentActivity: RecentActivity[] = [
  { id: "act-1", message: "Fatima Bello replied to your message", time: "2h", tone: "green" },
  { id: "act-2", message: "Payment received · SC-2044", time: "5h", tone: "green" },
  { id: "act-3", message: "New inquiry from Daniel Osei", time: "8h", tone: "orange" },
  { id: "act-4", message: "Booking confirmed · SC-2046", time: "1d", tone: "green" },
];

export const initialEvents: AdminEvent[] = [
  { id: "evt-1", name: "Kilimanjaro Trek", country: "Tanzania", durationDays: 7, price: 55000, coverImage: serengetiPlains, status: "draft" },
  { id: "evt-2", name: "Mole National Park Safari", country: "Ghana", durationDays: 3, price: 9500, coverImage: null, status: "draft" },
  { id: "evt-3", name: "Serengeti Migration Safari", country: "Tanzania", durationDays: 8, price: 42000, coverImage: serengetiPlains, status: "published" },
  { id: "evt-4", name: "Zanzibar Beach Escape", country: "Zanzibar", durationDays: 6, price: 28500, coverImage: zanzibarElephant, status: "published" },
  { id: "evt-5", name: "Cape Coast Heritage", country: "Ghana", durationDays: 4, price: 12000, coverImage: capeCoastBoats, status: "published" },
];

export const initialTours: AdminTour[] = [
  { id: "tour-1", name: "Cape Coast Heritage", location: "Cape Coast", durationDays: 4, price: 12000, activitiesCount: 5, coverImage: null, status: "published" },
  { id: "tour-2", name: "Tamale Cultural Trail", location: "Tamale", durationDays: 3, price: 8500, activitiesCount: 3, coverImage: null, status: "published" },
  { id: "tour-3", name: "Accra City Tour", location: "Accra", durationDays: 1, price: 3200, activitiesCount: 4, coverImage: null, status: "published" },
  { id: "tour-4", name: "Kumasi Ashanti Experience", location: "Kumasi", durationDays: 2, price: 6800, activitiesCount: 6, coverImage: null, status: "draft" },
  { id: "tour-5", name: "Elmina Castle Day", location: "Elmina", durationDays: 1, price: 2900, activitiesCount: 2, coverImage: null, status: "draft" },
];

export const bookings: Booking[] = [
  { reference: "SC-2048", customer: "Daniel Osei", avatarTone: 1, tour: "Serengeti Migration Safari", departure: "Mar 14", amount: 84000, status: "pending" },
  { reference: "SC-2047", customer: "Fatima Bello", avatarTone: 2, tour: "Zanzibar Beach Escape", departure: "Mar 18", amount: 57000, status: "paid" },
  { reference: "SC-2046", customer: "Lena Fischer", avatarTone: 3, tour: "Cape Coast Heritage", departure: "Mar 22", amount: 72000, status: "confirmed" },
  { reference: "SC-2045", customer: "Ama Serwaa", avatarTone: 5, tour: "Zanzibar Beach Escape", departure: "Mar 18", amount: 28500, status: "cancelled" },
  { reference: "SC-2044", customer: "Kwame Mensah", avatarTone: 4, tour: "Kilimanjaro Trek", departure: "Apr 2", amount: 55000, status: "paid" },
];

function isoDateFromToday(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().slice(0, 10);
}

const sampleActivities = [
  { id: "a-1", name: "Great Migration game drive", price: "" },
  { id: "a-2", name: "Hot-air balloon safari", price: "3,500" },
  { id: "a-3", name: "Maasai village visit", price: "800" },
];

const sampleListing = {
  name: "Serengeti Migration Safari",
  destination: "Serengeti, Tanzania",
  durationDays: "8",
  capacity: "16",
  price: "42,000",
  firstDeparture: isoDateFromToday(12),
  description:
    "An eight-day guided safari across the Serengeti plains — full board and expert rangers.",
  activities: sampleActivities,
  coverImage: null,
  publishMode: "now" as const,
  publishOn: `${isoDateFromToday(18)}T09:00`,
};

export const initialEventDraft: ListingDraft = {
  ...sampleListing,
  highlights: [
    { id: "h-1", icon: "users", label: "Guided Experience" },
    { id: "h-2", icon: "bed", label: "Accommodation Support" },
    { id: "h-3", icon: "bus", label: "Transport Included" },
  ],
};

export const initialTourDraft: ListingDraft = {
  ...sampleListing,
  highlights: [],
};

export const initialCompanyProfile: CompanyProfile = {
  name: "Afro Nyanka Tours",
  email: "info@afronyanka.com",
  phone: "+233 24 123 4567",
  location: "Accra, Ghana",
};

export const initialNotificationPreferences: NotificationPreferences = {
  inquiryAlerts: true,
  bookingConfirmations: true,
  weeklySummary: false,
};
