import { Fragment, useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminPage } from "@/components/admin/layout/AdminPage";
import { ActivitiesEditor } from "@/components/admin/forms/ActivitiesEditor";
import { CoverImageField } from "@/components/admin/forms/CoverImageField";
import { ListingDetailsFields } from "@/components/admin/forms/ListingDetailsFields";
import { PublishingPanel } from "@/components/admin/forms/PublishingPanel";
import { TourCardPreview } from "@/components/admin/TourCardPreview";
import { BackLink } from "@/components/admin/ui/BackLink";
import { Divider, Panel, SectionEyebrow } from "@/components/admin/ui/Panel";
import { DraftBadge } from "@/components/admin/ui/StatusChip";
import { editTour, saveTourDraft, startNewTour, updateTourDraft } from "@/adminSlice";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import type { ListingDraft, PublishStatus } from "@/types/admin";

const steps = ["Tour details", "Activities", "Publish"];

export function AddTourPage() {
  const { tourId } = useParams();
  const draft = useAppSelector((state) => state.admin.tourDraft);
  const editingTourId = useAppSelector((state) => state.admin.editingTourId);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const detailsRef = useRef<HTMLElement>(null);
  const activitiesRef = useRef<HTMLDivElement>(null);
  const publishRef = useRef<HTMLDivElement>(null);
  const stepTargets: RefObject<HTMLElement | null>[] = [detailsRef, activitiesRef, publishRef];

  useEffect(() => {
    if (tourId && editingTourId !== tourId) dispatch(editTour(tourId));
    if (!tourId && editingTourId) dispatch(startNewTour());
  }, [tourId, editingTourId, dispatch]);

  const change = (changes: Partial<ListingDraft>) => dispatch(updateTourDraft(changes));
  const canSubmit = Boolean(draft.name.trim() && draft.destination.trim());

  const save = (status: PublishStatus) => {
    if (!canSubmit) return;
    dispatch(saveTourDraft(status));
    navigate("/admin/tours");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save("published");
  };

  const goToStep = (index: number) => {
    setActiveStep(index);
    stepTargets[index].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AdminPage
      title={tourId ? "Edit tour" : "Add tour"}
      subtitle={tourId ? "Update this tour and its activities" : "Create a tour and its activities"}
      contentClassName="gap-[18px] py-[22px]"
    >
      <div className="flex items-center justify-between gap-3">
        <BackLink to="/admin/tours" label="Tours" />
        <DraftBadge label="Draft — not saved" className="text-[13px]" />
      </div>

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
            <ListingDetailsFields
              draft={draft}
              onChange={change}
              durationLabel="Duration (days)"
              compactColumnClassName="w-[110px]"
              fieldClassName="gap-[6px]"
            />
          </section>
          <Divider />
          <div ref={activitiesRef} className="scroll-mt-6">
            <ActivitiesEditor activities={draft.activities} onChange={(activities) => change({ activities })} />
          </div>
          <Divider />
          <CoverImageField
            value={draft.coverImage}
            onChange={(coverImage) => change({ coverImage })}
            className="gap-[6px]"
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
            <TourCardPreview draft={draft} />
          </section>

          <div ref={publishRef} className="scroll-mt-6">
            <PublishingPanel
              mode={draft.publishMode}
              publishOn={draft.publishOn}
              onModeChange={(publishMode) => change({ publishMode })}
              onPublishOnChange={(publishOn) => change({ publishOn })}
              onSaveDraft={() => save("draft")}
              publishLabel={tourId ? "Save tour" : "Publish tour"}
              canSubmit={canSubmit}
              className="rounded-[18px] px-[18px] pt-4 pb-[18px]"
            />
          </div>
        </div>
      </form>
    </AdminPage>
  );
}
