import { Hono } from 'hono';

import { errorMiddleware } from './middleware/error.js';
import { loggingMiddleware } from './middleware/logging.js';

const app = new Hono();

app.use('*', errorMiddleware);
app.use('*', loggingMiddleware);

app.get('/healthz', (c) => c.json({ ok: true }));

// TODO: add routes per OpenAPI:
// - POST /v1/pairing-codes
// - POST /v1/pairing-codes/claim
// - POST /v1/questions/generate
// - POST /v1/events
// - GET  /v1/metrics

export default app;


