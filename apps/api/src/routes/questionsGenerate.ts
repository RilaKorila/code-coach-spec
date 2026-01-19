import { Hono } from 'hono';

import { generateLearningQuestion } from '../infra/vertexAi.js';

export const questionsGenerateRoutes = new Hono().post('/v1/questions/generate', async (c) => {
  const body = await c.req.json().catch(() => null);
  const installationId = body?.installationId;
  if (typeof installationId !== 'string') return c.json({ error: 'installationId is required' }, 400);

  const question = await generateLearningQuestion({
    rawPrompt: typeof body?.rawPrompt === 'string' ? body.rawPrompt : undefined,
    rawCode: typeof body?.rawCode === 'string' ? body.rawCode : undefined,
    categoryHint: typeof body?.categoryHint === 'string' ? body.categoryHint : undefined,
  });

  return c.json(question, 200);
});


