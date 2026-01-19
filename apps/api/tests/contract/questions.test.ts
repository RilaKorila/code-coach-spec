import { describe, expect, it } from 'vitest';

import app from '../../src/server.js';

describe('contract: questions', () => {
  it('POST /v1/questions/generate returns question payload', async () => {
    const res = await app.request('/v1/questions/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        installationId: 'inst_1',
        rawPrompt: 'このコードを説明して',
        rawCode: 'function add(a,b){return a+b}',
        categoryHint: 'code-reading',
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('questionId');
    expect(body).toHaveProperty('category');
    expect(body).toHaveProperty('questionText');
    expect(body).toHaveProperty('answerType');
  });
});


