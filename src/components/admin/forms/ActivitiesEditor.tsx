import { Plus, Trash } from "lucide-react";
import { AdminButton, IconButton } from "@/components/admin/ui/AdminButton";
import { SectionEyebrow } from "@/components/admin/ui/Panel";
import type { ListingActivity } from "@/types/admin";

interface ActivitiesEditorProps {
  activities: ListingActivity[];
  onChange: (activities: ListingActivity[]) => void;
}

const inputClass =
  "h-[42px] rounded-[10px] border border-admin-border bg-admin-field px-[13px] font-admin text-[14px] text-admin-text outline-none placeholder:text-admin-subtle focus:border-admin-orange-line-strong focus:ring-2 focus:ring-admin-orange-soft";

export function ActivitiesEditor({ activities, onChange }: ActivitiesEditorProps) {
  const updateActivity = (id: string, changes: Partial<ListingActivity>) => {
    onChange(activities.map((activity) => (activity.id === id ? { ...activity, ...changes } : activity)));
  };

  const removeActivity = (id: string) => {
    onChange(activities.filter((activity) => activity.id !== id));
  };

  const addActivity = () => {
    onChange([...activities, { id: `a-${Date.now()}`, name: "", price: "" }]);
  };

  return (
    <section aria-labelledby="activities-heading" className="flex flex-col gap-[10px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionEyebrow>
          <span id="activities-heading">ACTIVITIES</span>
        </SectionEyebrow>
        <p className="text-[12px] font-medium text-admin-placeholder">Travellers can select these when booking</p>
      </div>
      <div aria-hidden className="flex gap-[10px] text-[11.5px] font-medium text-admin-placeholder">
        <span className="flex-1">ACTIVITY</span>
        <span className="w-[130px]">PRICE</span>
        <span className="w-[42px]" />
      </div>
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex items-center gap-[10px]">
          <input
            aria-label={`Activity ${index + 1} name`}
            placeholder="Activity name"
            value={activity.name}
            onChange={(event) => updateActivity(activity.id, { name: event.target.value })}
            className={`${inputClass} min-w-0 flex-1`}
          />
          <input
            aria-label={`Activity ${index + 1} price`}
            placeholder="Free"
            value={activity.price ? `GHS ${activity.price}` : ""}
            onChange={(event) => updateActivity(activity.id, { price: event.target.value.replace(/^GHS\s?/i, "") })}
            className={`${inputClass} w-[130px]`}
          />
          <IconButton
            label={`Remove activity ${index + 1}`}
            tone="dangerSoft"
            size="md"
            onClick={() => removeActivity(activity.id)}
          >
            <Trash size={16} strokeWidth={1.85} absoluteStrokeWidth />
          </IconButton>
        </div>
      ))}
      <AdminButton variant="dashed" className="w-full gap-[7px] py-[10px] text-[13.5px]" onClick={addActivity}>
        <Plus size={15} strokeWidth={1.85} absoluteStrokeWidth />
        Add activity
      </AdminButton>
    </section>
  );
}
