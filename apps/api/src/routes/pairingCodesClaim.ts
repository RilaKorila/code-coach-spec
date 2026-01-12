import { Hono } from 'hono';

import { issueInstallationToken } from '../auth/installationToken.js';
import { memoryStore } from '../store/memoryStore.js';

export const pairingCodesClaimRoutes = new Hono().post('/v1/pairing-codes/claim', async (c) => {
  const body = await c.req.json().catch(() => null);
  const code = body?.code;
  const installationId = body?.installationId;

  if (typeof code !== 'string' || typeof installationId !== 'string') {
    return c.json({ error: 'Invalid request' }, 400);
  }

  const rec = memoryStore.getPairingCode(code);
  if (!rec) return c.json({ error: 'Invalid code' }, 404);
  if (new Date(rec.expiresAt).getTime() < Date.now()) return c.json({ error: 'Expired code' }, 410);

  memoryStore.setInstallation({ installationId, userId: rec.userId });
  const installationToken = await issueInstallationToken({ installationId, userId: rec.userId });

  return c.json({ userId: rec.userId, installationToken }, 200);
});


