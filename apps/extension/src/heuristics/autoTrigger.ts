import * as vscode from 'vscode';

import { detectGenerationLike } from './generationLikeDetector';
import { askQuestionManual } from '../commands/askQuestion';
import { logError, logInfo } from '../logging/output';

const STATE_COUNTER = 'codeCoach.generationLikeCount';
const STATE_LAST_TRIGGER_AT = 'codeCoach.lastAutoTriggerAt';

const COUNT_THRESHOLD = 2; // FIXME: 動作確認ように2回に設定。本来は5回などにする。
const COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes

function now() {
    return Date.now();
}

export function registerAutoTrigger(context: vscode.ExtensionContext): void {
    logInfo('auto-trigger registered');
    const sub = vscode.workspace.onDidChangeTextDocument(async (e) => {
        const det = detectGenerationLike(e);
        if (!det) return;

        const current = context.globalState.get<number>(STATE_COUNTER) ?? 0;
        const next = current + 1;
        await context.globalState.update(STATE_COUNTER, next);
        logInfo(`generation-like detected (${det.reason}) count=${next} uri=${det.uri}`);

        if (next < COUNT_THRESHOLD) return;

        const lastAt = context.globalState.get<number>(STATE_LAST_TRIGGER_AT) ?? 0;
        if (now() - lastAt < COOLDOWN_MS) {
            // Avoid spamming: keep the counter capped but do not trigger
            await context.globalState.update(STATE_COUNTER, COUNT_THRESHOLD);
            return;
        }

        await context.globalState.update(STATE_LAST_TRIGGER_AT, now());
        await context.globalState.update(STATE_COUNTER, 0);

        const choice = await vscode.window.showInformationMessage(
            `Code Coach: 生成っぽい変更を${COUNT_THRESHOLD}回検出しました。学習のための質問を出しますか？`,
            'Ask now',
            'Later',
        );
        if (choice !== 'Ask now') return;

        try {
            await askQuestionManual(context);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            logError(`auto-trigger failed: ${msg}`);
            void vscode.window.showErrorMessage(`Code Coach auto-trigger failed: ${msg}`);
        }
    });

    context.subscriptions.push(sub);
}


