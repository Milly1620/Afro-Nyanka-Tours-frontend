import { useSyncExternalStore } from "react";

export type ToastKind = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

const MAX_VISIBLE = 4;
const DURATIONS: Record<ToastKind, number> = { success: 4000, info: 4000, error: 7000 };

let items: ToastItem[] = [];
let nextId = 1;
const timers = new Map<number, ReturnType<typeof setTimeout>>();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function snapshot() {
  return items;
}

export function dismissToast(id: number): void {
  const timer = timers.get(id);
  if (timer) clearTimeout(timer);
  timers.delete(id);
  items = items.filter((item) => item.id !== id);
  emit();
}

function push(kind: ToastKind, message: string): number {
  const id = nextId++;
  items = [...items, { id, kind, message }].slice(-MAX_VISIBLE);
  timers.set(id, setTimeout(() => dismissToast(id), DURATIONS[kind]));
  emit();
  return id;
}

export const toast = {
  success: (message: string) => push("success", message),
  error: (message: string) => push("error", message),
  info: (message: string) => push("info", message),
};

export function clearToasts(): void {
  timers.forEach((timer) => clearTimeout(timer));
  timers.clear();
  items = [];
  emit();
}

export function useToasts(): ToastItem[] {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}
