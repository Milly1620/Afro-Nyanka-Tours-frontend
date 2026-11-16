import { formatGhs } from "@/lib/adminFormat";
import type { Dashboard, DashboardActivity } from "@/types/api";

export interface StatFigure {
  label: string;
  value: string;
  delta: string;
  icon: "inbox" | "plane" | "trending-up" | "users";
}

function signed(value: number, suffix: string): string {
  return `${value > 0 ? "+" : ""}${value}${suffix}`;
}

export function statFigures(dashboard: Dashboard): StatFigure[] {
  const { new_inquiries, upcoming_departures, revenue_ghs, avg_occupancy_pct } = dashboard;
  return [
    {
      label: "New inquiries",
      value: String(new_inquiries.count),
      delta: `${signed(new_inquiries.delta_7d, "")} in 7 days`,
      icon: "inbox",
    },
    {
      label: "Upcoming departures",
      value: String(upcoming_departures.count),
      delta: `${upcoming_departures.next_14d} in next 14 days`,
      icon: "plane",
    },
    {
      label: "Revenue (30d)",
      value: formatGhs(revenue_ghs.total),
      delta:
        revenue_ghs.delta_pct_vs_prev_30d === null
          ? "No previous period"
          : `${signed(revenue_ghs.delta_pct_vs_prev_30d, "%")} vs prev`,
      icon: "trending-up",
    },
    {
      label: "Avg occupancy",
      value: avg_occupancy_pct.value === null ? "—" : `${Math.round(avg_occupancy_pct.value)}%`,
      delta: avg_occupancy_pct.value === null ? "No events with a capacity" : "Upcoming events",
      icon: "users",
    },
  ];
}

export function activityMessage(activity: DashboardActivity): string {
  if (activity.to_status && activity.type.includes("status")) {
    return `${activity.customer_name} · ${activity.reference} marked ${activity.to_status}`;
  }
  return `New booking from ${activity.customer_name} · ${activity.reference}`;
}

export function occupancyPercent(booked: number, capacity: number | null): number | null {
  if (capacity === null || capacity <= 0) return null;
  return Math.min(Math.round((booked / capacity) * 100), 100);
}
