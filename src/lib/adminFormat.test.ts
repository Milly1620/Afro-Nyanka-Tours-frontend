import { formatGhs, formatPrice } from "@/lib/adminFormat";

describe("price formatting", () => {
  it("formats a number in cedis", () => {
    expect(formatPrice(2650)).toBe("GHS 2,650");
  });

  it("shows a dash instead of crashing when the backend has no price", () => {
    expect(formatPrice(null)).toBe("—");
    expect(formatGhs(undefined)).toBe("—");
  });
});
