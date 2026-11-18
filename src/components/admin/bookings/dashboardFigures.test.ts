import { activityMessage, occupancyPercent, statFigures } from "@/components/admin/bookings/dashboardFigures";
import type { Dashboard } from "@/types/api";

const dashboard: Dashboard = {
  new_inquiries: { count: 3, delta_7d: 2 },
  upcoming_departures: { count: 4, next_14d: 1 },
  revenue_ghs: { total: 142300, delta_pct_vs_prev_30d: -5 },
  avg_occupancy_pct: { value: 77.6 },
  inquiries: [],
  upcoming: [],
  recent_activity: [],
};

describe("statFigures", () => {
  it("formats the four headline figures", () => {
    const figures = statFigures(dashboard);
    expect(figures.map((figure) => figure.value)).toEqual(["3", "4", "GHS 142,300", "78%"]);
    expect(figures[0].delta).toBe("+2 in 7 days");
    expect(figures[2].delta).toBe("-5% vs prev");
  });

  it("handles a missing revenue comparison and occupancy", () => {
    const figures = statFigures({
      ...dashboard,
      revenue_ghs: { total: 0, delta_pct_vs_prev_30d: null },
      avg_occupancy_pct: { value: null },
    });
    expect(figures[2].delta).toBe("No previous period");
    expect(figures[3].value).toBe("—");
  });
});

describe("activityMessage", () => {
  it("describes a status change", () => {
    expect(
      activityMessage({ type: "status_change", reference: "BC-4", customer_name: "Ama", to_status: "paid", created_at: "" }),
    ).toBe("Ama · BC-4 marked paid");
  });

  it("describes a new booking", () => {
    expect(
      activityMessage({ type: "new_booking", reference: "BC-5", customer_name: "Kofi", to_status: "pending", created_at: "" }),
    ).toBe("New booking from Kofi · BC-5");
  });
});

describe("occupancyPercent", () => {
  it("returns null for unlimited capacity", () => {
    expect(occupancyPercent(5, null)).toBeNull();
  });

  it("caps at 100", () => {
    expect(occupancyPercent(12, 10)).toBe(100);
  });

  it("rounds to a whole percent", () => {
    expect(occupancyPercent(1, 3)).toBe(33);
  });
});
