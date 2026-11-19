import { Check } from "lucide-react";
import { formatExtraPrice } from "@/lib/adminFormat";
import type { ListingExtra } from "@/types/api";

interface ExtrasPickerProps {
  extras: ListingExtra[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export function ExtrasPicker({ extras, selectedIds, onChange }: ExtrasPickerProps) {
  if (extras.length === 0) return null;

  const toggle = (id: number) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((value) => value !== id) : [...selectedIds, id]);
  };

  return (
    <fieldset className="space-y-3">
      <legend className="block text-sm font-medium text-gray-700 mb-2">Add extras</legend>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {extras.map((extra) => {
          const checked = selectedIds.includes(extra.extra_id);
          return (
            <li key={extra.extra_id}>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                  checked ? "border-[#FFA75D] bg-orange-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(extra.extra_id)}
                  className="peer sr-only"
                />
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border peer-focus-visible:outline-2 peer-focus-visible:outline-[#FFA75D] ${
                    checked ? "border-[#FFA75D] bg-[#FFA75D] text-white" : "border-gray-300 bg-white"
                  }`}
                >
                  {checked && <Check className="h-3 w-3" />}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex items-center justify-between gap-2 text-sm font-medium text-[#4A2C00]">
                    <span>{extra.name}</span>
                    <span className="shrink-0">{formatExtraPrice(extra.price_ghs)}</span>
                  </span>
                  {extra.description && <span className="text-xs text-gray-600">{extra.description}</span>}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
