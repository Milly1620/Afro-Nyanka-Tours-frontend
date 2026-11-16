import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminPage } from "@/components/admin/layout/AdminPage";
import { EventCard } from "@/components/admin/EventCard";
import { Pager } from "@/components/admin/listings/Pager";
import { useStatusList, type StatusFilter } from "@/components/admin/listings/useStatusList";
import { AsyncState } from "@/components/admin/ui/AsyncState";
import { FilterPills, type FilterOption } from "@/components/admin/ui/FilterPills";
import { adminEventsApi } from "@/services/adminApi";
import { getErrorMessage } from "@/services/api";
import type { AdminEvent } from "@/types/api";

const cardGrid = "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3";

export function EventsPage() {
  const { filter, setFilter, page, setPage, resource } = useStatusList(adminEventsApi.list);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const counts = resource.data?.counts;
  const filterOptions: FilterOption<StatusFilter>[] = [
    { value: "all", label: "All", count: counts?.all },
    { value: "published", label: "Published", count: counts?.published },
    { value: "scheduled", label: "Scheduled", count: counts?.scheduled },
    { value: "draft", label: "Drafts", count: counts?.draft },
  ];

  const visibleEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    const items = resource.data?.items ?? [];
    if (!query) return items;
    return items.filter((event) =>
      [event.name, event.country, event.destination].some((field) => (field ?? "").toLowerCase().includes(query)),
    );
  }, [resource.data, search]);

  const handleDelete = async (event: AdminEvent) => {
    if (!window.confirm(`Delete "${event.name}"? This cannot be undone.`)) return;
    setNotice(null);
    try {
      await adminEventsApi.remove(event.id);
      resource.reload();
    } catch (error) {
      setNotice(getErrorMessage(error, "We couldn't delete this event."));
    }
  };

  const live = counts?.published ?? 0;
  const drafts = counts?.draft ?? 0;
  const scheduled = counts?.scheduled ?? 0;

  return (
    <AdminPage
      title="Events"
      subtitle="Fixed-date trips travellers can book"
      action={{ label: "New event", to: "/admin/events/new" }}
      search={search}
      onSearchChange={setSearch}
    >
      <section
        aria-label="Landing page status"
        className="flex flex-wrap items-start justify-between gap-3 rounded-[16px] border border-admin-banner-border bg-white py-5 pr-5 pl-6"
      >
        <div className="flex flex-col gap-[3px]">
          <p className="text-[16px] font-semibold text-admin-text">
            {live} {live === 1 ? "event" : "events"} live on your landing page
          </p>
          <p className="text-[12px] text-admin-subtle">
            {scheduled} scheduled · {drafts} {drafts === 1 ? "draft" : "drafts"} not yet published
          </p>
        </div>
        <Link
          to="/events"
          target="_blank"
          rel="noreferrer"
          className="rounded-[10px] bg-admin-orange px-4 py-[11px] text-[13.5px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-admin-orange-deep"
        >
          Preview site →
        </Link>
      </section>

      <FilterPills
        label="Filter events by status"
        variant="soft"
        options={filterOptions}
        value={filter}
        onChange={setFilter}
      />

      {notice && (
        <p role="alert" className="rounded-[12px] bg-admin-danger-bg px-4 py-3 text-[13px] font-medium text-admin-danger">
          {notice}
        </p>
      )}

      <AsyncState loading={resource.loading && !resource.data} error={resource.error} onRetry={resource.reload}>
        {visibleEvents.length > 0 ? (
          <section aria-label="Events" className={cardGrid}>
            {visibleEvents.map((event) => (
              <EventCard key={event.id} event={event} onDelete={(target) => void handleDelete(target)} />
            ))}
          </section>
        ) : (
          <p className="py-10 text-center text-[13.5px] text-admin-subtle">
            {search ? "No events match your search." : "No events here yet."}
          </p>
        )}
        <Pager page={page} total={counts?.[filter] ?? counts?.all ?? 0} onChange={setPage} />
      </AsyncState>
    </AdminPage>
  );
}
