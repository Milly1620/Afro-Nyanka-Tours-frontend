import { Fragment, useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminPage } from "@/components/admin/layout/AdminPage";
import { CoverImageField } from "@/components/admin/forms/CoverImageField";
import { ListingDetailsFields } from "@/components/admin/forms/ListingDetailsFields";
import { PublishingPanel } from "@/components/admin/forms/PublishingPanel";
import { ExtrasEditor } from "@/components/admin/listings/ExtrasEditor";
import { GalleryField } from "@/components/admin/listings/GalleryField";
import { StopsEditor } from "@/components/admin/listings/StopsEditor";
import { draftFromTour, tourInputFromDraft } from "@/components/admin/listings/listingMapping";
import { useListingEditor } from "@/components/admin/listings/useListingEditor";
import { TourCardPreview } from "@/components/admin/TourCardPreview";
import { AsyncState } from "@/components/admin/ui/AsyncState";
import { BackLink } from "@/components/admin/ui/BackLink";
import { Divider, Panel, SectionEyebrow } from "@/components/admin/ui/Panel";
import { DraftBadge, PublishChip } from "@/components/admin/ui/StatusChip";
import { loadTourDraft, resetTourDraft, updateTourDraft } from "@/listingDraftSlice";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { useResource } from "@/hooks/useResource";
import { cn } from "@/lib/utils";
import { adminExtrasApi, adminLocationsApi, adminToursApi } from "@/services/adminApi";
import { useAppDispatch, useAppSelector } from "@/store";
import type { Location } from "@/types/api";

const steps = ["Tour details", "Activities & extras", "Publish"];

export function AddTourPage() {
  const { tourId } = useParams();
  const id = tourId ? Number(tourId) : null;
  const draft = useAppSelector((state) => state.listingDraft.tourDraft);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [createdLocations, setCreatedLocations] = useState<Location[]>([]);
  const detailsRef = useRef<HTMLElement>(null);
  const stopsRef = useRef<HTMLDivElement>(null);
  const publishRef = useRef<HTMLDivElement>(null);
  const stepTargets: RefObject<HTMLElement | null>[] = [detailsRef, stopsRef, publishRef];

  const tour = useResource(() => (id === null ? Promise.resolve(null) : adminToursApi.get(id)), [id]);
  const catalog = useResource(() => adminExtrasApi.list({ limit: 200 }), []);
  const locations = useResource(() => adminLocationsApi.list(), []);

  useEffect(() => {
    if (id !== null) {
      setReady(false);
      return;
    }
    dispatch(resetTourDraft());
    setReady(true);
  }, [id, dispatch]);

  useEffect(() => {
    if (id === null || !tour.data || tour.data.id !== id) return;
    dispatch(loadTourDraft(draftFromTour(tour.data)));
    setReady(true);
  }, [id, tour.data, dispatch]);

  const loadedTour = id !== null && tour.data?.id === id ? tour.data : null;

  const editor = useListingEditor({
    kind: "tour",
    api: adminToursApi,
    id,
    draft,
    existingExtras: loadedTour?.extras ?? [],
    catalog: catalog.data?.items ?? [],
    buildInput: tourInputFromDraft,
    listPath: "/admin/tours",
    editPath: (savedId) => `/admin/tours/${savedId}/edit`,
    onFollowUpFailure: tour.reload,
  });

  const coverPreview = useObjectUrl(editor.mainImage) ?? draft.coverImage;
  const change = (changes: Partial<typeof draft>) => dispatch(updateTourDraft(changes));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void editor.save("publish");
  };

  const goToStep = (index: number) => {
    setActiveStep(index);
    stepTargets[index].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const allLocations = [...(locations.data ?? []), ...createdLocations];
  const visibleGallery = draft.galleryImages.filter((url) => !editor.removedGalleryImages.includes(url));

  return (
    <AdminPage
      title={id !== null ? "Edit tour" : "Add tour"}
      subtitle={id !== null ? "Update this tour, its activities and extras" : "Create a tour with its activities and extras"}
      contentClassName="gap-[18px] py-[22px]"
    >
      <div className="flex items-center justify-between gap-3">
        <BackLink to="/admin/tours" label="Tours" />
        {loadedTour ? (
          <PublishChip status={loadedTour.status} withDot />
        ) : (
          id === null && <DraftBadge label="Not saved yet" className="text-[13px]" />
        )}
      </div>


      <AsyncState
        loading={id !== null && (tour.loading || !ready)}
        error={id !== null ? tour.error : null}
        onRetry={tour.reload}
      >
        {ready && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 xl:flex-row xl:items-start">
            <Panel className="flex min-w-0 flex-1 flex-col gap-[18px] rounded-[18px] px-[26px] pt-[22px] pb-6">
              <ol className="flex items-center">
                {steps.map((step, index) => (
                  <Fragment key={step}>
                    {index > 0 && (
                      <li aria-hidden className="flex flex-1 px-[14px]">
                        <span className="h-[2px] flex-1 rounded-[2px] bg-admin-step-line" />
                      </li>
                    )}
                    <li>
                      <button
                        type="button"
                        onClick={() => goToStep(index)}
                        aria-current={index === activeStep ? "step" : undefined}
                        className="flex cursor-pointer items-center gap-[9px]"
                      >
                        <span
                          className={cn(
                            "flex size-[26px] items-center justify-center rounded-full text-[12px] font-bold",
                            index <= activeStep ? "bg-admin-orange text-white" : "bg-admin-step-idle-bg text-admin-step-idle",
                          )}
                        >
                          {index + 1}
                        </span>
                        <span
                          className={cn(
                            "hidden text-[13.5px] font-bold whitespace-nowrap sm:inline",
                            index <= activeStep ? "text-admin-text" : "text-admin-step-idle",
                          )}
                        >
                          {step}
                        </span>
                      </button>
                    </li>
                  </Fragment>
                ))}
              </ol>
              <Divider />
              <section ref={detailsRef} aria-label="Tour details" className="flex scroll-mt-6 flex-col gap-3">
                <SectionEyebrow>TOUR DETAILS</SectionEyebrow>
                <ListingDetailsFields kind="tour" draft={draft} onChange={change} fieldClassName="gap-[6px]" />
              </section>
              <Divider />
              <div ref={stopsRef} className="flex scroll-mt-6 flex-col gap-[18px]">
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
              </div>
              <Divider />
              <CoverImageField
                value={coverPreview}
                onSelect={editor.selectMainImage}
                className="gap-[6px]"
              />
              <GalleryField
                existing={visibleGallery}
                pending={editor.galleryFiles}
                onRemoveExisting={editor.removeExistingGallery}
                onAddFiles={editor.addGalleryFiles}
                onRemovePending={editor.removePendingGallery}
              />
            </Panel>

            <div className="flex w-full flex-col gap-[18px] xl:w-[384px] xl:shrink-0">
              <section
                aria-label="Live preview"
                className="flex flex-col items-center gap-[10px] rounded-[18px] border border-admin-thead-border bg-admin-thead px-[18px] pt-4 pb-[18px]"
              >
                <p className="flex w-full items-center gap-[6px] text-[11px] font-bold tracking-[0.5px] text-admin-subtle">
                  <span className="size-[6px] rounded-[3px] bg-admin-orange" />
                  LIVE PREVIEW
                </p>
                <TourCardPreview draft={draft} coverImage={coverPreview} />
              </section>

              <div ref={publishRef} className="scroll-mt-6">
                <PublishingPanel
                  mode={draft.publishMode}
                  publishOn={draft.publishOn}
                  onModeChange={(publishMode) => change({ publishMode })}
                  onPublishOnChange={(publishOn) => change({ publishOn })}
                  onSaveDraft={() => void editor.save("draft")}
                  publishLabel={id !== null ? "Save tour" : "Publish tour"}
                  submitting={editor.submitting}
                  error={editor.error}
                  className="rounded-[18px] px-[18px] pt-4 pb-[18px]"
                />
              </div>
            </div>
          </form>
        )}
      </AsyncState>
    </AdminPage>
  );
}
