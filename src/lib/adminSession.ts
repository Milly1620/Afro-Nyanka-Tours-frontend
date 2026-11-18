const SESSION_KEY = "admin:session";

interface StoredSession {
  token: string;
  expiresAt: number;
}

function readSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredSession>;
    if (typeof parsed.token !== "string" || typeof parsed.expiresAt !== "number") return null;
    if (parsed.expiresAt <= Date.now()) return null;
    return { token: parsed.token, expiresAt: parsed.expiresAt };
  } catch {
    return null;
  }
}

export function getAdminToken(): string | null {
  return readSession()?.token ?? null;
}

export function hasAdminSession(): boolean {
  return readSession() !== null;
}

export function saveAdminSession(token: string, expiresInSeconds: number): void {
  try {
    const session: StoredSession = { token, expiresAt: Date.now() + expiresInSeconds * 1000 };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    return;
  }
}

export function clearAdminSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    return;
  }
}
