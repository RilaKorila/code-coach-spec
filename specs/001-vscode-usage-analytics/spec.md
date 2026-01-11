# Feature Specification: VSCode拡張 利用状況分析ダッシュボード

**Feature Branch**: `001-vscode-usage-analytics`  
**Created**: 2026-01-11  
**Status**: Draft  
**Input**: User description: "VSCode拡張の利用状況を収集し、ログイン必須のWebアプリで分析・可視化する"

## VSCode拡張のスコープ（MVP）

**目的**: 初学者が VibeCoding 中に学習を促進できるよう、理解を深めるための質問を提示する。

### MVP（必須）

- ユーザーが VSCode 上で「質問を出す」操作を実行できる
- システムは、ユーザーが使っているプロンプト/生成したコードの理解を深めるための質問を提示する
- ユーザーは質問に回答できる（テキスト/選択式などは問わない）
- 質問と回答は分析用イベントとして収集され、Webダッシュボード側で集計として可視化できる

### NOT in MVP（今回やらない）

- 理解の誤りをユーザー単位で永続的に記憶して、次回以降の質問に反映する（“システムとして記憶”）

### WANT（次の段階）

- ユーザーの理解の間違い（誤答傾向）を蓄積し、次回の質問で補強できるようにする

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 利用状況を収集してダッシュボードで確認する (Priority: P1)

ユーザーとして、VSCode拡張の利用状況が自動で収集され、Webアプリにログインすると
分析結果（基本指標）が可視化されている状態にしたい。

**Why this priority**: まず「データが集まる」「見える」が成立しないと価値が出ないため。

**Independent Test**: 拡張からテストデータを送信でき、Webアプリでログイン後にダッシュボードで
“データが表示される”ことを確認できる（E2Eで主要フローを検証可能）。

**Acceptance Scenarios**:

1. **Given** ユーザーがログインしている, **When** ダッシュボードを開く,
   **Then** 直近の利用状況サマリ（例: イベント数、日別推移など）が表示される
2. **Given** まだデータが存在しない, **When** ダッシュボードを開く,
   **Then** 空状態がユーザーに分かる形で表示され、収集開始方法が案内される

---

### User Story 2 - 期間や条件で分析結果を絞り込む (Priority: P2)

ユーザーとして、特定期間（例: 直近7日/30日）や条件（例: 機能/イベント種別）で
分析結果を絞り込んで傾向を見たい。

**Why this priority**: P1が成立した後、意思決定に役立つ“分析らしさ”を増やせるため。

**Independent Test**: 絞り込み条件を変更し、表示されるグラフ/数値が変化することを確認できる。

**Acceptance Scenarios**:

1. **Given** 収集済みデータがある, **When** 期間を「直近7日」に変更する,
   **Then** 表示が直近7日に限定される
2. **Given** 収集済みデータがある, **When** 特定イベント種別でフィルタする,
   **Then** 表示がそのイベントに限定される

---

### Edge Cases

- 拡張がオフラインのとき、イベント送信はどう扱うか？（再送/破棄/ローカルに一時保存）
- 送信失敗やレート制限が起きたとき、ユーザーにどう通知するか？（静かにリトライ/明示）
- 同一ユーザーが複数端末で拡張を使う場合、集計はどう扱うか？
- 自動質問トリガー（5回コード生成）に達した判定は、どのタイミングでリセットされるか？
- “生成っぽさ”推定の誤検知（false positive/negative）をどう扱うか？
- 送信対象に秘匿情報（APIキー等）が含まれていた場合、どう扱うか？（マスキング/警告/送信中止）

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST VSCode拡張から利用状況イベントを受け付け、ユーザー単位で関連付ける
- **FR-002**: System MUST ログイン必須のクローズドWebアプリを提供し、未ログインでは分析情報を閲覧できない
- **FR-003**: System MUST ダッシュボードで基本指標（例: 日別推移、イベント数）を表示する
- **FR-004**: Users MUST be able to 期間（例: 7日/30日）で表示を切り替える

- **FR-006**: System MUST authenticate users via Google login
- **FR-006a**: System MUST provide a pairing-code flow to associate a VSCode extension installation with the logged-in user
- **FR-007**: System MUST allow users to trigger a learning question in the VSCode extension, and MUST show a question aimed at understanding the current prompt and/or generated code
- **FR-007a**: System MUST support two “相談の入口”/trigger sources in the VSCode extension:
  - Chat Participant API: 相談はここに来るようにする
  - editor events: “生成っぽさ”を推定して介入する（実装軽め）
- **FR-007b**: System MUST trigger a question automatically after 5 detected “code-generation-like” events (in addition to manual trigger)
  - “code-generation-like” is detected from editor events (e.g., onDidChangeTextDocument), such as:
    - A large number of lines added in a single change (paste / generation likely)
    - Recent changes increased main logic without accompanying tests (heuristic)
- **FR-008**: System MUST collect “Code Coach” interaction events from the VSCode extension:
  - **QuestionAsked**: 拡張が質問を提示した（質問本文、カテゴリ、関連コンテキスト、trigger: manual/auto、autoReason: generatedCodeCount5 など）
  - **AnswerSubmitted**: ユーザーが回答した（回答内容、回答種別、self-check: 理解できた/できてない）
  - **QuestionDismissed**: ユーザーがスキップ/閉じた
  - **Feedback**: 回答が役に立ったか等のフィードバック（任意）
- **FR-009**: System MUST store only aggregated analytics metrics for the dashboard (集計のみ保存)
  - System MUST NOT store raw question/answer text in the database
  - System MUST support at least "last 7 days" and "last 30 days" views from stored aggregates
- **FR-010**: System MUST generate learning questions using Gemini (via Vertex AI) based on the user's raw prompt and/or generated code sent from the VSCode extension
  - System MUST NOT persist the raw prompt/code beyond what is required to generate the question
  - System MUST transmit prompt/code securely (e.g., via HTTPS) and use least-privilege credentials

### Key Entities *(include if feature involves data)*

- **User**: Webアプリの利用者（ログイン主体）
- **ExtensionInstallation**: VSCode拡張のインストール単位（ユーザーと紐づく。複数端末を許容）
- **PairingCode**: Webで発行されるワンタイムの紐づけコード
- **Device**: 拡張が稼働する端末（任意で識別）
- **UsageEvent**: 拡張から送られる利用状況イベント（種類、時刻、関連メタデータ）
- **CoachQuestion**: 拡張が提示する質問（本文、カテゴリ、提示時刻）
- **CoachAnswer**: ユーザーの回答（本文、種別、回答時刻）
- **AggregatedMetric**: ダッシュボード表示用の集計値（例: 日別件数、カテゴリ別件数、self-check率など）
- **DashboardView**: 指標やグラフの表示単位（期間/フィルタ）

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 初回セットアップ後、ユーザーが「ダッシュボードでデータを確認」するまでを10分以内で完了できる
- **SC-002**: 直近7日/30日の切り替えで表示が正しく切り替わる（ユーザーが確認できる）
- **SC-003**: 主要イベント（質問提示/回答送信）が収集され、日別の集計として可視化されることを確認できる
- **SC-004**: 主要フロー（ログイン→表示→期間切替）がE2Eで再現可能である
- **SC-005**: VSCode拡張で「質問提示→回答」が完了し、その結果が集計に反映されることを確認できる
