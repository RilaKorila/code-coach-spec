import { Hono } from 'hono';

import { errorMiddleware } from './middleware/error.js';
import { loggingMiddleware } from './middleware/logging.js';
import { eventsRoutes } from './routes/events.js';
import { metricsRoutes } from './routes/metrics.js';
import { pairingCodesRoutes } from './routes/pairingCodes.js';
import { pairingCodesClaimRoutes } from './routes/pairingCodesClaim.js';
import { questionsGenerateRoutes } from './routes/questionsGenerate.js';

const app = new Hono();

app.use('*', errorMiddleware);
app.use('*', loggingMiddleware);

app.get('/healthz', (c) => c.json({ ok: true }));

app.route('/', pairingCodesRoutes);
app.route('/', pairingCodesClaimRoutes);
app.route('/', questionsGenerateRoutes);
app.route('/', eventsRoutes);
app.route('/', metricsRoutes);

export default app;


