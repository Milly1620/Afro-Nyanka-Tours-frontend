import { useEffect, useState, type FormEvent } from "react";
import fallbackLogo from "@/assets/footer_logo.svg";
import { AdminPage } from "@/components/admin/layout/AdminPage";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { AsyncState } from "@/components/admin/ui/AsyncState";
import { Field, TextInput } from "@/components/admin/ui/Field";
import { Panel, PanelHeading } from "@/components/admin/ui/Panel";
import { Toggle } from "@/components/admin/ui/Toggle";
import { PasswordResetPanel } from "@/components/admin/settings/PasswordResetPanel";
import {
  normaliseSettings,
  notificationOptions,
  profileFields,
  validateSettings,
} from "@/components/admin/settings/settingsForm";
import { useResource } from "@/hooks/useResource";
import { toast } from "@/lib/toast";
import { adminSettingsApi } from "@/services/adminApi";
import { getErrorMessage } from "@/services/api";
import type { AdminSettings } from "@/types/api";

export function SettingsPage() {
  const remote = useResource(() => adminSettingsApi.get());

  return (
    <AdminPage title="Settings" subtitle="Company profile and preferences">
      <AsyncState loading={remote.loading} error={remote.error} onRetry={remote.reload}>
        {remote.data && <SettingsForm initial={remote.data} onLogoChanged={remote.reload} />}
      </AsyncState>
    </AdminPage>
  );
}

interface SettingsFormProps {
  initial: AdminSettings;
  onLogoChanged: () => void;
}

function SettingsForm({ initial, onLogoChanged }: SettingsFormProps) {
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    setSettings((current) => ({ ...current, logo_url: initial.logo_url }));
  }, [initial.logo_url]);

  const change = (changes: Partial<AdminSettings>) => {
    setSettings((current) => ({ ...current, ...changes }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const problem = validateSettings(settings);
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updated = await adminSettingsApi.update(normaliseSettings(settings));
      setSettings(updated);
      toast.success("Settings saved");
    } catch (reason) {
      toast.error(getErrorMessage(reason, "We couldn't save your settings."));
    } finally {
      setSaving(false);
    }
  };

  const handleLogo = async (file: File | undefined) => {
    if (!file) return;
    setUploadingLogo(true);
    try {
      await adminSettingsApi.uploadLogo(file);
      toast.success("Logo updated");
      onLogoChanged();
    } catch (reason) {
      toast.error(getErrorMessage(reason, "We couldn't upload the logo."));
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 xl:flex-row xl:items-start">
      <Panel className="flex min-w-0 flex-1 flex-col gap-[18px] p-[22px]">
        <PanelHeading title="Company profile" subtitle="This information appears on your public site" />
        <div className="flex items-center gap-[14px]">
          <span className="flex size-[60px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-admin-border bg-white">
            <img
              src={settings.logo_url || fallbackLogo}
              alt="Brand logo"
              className="h-[42px] w-[42px] object-contain"
            />
          </span>
          <div className="flex flex-col gap-[6px]">
            <span className="text-[14px] font-semibold text-admin-ink-900">Brand logo</span>
            <label className="inline-flex w-fit cursor-pointer items-center justify-center rounded-[9px] border border-admin-border bg-white px-[13px] py-2 text-[12.5px] font-semibold text-admin-text-2 hover:bg-admin-field">
              {uploadingLogo ? "Uploading..." : "Change logo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                disabled={uploadingLogo}
                className="sr-only"
                onChange={(event) => handleLogo(event.target.files?.[0])}
              />
            </label>
          </div>
        </div>
        {profileFields.map((field) => (
          <Field key={field.key} label={field.label} labelClassName="font-semibold">
            {(id) => (
              <TextInput
                id={id}
                type={field.type}
                value={settings[field.key]}
                onChange={(event) => change({ [field.key]: event.target.value })}
                wrapperClassName="h-[47px]"
              />
            )}
          </Field>
        ))}
        <div className="flex items-center gap-3">
          <AdminButton type="submit" size="lg" className="px-[18px] py-3 text-[13.5px]" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </AdminButton>
          {error && (
            <span role="alert" className="text-[12.5px] font-medium text-admin-danger">
              {error}
            </span>
          )}
        </div>
      </Panel>

      <div className="flex w-full flex-col gap-5 xl:w-[430px] xl:shrink-0">
      <Panel className="flex w-full flex-col gap-[18px] p-[22px]">
        <PanelHeading title="Notification preferences" subtitle="Choose what Afro Nyanka tells you about" />
        <ul>
          {notificationOptions.map((option) => (
            <li
              key={option.key}
              className="flex items-center gap-4 border-b border-admin-divider pt-1 pb-4 not-first:pt-5 last:border-b-0"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                <span className="text-[14px] font-semibold text-admin-ink-900">{option.title}</span>
                <span className="text-[12px] text-admin-ink-500">{option.description}</span>
              </div>
              <Toggle
                label={option.title}
                checked={settings[option.key]}
                onChange={(value) => change({ [option.key]: value })}
              />
            </li>
          ))}
        </ul>
        <p className="text-[12px] text-admin-subtle">Notification choices are saved with the company profile.</p>
      </Panel>
      <PasswordResetPanel />
      </div>
    </form>
  );
}
