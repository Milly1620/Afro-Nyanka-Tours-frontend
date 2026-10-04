import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Pencil, Trash } from "lucide-react";
import { AdminPage } from "@/components/admin/layout/AdminPage";
import { IconButton } from "@/components/admin/ui/AdminButton";
import { CoverThumb } from "@/components/admin/ui/CoverImage";
import { FilterPills, type FilterOption } from "@/components/admin/ui/FilterPills";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { PublishChip } from "@/components/admin/ui/StatusChip";
import { deleteTour } from "@/adminSlice";
import { formatDays, formatGhs } from "@/lib/adminFormat";
import { useAppDispatch, useAppSelector } from "@/store";
import type { AdminTour, PublishStatus } from "@/types/admin";

type TourFilter = "all" | PublishStatus;

const columns = "grid grid-cols-[minmax(240px,1fr)_190px_120px_160px_140px_110px] items-center gap-4";

export function ToursPage() {
  const tours = useAppSelector((state) => state.admin.tours);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<TourFilter>("all");
  const [search, setSearch] = useState("");

  const filterOptions: FilterOption<TourFilter>[] = [
    { value: "all", label: "All", count: tours.length },
    { value: "published", label: "Published", count: tours.filter((tour) => tour.status === "published").length },
    { value: "draft", label: "Drafts", count: tours.filter((tour) => tour.status === "draft").length },
  ];

  const visibleTours = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tours.filter((tour) => {
      if (filter !== "all" && tour.status !== filter) return false;
      if (!query) return true;
      return [tour.name, tour.location].some((field) => field.toLowerCase().includes(query));
    });
  }, [tours, filter, search]);

  const handleDelete = (tour: AdminTour) => {
    if (window.confirm(`Delete "${tour.name}"? This cannot be undone.`)) {
      dispatch(deleteTour(tour.id));
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
          {visibleTours.map((tour) => (
            <div
              key={tour.id}
              role="row"
              className={`${columns} border-t border-admin-row-line px-[22px] py-[14px]`}
            >
              <span role="cell" className="flex min-w-0 items-center gap-[13px]">
                <CoverThumb src={tour.coverImage} alt={tour.name} />
                <span className="flex min-w-0 flex-col gap-[2px]">
                  <span className="truncate text-[14.5px] font-bold text-admin-text">{tour.name}</span>
                  <span className="text-[12px] font-medium text-admin-subtle">
                    {tour.activitiesCount} {tour.activitiesCount === 1 ? "activity" : "activities"}
                  </span>
                </span>
              </span>
              <span role="cell" className="flex items-center gap-[6px] text-[13.5px] font-medium text-admin-text-2">
                <MapPin size={14} strokeWidth={1.85} absoluteStrokeWidth className="shrink-0 text-admin-muted" />
                {tour.location}
              </span>
              <span role="cell" className="text-[13.5px] font-medium text-admin-text-2">
                {formatDays(tour.durationDays)}
              </span>
              <span role="cell" className="text-[13.5px] font-bold text-admin-text">
                {formatGhs(tour.price)}
              </span>
              <span role="cell">
                <PublishChip status={tour.status} withDot />
              </span>
              <span role="cell" className="flex items-center justify-end gap-[6px]">
                <IconButton label={`Edit ${tour.name}`} onClick={() => navigate(`/admin/tours/${tour.id}/edit`)}>
                  <Pencil size={15} strokeWidth={1.85} absoluteStrokeWidth />
                </IconButton>
                <IconButton label={`Delete ${tour.name}`} tone="danger" onClick={() => handleDelete(tour)}>
                  <Trash size={15} strokeWidth={1.85} absoluteStrokeWidth />
                </IconButton>
              </span>
            </div>
          ))}
          {visibleTours.length === 0 && (
            <p className="border-t border-admin-row-line px-5 py-10 text-center text-[13.5px] text-admin-subtle">
              No tours match your filters.
            </p>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
