# Agent Council - repo-file-mediated Codex/Claude decision process

> 制定日：2026-07-08
> 背景：Codex 與 Claude 是不同模型、不共享對話記憶，不該硬湊在同一個 chat UI
> 裡即時對話。改用 repo 檔案交換提案與 review，過程可審計、可版本控制、跟
> 專案既有的 spec-driven 文化相容。

## 這是什麼

一個讓 Codex CLI 與 Claude CLI 針對同一份問題各自分析、互相 review、最後
整理出一份 draft 決策文件的流程。核心原則：**不是讓兩個 agent 自由聊天，
是讓它們依序讀同一份 brief、產出書面意見、最後由其中一方整理成決策草案**。

## 什麼問題值得跑 council（門檻）

**值得跑**（有真實 trade-off、你自己也還沒想清楚要選哪邊）：
- 架構層級的取捨（例如：aside active state 要不要改成 data-page 驅動）
- 技術選型有多個合理選項，各有不同代價
- 規格之間出現衝突，需要判斷哪邊該讓步
- 一個決定會影響多個檔案/多個未來 session 的做法

**不值得跑**（沒有真正分歧，或範圍太小）：
- 單一 Figma 元件的規格核對
- 小 bug 修正、文字修正
- 已經有明確 spec 依據、只是需要照做的實作
- 你已經知道答案、只是想找人確認的情況（直接問 Claude 或 Codex 其中一個就好）

不確定算不算值得跑時，先問自己：「如果 Codex 和 Claude 各自獨立分析，會不
會真的產出不同意見？」如果答案顯然是「不會」，就不需要 council。

## 觸發關鍵字

使用者用 `ai-chat` 觸發這個流程。

建議用法：

```text
ai-chat: 要不要把 aside active state 改成 data-page 驅動？
```

如果使用者只給一句問題，agent 先依 `_template.md` 建立
`specs/agent-council/{topic}/brief.md` 草稿，回報 topic 路徑與待確認的
brief 重點；使用者確認後才進入 round-1/round-2。

如果使用者已經準備好 brief，可直接指定路徑：

```text
ai-chat specs/agent-council/{topic}/brief.md
```

在 `scripts/agent-council.mjs` 做出來之前，`ai-chat` 代表啟動手動
repo-file-mediated 流程；腳本完成後，同一個關鍵字改由腳本執行，不需要換
新的觸發詞。

## 檔案結構

每次 council 開一個 topic 目錄：

```
specs/agent-council/{topic}/
  brief.md                    <- 問題與限制（使用者只寫這一份）
  round-1-codex.md            <- Codex 獨立分析
  round-1-claude.md           <- Claude 獨立分析
  round-2-codex-review.md     <- Codex review Claude 的 round-1
  round-2-claude-review.md    <- Claude review Codex 的 round-1
  consensus.md                <- draft 決策文件（見下方格式）
```

`{topic}` 用 kebab-case，簡短描述問題（例如 `aside-active-state`）。

brief 格式見 `specs/agent-council/_template.md`。

## 角色與流程

1. 使用者只寫一次 `brief.md`：背景、限制、候選方案、禁止事項、需要裁決的
   問題。
2. Codex 讀 brief，寫 `round-1-codex.md`（獨立分析，不看 Claude 的意見）。
3. Claude 讀 brief，寫 `round-1-claude.md`（獨立分析，不看 Codex 的意見）。
4. Codex 讀 `round-1-claude.md`，寫 `round-2-codex-review.md`（critique +
   counterproposal）。
5. Claude 讀 `round-1-codex.md`，寫 `round-2-claude-review.md`（critique +
   counterproposal）。
6. 其中一方擔任 **synthesizer**（不是 moderator）：讀完雙方全部四份文件，
   把共識、分歧、風險、建議方案、需要使用者裁決的問題整理成
   `consensus.md`。

**synthesizer 不裁決，只整理**。它的任務是讓使用者能快速看懂雙方立場、
快速拍板，不是替使用者做決定，也不是判誰對誰錯。

## `consensus.md` 是 draft，不是權威來源

`consensus.md` 一律標記為 draft / pending user decision。固定格式：

```markdown
# Consensus (DRAFT - pending user decision)

## Decision Candidates
列出可行方案（可能不只一個）。

## Why
每個方案的主要理由。

## Agreement
雙方一致同意的點。

## Disagreement
仍有分歧的點，以及各自的理由。

## Risks
實作或維護風險。

## Action Plan
若採用某方案，可執行步驟。

## Needs User Decision
只列真的需要使用者拍板的問題，不是雙方隨口的疑問。
```

## Decision Convergence

`consensus.md` is a draft decision aid, not an authority source.

After the user makes a decision, the accepted decision must converge into the
existing authority file that owns that rule or behavior:

- General project decision or handoff context -> `specs/progress.md`
- Cross-task workflow rule -> `start.md`
- Component behavior or variant rule -> `components/{name}.md`
- Page behavior, layout, or page-specific state -> `specs/pages/{name}.md`
- Implementation convention -> `specs/html-conventions.md`

The council run directory remains only historical evidence. Future work must not
treat `consensus.md` as the current source of truth unless the accepted decision
has been written back into the appropriate authority file.

## 失敗處理

任何一輪呼叫失敗或逾時，**已經產出的檔案不可刪除、不可回滾**。失敗的那
一輪留空或標記失敗原因，讓使用者可以手動接續、重跑失敗的那一輪，或直接
帶著目前已有的內容自己判斷。council 執行工具（見下）必須支援從既有
run 目錄繼續，不需要每次從 round-1 重來。

## 執行工具現狀

`scripts/agent-council.mjs`（自動化這整個流程的腳本）**尚未實作**。
先決條件是對本機的 `claude -p ...` 與 `codex exec ...` 做 CLI smoke test，
確認：stdin/stdout 格式、cwd 繼承行為、permission mode、timeout 行為、
失敗時的 exit code、JSON 輸出是否穩定可解析。沒有這輪驗證就直接寫
orchestration，容易卡在 CLI 行為細節上。

在腳本做出來之前，council 流程可以手動走（使用者自己分別呼叫 Codex/
Claude CLI，貼上對應檔案內容），一樣照上面的檔案結構與格式執行。
