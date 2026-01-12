import { Hono } from 'hono';

import { buildStoredEvent } from '../policy/rawData.js';
import { getEventStore } from '../store/getEventStore.js';
import { memoryStore } from '../store/memoryStore.js';

function yyyymmdd(iso: string): string {
    const d = new Date(iso);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function mapEventType(t: string): 'asked' | 'answered' | 'dismissed' | 'feedback' {
    switch (t) {
        case 'QuestionAsked':
            return 'asked';
        case 'AnswerSubmitted':
            return 'answered';
        case 'QuestionDismissed':
            return 'dismissed';
        case 'Feedback':
            return 'feedback';
        default:
            return 'asked';
    }
}

export const eventsRoutes = new Hono().post('/v1/events', async (c) => {
    const body = await c.req.json().catch(() => null);
    const installationId = body?.installationId;
    const timestamp = body?.timestamp;
    const type = body?.type;

    if (typeof installationId !== 'string' || typeof timestamp !== 'string' || typeof type !== 'string') {
        return c.json({ error: 'Invalid request' }, 400);
    }

    const inst = memoryStore.getInstallation(installationId);
    const userId = inst?.userId ?? 'unknown';

    // Persist raw event (metadata only; never persist prompt/code/Q&A text)
    const ingestedAt = new Date().toISOString();
    const eventId = crypto.randomUUID();
    const eventStore = getEventStore();
    try {
        await eventStore.put(
            buildStoredEvent({
                eventId,
                userId,
                ingestedAt,
                body: body as Record<string, unknown>,
            }),
        );
    } catch (err) {
        // Local/test environments may not have Firestore available. For MVP we do not block ingestion.
        // If you need strict behavior, run with EVENT_STORE=firestore and ensure credentials/emulator.
        if (process.env.EVENT_STORE === 'firestore') throw err;
    }

    const date = yyyymmdd(timestamp);
    const eventType = mapEventType(type);
    const questionCategory = typeof body?.questionCategory === 'string' ? body.questionCategory : 'unknown';
    const selfCheck =
        typeof body?.selfCheck === 'string' ? body.selfCheck : 'none';

    memoryStore.incrementMetric({ userId, date, eventType, questionCategory, selfCheck });

    return new Response(null, { status: 204 });
});


