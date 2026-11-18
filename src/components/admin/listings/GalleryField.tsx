import { useEffect, useId, useMemo } from "react";
import { Plus, X } from "lucide-react";

interface GalleryFieldProps {
  existing: string[];
  pending: File[];
  onRemoveExisting: (url: string) => void;
  onAddFiles: (files: File[]) => void;
  onRemovePending: (index: number) => void;
}

const tileClass = "relative size-[72px] shrink-0 overflow-hidden rounded-[10px] border border-admin-border";

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="absolute top-1 right-1 flex size-5 cursor-pointer items-center justify-center rounded-full bg-white/90 text-admin-text-2 hover:text-admin-danger"
    >
      <X size={12} strokeWidth={1.85} absoluteStrokeWidth />
    </button>
  );
}

export function GalleryField({ existing, pending, onRemoveExisting, onAddFiles, onRemovePending }: GalleryFieldProps) {
  const id = useId();
  const previews = useMemo(() => pending.map((file) => URL.createObjectURL(file)), [pending]);

  useEffect(
    () => () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    },
    [previews],
  );

  return (
    <div className="flex flex-col gap-[7px]">
      <label htmlFor={id} className="text-[12.5px] font-medium text-admin-subtle">
        Gallery images
      </label>
      <div className="flex flex-wrap gap-2">
        {existing.map((url) => (
          <div key={url} className={tileClass}>
            <img src={url} alt="" className="size-full object-cover" />
            <RemoveButton label="Remove gallery image" onClick={() => onRemoveExisting(url)} />
          </div>
        ))}
        {previews.map((url, index) => (
          <div key={url} className={tileClass}>
            <img src={url} alt="" className="size-full object-cover" />
            <RemoveButton label="Remove new gallery image" onClick={() => onRemovePending(index)} />
          </div>
        ))}
        <label
          htmlFor={id}
          className="flex size-[72px] cursor-pointer flex-col items-center justify-center gap-1 rounded-[10px] border border-dashed border-admin-border-dashed text-[11px] font-semibold text-admin-orange hover:bg-admin-orange-tint"
        >
          <Plus size={16} strokeWidth={1.85} absoluteStrokeWidth />
          Add
          <input
            id={id}
            type="file"
            multiple
            accept="image/png,image/jpeg"
            className="sr-only"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              if (files.length > 0) onAddFiles(files);
              event.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}
