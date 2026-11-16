import { Plus, Trash } from "lucide-react";
import { AdminButton, IconButton } from "@/components/admin/ui/AdminButton";
import { MAX_HIGHLIGHTS } from "@/components/admin/listings/listingMapping";

interface HighlightsEditorProps {
  highlights: string[];
  onChange: (highlights: string[]) => void;
}

const inputClass =
  "h-[42px] min-w-0 flex-1 rounded-[10px] border border-admin-border bg-admin-field px-[13px] font-admin text-[14px] text-admin-text outline-none placeholder:text-admin-subtle focus:border-admin-orange-line-strong focus:ring-2 focus:ring-admin-orange-soft";

export function HighlightsEditor({ highlights, onChange }: HighlightsEditorProps) {
  const update = (index: number, label: string) => {
    onChange(highlights.map((highlight, position) => (position === index ? label : highlight)));
  };

  const remove = (index: number) => {
    onChange(highlights.filter((_, position) => position !== index));
  };

  return (
    <section aria-labelledby="highlights-heading" className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p id="highlights-heading" className="text-[12.5px] font-medium text-admin-subtle">
          Highlights
        </p>
        <p className="text-[12px] text-admin-placeholder">Up to {MAX_HIGHLIGHTS} · shown to travellers</p>
      </div>
      {highlights.map((highlight, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            aria-label={`Highlight ${index + 1}`}
            placeholder="e.g. Guided experience"
            value={highlight}
            onChange={(event) => update(index, event.target.value)}
            className={inputClass}
          />
          <IconButton label={`Remove highlight ${index + 1}`} tone="dangerSoft" size="md" onClick={() => remove(index)}>
            <Trash size={16} strokeWidth={1.85} absoluteStrokeWidth />
          </IconButton>
        </div>
      ))}
      {highlights.length < MAX_HIGHLIGHTS && (
        <AdminButton
          variant="dashed"
          className="w-full gap-[7px] py-[10px] text-[13.5px]"
          onClick={() => onChange([...highlights, ""])}
        >
          <Plus size={15} strokeWidth={1.85} absoluteStrokeWidth />
          Add highlight
        </AdminButton>
      )}
    </section>
  );
}
