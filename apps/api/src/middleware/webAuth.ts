import type { MiddlewareHandler } from 'hono';
import { OAuth2Client } from 'google-auth-library';

const oauth = new OAuth2Client();

declare module 'hono' {
  interface ContextVariableMap {
    userId: string;
  }
}

export const webAuthMiddleware: MiddlewareHandler = async (c, next) => {
  const auth = c.req.header('authorization') ?? '';
  const m = auth.match(/^Bearer (.+)$/);
  if (!m) return c.json({ error: 'Missing bearer token' }, 401);

  const idToken = m[1];
  const ticket = await oauth.verifyIdToken({ idToken });
  const payload = ticket.getPayload();
  const sub = payload?.sub;
  if (!sub) return c.json({ error: 'Invalid token' }, 401);

  c.set('userId', sub);
  await next();
};


