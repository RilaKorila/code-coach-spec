import * as vscode from 'vscode';

type Json = Record<string, unknown>;
const BACKEND_API_URL = 'http://localhost:8787';

export function getApiBaseUrl(): string {
    const cfg = vscode.workspace.getConfiguration('codeCoach');
    const v = cfg.get<string>('apiBaseUrl');
    return v && v.trim().length > 0 ? v : BACKEND_API_URL;
}

export async function apiPost<T>(
    path: string,
    body?: Json | null,
    headers?: Record<string, string>,
): Promise<T> {
    const url = `${getApiBaseUrl()}${path}`;

    const hasBody = body !== undefined && body !== null;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            ...(hasBody ? { 'content-type': 'application/json' } : {}),
            ...(headers ?? {}),
        },
        ...(hasBody ? { body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`API POST ${path} failed: ${res.status} ${text}`);
    }

    // Many "command" style endpoints intentionally return no body (e.g. 204 No Content).
    // Treat empty body as success and return undefined for T=void cases.
    if (res.status === 204 || res.status === 205) return undefined as T;

    const raw = await res.text().catch(() => '');
    if (!raw) return undefined as T;

    const ct = res.headers.get('content-type') ?? '';
    if (ct.includes('application/json')) {
        return JSON.parse(raw) as T;
    }

    // Best effort: some servers may omit content-type even when returning JSON.
    try {
        return JSON.parse(raw) as T;
    } catch {
        throw new Error(`API POST ${path} returned non-JSON body (content-type=${ct}): ${raw.slice(0, 200)}`);
    }
}


