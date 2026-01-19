import type { MiddlewareHandler } from 'hono';

import { verifyInstallationToken } from '../auth/installationToken.js';

declare module 'hono' {
  interface ContextVariableMap {
    installationId: string;
    userId: string;
  }
}

export const installationAuthMiddleware: MiddlewareHandler = async (c, next) => {
  const auth = c.req.header('authorization') ?? '';
  const m = auth.match(/^Bearer (.+)$/);
  if (!m) return c.json({ error: 'Missing bearer token' }, 401);

  try {
    const claims = await verifyInstallationToken(m[1]);
    c.set('installationId', claims.installationId);
    c.set('userId', claims.userId);
    await next();
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Invalid token';
    return c.json({ error: message }, 401);
  }
};


