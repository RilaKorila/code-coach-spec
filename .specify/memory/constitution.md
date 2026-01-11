<!--
Sync Impact Report

- Version change: 0.3.0 → 0.3.1
- Modified principles:
  - Spec-First, User-Value → Spec-First, User-Value（仕様優先・ユーザー価値）
  - Story Independence & Traceability → Story Independence & Traceability（独立性とトレーサビリティ）
  - Testing Is Default (Opt-out Requires Explicit Sign-off) → Testing Is Default（テストはデフォルト）
  - Keep It Small (MVP-First, YAGNI) → Keep It Small（MVP優先）
  - Automation, Consistency, and Documentation → Automation, Consistency, and Documentation（一貫性と記録）
- Added principles:
  - Avoid Unnecessary Features & Over-Optimization（不要な機能追加・過剰最適化をしない）
- Added sections:
  - プロジェクト前提・技術制約
- Clarifications:
  - Web app is closed (login required) → CSR-first is acceptable; SSR not required by default
  - Default GCP execution product recommendation: Cloud Run (SHOULD)
- Removed sections: none
- Templates requiring updates:
  - ✅ updated: .specify/templates/plan-template.md
  - ✅ updated: .specify/templates/tasks-template.md
  - ✅ verified (no change): .specify/templates/spec-template.md
  - ✅ verified (no change): .specify/templates/checklist-template.md
  - ✅ verified (no change): .cursor/commands/speckit.constitution.md
  - ✅ verified (no change): .cursor/commands/speckit.plan.md
  - ✅ verified (no change): .cursor/commands/speckit.specify.md
- Follow-up TODOs: none
-->

# Code Coach Spec Constitution（憲法）

## Core Principles

### Spec-First, User-Value（仕様優先・ユーザー価値）
すべての変更は、ユーザー価値とテスト可能な成果を明記した feature specification から開始 MUST。
spec には user scenarios / acceptance scenarios / requirements / success criteria を含め MUST。
spec には実装詳細（言語、フレームワーク、ファイル配置など）を含めてはならない MUST（planning まで）。

### Story Independence & Traceability（独立性とトレーサビリティ）
user story は優先度付けされ、かつ独立して価値を提供する形で書かれていること MUST。
最優先（P1）の story だけを実装しても、ユーザーにとって有用な MVP になること MUST。
plan / tasks は、どの story に紐づくか追跡可能（US1/US2 など）であること MUST。
tasks は具体的なファイルパスを含め MUST。

### Testing Is Default（テストはデフォルト）
テストはデフォルトの期待値である（Testing is default）。非自明なロジック、外部連携、ユーザー可視の挙動変更がある場合、
tests（unit / integration / contract 等、適切な種類）を計画し実装すること MUST。
実装完了の判断前に、該当テストは FAIL する状態を確認していること MUST。
Webアプリの主要ユーザーフローについては、Playwright による E2E テストを用意すること SHOULD（特に認証/検索/分析閲覧など）。
テストを意図的に省略する場合、feature spec に「tests は要求しない」旨を明記 MUST。
その場合 plan に、省略理由と代替の検証方法（手動検証手順など）を記録 MUST。

### Avoid Unnecessary Features & Over-Optimization（不要な機能追加・過剰最適化をしない）
acceptance scenarios と success criteria に直接寄与しない機能追加は行わない MUST。
測定されていないパフォーマンス問題に対する最適化（予防最適化）は行わない MUST。
「将来必要になるかも」だけを根拠にした一般化や抽象化は行わない SHOULD（YAGNI）。
例外が必要な場合、plan に根拠（測定結果、想定ユーザー数、制約）と代替案を記録 MUST。

### Keep It Small（MVP優先）
acceptance scenarios を満たす最小の解で進める SHOULD（MVP-first）。
抽象化は、複数の具体的ユースケースで正当化できるまで延期 SHOULD。
複雑性を導入する場合は、理由・代替案・軽減策を明文化し追跡すること MUST。

### Automation, Consistency, and Documentation（一貫性と記録）
提供される Speckit の workflow / templates を一貫して使うこと MUST。
design を確定する前に、plan は unknowns を research で解消していること MUST。
スコープ、UX、セキュリティ、保守性に実質的な影響がある意思決定は、理由と代替案を記録 MUST。

## プロジェクト前提・技術制約

- **Deliverables**: VSCode extension + 分析のための Web アプリ
- **Web Backend**: Hono（MUST）
- **Web Frontend**: Next.js（MUST）
- **Web app (access)**: ログイン必須のクローズド運用（MUST）
- **Web app (rendering)**: CSR-first を許容（SHOULD）。SSR はデフォルトでは必須ではない。
- **AI**: Gemini API（MUST）
  - 利用形態は Vertex AI 経由を採用（MUST）
- **Deploy**: Google Cloud の「アプリケーション実行プロダクト」を以下のいずれかで実施 MUST  
  App Engine / Google Compute Engine / GKE / Cloud Run / Cloud Functions
- **Deploy (default)**: ハッカソン/小規模運用では Cloud Run をデフォルト候補として推奨（SHOULD）
- 選定した deploy 方式（どれを使うか、構成、環境変数、権限）は plan に明記 MUST

## Quality Gates

以下の gates を planning 開始時と design 後に再チェック MUST:

- feature spec が存在し、prioritized user stories / acceptance scenarios / requirements /
  measurable success criteria を含むこと
- spec に unresolved clarification markers が残っていないこと（残っていれば planning は停止 MUST）
- testing stance が明示されていること（tests デフォルト or 明示的 opt-out + 代替検証）
- plan / tasks が story 独立性とトレーサビリティを満たし、tasks にファイルパスがあること
- 技術制約（Hono / Next.js / Gemini API / GCP deploy）の逸脱がないこと（逸脱があるなら例外として記録 MUST）
- 不要な機能追加・過剰最適化が計画に含まれていないこと（含むなら根拠と計測を記録 MUST）

## Workflow & Review

すべての作業は次の documentation flow に従う MUST:

- feature spec が WHAT / WHY を定義（実装詳細は書かない）
- implementation plan が HOW を定義し、unknowns を解消し、constitution gate を明示
- tasks は user story ごとにグルーピングされ、段階的リリースと独立検証ができる

レビューでは constitution 準拠を明示的に確認 MUST。原則違反がある場合、逸脱内容・理由・軽減策を記録 MUST。

## Governance
この憲法は templates や慣習より優先される。template がこの憲法と矛盾する場合、template を修正 MUST。

改定（amendments）は、このファイルの変更として記録し、必要な template sync を行い、簡潔な理由を残す MUST。
改定時は semantic versioning に従い version を更新 MUST:

- MAJOR: 互換性のない governance 変更、principle の削除/再定義
- MINOR: 新しい principle、またはガイダンスの実質的な拡張
- PATCH: 明確化、表現改善、非意味的な修正

すべての plan/review で準拠が期待される。準拠できない場合は例外として、plan や tasks に理由と軽減策を明記 MUST。

**Version**: 0.3.1 | **Ratified**: 2026-01-11 | **Last Amended**: 2026-01-11
