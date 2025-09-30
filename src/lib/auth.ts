export type Role = 'USER' | 'ADMIN';

export type Session = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: Role;
  };
};

export const SESSION_KEY = 'idoe_session';

export function saveSession(session: Session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {}
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

export function getAccessToken(): string | null {
  return getSession()?.accessToken || null;
}

export function getRefreshToken(): string | null {
  return getSession()?.refreshToken || null;
}

export function setAccessToken(token: string) {
  const s = getSession();
  if (!s) return;
  saveSession({ ...s, accessToken: token });
}
