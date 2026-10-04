import { useState } from "react";
import { Bed, Bus, ChevronDown, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Highlight, HighlightIcon } from "@/types/admin";

export const highlightIcons: Record<HighlightIcon, { icon: LucideIcon; label: string }> = {
  users: { icon: Users, label: "Group" },
  bed: { icon: Bed, label: "Accommodation" },
  bus: { icon: Bus, label: "Transport" },
};

interface HighlightsEditorProps {
  highlights: Highlight[];
  onChange: (highlights: Highlight[]) => void;
}

export function HighlightsEditor({ highlights, onChange }: HighlightsEditorProps) {
  const update = (id: string, changes: Partial<Highlight>) => {
    onChange(highlights.map((highlight) => (highlight.id === id ? { ...highlight, ...changes } : highlight)));
  };

  return (
    <section aria-labelledby="highlights-heading" className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p id="highlights-heading" className="text-[12.5px] font-medium text-admin-subtle">
          Highlights
        </p>
        <p className="text-[12px] text-admin-placeholder">Up to 3 · shown on the card</p>
      </div>
      {highlights.map((highlight, index) => (
        <div key={highlight.id} className="flex items-center gap-2">
          <IconPicker value={highlight.icon} onChange={(icon) => update(highlight.id, { icon })} />
          <input
            aria-label={`Highlight ${index + 1}`}
            value={highlight.label}
            onChange={(event) => update(highlight.id, { label: event.target.value })}
            className="h-[38px] min-w-0 flex-1 rounded-[10px] border border-admin-border bg-admin-field px-[14px] font-admin text-[14px] text-admin-text outline-none focus:border-admin-orange-line-strong focus:ring-2 focus:ring-admin-orange-soft"
          />
        </div>
      ))}
    </section>
  );
}

function IconPicker({ value, onChange }: { value: HighlightIcon; onChange: (icon: HighlightIcon) => void }) {
  const [open, setOpen] = useState(false);
  const Current = highlightIcons[value].icon;

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Highlight icon: ${highlightIcons[value].label}`}
        onClick={() => setOpen((isOpen) => !isOpen)}
        className="flex h-[38px] w-14 cursor-pointer items-center justify-center gap-[3px] rounded-[9px] border border-admin-orange-line bg-admin-orange-soft pr-2 pl-[10px] text-admin-orange"
      >
        <Current size={16} strokeWidth={1.85} absoluteStrokeWidth className="shrink-0" />
        <ChevronDown size={13} strokeWidth={1.85} absoluteStrokeWidth className="shrink-0 text-admin-chevron" />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Choose highlight icon"
          className="absolute top-[42px] left-0 z-10 flex flex-col gap-1 rounded-[10px] border border-admin-border bg-white p-1 shadow-[0px_4px_12px_0px_rgba(26,26,26,0.08)]"
        >
          {(Object.keys(highlightIcons) as HighlightIcon[]).map((key) => {
            const Option = highlightIcons[key].icon;
            return (
              <li key={key} role="option" aria-selected={key === value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2 rounded-[8px] px-[10px] py-2 text-[13px] whitespace-nowrap text-admin-text-2 hover:bg-admin-orange-soft",
                    key === value && "bg-admin-orange-soft text-admin-orange",
                  )}
                >
                  <Option size={16} strokeWidth={1.85} absoluteStrokeWidth className="text-admin-orange" />
                  {highlightIcons[key].label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
