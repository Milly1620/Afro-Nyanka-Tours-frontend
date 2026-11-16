export function formatGhs(amount: number): string {
  return `GHS ${amount.toLocaleString("en-US")}`;
}

export function parseAmount(value: string): number {
  const digits = value.replace(/[^0-9.]/g, "");
  return digits ? Number(digits) : 0;
}

export function formatDays(days: number): string {
  return `${days} ${days === 1 ? "day" : "days"}`;
}

export function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return "";
  const day = formatShortDate(isoDateTime);
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${day} · ${time} GMT`;
}

export function formatDateRange(isoStart: string, days: number): string {
  const start = new Date(isoStart);
  if (Number.isNaN(start.getTime())) return "";
  const end = new Date(start);
  end.setDate(start.getDate() + Math.max(days - 1, 0));
  const month = start.toLocaleDateString("en-US", { month: "long" });
  const endMonth = end.toLocaleDateString("en-US", { month: "long" });
  const range =
    month === endMonth
      ? `${month} ${start.getDate()} - ${end.getDate()}`
      : `${month} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
  return `${range}, ${end.getFullYear()}`;
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function countdownTo(isoTarget: string, now: Date): Countdown {
  const remaining = Math.max(new Date(isoTarget).getTime() - now.getTime(), 0);
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function padTwo(value: number): string {
  return value.toString().padStart(2, "0");
}

export function avatarToneFor(name: string): 1 | 2 | 3 | 4 | 5 {
  const total = [...name].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return ((total % 5) + 1) as 1 | 2 | 3 | 4 | 5;
}

export function formatPrice(amount: number | null): string {
  return amount === null ? "Price on request" : formatGhs(amount);
}

export function toDateTimeLocal(isoDateTime: string | null): string {
  if (!isoDateTime) return "";
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function fromDateTimeLocal(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function relativeTime(isoDateTime: string, now: Date = new Date()): string {
  const elapsed = Math.max(now.getTime() - new Date(isoDateTime).getTime(), 0);
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
