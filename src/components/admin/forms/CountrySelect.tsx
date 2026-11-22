import { NativeSelect } from "@/components/ui/NativeSelect";
import { ALL_COUNTRIES } from "@/data/countries";

interface CountrySelectProps {
  id?: string;
  value: string;
  onChange: (country: string) => void;
  required?: boolean;
  placeholder?: string;
}

const selectClass =
  "h-[42px] rounded-[10px] border border-admin-border bg-admin-field px-[13px] font-admin text-[14px] text-admin-text outline-none focus:border-admin-orange-line-strong focus:ring-2 focus:ring-admin-orange-soft";

export function CountrySelect({ id, value, onChange, required, placeholder = "Select a country…" }: CountrySelectProps) {
  const options = value && !ALL_COUNTRIES.includes(value) ? [value, ...ALL_COUNTRIES] : ALL_COUNTRIES;

  return (
    <NativeSelect
      id={id}
      required={required}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={selectClass}
    >
      <option value="">{placeholder}</option>
      {options.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </NativeSelect>
  );
}
