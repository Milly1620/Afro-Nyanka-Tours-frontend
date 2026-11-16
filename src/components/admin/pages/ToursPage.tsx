import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Pencil, Trash } from "lucide-react";
import { AdminPage } from "@/components/admin/layout/AdminPage";
import { Pager } from "@/components/admin/listings/Pager";
import { useStatusList, type StatusFilter } from "@/components/admin/listings/useStatusList";
import { AdminButton, IconButton } from "@/components/admin/ui/AdminButton";
import { AsyncState } from "@/components/admin/ui/AsyncState";
import { CoverThumb } from "@/components/admin/ui/CoverImage";
import { FilterPills, type FilterOption } from "@/components/admin/ui/FilterPills";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { PublishChip } from "@/components/admin/ui/StatusChip";
import { formatDays, formatPrice } from "@/lib/adminFormat";
import { adminToursApi } from "@/services/adminApi";
import { getErrorMessage, getErrorStatus } from "@/services/api";
import type { AdminTour } from "@/types/api";

const columns = "grid grid-cols-[minmax(240px,1fr)_190px_120px_160px_140px_110px] items-center gap-4";

interface DeleteBlock {
  tour: AdminTour;
  message: string;
}

export function ToursPage() {
  const navigate = useNavigate();
  const { filter, setFilter, page, setPage, resource } = useStatusList(adminToursApi.list);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [blocked, setBlocked] = useState<DeleteBlock | null>(null);

  const counts = resource.data?.counts;
  const filterOptions: FilterOption<StatusFilter>[] = [
    { value: "all", label: "All", count: counts?.all },
    { value: "published", label: "Published", count: counts?.published },
    { value: "scheduled", label: "Scheduled", count: counts?.scheduled },
    { value: "draft", label: "Drafts", count: counts?.draft },
  ];

  const visibleTours = useMemo(() => {
    const query = search.trim().toLowerCase();
    const items = resource.data?.items ?? [];
    if (!query) return items;
    return items.filter((tour) =>
      [tour.name, tour.country, tour.region].some((field) => (field ?? "").toLowerCase().includes(query)),
    );
  }, [resource.data, search]);

  const handleDelete = async (tour: AdminTour) => {
    if (!window.confirm(`Delete "${tour.name}"? This cannot be undone.`)) return;
    setNotice(null);
    setBlocked(null);
    try {
      await adminToursApi.remove(tour.id);
      resource.reload();
    } catch (error) {
      const message = getErrorMessage(error, "We couldn't delete this tour.");
      if (getErrorStatus(error) === 409) setBlocked({ tour, message });
      else setNotice(message);
    }
  };

  const setToDraft = async (tour: AdminTour) => {
    try {
      await adminToursApi.update(tour.id, { status: "draft", publish_at: null });
      setBlocked(null);
      resource.reload();
    } catch (error) {
      setNotice(getErrorMessage(error, "We couldn't update this tour."));
    }
  };

  return (
    <AdminPage
      title="Tours"
      subtitle="Add and manage your landing-page tours"
      action={{ label: "New tour", to: "/admin/tours/new" }}
      search={search}
      onSearchChange={setSearch}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-bold text-admin-text">Tours on your landing page</h2>
        <p className="text-[13.5px] font-medium text-admin-subtle">
          Travellers browse these destinations. Add or edit them any time.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterPills
          label="Filter tours by status"
          variant="soft"
          options={filterOptions}
          value={filter}
          onChange={setFilter}
        />
        <SearchInput
          placeholder="Search tours"
          wrapperClassName="w-full bg-white px-[13px] sm:w-[240px]"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {notice && (
        <p role="alert" className="rounded-[12px] bg-admin-danger-bg px-4 py-3 text-[13px] font-medium text-admin-danger">
          {notice}
        </p>
      )}
      {blocked && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] bg-admin-danger-bg px-4 py-3 text-[13px] font-medium text-admin-danger"
        >
          <span>{blocked.message}</span>
          <AdminButton variant="secondary" size="sm" onClick={() => void setToDraft(blocked.tour)}>
            Set to draft
          </AdminButton>
        </div>
      )}

      <AsyncState loading={resource.loading && !resource.data} error={resource.error} onRetry={resource.reload}>
        <div className="overflow-x-auto rounded-[16px] border border-admin-border bg-white">
          <div role="table" aria-label="Tours" className="min-w-[1000px]">
            <div role="row" className={`${columns} bg-admin-thead px-[22px] py-[14px]`}>
              {["TOUR", "LOCATION", "DURATION", "PRICE", "STATUS"].map((heading) => (
                <span
                  key={heading}
                  role="columnheader"
                  className="text-[11px] font-bold tracking-[0.6px] text-admin-faint"
                >
                  {heading}
                </span>
              ))}
              <span role="columnheader" className="sr-only">
                Actions
              </span>
            </div>
            {visibleTours.map((tour) => {
              const stops = tour.tour_locations?.length ?? 0;
              return (
                <div
                  key={tour.id}
                  role="row"
                  className={`${columns} border-t border-admin-row-line px-[22px] py-[14px]`}
                >
                  <span role="cell" className="flex min-w-0 items-center gap-[13px]">
                    <CoverThumb src={tour.main_image_url} alt={tour.name} />
                    <span className="flex min-w-0 flex-col gap-[2px]">
                      <span className="truncate text-[14.5px] font-bold text-admin-text">{tour.name}</span>
                      <span className="text-[12px] font-medium text-admin-subtle">
                        {stops} {stops === 1 ? "stop" : "stops"}
                      </span>
                    </span>
                  </span>
                  <span
                    role="cell"
                    className="flex items-center gap-[6px] text-[13.5px] font-medium text-admin-text-2"
                  >
                    <MapPin size={14} strokeWidth={1.85} absoluteStrokeWidth className="shrink-0 text-admin-muted" />
                    {[tour.region, tour.country].filter(Boolean).join(", ")}
                  </span>
                  <span role="cell" className="text-[13.5px] font-medium text-admin-text-2">
                    {tour.duration_days ? formatDays(tour.duration_days) : "—"}
                  </span>
                  <span role="cell" className="text-[13.5px] font-bold text-admin-text">
                    {formatPrice(tour.price_ghs)}
                  </span>
                  <span role="cell">
                    <PublishChip status={tour.status} withDot />
                  </span>
                  <span role="cell" className="flex items-center justify-end gap-[6px]">
                    <IconButton label={`Edit ${tour.name}`} onClick={() => navigate(`/admin/tours/${tour.id}/edit`)}>
                      <Pencil size={15} strokeWidth={1.85} absoluteStrokeWidth />
                    </IconButton>
                    <IconButton label={`Delete ${tour.name}`} tone="danger" onClick={() => void handleDelete(tour)}>
                      <Trash size={15} strokeWidth={1.85} absoluteStrokeWidth />
                    </IconButton>
                  </span>
                </div>
              );
            })}
            {visibleTours.length === 0 && (
              <p className="border-t border-admin-row-line px-5 py-10 text-center text-[13.5px] text-admin-subtle">
                {search ? "No tours match your search." : "No tours here yet."}
              </p>
            )}
          </div>
        </div>
        <Pager page={page} total={counts?.[filter] ?? counts?.all ?? 0} onChange={setPage} />
      </AsyncState>
    </AdminPage>
  );
}
