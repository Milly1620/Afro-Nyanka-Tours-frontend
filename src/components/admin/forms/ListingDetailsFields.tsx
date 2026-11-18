import { Field, TextArea, TextInput } from "@/components/admin/ui/Field";
import { DateField } from "@/components/admin/forms/DateField";
import type { ListingDraft, ListingKind } from "@/components/admin/listings/listingMapping";
import { cn } from "@/lib/utils";

interface ListingDetailsFieldsProps {
  kind: ListingKind;
  draft: ListingDraft;
  onChange: (changes: Partial<ListingDraft>) => void;
  fieldClassName?: string;
}

export function ListingDetailsFields({ kind, draft, onChange, fieldClassName }: ListingDetailsFieldsProps) {
  const noun = kind === "event" ? "Event" : "Tour";

  return (
    <>
      <Field label={`${noun} name`} className={fieldClassName}>
        {(id) => (
          <TextInput id={id} required value={draft.name} onChange={(event) => onChange({ name: event.target.value })} />
        )}
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Field label="Country" className={cn("flex-1", fieldClassName)}>
          {(id) => (
            <TextInput
              id={id}
              required
              value={draft.country}
              onChange={(event) => onChange({ country: event.target.value })}
            />
          )}
        </Field>
        <Field label="Region" className={cn("flex-1", fieldClassName)}>
          {(id) => (
            <TextInput id={id} value={draft.region} onChange={(event) => onChange({ region: event.target.value })} />
          )}
        </Field>
      </div>

      {kind === "event" && (
        <>
          <Field label="Destination" className={fieldClassName}>
            {(id) => (
              <TextInput
                id={id}
                value={draft.destination}
                onChange={(event) => onChange({ destination: event.target.value })}
              />
            )}
          </Field>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Field label="Start date" className={cn("flex-1", fieldClassName)}>
              {(id) => (
                <DateField
                  id={id}
                  type="date"
                  value={draft.startDate}
                  onChange={(startDate) => onChange({ startDate })}
                />
              )}
            </Field>
            <Field label="End date" className={cn("flex-1", fieldClassName)}>
              {(id) => (
                <DateField id={id} type="date" value={draft.endDate} onChange={(endDate) => onChange({ endDate })} />
              )}
            </Field>
          </div>
        </>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Field label="Price per person (GHS)" className={cn("flex-1", fieldClassName)}>
          {(id) => (
            <TextInput
              id={id}
              inputMode="numeric"
              placeholder="Price on request"
              value={draft.price}
              onChange={(event) => onChange({ price: event.target.value })}
            />
          )}
        </Field>
        <Field label="Duration (days)" className={cn("sm:w-[140px]", fieldClassName)}>
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
        <Field label="Capacity" className={cn("sm:w-[140px]", fieldClassName)}>
          {(id) => (
            <TextInput
              id={id}
              type="number"
              min={1}
              inputMode="numeric"
              placeholder="No limit"
              value={draft.capacity}
              onChange={(event) => onChange({ capacity: event.target.value })}
            />
          )}
        </Field>
      </div>

      <Field label="Description" className={fieldClassName}>
        {(id) => (
          <TextArea
            id={id}
            rows={3}
            value={draft.description}
            onChange={(event) => onChange({ description: event.target.value })}
          />
        )}
      </Field>

      {kind === "tour" && (
        <label className="flex cursor-pointer items-center gap-[10px] text-[13.5px] font-medium text-admin-text-2">
          <input
            type="checkbox"
            checked={draft.isPopular}
            onChange={(event) => onChange({ isPopular: event.target.checked })}
            className="size-4 accent-admin-orange"
          />
          Feature as a popular tour
        </label>
      )}
    </>
  );
}
