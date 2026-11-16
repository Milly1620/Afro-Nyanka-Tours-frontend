import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Field } from "@/components/admin/ui/Field";
import { Panel } from "@/components/admin/ui/Panel";
import { RadioOption } from "@/components/admin/ui/RadioOption";
import { DateField } from "@/components/admin/forms/DateField";
import type { PublishMode } from "@/components/admin/listings/listingMapping";
import { cn } from "@/lib/utils";

interface PublishingPanelProps {
  mode: PublishMode;
  publishOn: string;
  onModeChange: (mode: PublishMode) => void;
  onPublishOnChange: (value: string) => void;
  onSaveDraft: () => void;
  publishLabel: string;
  submitting: boolean;
  error: string | null;
  className?: string;
}

export function PublishingPanel({
  mode,
  publishOn,
  onModeChange,
  onPublishOnChange,
  onSaveDraft,
  publishLabel,
  submitting,
  error,
  className,
}: PublishingPanelProps) {
  return (
    <Panel className={cn("flex flex-col gap-[11px] px-5 py-4", className)}>
      <h2 className="text-[16px] font-medium text-admin-text">Publishing</h2>
      <RadioOption
        name="publish-mode"
        checked={mode === "now"}
        onSelect={() => onModeChange("now")}
        title="Publish now"
        description="Goes live on your landing page immediately"
      />
      <RadioOption
        name="publish-mode"
        checked={mode === "schedule"}
        onSelect={() => onModeChange("schedule")}
        title="Schedule for later"
        description="Goes live by itself at the time you choose"
      />
      <Field label="Publish on">
        {(id) => (
          <DateField
            id={id}
            type="datetime-local"
            value={publishOn}
            disabled={mode !== "schedule"}
            onChange={onPublishOnChange}
            textClassName="text-admin-text-2"
          />
        )}
      </Field>
      <div className="h-px w-full bg-admin-divider-plain" />
      {error && (
        <p role="alert" className="text-[12.5px] font-medium text-admin-danger">
          {error}
        </p>
      )}
      <div className="flex gap-[10px]">
        <AdminButton variant="secondary" size="lg" className="flex-1" onClick={onSaveDraft} disabled={submitting}>
          Save as draft
        </AdminButton>
        <AdminButton type="submit" size="lg" className="flex-1" disabled={submitting}>
          {submitting ? "Saving..." : mode === "schedule" ? "Schedule" : publishLabel}
        </AdminButton>
      </div>
    </Panel>
  );
}
