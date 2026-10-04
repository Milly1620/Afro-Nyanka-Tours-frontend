import { Field, TextArea, TextInput } from "@/components/admin/ui/Field";
import { DateField } from "@/components/admin/forms/DateField";
import { cn } from "@/lib/utils";
import type { ListingDraft } from "@/types/admin";

interface ListingDetailsFieldsProps {
  draft: ListingDraft;
  onChange: (changes: Partial<ListingDraft>) => void;
  durationLabel: string;
  compactColumnClassName: string;
  fieldClassName?: string;
}

export function ListingDetailsFields({
  draft,
  onChange,
  durationLabel,
  compactColumnClassName,
  fieldClassName,
}: ListingDetailsFieldsProps) {
  return (
    <>
      <Field label="Tour name" className={fieldClassName}>
        {(id) => (
          <TextInput
            id={id}
            required
            value={draft.name}
            onChange={(event) => onChange({ name: event.target.value })}
          />
        )}
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Field label="Destination" className={cn("flex-1", fieldClassName)}>
          {(id) => (
            <TextInput
              id={id}
              required
              value={draft.destination}
              onChange={(event) => onChange({ destination: event.target.value })}
            />
          )}
        </Field>
        <div className="flex gap-3">
          <Field label={durationLabel} className={cn(compactColumnClassName, fieldClassName)}>
            {(id) => (
              <TextInput
                id={id}
                type="number"
                min={1}
                inputMode="numeric"
                value={draft.durationDays}
                onChange={(event) => onChange({ durationDays: event.target.value })}
              />
            )}
          </Field>
          <Field label="Capacity" className={cn(compactColumnClassName, fieldClassName)}>
            {(id) => (
              <TextInput
                id={id}
                type="number"
                min={1}
                inputMode="numeric"
                value={draft.capacity}
                onChange={(event) => onChange({ capacity: event.target.value })}
              />
            )}
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Field label="Price per person (GHS)" className={cn("flex-1", fieldClassName)}>
          {(id) => (
            <TextInput
              id={id}
              inputMode="decimal"
              value={draft.price}
              onChange={(event) => onChange({ price: event.target.value })}
            />
          )}
        </Field>
        <Field label="First departure" className={cn("sm:w-[170px]", fieldClassName)}>
          {(id) => (
            <DateField
              id={id}
              type="date"
              value={draft.firstDeparture}
              onChange={(firstDeparture) => onChange({ firstDeparture })}
            />
          )}
        </Field>
      </div>

      <Field label="Description" className={fieldClassName}>
        {(id) => (
          <TextArea
            id={id}
            rows={2}
            value={draft.description}
            onChange={(event) => onChange({ description: event.target.value })}
          />
        )}
      </Field>
    </>
  );
}
