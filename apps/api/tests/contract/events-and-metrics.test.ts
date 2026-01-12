import { describe, expect, it } from 'vitest';

import app from '../../src/server.js';

describe('contract: events + metrics', () => {
  it('POST /v1/events returns 204', async () => {
    const res = await app.request('/v1/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        installationId: 'inst_1',
        timestamp: new Date().toISOString(),
        type: 'QuestionAsked',
        questionCategory: 'code-reading',
        trigger: 'manual',
      }),
    });
    expect(res.status).toBe(204);
  });

  it('GET /v1/metrics?range=7d returns points[]', async () => {
    const res = await app.request('/v1/metrics?range=7d', { method: 'GET' });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('points');
    expect(Array.isArray(body.points)).toBe(true);
  });
});


