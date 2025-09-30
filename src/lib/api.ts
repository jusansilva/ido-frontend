import { getAccessToken, getRefreshToken, saveSession, setAccessToken, clearSession, Session, Role } from './auth';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

type ApiErrorBody = { message?: string; error?: string } & Record<string, unknown>;

async function request<T>(path: string, init?: RequestInit, _retry = false): Promise<T> {
  const access = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(access ? { Authorization: `Bearer ${access}` } : {}),
    ...(init?.headers || {}),
  } as Record<string, string>;

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (res.status === 204) return {} as T;
  const data: ApiErrorBody | T = await res.json().catch(() => ({} as ApiErrorBody));

  if (res.status === 401 && !_retry) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request<T>(path, init, true);
    }
  }

  if (!res.ok) {
    const d = data as ApiErrorBody;
    const message = (d && (d.message || d.error)) || 'Erro na requisição';
    throw new Error(message);
  }
  return data as T;
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { accessToken: string; refreshToken?: string };
    if (data?.accessToken) {
      if (data.refreshToken) {
        // Se o backend rotacionar o refresh, precisamos atualizar toda a sessão
        const current = getSessionSafe();
        if (current) saveSession({ ...current, accessToken: data.accessToken, refreshToken: data.refreshToken });
      } else {
        setAccessToken(data.accessToken);
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function getSessionSafe(): Session | null {
  try {
    return JSON.parse(localStorage.getItem('idoe_session') || 'null');
  } catch {
    return null;
  }
}

export type User = { id: number; name: string; email: string; role: Role };
export type AuthResponse = { user: User; accessToken: string; refreshToken: string };

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  logout: async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await request<void>('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      }
    } finally {
      clearSession();
    }
  },
};
