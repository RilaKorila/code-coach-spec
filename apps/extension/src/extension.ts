import * as vscode from 'vscode';

import { pairWithCode } from './pairing/pairingCode';
import { askQuestionManual } from './commands/askQuestion';
import { sendTestEvent } from './commands/sendTestEvent';
import { registerAutoTrigger } from './heuristics/autoTrigger';
import { registerChatParticipant } from './chat/participant';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('codeCoach.pair', () => pairWithCode(context)),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('codeCoach.askQuestion', () => askQuestionManual(context)),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('codeCoach.sendTestEvent', () => sendTestEvent(context)),
  );

  // Auto-trigger (MVP): detect "generation-like" edits and prompt after N occurrences.
  registerAutoTrigger(context);

  // Chat Participant (MVP): entrypoint in VS Code chat via @codecoach
  registerChatParticipant(context);
}

export function deactivate() {
  // noop
}


