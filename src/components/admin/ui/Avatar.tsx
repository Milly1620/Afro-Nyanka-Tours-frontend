import { cn } from "@/lib/utils";
import { initialsOf } from "@/lib/adminFormat";
import type { AvatarTone } from "@/types/admin";

const toneStyles: Record<AvatarTone, string> = {
  1: "bg-admin-avatar-1",
  2: "bg-admin-avatar-2",
  3: "bg-admin-avatar-3",
  4: "bg-admin-avatar-4",
  5: "bg-admin-avatar-5",
};

const sizeStyles = {
  30: "size-[30px]",
  36: "size-9",
  40: "size-10",
} as const;

interface AvatarProps {
  name: string;
  tone: AvatarTone;
  size?: keyof typeof sizeStyles;
  className?: string;
}

export function Avatar({ name, tone, size = 40, className }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white",
        toneStyles[tone],
        sizeStyles[size],
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  );
}
