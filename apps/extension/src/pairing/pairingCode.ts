import * as vscode from 'vscode';
import { randomUUID } from 'crypto';

import { apiPost } from '../api/client';

const SECRET_INSTALLATION_TOKEN = 'codeCoach.installationToken';
const STATE_INSTALLATION_ID = 'codeCoach.installationId';

type PairingClaimResponse = {
  userId: string;
  installationToken: string;
};

function getOrCreateInstallationId(context: vscode.ExtensionContext): string {
  const existing = context.globalState.get<string>(STATE_INSTALLATION_ID);
  if (existing) return existing;
  const created = `inst_${randomUUID()}`;
  void context.globalState.update(STATE_INSTALLATION_ID, created);
  return created;
}

export async function pairWithCode(context: vscode.ExtensionContext): Promise<void> {
  const code = await vscode.window.showInputBox({
    title: 'Code Coach Pairing',
    prompt: 'Webで発行した pairing code を貼り付けてください',
    ignoreFocusOut: true,
    validateInput: (v) => (v.trim().length === 0 ? 'pairing code is required' : null),
  });
  if (!code) return;

  const installationId = getOrCreateInstallationId(context);

  const res = await apiPost<PairingClaimResponse>('/v1/pairing-codes/claim', {
    code: code.trim(),
    installationId,
  });

  await context.secrets.store(SECRET_INSTALLATION_TOKEN, res.installationToken);

  vscode.window.showInformationMessage(
    `Paired! installationId=${installationId} userId=${res.userId}`,
  );
}

export async function getInstallationId(context: vscode.ExtensionContext): Promise<string> {
  return getOrCreateInstallationId(context);
}

export async function getInstallationToken(context: vscode.ExtensionContext): Promise<string | undefined> {
  return await context.secrets.get(SECRET_INSTALLATION_TOKEN);
}


