import { SectionEyebrow } from "@/components/admin/ui/Panel";
import type { DraftExtra } from "@/components/admin/listings/listingMapping";
import { formatExtraPrice } from "@/lib/adminFormat";
import type { AdminExtra } from "@/types/api";

interface ExtrasEditorProps {
  catalog: AdminExtra[];
  value: DraftExtra[];
  onChange: (extras: DraftExtra[]) => void;
}

export function ExtrasEditor({ catalog, value, onChange }: ExtrasEditorProps) {
  const attached = new Map(value.map((extra) => [extra.extraId, extra]));
  const visible = catalog.filter((extra) => extra.is_active || attached.has(extra.id));

  const toggle = (extra: AdminExtra, checked: boolean) => {
    if (checked) {
      onChange([...value, { extraId: extra.id, price: String(extra.default_price_ghs) }]);
      return;
    }
    onChange(value.filter((item) => item.extraId !== extra.id));
  };

  const setPrice = (extraId: number, price: string) => {
    onChange(value.map((item) => (item.extraId === extraId ? { ...item, price } : item)));
  };

  return (
    <section aria-labelledby="extras-heading" className="flex flex-col gap-[10px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionEyebrow>
          <span id="extras-heading">EXTRAS</span>
        </SectionEyebrow>
        <p className="text-[12px] font-medium text-admin-placeholder">Paid add-ons travellers can pick when booking</p>
      </div>
      {visible.length === 0 && (
        <p className="text-[13px] text-admin-subtle">No extras in your catalogue yet. Create them on the Extras page.</p>
      )}
      {visible.map((extra) => {
        const current = attached.get(extra.id);
        return (
          <div
            key={extra.id}
            className="flex flex-wrap items-center gap-[10px] rounded-[10px] border border-admin-border bg-admin-field px-3 py-2"
          >
            <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-[10px]">
              <input
                type="checkbox"
                checked={Boolean(current)}
                onChange={(event) => toggle(extra, event.target.checked)}
                className="size-4 accent-admin-orange"
              />
              <span className="min-w-0 flex-1 truncate text-[14px] text-admin-text">
                {extra.name}
                {!extra.is_active && <span className="text-admin-subtle"> (inactive)</span>}
                <span className="text-admin-subtle"> · catalogue {formatExtraPrice(extra.default_price_ghs)}</span>
              </span>
            </label>
            {current && (
              <input
                aria-label={`${extra.name} price for this listing`}
                inputMode="numeric"
                placeholder="GHS"
                value={current.price}
                onChange={(event) => setPrice(extra.id, event.target.value)}
                className="h-[38px] w-[110px] rounded-[10px] border border-admin-border bg-white px-[13px] font-admin text-[14px] text-admin-text outline-none focus:border-admin-orange-line-strong focus:ring-2 focus:ring-admin-orange-soft"
              />
            )}
          </div>
        );
      })}
    </section>
  );
}
