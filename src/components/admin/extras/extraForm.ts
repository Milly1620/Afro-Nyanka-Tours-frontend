import type { AdminExtra, ExtraInput } from "@/types/api";

export interface ExtraFormValues {
  name: string;
  description: string;
  price: string;
}

export const emptyExtraForm: ExtraFormValues = { name: "", description: "", price: "" };

export function formFromExtra(extra: AdminExtra): ExtraFormValues {
  return {
    name: extra.name,
    description: extra.description ?? "",
    price: String(extra.default_price_ghs),
  };
}

export function parseWholeCedi(value: string): number | null {
  const trimmed = value.trim().replace(/,/g, "");
  if (!/^\d+$/.test(trimmed)) return null;
  return Number(trimmed);
}

export function validateExtraForm(values: ExtraFormValues): string | null {
  if (!values.name.trim()) return "Enter a name for the extra.";
  if (parseWholeCedi(values.price) === null) return "Price must be a whole number of cedis.";
  return null;
}

export function toExtraInput(values: ExtraFormValues): ExtraInput {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    default_price_ghs: parseWholeCedi(values.price) ?? 0,
  };
}
