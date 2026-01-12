import { Hono } from 'hono';

import { memoryStore } from '../store/memoryStore.js';

const EXPIRE_TIME_MS = 10 * 60 * 1000; // 10 minutes

function randomCode(): string {
    // 6 chars base32-ish, good enough for MVP
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
    return out;
}

function getUserIdFromRequest(c: { req: { header(name: string): string | undefined } }): string {
    // MVP: if web auth is wired, it should set userId in context. For now, keep a safe fallback.
    const h = c.req.header('x-dev-user-id');
    return h ?? 'dev-user';
}

export const pairingCodesRoutes = new Hono()
    .post('/v1/pairing-codes', async (c) => {
        const userId = getUserIdFromRequest(c);
        const code = randomCode();
        const expiresAt = new Date(Date.now() + EXPIRE_TIME_MS).toISOString();
        memoryStore.upsertPairingCode({ code, userId, expiresAt });
        return c.json({ code, expiresAt }, 200);
    });


