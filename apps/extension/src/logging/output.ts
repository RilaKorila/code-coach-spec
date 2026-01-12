import * as vscode from 'vscode';

let channel: vscode.OutputChannel | undefined;

export function getOutputChannel(): vscode.OutputChannel {
  if (!channel) channel = vscode.window.createOutputChannel('Code Coach');
  return channel;
}

export function logInfo(message: string): void {
  const c = getOutputChannel();
  c.appendLine(`[info] ${message}`);
}

export function logError(message: string): void {
  const c = getOutputChannel();
  c.appendLine(`[error] ${message}`);
}


