import * as vscode from 'vscode';

import { apiPost } from '../api/client';
import { getInstallationId, getInstallationToken } from '../pairing/pairingCode';

type GeneratedQuestion = {
  questionId: string;
  category: string;
  questionText: string;
  answerType: string;
};

export async function askQuestionManual(context: vscode.ExtensionContext): Promise<void> {
  const installationId = await getInstallationId(context);
  const token = await getInstallationToken(context);

  const editor = vscode.window.activeTextEditor;
  const selected = editor?.document.getText(editor.selection);
  const rawCode = selected && selected.trim().length > 0 ? selected : editor?.document.getText();

  const q = await apiPost<GeneratedQuestion>(
    '/v1/questions/generate',
    {
      installationId,
      rawPrompt: 'manual',
      rawCode,
      categoryHint: 'code-reading',
    },
    token ? { authorization: `Bearer ${token}` } : undefined,
  );

  const answer = await vscode.window.showInputBox({
    title: 'Code Coach Question',
    prompt: q.questionText,
    ignoreFocusOut: true,
  });

  const selfCheck = await vscode.window.showQuickPick(['understood', 'not_understood'], {
    title: 'Self-check',
    placeHolder: '理解できた？',
  });

  // Fire-and-forget analytics (MVP)
  await apiPost<void>(
    '/v1/events',
    {
      installationId,
      timestamp: new Date().toISOString(),
      type: 'AnswerSubmitted',
      questionCategory: q.category,
      selfCheck: selfCheck ?? 'none',
      answerPreview: answer ?? '',
      questionId: q.questionId,
    },
    token ? { authorization: `Bearer ${token}` } : undefined,
  );

  vscode.window.showInformationMessage('Answer submitted (analytics event sent).');
}


