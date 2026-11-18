import { allowedStatusMoves, bookingStatusSuccessMessage } from "@/components/admin/bookings/bookingStatus";

describe("allowedStatusMoves", () => {
  it("lets a pending booking be confirmed, paid or cancelled", () => {
    expect(allowedStatusMoves("pending")).toEqual(["confirmed", "paid", "cancelled"]);
  });

  it("lets a confirmed booking be paid or cancelled", () => {
    expect(allowedStatusMoves("confirmed")).toEqual(["paid", "cancelled"]);
  });

  it("lets a paid booking only be cancelled", () => {
    expect(allowedStatusMoves("paid")).toEqual(["cancelled"]);
  });

  it("offers no moves for a cancelled booking", () => {
    expect(allowedStatusMoves("cancelled")).toEqual([]);
  });

  it("never offers a move back to pending", () => {
    (["pending", "confirmed", "paid", "cancelled"] as const).forEach((status) => {
      expect(allowedStatusMoves(status)).not.toContain("pending");
    });
  });
});

describe("bookingStatusSuccessMessage", () => {
  it.each([
    ["confirmed", "Booking BC-7 confirmed"],
    ["paid", "Booking BC-7 marked as paid"],
    ["cancelled", "Booking BC-7 cancelled"],
  ] as const)("describes a move to %s", (status, message) => {
    expect(bookingStatusSuccessMessage("BC-7", status)).toBe(message);
  });
});
