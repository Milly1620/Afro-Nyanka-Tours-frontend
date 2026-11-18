import { useEffect, useId, useRef } from "react";
import { Image } from "lucide-react";

interface CoverImageFieldProps {
  value: string | null;
  onSelect: (file: File, previewUrl: string) => void;
  className?: string;
}

export function CoverImageField({ value, onSelect, className }: CoverImageFieldProps) {
  const id = useId();
  const createdUrl = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (createdUrl.current) URL.revokeObjectURL(createdUrl.current);
    },
    [],
  );

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (createdUrl.current) URL.revokeObjectURL(createdUrl.current);
    createdUrl.current = URL.createObjectURL(file);
    onSelect(file, createdUrl.current);
  };

  return (
    <div className={`flex flex-col gap-[7px] ${className ?? ""}`}>
      <label htmlFor={id} className="text-[12.5px] font-medium text-admin-subtle">
        Cover image
      </label>
      <label
        htmlFor={id}
        className="flex h-[42px] cursor-pointer items-center gap-[10px] rounded-[10px] border border-admin-border bg-admin-field px-[14px] text-[14px] text-admin-text-2 focus-within:border-admin-orange-line-strong hover:border-admin-orange-line-strong"
      >
        {value ? <img src={value} alt="" className="h-7 w-10 shrink-0 rounded-[6px] object-cover" /> : null}
        <span className="min-w-0 flex-1 truncate">
          {value ? "Cover image selected · click to replace" : "Upload cover image · PNG or JPG"}
        </span>
        <Image size={17} strokeWidth={1.85} absoluteStrokeWidth className="shrink-0 text-admin-subtle" />
        <input
          id={id}
          type="file"
          accept="image/png,image/jpeg"
          className="sr-only"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </label>
    </div>
  );
}
