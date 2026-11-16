import type { BookingStatus } from "@/types/api";

const forwardMoves: Record<BookingStatus, BookingStatus[]> = {
  pending: ["confirmed", "paid", "cancelled"],
  confirmed: ["paid", "cancelled"],
  paid: ["cancelled"],
  cancelled: [],
};

export function allowedStatusMoves(status: BookingStatus): BookingStatus[] {
  return forwardMoves[status];
}

export const bookingStatusActionLabels: Record<BookingStatus, string> = {
  pending: "Mark as pending",
  confirmed: "Confirm booking",
  paid: "Mark as paid",
  cancelled: "Cancel booking",
};

const statusSuccessVerbs: Record<BookingStatus, string> = {
  pending: "set to pending",
  confirmed: "confirmed",
  paid: "marked as paid",
  cancelled: "cancelled",
};

export function bookingStatusSuccessMessage(reference: string, status: BookingStatus): string {
  return `Booking ${reference} ${statusSuccessVerbs[status]}`;
}
