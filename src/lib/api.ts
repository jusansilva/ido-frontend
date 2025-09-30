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
export type Campaign = { id: number; title: string; ownerId: number; closed: boolean; approved: boolean; createdAt: string; updatedAt: string };
export type Donation = { id: number; amount: number; donorId?: number; campaignId: number; createdAt: string };
export type Payment = {
  id: number;
  method: 'PIX' | 'BOLETO' | 'CREDIT';
  amount: number;
  providerTransactionId?: string;
  pixQrCode?: string;
  pixCode?: string;
  boletoUrl?: string;
  boletoDigitableLine?: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELED';
};

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
  campaigns: {
    list: () => request<Campaign[]>('/campaigns', { method: 'GET' }),
    get: (id: number) => request<Campaign>(`/campaigns/${id}`, { method: 'GET' }),
    create: (title: string) => request<Campaign>('/campaigns', { method: 'POST', body: JSON.stringify({ title }) }),
    report: (id: number) => request<{ count: number; total: number; average: number; donorsCount: number; lastDonationAt: string | null }>(`/campaigns/${id}/report`, { method: 'GET' }),
  },
  initiatives: {
    list: () => request<{ id: number; title: string; description: string; imageUrl: string; sortOrder: number; createdAt: string; updatedAt: string }[]>(`/initiatives`, { method: 'GET' }),
  },
  admin: {
    campaigns: (status?: 'pending' | 'approved' | 'all') => request<Campaign[]>(`/admin/campaigns${status ? `?status=${status}` : ''}`, { method: 'GET' }),
    moderateCampaign: (id: number, approved: boolean) => request<Campaign>(`/admin/campaigns/${id}/moderate`, { method: 'PATCH', body: JSON.stringify({ approved }) }),
    dashboard: () => request<{ usersCount: number; campaignsCount: number; donationsCount: number; recentCampaigns: Campaign[]; recentUsers: { id: number; name: string; email: string; createdAt: string; role: string }[]; recentDonations: { id: number; amount: number; campaignId: number; createdAt: string }[] }>('/admin/dashboard', { method: 'GET' }),
    initiatives: {
      create: (payload: { title: string; description: string; imageUrl: string; sortOrder?: number }) =>
        request(`/admin/initiatives`, { method: 'POST', body: JSON.stringify(payload) }),
      update: (id: number, payload: Partial<{ title: string; description: string; imageUrl: string; sortOrder: number }>) =>
        request(`/admin/initiatives/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
      delete: (id: number) =>
        request(`/admin/initiatives/${id}`, { method: 'DELETE' }),
      getUploadUrl: (filename: string, contentType: string) =>
        request<{ url: string; key: string; publicUrl?: string }>(`/admin/initiatives/upload-url`, { method: 'POST', body: JSON.stringify({ filename, contentType }) }),
    },
  },
  donations: {
    mine: () => request<Donation[]>('/donations', { method: 'GET' }),
    byCampaign: (id: number) => request<Donation[]>(`/donations/campaign/${id}`, { method: 'GET' }),
  },
  payments: {
    create: (
      campaignId: number,
      amount: number,
      method: 'PIX' | 'BOLETO' | 'CREDIT',
      creditCard?: (
        { holder: string; number: string; expMonth: number; expYear: number; cvv: string; installments?: number } |
        { token: string; installments?: number }
      )
    ) =>
      request<Payment>('/payments', { method: 'POST', body: JSON.stringify({ campaignId, amount, method, creditCard }) }),
    status: (id: number) => request<{ status: Payment['status']; paidAt?: string }>(`/payments/${id}/status`, { method: 'GET' }),
  },
};
