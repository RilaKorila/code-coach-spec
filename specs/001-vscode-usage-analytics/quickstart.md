# Quickstart: VSCode拡張 利用状況分析ダッシュボード（MVP）

**Feature**: `001-vscode-usage-analytics`  
**Date**: 2026-01-11

## 目的

- VSCode拡張で「質問提示→回答→self-check」を行い、イベントをAPIへ送る
- Webアプリ（ログイン必須）で集計結果を表示する
- 集計のみ保存し、raw の質問/回答本文やプロンプト/コードは DB に保存しない

## ローカル実行（想定）

このリポジトリは現時点で実装前のため、以下は plan に基づく想定の quickstart です。

### 1) 前提

- Node.js 20+
- Google Cloud Project
- Vertex AI (Gemini) を利用できる権限

### 2) 環境変数（例）

- API（Hono）
  - `GOOGLE_CLOUD_PROJECT`
  - `GOOGLE_APPLICATION_CREDENTIALS`（ローカル用。Cloud Runでは推奨しない）
  - `VERTEX_AI_LOCATION`（例: `us-central1`）
  - `FIRESTORE_DATABASE`（必要なら）

- Web（Next.js）
  - `NEXTAUTH_URL`
  - `NEXTAUTH_SECRET`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `API_BASE_URL`（apiサービスのURL）

### 3) 起動（例）

- `apps/api`: `npm run dev`
- `apps/web`: `npm run dev`
- `apps/extension`: `npm run build` → VSCode で拡張をデバッグ実行

## デプロイ（Cloud Run想定）

- `apps/api` と `apps/web` をそれぞれ Cloud Run にデプロイ
- APIは Firestore と Vertex AI を呼び出すため、Cloud Run のサービスアカウントに最小権限を付与する

## E2E（Playwright）

- Webの主要フロー（ログイン→ダッシュボード表示→期間切替）を Playwright で検証する

