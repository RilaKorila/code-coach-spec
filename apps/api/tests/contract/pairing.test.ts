import { describe, expect, it } from 'vitest';

import app from '../../src/server.js';

describe('contract: pairing', () => {
  it('POST /v1/pairing-codes returns { code, expiresAt }', async () => {
    const res = await app.request('/v1/pairing-codes', { method: 'POST' });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('expiresAt');
  });

  it('POST /v1/pairing-codes/claim returns { userId, installationToken }', async () => {
    const create = await app.request('/v1/pairing-codes', { method: 'POST' });
    expect(create.status).toBe(200);
    const created = await create.json();

    const res = await app.request('/v1/pairing-codes/claim', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code: created.code, installationId: 'inst_1' }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('userId');
    expect(body).toHaveProperty('installationToken');
  });
});


