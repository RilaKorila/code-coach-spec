import * as vscode from 'vscode';

import { apiPost } from '../api/client';
import { getInstallationId, getInstallationToken } from '../pairing/pairingCode';

export async function sendTestEvent(context: vscode.ExtensionContext): Promise<void> {
  const installationId = await getInstallationId(context);
  const token = await getInstallationToken(context);

  await apiPost<void>(
    '/v1/events',
    {
      installationId,
      timestamp: new Date().toISOString(),
      type: 'QuestionAsked',
      questionCategory: 'code-reading',
      selfCheck: 'none',
    },
    token ? { authorization: `Bearer ${token}` } : undefined,
  );

  vscode.window.showInformationMessage('Sent test event to /v1/events');
}


