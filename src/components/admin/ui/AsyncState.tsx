import type { ReactNode } from "react";

interface AsyncStateProps {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  children: ReactNode;
}

export function AsyncState({ loading, error, onRetry, children }: AsyncStateProps) {
  if (error) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 rounded-[16px] border border-admin-border bg-white px-5 py-10 text-center">
        <p className="text-[14px] font-medium text-admin-danger">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-[10px] border border-admin-border bg-white px-4 py-2 text-[13px] font-semibold text-admin-text-2 hover:bg-admin-field"
        >
          Try again
        </button>
      </div>
    );
  }
  if (loading) {
    return (
      <p role="status" className="px-5 py-10 text-center text-[13.5px] text-admin-subtle">
        Loading…
      </p>
    );
  }
  return <>{children}</>;
}
