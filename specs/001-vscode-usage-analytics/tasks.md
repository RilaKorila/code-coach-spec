---

description: "Task list for feature implementation"
---

# Tasks: VSCode拡張 利用状況分析ダッシュボード

**Input**: Design documents from `specs/001-vscode-usage-analytics/`  
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/openapi.yaml`, `quickstart.md`

**Tests**: By constitution, tests are the default expectation. This plan includes Playwright E2E and API tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## E2E (Web app)

- Webの主要ユーザーフロー（ログイン→ダッシュボード表示→期間切替）を Playwright で検証する
- 配置: `apps/web/e2e/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Monorepo の初期化と共通基盤

- [x] T001 Create monorepo directory structure per plan in `apps/` and `packages/`
- [x] T002 Initialize root workspace config in `package.json` (workspaces) and `package-lock.json`/`pnpm-lock.yaml` (choose one)
- [x] T003 [P] Add root TypeScript config in `tsconfig.base.json`
- [x] T004 [P] Add shared lint/format configs in `.eslintrc.*` and `.prettierrc`
- [x] T005 [P] Create `apps/api/package.json`, `apps/web/package.json`, `apps/extension/package.json`
- [x] T006 [P] Create shared types package skeleton in `packages/shared/src/index.ts`
- [x] T007 Add root scripts for dev/test/lint in `package.json` (api/web/extension/playwright)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 認証、DB、共通ミドルウェア、最低限のセキュリティ/観測性

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Setup env management for API in `apps/api/src/config/env.ts`
- [ ] T009 Setup env management for Web in `apps/web/src/config/env.ts`
- [ ] T010 Setup Firestore client wrapper in `apps/api/src/infra/firestore.ts`
- [ ] T011 Setup Vertex AI (Gemini) client wrapper in `apps/api/src/infra/vertexAi.ts`
- [ ] T012 Implement API server bootstrap in `apps/api/src/server.ts` (Hono app + routing)
- [ ] T013 [P] Implement API error handler middleware in `apps/api/src/middleware/error.ts`
- [ ] T014 [P] Implement API request logging middleware in `apps/api/src/middleware/logging.ts`
- [x] T015 Implement Web auth (Google login) in `apps/web/src/auth/` (NextAuth or equivalent)
- [ ] T016 Implement API auth for web calls (verify Google ID token) in `apps/api/src/middleware/webAuth.ts`
- [ ] T017 Implement API auth for extension installation (post-claim token) in `apps/api/src/middleware/installationAuth.ts`
- [x] T008 Setup env management for API in `apps/api/src/config/env.ts`
- [x] T009 Setup env management for Web in `apps/web/src/config/env.ts`
- [x] T010 Setup Firestore client wrapper in `apps/api/src/infra/firestore.ts`
- [x] T011 Setup Vertex AI (Gemini) client wrapper in `apps/api/src/infra/vertexAi.ts`
- [x] T012 Implement API server bootstrap in `apps/api/src/server.ts` (Hono app + routing)
- [x] T013 [P] Implement API error handler middleware in `apps/api/src/middleware/error.ts`
- [x] T014 [P] Implement API request logging middleware in `apps/api/src/middleware/logging.ts`
- [x] T015 Implement Web auth (Google login) in `apps/web/src/auth/` (NextAuth or equivalent)
- [x] T016 Implement API auth for web calls (verify Google ID token) in `apps/api/src/middleware/webAuth.ts`
- [x] T017 Implement API auth for extension installation (post-claim token) in `apps/api/src/middleware/installationAuth.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - 収集→集計→ダッシュボード表示 (Priority: P1) 🎯 MVP

**Goal**: VSCode拡張の「質問提示→回答→self-check」を収集し、Webで集計を表示する（ペアリング含む）

**Independent Test**: ログイン→ペアリングコード発行→拡張でclaim→質問生成→回答送信→Webに集計が出る

### Tests for User Story 1 (DEFAULT) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T018 [P] [US1] Contract test for pairing endpoints in `apps/api/tests/contract/pairing.test.ts`
- [ ] T019 [P] [US1] Contract test for question generation endpoint in `apps/api/tests/contract/questions.test.ts`
- [ ] T020 [P] [US1] Contract test for events ingest + metrics in `apps/api/tests/contract/events-and-metrics.test.ts`
- [ ] T021 [P] [US1] API integration test for aggregation logic in `apps/api/tests/integration/aggregation.test.ts`
- [ ] T022 [P] [US1] Playwright E2E: login → dashboard empty state in `apps/web/e2e/dashboard-empty.spec.ts`
- [ ] T023 [P] [US1] Playwright E2E: login → metrics appear (seed via API) in `apps/web/e2e/dashboard-metrics.spec.ts`

### Implementation for User Story 1

#### API (Hono)

- [ ] T024 [P] [US1] Define API types aligned with `contracts/openapi.yaml` in `apps/api/src/contracts/types.ts`
- [ ] T025 [US1] Implement `POST /v1/pairing-codes` in `apps/api/src/routes/pairingCodes.ts`
- [ ] T026 [US1] Implement `POST /v1/pairing-codes/claim` in `apps/api/src/routes/pairingCodesClaim.ts`
- [ ] T027 [US1] Issue installation auth token on claim and document format in `apps/api/src/auth/installationToken.ts`
- [ ] T028 [US1] Implement `POST /v1/questions/generate` (Vertex AI Gemini) in `apps/api/src/routes/questionsGenerate.ts`
- [ ] T029 [US1] Implement `POST /v1/events` (ingest, aggregate-only storage) in `apps/api/src/routes/events.ts`
- [ ] T030 [US1] Implement `GET /v1/metrics` (range=7d/30d) in `apps/api/src/routes/metrics.ts`
 - [x] T018 [P] [US1] Contract test for pairing endpoints in `apps/api/tests/contract/pairing.test.ts`
 - [x] T019 [P] [US1] Contract test for question generation endpoint in `apps/api/tests/contract/questions.test.ts`
 - [x] T020 [P] [US1] Contract test for events ingest + metrics in `apps/api/tests/contract/events-and-metrics.test.ts`
 - [x] T025 [US1] Implement `POST /v1/pairing-codes` in `apps/api/src/routes/pairingCodes.ts`
 - [x] T026 [US1] Implement `POST /v1/pairing-codes/claim` in `apps/api/src/routes/pairingCodesClaim.ts`
 - [x] T027 [US1] Issue installation auth token on claim and document format in `apps/api/src/auth/installationToken.ts`
 - [x] T028 [US1] Implement `POST /v1/questions/generate` (Vertex AI Gemini) in `apps/api/src/routes/questionsGenerate.ts`
 - [x] T029 [US1] Implement `POST /v1/events` (ingest, aggregate-only storage) in `apps/api/src/routes/events.ts`
 - [x] T030 [US1] Implement `GET /v1/metrics` (range=7d/30d) in `apps/api/src/routes/metrics.ts`
- [ ] T031 [US1] Ensure raw prompt/code is never persisted (code review check + guardrails) in `apps/api/src/policy/rawData.ts`

#### Web (Next.js)

- [x] T032 [P] [US1] Implement API client wrapper in `apps/web/src/lib/apiClient.ts`
- [x] T033 [US1] Implement pairing-code UI in `apps/web/src/app/pairing/page.tsx` (create + show code)
- [x] T034 [US1] Implement dashboard page (basic metrics + empty state) in `apps/web/src/app/dashboard/page.tsx`

#### VSCode Extension

- [x] T035 [P] [US1] Add extension settings + commands scaffold in `apps/extension/package.json` and `apps/extension/src/extension.ts`
- [x] T036 [US1] Implement pairing-code input flow in `apps/extension/src/pairing/pairingCode.ts` (store installation token)
- [x] T037 [US1] Implement Chat Participant API entrypoint (相談の入口) in `apps/extension/src/chat/participant.ts`
- [x] T038 [US1] Implement editor heuristic detector in `apps/extension/src/heuristics/generationLikeDetector.ts` (large insert, test-less logic increase)
- [x] T039 [US1] Implement “ask question” manual trigger in `apps/extension/src/commands/askQuestion.ts`
- [x] T040 [US1] Implement auto-trigger after 5 generation-like detections in `apps/extension/src/heuristics/autoTrigger.ts`
- [x] T041 [US1] Implement API client for extension in `apps/extension/src/api/client.ts`
- [x] T042 [US1] Implement question generation call (send raw prompt/code) in `apps/extension/src/commands/askQuestion.ts` (MVP integrated)
- [x] T043 [US1] Implement answer submission + self-check event in `apps/extension/src/commands/askQuestion.ts` (MVP integrated)

**Checkpoint**: US1 end-to-end demo possible (extension → api → aggregates → web)

---

## Phase 4: User Story 2 - 絞り込み（期間/条件） (Priority: P2)

**Goal**: 期間（7d/30d）や条件（eventType/category）で表示を絞り込める（最小実装）

**Independent Test**: UIで条件を変えると、取得する metrics と表示が切り替わる

### Tests for User Story 2 (DEFAULT) ⚠️

- [ ] T044 [P] [US2] API contract test for metrics filters in `apps/api/tests/contract/metrics-filters.test.ts`
- [ ] T045 [P] [US2] Playwright E2E: switch range 7d/30d in `apps/web/e2e/dashboard-range.spec.ts`

### Implementation for User Story 2

- [ ] T046 [US2] Extend `GET /v1/metrics` to support filters (category/eventType) per OpenAPI in `apps/api/src/routes/metrics.ts`
- [ ] T047 [US2] Add dashboard filter UI (range/category/eventType) in `apps/web/src/app/dashboard/page.tsx`
- [ ] T048 [US2] Ensure URL/query-state is reflected (shareable within closed app) in `apps/web/src/app/dashboard/page.tsx`

**Checkpoint**: US1 + US2 demo (filters work, E2E passes)

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: 仕上げ・運用最小化・ドキュメント整備

- [ ] T050 [P] Add minimal docs and update `specs/001-vscode-usage-analytics/quickstart.md` with real commands
- [ ] T051 Add basic rate limiting for `/v1/events` and `/v1/questions/generate` in `apps/api/src/middleware/rateLimit.ts`
- [ ] T052 Add basic secret/redaction heuristics before sending raw prompt/code (warning + opt-out) in `apps/extension/src/policy/redaction.ts`
- [ ] T053 Add minimal CI workflow to run lint + API tests + Playwright in `.github/workflows/ci.yml`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Final Phase)**: After desired user stories

### User Story Dependencies

- **User Story 1 (P1)**: Foundation complete
- **User Story 2 (P2)**: Depends on US1 metrics endpoint + dashboard existing

### Parallel Opportunities

- Tasks marked **[P]** can be done in parallel (different files / no shared dependency)

---

## Parallel Example: User Story 1

```bash
# Parallelizable tests:
Task: "Contract test for pairing endpoints in apps/api/tests/contract/pairing.test.ts"
Task: "Playwright E2E: login → dashboard empty state in apps/web/e2e/dashboard-empty.spec.ts"

# Parallelizable implementation:
Task: "Implement pairing-code UI in apps/web/src/app/pairing/page.tsx"
Task: "Implement API client for extension in apps/extension/src/api/client.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: E2E demo + basic tests

### Incremental Delivery

1. US1 を動く形にする（拡張→API→Web）
2. US2 のフィルタを追加

