# Implementation Plan: VSCode拡張 利用状況分析ダッシュボード

**Branch**: `001-vscode-usage-analytics` | **Date**: 2026-01-11 | **Spec**: `specs/001-vscode-usage-analytics/spec.md`
**Input**: Feature specification from `specs/001-vscode-usage-analytics/spec.md`

## Summary

VSCode拡張が「学習を促進する質問」を提示し、ユーザーの回答・自己申告（理解できた/できてない）を収集する。
Webアプリ（ログイン必須）では、収集したイベントを **集計のみ保存**した指標として可視化する。

技術方針（憲法準拠）:

- Web Backend: Hono
- Web Frontend: Next.js（CSR-first）
- AI: Gemini (Vertex AI 経由)
- Deploy: Cloud Run（ハッカソンのデフォルト）
- Web E2E: Playwright

## Technical Context

**Language/Version**: TypeScript + Node.js 20 LTS  
**Primary Dependencies**: VSCode Extension API, Hono, Next.js, Playwright, Google Auth (OIDC), Vertex AI (Gemini)  
**Storage**: Firestore（集計値 + ペアリングコード + インストール紐づけ）  
**Testing**: Playwright (web E2E), unit tests (minimal), contract tests (OpenAPI)  
**Target Platform**: VSCode Desktop, Web (browser)  
**Project Type**: web + extension (monorepo)  
**Performance Goals**: ハッカソン用途の軽量スケール（まずは体感が遅くない）  
**Constraints**: 生のプロンプト/コードは送信するが、DBに永続化しない。ログイン必須のクローズド運用。  
**Scale/Scope**: 個人/少人数運用。MVPは「質問→回答→集計可視化」まで。

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Feature spec is complete（OK）
- No unresolved clarification markers remain（OK）
- Testing stance is explicit（Playwright E2E含む）（OK）
- Story independence and traceability（US単位 + tasksにパス）（OK）
- Tech constraints honored（Hono/Next.js/Vertex AI/Cloud Run）（OK）
- No unnecessary features or premature optimization（誤答記憶は NOT in MVP）（OK）

## Project Structure

### Documentation (this feature)

```text
specs/001-vscode-usage-analytics/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
apps/
├── extension/           # VSCode拡張
│   ├── src/
│   └── package.json
├── api/                 # Hono API (Cloud Run)
│   ├── src/
│   └── package.json
└── web/                 # Next.js (Cloud Run)
    ├── src/
    ├── e2e/             # Playwright E2E
    └── package.json

packages/
└── shared/              # 共通の型/ユーティリティ（任意・最小）
```

**Structure Decision**: monorepo（extension / api / web）で最短に分離。Cloud Run は api と web を別サービス想定。

## Architecture (High-Level)

- **VSCode拡張**
  - 相談の入口: Chat Participant API
  - editor event 監視: onDidChangeTextDocument で“生成っぽさ”推定（大量追加/テストなしで本体ロジック増）
  - 質問生成: 生のプロンプト/生成コードを API に送信し、Gemini（Vertex AI）で質問を生成
  - 回答: ユーザー回答 + self-check（理解できた/できてない）をイベントとして送信
  - ペアリング: Webで発行した pairing code を拡張に貼り付けて紐づけ

- **API (Hono)**
  - Pairing code 発行/検証、ExtensionInstallation の紐づけ
  - 質問生成（Vertex AI）: 受け取ったプロンプト/コードを使って質問文生成（永続化しない）
  - イベント取り込み: raw text を受け取る場合も DB には保存せず、集計を Firestore に保存
  - ダッシュボード用集計API

- **Web (Next.js)**
  - Googleログイン
  - ダッシュボード表示（CSR-first）
  - Playwright E2E 対象: ログイン→表示→期間切替

## Data (Aggregates-Only)

永続化するのは集計値のみ。

- Dimension（例）: date × eventType × questionCategory × selfCheck
- eventType: asked / answered / dismissed / feedback
- selfCheck: understood / not_understood（AnswerSubmittedのみ）

Note（最小実装）: `selfCheck` は集計には含めるが、`GET /v1/metrics` のフィルタ条件としては必須にしない。

## Phase 0: Outline & Research

`research.md` に以下の決定をまとめる:

- Firestore を採用（集計/ペアリング/紐づけ）
- Cloud Run を採用（api/web）
- Vertex AI Gemini の呼び出し方式（認証、最低限のログ）
- 生コード/プロンプトの取り扱い（保存しない、秘匿情報対策）

## Phase 1: Design & Contracts

- `data-model.md`: User, ExtensionInstallation, PairingCode, AggregatedMetric を確定
- `contracts/openapi.yaml`: ペアリング/質問生成/イベント送信/集計取得 API を定義
- `quickstart.md`: ローカル実行の最短手順、必要な env を整理

## Complexity Tracking

（現時点で憲法違反は想定なし）
