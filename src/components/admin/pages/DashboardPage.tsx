import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Inbox, Plane, TrendingUp, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminPage } from "@/components/admin/layout/AdminPage";
import { Avatar } from "@/components/admin/ui/Avatar";
import { AsyncState } from "@/components/admin/ui/AsyncState";
import {
  activityMessage,
  occupancyPercent,
  statFigures,
  type StatFigure,
} from "@/components/admin/bookings/dashboardFigures";
import { useResource } from "@/hooks/useResource";
import { avatarToneFor, formatShortDate, relativeTime } from "@/lib/adminFormat";
import { adminDashboardApi } from "@/services/adminApi";
import { useAppSelector } from "@/store";
import type { Dashboard, DashboardUpcomingEvent } from "@/types/api";

const statIcons: Record<StatFigure["icon"], LucideIcon> = {
  inbox: Inbox,
  plane: Plane,
  "trending-up": TrendingUp,
  users: Users,
};

function greetingFor(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardPage() {
  const email = useAppSelector((state) => state.admin.email);
  const dashboard = useResource(() => adminDashboardApi.get());
  const firstName = email ? email.split("@")[0] : "";
  const greeting = greetingFor(new Date());

  return (
    <AdminPage
      title={firstName ? `${greeting}, ${firstName}` : greeting}
      subtitle="Here is what needs your attention today"
      action={{ label: "New event", to: "/admin/events/new" }}
      contentClassName="gap-6 md:py-7"
    >
      <AsyncState loading={dashboard.loading} error={dashboard.error} onRetry={dashboard.reload}>
        {dashboard.data && <DashboardContent dashboard={dashboard.data} />}
      </AsyncState>
    </AdminPage>
  );
}

function DashboardContent({ dashboard }: { dashboard: Dashboard }) {
  return (
    <>
      <section aria-label="Key figures" className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
        {statFigures(dashboard).map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </section>

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <section className="flex min-w-0 flex-1 flex-col gap-1 rounded-[18px] border border-admin-border bg-white px-[22px] pt-5 pb-[14px]">
          <div className="flex items-center pb-2">
            <h2 className="flex-1 text-[16px] font-medium text-admin-ink-900">Inquiries to respond to</h2>
            <Link to="/admin/bookings" className="text-[12.5px] font-medium text-admin-accent hover:underline">
              View all →
            </Link>
          </div>
          {dashboard.inquiries.length === 0 && (
            <p className="py-6 text-center text-[13px] text-admin-subtle">No pending inquiries.</p>
          )}
          {dashboard.inquiries.map((inquiry, index) => (
            <Fragment key={inquiry.booking_id}>
              {index > 0 && <div className="h-px w-full bg-admin-divider" />}
              <Link
                to={`/admin/bookings/${inquiry.booking_id}`}
                className="flex items-center gap-3 py-[11px] hover:opacity-80"
              >
                <Avatar name={inquiry.customer_name} tone={avatarToneFor(inquiry.customer_name)} />
                <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <span className="truncate text-[14px] font-semibold text-admin-ink-900">
                    {inquiry.customer_name}
                  </span>
                  <span className="truncate text-[12px] text-admin-ink-500">
                    {inquiry.tour_or_event_name ?? "Booking"} · {inquiry.number_of_people}{" "}
                    {inquiry.number_of_people === 1 ? "guest" : "guests"}
                  </span>
                </div>
                <span className="text-[12px] text-admin-ink-300">{relativeTime(inquiry.created_at)}</span>
              </Link>
            </Fragment>
          ))}
        </section>

        <div className="flex w-full flex-col gap-6 xl:w-[380px] xl:shrink-0">
          <section className="flex flex-col gap-1 rounded-[18px] border border-admin-border bg-white px-[22px] pt-5 pb-4">
            <h2 className="pb-[6px] text-[16px] font-medium text-admin-ink-900">Upcoming departures</h2>
            {dashboard.upcoming.length === 0 && (
              <p className="py-4 text-center text-[13px] text-admin-subtle">No upcoming events.</p>
            )}
            {dashboard.upcoming.map((event) => (
              <DepartureRow key={event.event_id} event={event} />
            ))}
          </section>

          <section className="flex flex-col gap-1 rounded-[18px] border border-admin-border bg-white px-[22px] pt-5 pb-4">
            <h2 className="pb-[6px] text-[16px] font-medium text-admin-ink-900">Recent activity</h2>
            {dashboard.recent_activity.length === 0 && (
              <p className="py-4 text-center text-[13px] text-admin-subtle">No recent activity.</p>
            )}
            <ul>
              {dashboard.recent_activity.map((item, index) => (
                <li key={`${item.reference}-${item.created_at}-${index}`} className="flex items-center gap-[10px] py-[9px]">
                  <span
                    aria-hidden
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      item.to_status === "cancelled" || item.to_status === "pending"
                        ? "bg-admin-orange"
                        : "bg-admin-published-dot",
                    )}
                  />
                  <span className="flex-1 text-[12.5px] font-medium text-admin-ink-700">{activityMessage(item)}</span>
                  <span className="text-[12px] text-admin-ink-300">{relativeTime(item.created_at)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}

function StatCard({ stat }: { stat: StatFigure }) {
  const Icon = statIcons[stat.icon];
  return (
    <div className="flex flex-col gap-[10px] rounded-[16px] border border-admin-border bg-admin-panel px-5 py-[18px]">
      <div className="flex items-center">
        <span className="flex-1 text-[12.5px] font-medium text-admin-ink-500">{stat.label}</span>
        <span className="flex size-8 items-center justify-center rounded-[10px] bg-admin-icon-tile text-admin-orange">
          <Icon size={16} strokeWidth={1.5} absoluteStrokeWidth />
        </span>
      </div>
      <span className="text-[28px] font-medium text-admin-ink-900">{stat.value}</span>
      <span className="text-[12px] text-admin-green">{stat.delta}</span>
    </div>
  );
}

function DepartureRow({ event }: { event: DashboardUpcomingEvent }) {
  const percent = occupancyPercent(event.seats_booked, event.capacity);
  const full = percent === 100;
  return (
    <div className="flex flex-col gap-2 py-[10px]">
      <div className="flex items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <span className="truncate text-[14px] font-semibold text-admin-ink-900">{event.name}</span>
          <span className="text-[12px] text-admin-ink-500">Departs {formatShortDate(event.start_date)}</span>
        </div>
        <span className="text-[12.5px] font-medium text-admin-ink-500">
          {event.seats_booked} / {event.capacity ?? "∞"}
        </span>
      </div>
      {percent !== null && (
        <div
          role="progressbar"
          aria-label={`${event.name} occupancy`}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-[6px] w-full overflow-hidden rounded-full bg-admin-field"
        >
          <div
            className={cn("h-full", full ? "bg-admin-published-dot" : "bg-admin-orange")}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}
