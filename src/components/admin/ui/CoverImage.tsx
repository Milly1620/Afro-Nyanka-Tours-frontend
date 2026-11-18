import { Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoverImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function CoverImage({ src, alt, className }: CoverImageProps) {
  if (src) {
    return <img src={src} alt={alt} className={cn("h-[140px] w-full object-cover", className)} />;
  }
  return (
    <div
      role="img"
      aria-label={`${alt} (no cover image)`}
      className={cn("admin-cover-stripes flex h-[140px] w-full items-center justify-center", className)}
    >
      <Image size={26} strokeWidth={1.85} absoluteStrokeWidth className="text-admin-cover-icon" />
    </div>
  );
}

export function CoverThumb({ src, alt }: { src: string | null; alt: string }) {
  if (src) {
    return <img src={src} alt={alt} className="h-10 w-[52px] shrink-0 rounded-[8px] object-cover" />;
  }
  return <div aria-hidden className="admin-thumb-stripes h-10 w-[52px] shrink-0 rounded-[8px]" />;
}
