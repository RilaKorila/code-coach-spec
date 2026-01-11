# Data Model: VSCode拡張 利用状況分析ダッシュボード

**Feature**: `001-vscode-usage-analytics`  
**Date**: 2026-01-11  
**Storage**: Firestore（想定）

## Entities

### User

- **id**: string（Googleのsubject等）
- **createdAt**: timestamp

### ExtensionInstallation

- **id**: string（拡張インストール単位）
- **userId**: string（User.id）
- **createdAt**: timestamp
- **lastSeenAt**: timestamp（任意）

### PairingCode

- **code**: string（短いワンタイムコード）
- **userId**: string（発行者）
- **expiresAt**: timestamp
- **claimedAt**: timestamp | null
- **installationId**: string | null

**Constraint (MVP)**:

- User あたり **有効な PairingCode は最大1つ**（0..1）。新規発行は既存の有効コードを上書き/無効化する。

### UsageEvent（永続化しない）

受信はするが、DBには保存しない（集計に反映して破棄）。

- **type**: QuestionAsked | AnswerSubmitted | QuestionDismissed | Feedback
- **timestamp**: timestamp
- **installationId**: string
- **userId**: string（サーバ側で紐づけ）
- **questionCategory**: string（例: prompt-understanding / code-reading / concept-check）
- **trigger**: manual | auto
- **autoReason**: generatedCodeCount5 | heuristic
- **selfCheck**: understood | not_understood（AnswerSubmittedのみ）
- **rawPrompt**: string（質問生成用。保存しない）
- **rawCode**: string（質問生成用。保存しない）

### AggregatedMetric

ダッシュボード表示用の集計値（永続化対象）。

- **date**: YYYY-MM-DD
- **userId**: string
- **eventType**: asked | answered | dismissed | feedback
- **questionCategory**: string
- **selfCheck**: understood | not_understood | none
- **count**: number

## Relationships

- User 1..N ExtensionInstallation
- User 0..1 PairingCode（ActivePairingCode。MVPでは有効コードは最大1つ）
- ExtensionInstallation 1..N UsageEvent（受信のみ）
- User 1..N AggregatedMetric

