import { useNavigate } from "react-router-dom";
import { ChevronLeft, Eye } from "lucide-react";
import { FeaturedTripPreview } from "@/components/admin/FeaturedTripPreview";
import { useAppSelector } from "@/store";

export function EventPreviewPage() {
  const draft = useAppSelector((state) => state.listingDraft.eventDraft);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-admin-preview-bg font-admin">
      <header className="flex h-[60px] items-center justify-between border-b border-admin-border bg-white px-4 md:px-7">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex cursor-pointer items-center gap-2 text-[14px] font-semibold text-admin-text-2 hover:text-admin-text"
        >
          <ChevronLeft size={18} strokeWidth={1.85} absoluteStrokeWidth />
          Back to editor
        </button>
        <p className="flex items-center gap-[7px] text-[12px] text-admin-subtle">
          <Eye size={15} strokeWidth={1.85} absoluteStrokeWidth />
          Preview mode — changes are not published until you save
        </p>
      </header>

      <main className="flex flex-1 justify-center px-4 py-[52px]">
        <div className="flex w-full max-w-[1080px] flex-col gap-[18px]">
          <div className="flex flex-col gap-[5px]">
            <p className="text-[12px] font-bold tracking-[1.5px] text-admin-orange">YOUR LANDING PAGE</p>
            <h1 className="text-[18px] font-medium text-admin-text">Featured trip preview</h1>
          </div>
          <FeaturedTripPreview draft={draft} />
          <p className="flex items-center gap-[7px] text-[12px] text-admin-note">
            <Eye size={14} strokeWidth={1.85} absoluteStrokeWidth />
            This preview reflects your current edits. Visitors will not see them until you publish.
          </p>
        </div>
      </main>
    </div>
  );
}
