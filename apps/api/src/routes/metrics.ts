import { Hono } from 'hono';

import { memoryStore } from '../store/memoryStore.js';

function daysAgo(n: number): Date {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - n);
    return d;
}

const EXPIRE_SHORT_DAYS_LIMIT = 7;
const EXPIRE_LONG_DAYS_LIMIT = 30;

export const metricsRoutes = new Hono().get('/v1/metrics', async (c) => {
    const range = c.req.query('range');
    if (range !== '7d' && range !== '30d') return c.json({ error: 'range is required (7d|30d)' }, 400);

    const userId = c.req.header('x-dev-user-id') ?? 'dev-user';
    const category = c.req.query('category');
    const eventType = c.req.query('eventType');

    const earliest = range === '7d' ? daysAgo(EXPIRE_SHORT_DAYS_LIMIT) : daysAgo(EXPIRE_LONG_DAYS_LIMIT);
    const earliestStr = earliest.toISOString().slice(0, 10);

    const points = memoryStore
        .listMetrics(userId)
        .filter((p) => p.date >= earliestStr)
        .filter((p) => (typeof category === 'string' ? p.questionCategory === category : true))
        .filter((p) => (typeof eventType === 'string' ? p.eventType === eventType : true))
        .map((p) => ({
            date: p.date,
            eventType: p.eventType,
            questionCategory: p.questionCategory,
            selfCheck: p.selfCheck,
            count: p.count,
        }));

    return c.json({ points }, 200);
});


