# Research: VSCode拡張 利用状況分析ダッシュボード

**Feature**: `001-vscode-usage-analytics`  
**Date**: 2026-01-11

## Decision: Deploy = Cloud Run（api/web 分離）

**Decision**: Cloud Run に `apps/api`（Hono）と `apps/web`（Next.js）を別サービスでデプロイする。  
**Rationale**: ハッカソンで運用が軽く、HTTPサービスをそのまま動かしやすい。  
**Alternatives considered**: App Engine（制約が多い場合がある）、GKE（重い）、GCE（運用が重い）

## Decision: Storage = Firestore（集計 + ペアリング + 紐づけ）

**Decision**: Firestore を採用し、集計値（AggregatedMetric）と PairingCode / ExtensionInstallation を保存する。  
**Rationale**: サーバレスでセットアップが軽く、集計データのキー設計と相性が良い。  
**Alternatives considered**: Cloud SQL（強いが運用が増える）、BigQuery（分析強いがMVPには過剰）

## Decision: Auth = Google login（Web）+ PairingCode（Extension）

**Decision**: Webは Google login。拡張は Webで発行した PairingCode を貼り付けて紐づける。  
**Rationale**: 拡張にOAuthを埋めずに済み、実装が最短。  
**Alternatives considered**: 拡張内OAuth（実装/UXコスト）、匿名ID（ユーザー単位の分析が弱い）

## Decision: Question Generation = Vertex AI Gemini（生プロンプト/コード送信、非永続）

**Decision**: 拡張から API に生プロンプト/生成コードを送信し、Vertex AI Gemini で質問を生成する。  
**Rationale**: 質問の質を上げやすく、拡張単体で完結させるより早い。  
**Alternatives considered**: テンプレ質問のみ（品質が落ちやすい）、ローカル実行（配布/認証が難しい）

## Decision: Data Policy（集計のみ保存）

**Decision**: DBに raw の質問/回答本文やプロンプト/コードは保存しない。保存するのは集計値のみ。  
**Rationale**: プライバシーと運用リスクを下げる。  
**Note**: 転送中は生テキストを扱うため、秘匿情報対策（警告/簡易マスキング）を計画に含める。

