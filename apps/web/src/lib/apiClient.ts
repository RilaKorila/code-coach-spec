export type PairingCodeResponse = {
  code: string;
  expiresAt: string; // ISO
};

export type MetricPoint = {
  date: string; // YYYY-MM-DD
  eventType: string;
  questionCategory: string;
  selfCheck: string;
  count: number;
};

export type MetricsResponse = {
  points: MetricPoint[];
};

function requireApiBaseUrl(): string {
  const v = process.env.API_BASE_URL;
  if (!v) {
    // DX: local dev default. In production, env must be provided.
    if (process.env.NODE_ENV !== 'production') return 'http://localhost:8787';
    throw new Error('Missing required env var: API_BASE_URL');
  }
  return v;
}

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = requireApiBaseUrl();
  const url = `${base}${path}`;
  return await fetch(url, {
    cache: 'no-store',
    ...init,
  });
}

export async function createPairingCode(params: { userId: string }): Promise<PairingCodeResponse> {
  const res = await apiFetch('/v1/pairing-codes', {
    method: 'POST',
    headers: {
      'x-dev-user-id': params.userId,
    },
  });
  if (!res.ok) throw new Error(`Failed to create pairing code: ${res.status}`);
  return (await res.json()) as PairingCodeResponse;
}

export async function getMetrics(params: {
  userId: string;
  range: '7d' | '30d';
  category?: string;
  eventType?: string;
}): Promise<MetricsResponse> {
  const q = new URLSearchParams({ range: params.range });
  if (params.category) q.set('category', params.category);
  if (params.eventType) q.set('eventType', params.eventType);

  const res = await apiFetch(`/v1/metrics?${q.toString()}`, {
    method: 'GET',
    headers: {
      'x-dev-user-id': params.userId,
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch metrics: ${res.status}`);
  return (await res.json()) as MetricsResponse;
}


