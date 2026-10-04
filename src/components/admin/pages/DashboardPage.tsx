import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Inbox, Plane, TrendingUp, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminPage } from "@/components/admin/layout/AdminPage";
import { Avatar } from "@/components/admin/ui/Avatar";
import { StatusChip } from "@/components/admin/ui/StatusChip";
import {
  adminUser,
  dashboardStats,
  inquiries,
  recentActivity,
  upcomingDepartures,
} from "@/data/adminMockData";
import type { DashboardStat, Departure, StatIcon } from "@/types/admin";

const statIcons: Record<StatIcon, LucideIcon> = {
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
  const firstName = adminUser.name.split(" ")[0];

  return (
    <AdminPage
      title={`${greetingFor(new Date())}, ${firstName}`}
      subtitle="Here is what needs your attention today"
      action={{ label: "New event", to: "/admin/events/new" }}
      contentClassName="gap-6 md:py-7"
    >
      <section aria-label="Key figures" className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
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
          {inquiries.map((inquiry, index) => (
            <Fragment key={inquiry.id}>
              {index > 0 && <div className="h-px w-full bg-admin-divider" />}
              <div className="flex items-center gap-3 py-[11px]">
                <Avatar name={inquiry.customer} tone={inquiry.avatarTone} />
                <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <span className="truncate text-[14px] font-semibold text-admin-ink-900">{inquiry.customer}</span>
                  <span className="truncate text-[12px] text-admin-ink-500">
                    {inquiry.tour} · {inquiry.guests} {inquiry.guests === 1 ? "guest" : "guests"}
                  </span>
                </div>
                <StatusChip status={inquiry.status} />
              </div>
            </Fragment>
          ))}
        </section>

        <div className="flex w-full flex-col gap-6 xl:w-[380px] xl:shrink-0">
          <section className="flex flex-col gap-1 rounded-[18px] border border-admin-border bg-white px-[22px] pt-5 pb-4">
            <h2 className="pb-[6px] text-[16px] font-medium text-admin-ink-900">Upcoming departures</h2>
            {upcomingDepartures.map((departure) => (
              <DepartureRow key={departure.id} departure={departure} />
            ))}
          </section>

          <section className="flex flex-col gap-1 rounded-[18px] border border-admin-border bg-white px-[22px] pt-5 pb-4">
            <h2 className="pb-[6px] text-[16px] font-medium text-admin-ink-900">Recent activity</h2>
            <ul>
              {recentActivity.map((item) => (
                <li key={item.id} className="flex items-center gap-[10px] py-[9px]">
                  <span
                    aria-hidden
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      item.tone === "green" ? "bg-admin-published-dot" : "bg-admin-orange",
                    )}
                  />
                  <span className="flex-1 text-[12.5px] font-medium text-admin-ink-700">{item.message}</span>
                  <span className="text-[12px] text-admin-ink-300">{item.time}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </AdminPage>
  );
}

function StatCard({ stat }: { stat: DashboardStat }) {
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

function DepartureRow({ departure }: { departure: Departure }) {
  const percent = Math.round((departure.booked / departure.capacity) * 100);
  const full = departure.booked >= departure.capacity;
  return (
    <div className="flex flex-col gap-2 py-[10px]">
      <div className="flex items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <span className="truncate text-[14px] font-semibold text-admin-ink-900">{departure.tour}</span>
          <span className="text-[12px] text-admin-ink-500">Departs {departure.departs}</span>
        </div>
        <span className="text-[12.5px] font-medium text-admin-ink-500">
          {departure.booked} / {departure.capacity}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={`${departure.tour} occupancy`}
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
    </div>
  );
}
