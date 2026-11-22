import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminPage } from "@/components/admin/layout/AdminPage";
import { EventCard } from "@/components/admin/EventCard";
import { Pager } from "@/components/admin/listings/Pager";
import { useStatusList, type StatusFilter } from "@/components/admin/listings/useStatusList";
import { AsyncState } from "@/components/admin/ui/AsyncState";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { FilterPills, type FilterOption } from "@/components/admin/ui/FilterPills";
import { toast } from "@/lib/toast";
import { adminEventsApi } from "@/services/adminApi";
import { getErrorMessage } from "@/services/api";
import type { AdminEvent } from "@/types/api";

const EVENT_COUNTRIES = ["Ghana", "Togo", "Benin", "Côte d'Ivoire", "Burkina Faso"];

const cardGrid = "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3";

export function EventsPage() {
  const [country, setCountry] = useState("all");
  const { filter, setFilter, page, setPage, resource } = useStatusList(
    adminEventsApi.list,
    country === "all" ? {} : { country: [country] },
    country,
  );
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<AdminEvent | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const event = pendingDelete;
    setDeleting(true);
    try {
      await adminEventsApi.remove(event.id);
      toast.success(`"${event.name}" deleted.`);
      resource.reload();
    } catch (error) {
      toast.error(getErrorMessage(error, "We couldn't delete this event."));
    } finally {
      setDeleting(false);
      setPendingDelete(null);
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

      <FilterPills
        label="Filter events by country"
        variant="soft"
        options={[{ value: "all", label: "All countries" }, ...EVENT_COUNTRIES.map((name) => ({ value: name, label: name }))]}
        value={country}
        onChange={(next) => {
          setCountry(next);
          setPage(0);
        }}
      />

      <AsyncState loading={resource.loading && !resource.data} error={resource.error} onRetry={resource.reload}>
        {visibleEvents.length > 0 ? (
          <section aria-label="Events" className={cardGrid}>
            {visibleEvents.map((event) => (
              <EventCard key={event.id} event={event} onDelete={setPendingDelete} />
            ))}
          </section>
        ) : (
          <p className="py-10 text-center text-[13.5px] text-admin-subtle">
            {search ? "No events match your search." : "No events here yet."}
          </p>
        )}
        <Pager page={page} total={counts?.[filter] ?? counts?.all ?? 0} onChange={setPage} />
      </AsyncState>
      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete event"
        message={
          <>
            Delete <strong>{pendingDelete?.name}</strong>? This cannot be undone.
          </>
        }
        confirmLabel="Delete event"
        loading={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminPage>
  );
}
