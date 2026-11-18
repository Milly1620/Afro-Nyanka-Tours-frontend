import { useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Plus, Trash } from "lucide-react";
import { AdminButton, IconButton } from "@/components/admin/ui/AdminButton";
import { Field, TextInput } from "@/components/admin/ui/Field";
import { NativeSelect } from "@/components/ui/NativeSelect";
import { SectionEyebrow } from "@/components/admin/ui/Panel";
import { moveItem } from "@/components/admin/listings/listingMapping";
import { getErrorMessage } from "@/services/api";
import type { Location, LocationInput } from "@/types/api";

interface StopsEditorProps {
  locations: Location[];
  value: number[];
  defaultCountry: string;
  onChange: (locationIds: number[]) => void;
  onCreateLocation: (input: LocationInput) => Promise<Location>;
}

const selectClass =
  "h-[42px] rounded-[10px] border border-admin-border bg-admin-field px-[13px] font-admin text-[14px] text-admin-text outline-none focus:border-admin-orange-line-strong focus:ring-2 focus:ring-admin-orange-soft";

export function StopsEditor({ locations, value, defaultCountry, onChange, onCreateLocation }: StopsEditorProps) {
  const [choice, setChoice] = useState("");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [country, setCountry] = useState(defaultCountry);
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const byId = new Map(locations.map((location) => [location.id, location]));
  const available = locations.filter((location) => !value.includes(location.id));

  const addChoice = () => {
    if (!choice) return;
    onChange([...value, Number(choice)]);
    setChoice("");
  };

  const submitLocation = async (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!name.trim() || !country.trim()) {
      setError("Enter a name and country for the location.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const created = await onCreateLocation({
        name: name.trim(),
        country: country.trim(),
        region: region.trim(),
        description: description.trim(),
      });
      onChange([...value, created.id]);
      setName("");
      setRegion("");
      setDescription("");
      setCreating(false);
    } catch (reason) {
      setError(getErrorMessage(reason, "We couldn't add that location."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-labelledby="stops-heading" className="flex flex-col gap-[10px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionEyebrow>
          <span id="stops-heading">STOPS</span>
        </SectionEyebrow>
        <p className="text-[12px] font-medium text-admin-placeholder">Travellers choose from these stops when booking</p>
      </div>

      {value.length === 0 && <p className="text-[13px] text-admin-subtle">No stops added yet.</p>}
      <ol className="flex flex-col gap-2">
        {value.map((locationId, index) => {
          const location = byId.get(locationId);
          return (
            <li
              key={locationId}
              className="flex items-center gap-[10px] rounded-[10px] border border-admin-border bg-admin-field px-3 py-2"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-admin-orange-soft text-[12px] font-bold text-admin-orange">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-[14px] text-admin-text">
                {location ? location.name : `Location ${locationId}`}
                {location && <span className="text-admin-subtle"> · {location.country}</span>}
              </span>
              <IconButton
                label={`Move stop ${index + 1} up`}
                disabled={index === 0}
                onClick={() => onChange(moveItem(value, index, index - 1))}
              >
                <ArrowUp size={15} strokeWidth={1.85} absoluteStrokeWidth />
              </IconButton>
              <IconButton
                label={`Move stop ${index + 1} down`}
                disabled={index === value.length - 1}
                onClick={() => onChange(moveItem(value, index, index + 1))}
              >
                <ArrowDown size={15} strokeWidth={1.85} absoluteStrokeWidth />
              </IconButton>
              <IconButton
                label={`Remove stop ${index + 1}`}
                tone="dangerSoft"
                onClick={() => onChange(value.filter((id) => id !== locationId))}
              >
                <Trash size={15} strokeWidth={1.85} absoluteStrokeWidth />
              </IconButton>
            </li>
          );
        })}
      </ol>

      <div className="flex items-center gap-[10px]">
        <NativeSelect
          aria-label="Choose a stop"
          value={choice}
          onChange={(event) => setChoice(event.target.value)}
          wrapperClassName="min-w-0 flex-1"
          className={selectClass}
        >
          <option value="">Choose a location…</option>
          {available.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name} · {location.country}
            </option>
          ))}
        </NativeSelect>
        <AdminButton variant="secondary" onClick={addChoice} disabled={!choice}>
          Add stop
        </AdminButton>
      </div>

      {creating ? (
        <div className="flex flex-col gap-3 rounded-[12px] border border-admin-border p-3">
          <Field label="Location name">
            {(id) => <TextInput id={id} value={name} onChange={(event) => setName(event.target.value)} />}
          </Field>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Field label="Location country" className="flex-1">
              {(id) => <TextInput id={id} value={country} onChange={(event) => setCountry(event.target.value)} />}
            </Field>
            <Field label="Location region" className="flex-1">
              {(id) => <TextInput id={id} value={region} onChange={(event) => setRegion(event.target.value)} />}
            </Field>
          </div>
          <Field label="Location description">
            {(id) => <TextInput id={id} value={description} onChange={(event) => setDescription(event.target.value)} />}
          </Field>
          {error && (
            <p role="alert" className="text-[12.5px] font-medium text-admin-danger">
              {error}
            </p>
          )}
          <div className="flex gap-[10px]">
            <AdminButton variant="secondary" onClick={() => setCreating(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={submitLocation} disabled={saving}>
              {saving ? "Adding..." : "Create location"}
            </AdminButton>
          </div>
        </div>
      ) : (
        <AdminButton
          variant="dashed"
          className="w-full gap-[7px] py-[10px] text-[13.5px]"
          onClick={() => {
            setCountry(defaultCountry);
            setCreating(true);
          }}
        >
          <Plus size={15} strokeWidth={1.85} absoluteStrokeWidth />
          Add a new location
        </AdminButton>
      )}
    </section>
  );
}
