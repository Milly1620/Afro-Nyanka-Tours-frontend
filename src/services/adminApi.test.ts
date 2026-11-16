import { describe, expect, it } from "vitest";
import { normaliseExtrasList, normaliseSettings } from "@/services/adminApi";
import type { AdminExtra, AdminSettings } from "@/types/api";

const extra: AdminExtra = { id: 1, name: "Airport pickup", description: null, default_price_ghs: 300, is_active: true };

describe("normaliseExtrasList", () => {
  it("wraps a plain array with an all count", () => {
    expect(normaliseExtrasList([extra])).toEqual({ items: [extra], counts: { all: 1 } });
  });

  it("wraps an empty array", () => {
    expect(normaliseExtrasList([])).toEqual({ items: [], counts: { all: 0 } });
  });

  it("passes a list response through unchanged", () => {
    const response = { items: [extra], counts: { all: 1, active: 1 } };
    expect(normaliseExtrasList(response)).toBe(response);
  });
});

describe("normaliseSettings", () => {
  it("turns null text fields into empty strings", () => {
    const settings = {
      company_name: "Afro Nyanka Tours",
      contact_email: "info@example.com",
      phone: null,
      location: null,
      notify_new_inquiry: true,
      notify_booking_confirmation: true,
      notify_weekly_summary: false,
    } as unknown as AdminSettings;
    expect(normaliseSettings(settings)).toMatchObject({ phone: "", location: "" });
  });
});
