import { AdminButton } from "@/components/admin/ui/AdminButton";
import { PAGE_SIZE } from "@/components/admin/listings/useStatusList";

interface PagerProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pager({ page, total, onChange }: PagerProps) {
  if (total <= PAGE_SIZE) return null;
  const first = page * PAGE_SIZE + 1;
  const last = Math.min((page + 1) * PAGE_SIZE, total);
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3">
      <p className="text-[12.5px] text-admin-subtle">
        {first}–{last} of {total}
      </p>
      <div className="flex gap-2">
        <AdminButton variant="secondary" size="sm" disabled={page === 0} onClick={() => onChange(page - 1)}>
          Previous
        </AdminButton>
        <AdminButton variant="secondary" size="sm" disabled={last >= total} onClick={() => onChange(page + 1)}>
          Next
        </AdminButton>
      </div>
    </nav>
  );
}
