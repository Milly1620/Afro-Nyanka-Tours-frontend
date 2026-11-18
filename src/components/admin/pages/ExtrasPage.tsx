import { useMemo, useState, type FormEvent } from "react";
import { Pencil } from "lucide-react";
import { AdminPage } from "@/components/admin/layout/AdminPage";
import { AdminButton, IconButton } from "@/components/admin/ui/AdminButton";
import { AsyncState } from "@/components/admin/ui/AsyncState";
import { Field, TextArea, TextInput } from "@/components/admin/ui/Field";
import { Panel, PanelHeading } from "@/components/admin/ui/Panel";
import { Toggle } from "@/components/admin/ui/Toggle";
import {
  emptyExtraForm,
  formFromExtra,
  toExtraInput,
  validateExtraForm,
  type ExtraFormValues,
} from "@/components/admin/extras/extraForm";
import { useResource } from "@/hooks/useResource";
import { formatGhs } from "@/lib/adminFormat";
import { toast } from "@/lib/toast";
import { adminExtrasApi } from "@/services/adminApi";
import { getErrorMessage } from "@/services/api";
import type { AdminExtra } from "@/types/api";

export function ExtrasPage() {
  const extras = useResource(() => adminExtrasApi.list({ limit: 200 }));
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AdminExtra | null>(null);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const items = extras.data?.items ?? [];
    if (!query) return items;
    return items.filter((extra) =>
      [extra.name, extra.description ?? ""].some((field) => field.toLowerCase().includes(query)),
    );
  }, [extras.data, search]);

  const toggleActive = async (extra: AdminExtra, isActive: boolean) => {
    try {
      await adminExtrasApi.update(extra.id, { is_active: isActive });
      toast.success(`${extra.name} ${isActive ? "is now visible to customers" : "is now hidden from customers"}`);
      extras.reload();
    } catch (reason) {
      toast.error(getErrorMessage(reason, "We couldn't update this extra."));
    }
  };

  return (
    <AdminPage
      title="Extras"
      subtitle="Paid add-ons customers can attach to a tour or event"
      search={search}
      onSearchChange={setSearch}
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <AsyncState loading={extras.loading} error={extras.error} onRetry={extras.reload}>
            <Panel>
              <ul aria-label="Extras catalog">
                {visible.map((extra) => (
                  <li
                    key={extra.id}
                    className="flex items-center gap-4 border-b border-admin-divider px-5 py-4 last:border-b-0"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                      <span className="truncate text-[14.5px] font-semibold text-admin-text">{extra.name}</span>
                      {extra.description && (
                        <span className="truncate text-[12px] text-admin-subtle">{extra.description}</span>
                      )}
                      <span className="text-[12px] text-admin-subtle">
                        {extra.is_active ? "Visible to customers" : "Hidden from customers"}
                      </span>
                    </div>
                    <span className="text-[14px] font-bold text-admin-text">{formatGhs(extra.default_price_ghs)}</span>
                    <Toggle
                      label={`${extra.name} active`}
                      checked={extra.is_active}
                      onChange={(isActive) => toggleActive(extra, isActive)}
                    />
                    <IconButton label={`Edit ${extra.name}`} onClick={() => setEditing(extra)}>
                      <Pencil size={15} strokeWidth={1.85} absoluteStrokeWidth />
                    </IconButton>
                  </li>
                ))}
              </ul>
              {visible.length === 0 && (
                <p className="px-5 py-10 text-center text-[13.5px] text-admin-subtle">
                  {search ? "No extras match your search." : "No extras yet. Create the first one."}
                </p>
              )}
            </Panel>
          </AsyncState>
        </div>

        <ExtraEditor
          key={editing?.id ?? "new"}
          extra={editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            extras.reload();
          }}
        />
      </div>
    </AdminPage>
  );
}

interface ExtraEditorProps {
  extra: AdminExtra | null;
  onCancel: () => void;
  onSaved: () => void;
}

function ExtraEditor({ extra, onCancel, onSaved }: ExtraEditorProps) {
  const [values, setValues] = useState<ExtraFormValues>(extra ? formFromExtra(extra) : emptyExtraForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const problem = validateExtraForm(values);
    if (problem) {
      setError(problem);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const input = toExtraInput(values);
      if (extra) {
        await adminExtrasApi.update(extra.id, input);
        toast.success(`${input.name} updated`);
      } else {
        await adminExtrasApi.create(input);
        toast.success(`${input.name} created`);
      }
      onSaved();
    } catch (reason) {
      toast.error(getErrorMessage(reason, "We couldn't save this extra."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Panel className="w-full p-[22px] xl:w-[400px] xl:shrink-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
        <PanelHeading
          title={extra ? "Edit extra" : "New extra"}
          subtitle="The catalog price is the default; each tour or event can override it"
        />
        <Field label="Name">
          {(id) => (
            <TextInput
              id={id}
              value={values.name}
              onChange={(event) => setValues({ ...values, name: event.target.value })}
            />
          )}
        </Field>
        <Field label="Description">
          {(id) => (
            <TextArea
              id={id}
              rows={2}
              value={values.description}
              onChange={(event) => setValues({ ...values, description: event.target.value })}
            />
          )}
        </Field>
        <Field label="Default price (GHS)">
          {(id) => (
            <TextInput
              id={id}
              inputMode="numeric"
              value={values.price}
              onChange={(event) => setValues({ ...values, price: event.target.value })}
            />
          )}
        </Field>
        {error && (
          <p role="alert" className="text-[12.5px] font-medium text-admin-danger">
            {error}
          </p>
        )}
        <div className="flex gap-[10px]">
          {extra && (
            <AdminButton variant="secondary" size="lg" className="flex-1" onClick={onCancel}>
              Cancel
            </AdminButton>
          )}
          <AdminButton type="submit" size="lg" className="flex-1" disabled={submitting}>
            {submitting ? "Saving..." : extra ? "Save changes" : "Create extra"}
          </AdminButton>
        </div>
      </form>
    </Panel>
  );
}
