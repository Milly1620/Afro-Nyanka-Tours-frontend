import { normaliseSettings, validateSettings } from "@/components/admin/settings/settingsForm";
import type { AdminSettings } from "@/types/api";

const settings: AdminSettings = {
  company_name: "Afro Nyanka Tours",
  contact_email: "info@example.com",
  phone: "+233 24 000 0000",
  location: "Accra",
  notify_new_inquiry: true,
  notify_booking_confirmation: true,
  notify_weekly_summary: false,
};

describe("validateSettings", () => {
  it("accepts complete settings", () => {
    expect(validateSettings(settings)).toBeNull();
  });

  it("requires a company name", () => {
    expect(validateSettings({ ...settings, company_name: "  " })).toBe("Enter your company name.");
  });

  it("rejects a malformed contact email", () => {
    expect(validateSettings({ ...settings, contact_email: "not-an-email" })).toBe("Enter a valid contact email.");
  });

  it("allows an empty contact email", () => {
    expect(validateSettings({ ...settings, contact_email: "" })).toBeNull();
  });
});

describe("normaliseSettings", () => {
  it("trims text fields and keeps the notification flags", () => {
    expect(normaliseSettings({ ...settings, company_name: "  Afro Nyanka ", phone: " 123 " })).toMatchObject({
      company_name: "Afro Nyanka",
      phone: "123",
      notify_weekly_summary: false,
    });
  });
});
