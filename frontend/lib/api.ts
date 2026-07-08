const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'object' && payload && 'error' in payload ? String((payload as any).error) : 'Request failed';
    throw new Error(message);
  }

  return payload as T;
}

export async function fetchJSON<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    credentials: 'include',
  });

  return parseResponse<T>(response);
}

export async function submitInquiry(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/inquiries`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  return parseResponse<{ ok: boolean; id: string }>(response);
}

export async function login(username: string, password: string) {
  return fetchJSON<{ ok: boolean; user: { id: string; username: string; displayName: string; role: string } }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    },
  );
}

export async function getCurrentUser() {
  return fetchJSON<{ ok: boolean; user: { id: string; username: string; displayName: string; role: string } }>('/auth/me');
}

export async function clientPortalLogin(phone: string, email?: string) {
  return fetchJSON<{ ok: boolean; user: { id: string; username: string; displayName: string; role: string } }>(
    '/portal/login',
    {
      method: 'POST',
      body: JSON.stringify({ phone, email }),
    },
  );
}

export async function getPortalSummary() {
  return fetchJSON('/portal/summary');
}

export async function getPortalMe() {
  return fetchJSON('/portal/me');
}

export async function logout() {
  return fetchJSON<{ ok: boolean }>('/auth/logout', { method: 'POST' });
}

export async function getDashboardSummary() {
  return fetchJSON('/dashboard/summary', { method: 'GET' });
}
