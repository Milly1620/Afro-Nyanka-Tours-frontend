import { useState, type FormEvent } from "react";
import logo from "@/assets/footer_logo.svg";
import { AdminPage } from "@/components/admin/layout/AdminPage";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Field, TextInput } from "@/components/admin/ui/Field";
import { Panel, PanelHeading } from "@/components/admin/ui/Panel";
import { Toggle } from "@/components/admin/ui/Toggle";
import { setNotificationPreference, updateCompanyProfile } from "@/adminSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import type { CompanyProfile, NotificationPreferences } from "@/types/admin";

const profileFields: { key: keyof CompanyProfile; label: string; type: string }[] = [
  { key: "name", label: "Company name", type: "text" },
  { key: "email", label: "Contact email", type: "email" },
  { key: "phone", label: "Phone", type: "tel" },
  { key: "location", label: "Location", type: "text" },
];

const notificationOptions: { key: keyof NotificationPreferences; title: string; description: string }[] = [
  { key: "inquiryAlerts", title: "New inquiry alerts", description: "Email me when a traveller sends an inquiry" },
  {
    key: "bookingConfirmations",
    title: "Booking confirmations",
    description: "Notify me when a booking is paid or confirmed",
  },
  { key: "weeklySummary", title: "Weekly summary email", description: "A Monday digest of the week ahead" },
];

export function SettingsPage() {
  const company = useAppSelector((state) => state.admin.company);
  const notifications = useAppSelector((state) => state.admin.notifications);
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState(company);
  const [logoPreview, setLogoPreview] = useState<string>(logo);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(updateCompanyProfile(profile));
    setSaved(true);
  };

  const handleLogo = (file: File | undefined) => {
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  return (
    <AdminPage title="Settings" subtitle="Company profile and preferences">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <Panel className="flex min-w-0 flex-1 p-[22px]">
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-[18px]">
            <PanelHeading title="Company profile" subtitle="This information appears on your public site" />
            <div className="flex items-center gap-[14px]">
              <span className="flex size-[60px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-admin-border bg-white">
                <img src={logoPreview} alt="Brand logo" className="h-[42px] w-[35.8px] object-contain" />
              </span>
              <div className="flex flex-col gap-[6px]">
                <span className="text-[14px] font-semibold text-admin-ink-900">Brand logo</span>
                <label className="inline-flex w-fit cursor-pointer items-center justify-center rounded-[9px] border border-admin-border bg-white px-[13px] py-2 text-[12.5px] font-semibold text-admin-text-2 hover:bg-admin-field">
                  Change logo
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
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
                    value={profile[field.key]}
                    onChange={(event) => {
                      setSaved(false);
                      setProfile({ ...profile, [field.key]: event.target.value });
                    }}
                    wrapperClassName="h-[47px]"
                  />
                )}
              </Field>
            ))}
            <div className="flex items-center gap-3">
              <AdminButton type="submit" size="lg" className="px-[18px] py-3 text-[13.5px]">
                Save changes
              </AdminButton>
              {saved && (
                <span role="status" className="text-[12.5px] font-medium text-admin-published-ink">
                  Changes saved
                </span>
              )}
            </div>
          </form>
        </Panel>

        <Panel className="flex w-full flex-col gap-[18px] p-[22px] xl:w-[430px] xl:shrink-0">
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
                  checked={notifications[option.key]}
                  onChange={(value) => dispatch(setNotificationPreference({ key: option.key, value }))}
                />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AdminPage>
  );
}
