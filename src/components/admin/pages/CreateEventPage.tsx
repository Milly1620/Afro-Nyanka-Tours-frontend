import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Eye } from "lucide-react";
import { AdminPage } from "@/components/admin/layout/AdminPage";
import { CoverImageField } from "@/components/admin/forms/CoverImageField";
import { HighlightsEditor } from "@/components/admin/forms/HighlightsEditor";
import { ListingDetailsFields } from "@/components/admin/forms/ListingDetailsFields";
import { PublishingPanel } from "@/components/admin/forms/PublishingPanel";
import { ExtrasEditor } from "@/components/admin/listings/ExtrasEditor";
import { GalleryField } from "@/components/admin/listings/GalleryField";
import { StopsEditor } from "@/components/admin/listings/StopsEditor";
import { draftFromEvent, eventInputFromDraft } from "@/components/admin/listings/listingMapping";
import { useListingEditor } from "@/components/admin/listings/useListingEditor";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AsyncState } from "@/components/admin/ui/AsyncState";
import { BackLink } from "@/components/admin/ui/BackLink";
import { Divider, Panel, SectionEyebrow } from "@/components/admin/ui/Panel";
import { DraftBadge, PublishChip } from "@/components/admin/ui/StatusChip";
import { loadEventDraft, resetEventDraft, updateEventDraft } from "@/listingDraftSlice";
import { useResource } from "@/hooks/useResource";
import { adminEventsApi, adminExtrasApi, adminLocationsApi } from "@/services/adminApi";
import { useAppDispatch, useAppSelector } from "@/store";
import type { Location } from "@/types/api";

export function CreateEventPage() {
  const { eventId } = useParams();
  const id = eventId ? Number(eventId) : null;
  const draft = useAppSelector((state) => state.listingDraft.eventDraft);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const warnings = (location.state as { warnings?: string[] } | null)?.warnings ?? [];
  const [ready, setReady] = useState(false);
  const [createdLocations, setCreatedLocations] = useState<Location[]>([]);

  const event = useResource(() => (id === null ? Promise.resolve(null) : adminEventsApi.get(id)), [id]);
  const catalog = useResource(() => adminExtrasApi.list({ limit: 200 }), []);
  const locations = useResource(() => adminLocationsApi.list(), []);
  const allLocations = [...(locations.data ?? []), ...createdLocations];

  useEffect(() => {
    if (id !== null) {
      setReady(false);
      return;
    }
    dispatch(resetEventDraft());
    setReady(true);
  }, [id, dispatch]);

  useEffect(() => {
    if (id === null || !event.data || event.data.id !== id) return;
    dispatch(loadEventDraft(draftFromEvent(event.data)));
    setReady(true);
  }, [id, event.data, dispatch]);

  const loadedEvent = id !== null && event.data?.id === id ? event.data : null;

  const editor = useListingEditor({
    kind: "event",
    api: adminEventsApi,
    id,
    draft,
    existingExtras: loadedEvent?.extras ?? [],
    catalog: catalog.data?.items ?? [],
    minimumCapacity: loadedEvent?.seats_booked ?? 0,
    buildInput: eventInputFromDraft,
    listPath: "/admin/events",
    editPath: (savedId) => `/admin/events/${savedId}/edit`,
    onFollowUpFailure: event.reload,
  });

  const change = (changes: Partial<typeof draft>) => dispatch(updateEventDraft(changes));

  const handleSubmit = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    void editor.save("publish");
  };

  const visibleGallery = draft.galleryImages.filter((url) => !editor.removedGalleryImages.includes(url));

  return (
    <AdminPage
      title={id !== null ? "Edit event" : "Create event"}
      subtitle={id !== null ? "Update this event, its extras and images" : "Add a fixed-date event travellers can book"}
      contentClassName="py-6"
    >
      <div className="flex items-center justify-between gap-3">
        <BackLink to="/admin/events" label="Events" className="text-[12px] font-normal" />
        {loadedEvent ? (
          <PublishChip status={loadedEvent.status} withDot />
        ) : (
          id === null && <DraftBadge label="Not saved yet" className="text-[14px]" />
        )}
      </div>

      {warnings.length > 0 && (
        <p role="alert" className="rounded-[12px] bg-admin-danger-bg px-4 py-3 text-[13px] font-medium text-admin-danger">
          Saved, but some changes did not apply. {warnings.join(" ")}
        </p>
      )}

      <AsyncState
        loading={id !== null && (event.loading || !ready)}
        error={id !== null ? event.error : null}
        onRetry={event.reload}
      >
        {ready && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 xl:flex-row xl:items-start">
            <Panel className="flex min-w-0 flex-1 flex-col gap-[15px] px-6 pt-[22px] pb-6">
              <SectionEyebrow tone="muted">EVENT DETAILS</SectionEyebrow>
              <ListingDetailsFields kind="event" draft={draft} onChange={change} />
              <Divider />
              <HighlightsEditor highlights={draft.highlights} onChange={(highlights) => change({ highlights })} />
              <Divider />
              <AsyncState loading={locations.loading} error={locations.error} onRetry={locations.reload}>
                <StopsEditor
                  locations={allLocations}
                  value={draft.locationIds}
                  defaultCountry={draft.country}
                  onChange={(locationIds) => change({ locationIds })}
                  onCreateLocation={async (input) => {
                    const created = await adminLocationsApi.create(input);
                    setCreatedLocations((current) => [...current, created]);
                    return created;
                  }}
                />
              </AsyncState>
              <Divider />
              <AsyncState loading={catalog.loading} error={catalog.error} onRetry={catalog.reload}>
                <ExtrasEditor
                  catalog={catalog.data?.items ?? []}
                  value={draft.extras}
                  onChange={(extras) => change({ extras })}
                />
              </AsyncState>
              <Divider />
              <CoverImageField
                value={draft.coverImage}
                onSelect={(file, coverImage) => {
                  editor.selectMainImage(file);
                  change({ coverImage });
                }}
              />
              <GalleryField
                existing={visibleGallery}
                pending={editor.galleryFiles}
                onRemoveExisting={editor.removeExistingGallery}
                onAddFiles={editor.addGalleryFiles}
                onRemovePending={editor.removePendingGallery}
              />
            </Panel>

            <div className="flex w-full flex-col gap-5 xl:w-[384px] xl:shrink-0">
              <Panel className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-admin-orange-soft text-admin-orange">
                    <Eye size={20} strokeWidth={1.85} absoluteStrokeWidth />
                  </span>
                  <div className="flex flex-col gap-[2px]">
                    <h2 className="text-[16px] font-medium text-admin-text">Preview</h2>
                    <p className="text-[12px] text-admin-subtle">Based on your current edits</p>
                  </div>
                </div>
                <p className="text-[14px] leading-[1.4] text-admin-text-2">
                  See how this event appears on your landing page before you publish it.
                </p>
                <AdminButton variant="tinted" className="w-full py-3" onClick={() => navigate("/admin/events/preview")}>
                  <Eye size={17} strokeWidth={1.85} absoluteStrokeWidth />
                  Open preview
                  <ArrowRight size={15} strokeWidth={1.85} absoluteStrokeWidth />
                </AdminButton>
              </Panel>

              <PublishingPanel
                mode={draft.publishMode}
                publishOn={draft.publishOn}
                onModeChange={(publishMode) => change({ publishMode })}
                onPublishOnChange={(publishOn) => change({ publishOn })}
                onSaveDraft={() => void editor.save("draft")}
                publishLabel={id !== null ? "Save event" : "Publish"}
                submitting={editor.submitting}
                error={editor.error}
              />
            </div>
          </form>
        )}
      </AsyncState>
    </AdminPage>
  );
}
