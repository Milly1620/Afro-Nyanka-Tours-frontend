import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminPage } from "@/components/admin/layout/AdminPage";
import { EventCard } from "@/components/admin/EventCard";
import { useAppSelector } from "@/store";

const cardGrid = "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3";

export function EventsPage() {
  const events = useAppSelector((state) => state.admin.events);
  const [search, setSearch] = useState("");

  const matchingEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return events;
    return events.filter((event) =>
      [event.name, event.country].some((field) => field.toLowerCase().includes(query)),
    );
  }, [events, search]);

  const drafts = matchingEvents.filter((event) => event.status === "draft");
  const published = matchingEvents.filter((event) => event.status === "published");
  const liveCount = events.filter((event) => event.status === "published").length;
  const draftCount = events.length - liveCount;

  return (
    <AdminPage
      title="Events"
      subtitle="Tours published to your landing page"
      action={{ label: "New event", to: "/admin/events/new" }}
      search={search}
      onSearchChange={setSearch}
    >
      <section
        aria-label="Drafts"
        className="flex flex-col gap-6 rounded-[16px] border border-admin-banner-border bg-white py-5 pr-5 pl-6"
      >
        {drafts.length > 0 && (
          <div className={cardGrid}>
            {drafts.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-[3px]">
            <p className="text-[16px] font-semibold text-admin-text">
              {liveCount} {liveCount === 1 ? "tour" : "tours"} live on your landing page
            </p>
            <p className="text-[12px] text-admin-subtle">
              Last synced 2h ago · {draftCount} {draftCount === 1 ? "draft" : "drafts"} not yet published
            </p>
          </div>
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="rounded-[10px] bg-admin-orange px-4 py-[11px] text-[13.5px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-admin-orange-deep"
          >
            Preview site →
          </Link>
        </div>
      </section>

      {published.length > 0 ? (
        <section aria-label="Published events" className={cardGrid}>
          {published.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </section>
      ) : (
        <p className="py-10 text-center text-[13.5px] text-admin-subtle">
          {search ? "No events match your search." : "No published events yet."}
        </p>
      )}
    </AdminPage>
  );
}
