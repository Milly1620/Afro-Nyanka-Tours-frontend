import { X } from "lucide-react";
import { CountrySelect } from "@/components/admin/forms/CountrySelect";

interface CountriesFieldProps {
  id?: string;
  value: string[];
  onChange: (countries: string[]) => void;
}

export function CountriesField({ id, value, onChange }: CountriesFieldProps) {
  const add = (country: string) => {
    if (!country) return;
    if (value.some((existing) => existing.toLowerCase() === country.toLowerCase())) return;
    onChange([...value, country]);
  };

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((country) => (
            <li
              key={country}
              className="flex items-center gap-[6px] rounded-full bg-admin-orange-soft px-3 py-1 text-[13px] font-medium text-admin-text"
            >
              {country}
              <button
                type="button"
                aria-label={`Remove ${country}`}
                onClick={() => onChange(value.filter((existing) => existing !== country))}
                className="flex cursor-pointer items-center text-admin-text-2 hover:text-admin-danger"
              >
                <X size={13} strokeWidth={1.85} absoluteStrokeWidth />
              </button>
            </li>
          ))}
        </ul>
      )}
      <CountrySelect id={id} value="" onChange={add} placeholder={value.length ? "Add another country…" : "Select a country…"} />
    </div>
  );
}
