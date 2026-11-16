import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { dismissToast, useToasts, type ToastKind } from "@/lib/toast";

const kindStyles: Record<ToastKind, { box: string; icon: string }> = {
  success: { box: "border-green-200 bg-green-50 text-green-900", icon: "text-green-600" },
  error: { box: "border-red-200 bg-red-50 text-red-900", icon: "text-red-600" },
  info: { box: "border-slate-200 bg-white text-slate-900", icon: "text-slate-500" },
};

const kindIcons = { success: CheckCircle2, error: XCircle, info: Info } as const;

export function Toaster() {
  const toasts = useToasts();

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:right-4 sm:w-[380px]"
    >
      {toasts.map((item) => {
        const styles = kindStyles[item.kind];
        const Icon = kindIcons[item.kind];
        return (
          <div
            key={item.id}
            role={item.kind === "error" ? "alert" : "status"}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg",
              styles.box,
            )}
          >
            <Icon size={18} strokeWidth={1.85} className={cn("mt-px shrink-0", styles.icon)} />
            <p className="min-w-0 flex-1 break-words">{item.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(item.id)}
              aria-label="Dismiss notification"
              className="shrink-0 cursor-pointer opacity-60 hover:opacity-100"
            >
              <X size={16} strokeWidth={1.85} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
