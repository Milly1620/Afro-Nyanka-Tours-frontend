import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Field } from "@/components/admin/ui/Field";
import { Panel } from "@/components/admin/ui/Panel";
import { RadioOption } from "@/components/admin/ui/RadioOption";
import { DateField } from "@/components/admin/forms/DateField";
import { cn } from "@/lib/utils";
import type { PublishMode } from "@/types/admin";

interface PublishingPanelProps {
  mode: PublishMode;
  publishOn: string;
  onModeChange: (mode: PublishMode) => void;
  onPublishOnChange: (value: string) => void;
  onSaveDraft: () => void;
  publishLabel: string;
  canSubmit: boolean;
  className?: string;
}

export function PublishingPanel({
  mode,
  publishOn,
  onModeChange,
  onPublishOnChange,
  onSaveDraft,
  publishLabel,
  canSubmit,
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
        description="Choose a future date and time"
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
      <div className="flex gap-[10px]">
        <AdminButton variant="secondary" size="lg" className="flex-1" onClick={onSaveDraft} disabled={!canSubmit}>
          Save as draft
        </AdminButton>
        <AdminButton type="submit" size="lg" className="flex-1" disabled={!canSubmit}>
          {mode === "schedule" ? "Schedule" : publishLabel}
        </AdminButton>
      </div>
    </Panel>
  );
}
