import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye } from "lucide-react";
import { AdminPage } from "@/components/admin/layout/AdminPage";
import { ActivitiesEditor } from "@/components/admin/forms/ActivitiesEditor";
import { CoverImageField } from "@/components/admin/forms/CoverImageField";
import { HighlightsEditor } from "@/components/admin/forms/HighlightsEditor";
import { ListingDetailsFields } from "@/components/admin/forms/ListingDetailsFields";
import { PublishingPanel } from "@/components/admin/forms/PublishingPanel";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { BackLink } from "@/components/admin/ui/BackLink";
import { Divider, Panel, SectionEyebrow } from "@/components/admin/ui/Panel";
import { DraftBadge } from "@/components/admin/ui/StatusChip";
import { saveEventDraft, updateEventDraft } from "@/adminSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import type { ListingDraft, PublishStatus } from "@/types/admin";

export function CreateEventPage() {
  const draft = useAppSelector((state) => state.admin.eventDraft);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const change = (changes: Partial<ListingDraft>) => dispatch(updateEventDraft(changes));
  const canSubmit = Boolean(draft.name.trim() && draft.destination.trim());

  const save = (status: PublishStatus) => {
    if (!canSubmit) return;
    dispatch(saveEventDraft(status));
    navigate("/admin/events");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save("published");
  };

  return (
    <AdminPage title="Create event" subtitle="Add a new tour to your catalogue" contentClassName="py-6">
      <div className="flex items-center justify-between gap-3">
        <BackLink to="/admin/events" label="Events" className="text-[12px] font-normal" />
        <DraftBadge label="Draft — not published" className="text-[14px]" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <Panel className="flex min-w-0 flex-1 flex-col gap-[15px] px-6 pt-[22px] pb-6">
          <SectionEyebrow tone="muted">TOUR DETAILS</SectionEyebrow>
          <ListingDetailsFields
            draft={draft}
            onChange={change}
            durationLabel="Duration"
            compactColumnClassName="w-24"
          />
          <Divider />
          <HighlightsEditor highlights={draft.highlights} onChange={(highlights) => change({ highlights })} />
          <Divider />
          <ActivitiesEditor activities={draft.activities} onChange={(activities) => change({ activities })} />
          <Divider />
          <CoverImageField value={draft.coverImage} onChange={(coverImage) => change({ coverImage })} />
        </Panel>

        <div className="flex w-full flex-col gap-5 xl:w-[384px] xl:shrink-0">
          <Panel className="flex flex-col gap-3 p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-admin-orange-soft text-admin-orange">
                <Eye size={20} strokeWidth={1.85} absoluteStrokeWidth />
              </span>
              <div className="flex flex-col gap-[2px]">
                <h2 className="text-[16px] font-medium text-admin-text">Preview</h2>
                <p className="text-[12px] text-admin-subtle">Not visible to visitors yet</p>
              </div>
            </div>
            <p className="text-[14px] leading-[1.4] text-admin-text-2">
              See exactly how this tour appears on your landing page before you publish it.
            </p>
            <AdminButton
              variant="tinted"
              className="w-full py-3"
              onClick={() => navigate("/admin/events/preview")}
            >
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
            onSaveDraft={() => save("draft")}
            publishLabel="Publish"
            canSubmit={canSubmit}
          />
        </div>
      </form>
    </AdminPage>
  );
}
