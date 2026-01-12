import * as vscode from 'vscode';

export type GenerationLikeDetection = {
    reason: 'large_insert' | 'large_replace';
    insertedLines: number;
    insertedChars: number;
    uri: string;
};

export type DetectorOptions = {
    minInsertedLines: number;
    minInsertedChars: number;
};

const DEFAULT_OPTIONS: DetectorOptions = {
    // MVP: simple heuristic. Tune later.
    minInsertedLines: 20,
    minInsertedChars: 800,
};

function isTestFile(uri: vscode.Uri): boolean {
    const p = uri.fsPath.toLowerCase();
    return (
        p.includes('/test/') ||
        p.includes('/tests/') ||
        p.endsWith('.test.ts') ||
        p.endsWith('.spec.ts') ||
        p.endsWith('.test.tsx') ||
        p.endsWith('.spec.tsx')
    );
}

function countInserted(change: vscode.TextDocumentContentChangeEvent): { lines: number; chars: number } {
    const text = change.text ?? '';
    const chars = text.length;
    const lines = text === '' ? 0 : text.split('\n').length - 1;
    return { lines, chars };
}

export function detectGenerationLike(
    e: vscode.TextDocumentChangeEvent,
    opts: Partial<DetectorOptions> = {},
): GenerationLikeDetection | null {
    const o: DetectorOptions = { ...DEFAULT_OPTIONS, ...opts };

    // Skip tests to avoid noise; we care about main logic growth.
    if (isTestFile(e.document.uri)) return null;

    // Consider only meaningful changes
    for (const ch of e.contentChanges) {
        const { lines, chars } = countInserted(ch);
        if (lines >= o.minInsertedLines && chars >= o.minInsertedChars) {
            const isReplace = ch.rangeLength > 0;
            return {
                reason: isReplace ? 'large_replace' : 'large_insert',
                insertedLines: lines,
                insertedChars: chars,
                uri: e.document.uri.toString(),
            };
        }
    }

    return null;
}


