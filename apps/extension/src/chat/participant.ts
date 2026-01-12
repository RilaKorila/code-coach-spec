import * as vscode from 'vscode';

import { apiPost } from '../api/client';
import { getInstallationId, getInstallationToken } from '../pairing/pairingCode';
import { logError, logInfo } from '../logging/output';

type GeneratedQuestion = {
  questionId: string;
  category: string;
  questionText: string;
  answerType: string;
  choices?: string[];
};

function getActiveEditorCode(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return undefined;
  const selected = editor.document.getText(editor.selection);
  if (selected && selected.trim().length > 0) return selected;
  return editor.document.getText();
}

export function registerChatParticipant(context: vscode.ExtensionContext): void {
  // VS Code Chat Participant API (stable in current @types/vscode)
  const participant = vscode.chat.createChatParticipant(
    'codeCoach.coach',
    async (request, _chatContext, response) => {
      logInfo(`chat request received: command=${request.command ?? '(none)'} promptLen=${request.prompt.length}`);

      const installationId = await getInstallationId(context);
      const token = await getInstallationToken(context);

      if (!token) {
        response.markdown('まずペアリングが必要です。`Code Coach: Pair (enter pairing code)` を実行してください。');
        response.button({ title: 'Pair', command: 'codeCoach.pair' });
        return;
      }

      const rawCode = getActiveEditorCode();
      const body = {
        installationId,
        rawPrompt: request.prompt,
        rawCode,
        categoryHint: 'code-reading',
      };

      try {
        const q = await apiPost<GeneratedQuestion>('/v1/questions/generate', body, {
          authorization: `Bearer ${token}`,
        });

        response.markdown(`### Code Coach Question\n\n${q.questionText}`);
        if (q.answerType === 'single_choice' && Array.isArray(q.choices) && q.choices.length > 0) {
          response.markdown(`\n\nChoices:\n${q.choices.map((c) => `- ${c}`).join('\n')}`);
        }
        response.markdown('\n\nこのスレッドで回答してOKです。回答後、必要なら `Code Coach: Ask a learning question (manual)` も使えます。');
        response.button({ title: 'Ask (manual UI)', command: 'codeCoach.askQuestion' });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        logError(`chat participant failed: ${msg}`);
        response.markdown(`エラー: ${msg}`);
      }
    },
  );

  participant.iconPath = new vscode.ThemeIcon('comment-discussion');
  context.subscriptions.push(participant);
}


