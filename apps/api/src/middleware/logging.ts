import type { MiddlewareHandler } from 'hono';

export const loggingMiddleware: MiddlewareHandler = async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  // Minimal structured log
  console.log(
    JSON.stringify({
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      durationMs: ms,
    }),
  );
};


