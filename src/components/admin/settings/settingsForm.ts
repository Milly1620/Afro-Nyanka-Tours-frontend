import type { AdminSettings } from "@/types/api";

export type NotificationKey = "notify_new_inquiry" | "notify_booking_confirmation" | "notify_weekly_summary";

export type ProfileKey = "company_name" | "contact_email" | "phone" | "location";

export const profileFields: { key: ProfileKey; label: string; type: string }[] = [
  { key: "company_name", label: "Company name", type: "text" },
  { key: "contact_email", label: "Contact email", type: "email" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "location", label: "Location", type: "text" },
];

export const notificationOptions: { key: NotificationKey; title: string; description: string }[] = [
  { key: "notify_new_inquiry", title: "New inquiry alerts", description: "Email me when a traveller sends an inquiry" },
  {
    key: "notify_booking_confirmation",
    title: "Booking confirmations",
    description: "Notify me when a booking is paid or confirmed",
  },
  { key: "notify_weekly_summary", title: "Weekly summary email", description: "A Monday digest of the week ahead" },
];

export function validateSettings(settings: AdminSettings): string | null {
  if (!settings.company_name.trim()) return "Enter your company name.";
  if (settings.contact_email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contact_email.trim())) {
    return "Enter a valid contact email.";
  }
  return null;
}

export function normaliseSettings(settings: AdminSettings): AdminSettings {
  return {
    ...settings,
    company_name: settings.company_name.trim(),
    contact_email: settings.contact_email.trim(),
    phone: settings.phone.trim(),
    location: settings.location.trim(),
  };
}
