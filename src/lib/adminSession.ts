const SESSION_KEY = "admin:isSignedIn";

export function loadAdminSession(): boolean {
  try {
    return localStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

export function saveAdminSession(isSignedIn: boolean): void {
  try {
    if (isSignedIn) {
      localStorage.setItem(SESSION_KEY, "true");
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    return;
  }
}
