---
author: Claude CLI
role: synthesizer draft
model_family: Claude
source_files:
  - specs/agent-council/aside-system-icon-overlap/round-1-codex.md
  - specs/agent-council/aside-system-icon-overlap/round-1-claude.md
  - specs/agent-council/aside-system-icon-overlap/round-2-codex-review.md
  - specs/agent-council/aside-system-icon-overlap/round-2-claude-review.md
---

# Consensus (DRAFT - pending user decision)

## Decision Candidates

### 候選 1：移除 topbar/mobile drawer 的 `system` icon（現在執行）
`source: Both`（Codex round-1 Option B、round-2 Branch 1；Claude round-1
方案 B、round-2 方案 2a）

移除 `preview/partials/topbar.html`（桌機）與 `preview/partials/aside.html`
（mobile drawer）的 system icon markup，讓 aside「系統設定」成為唯一的
設定入口。

### 候選 1a：移除但暫不同步 Figma
`source: Codex`（round-1 fallback、round-2 Branch 1 的變體提及）

移除 markup，但先不回頭改 Figma `Function icons` COMPONENT_SET（維持
Figma 端仍是 4 icon），在 repo 裡明確記錄這是「code 端的產品覆蓋，Figma
之後再補」。

### 候選 2：暫不移除，僅文件標記為未解決狀態
`source: Both`（Codex round-1/round-2 Option D / Branch 2；Claude round-1
方案 D、round-2 Layer 1 + 2c 的保留部分）

不動 markup，但在 `components/function-icons.md` 明確寫下：`system`
icon 目前是 Figma 保留位、零互動、語意（依 `specs/icons.md`）與 aside
「系統設定」重疊，不可被當成有效功能入口或未來 modal 的實作依據。

### 候選 3：全站統一隱藏（不動 markup 結構，僅視覺隱藏）
`source: Claude round-2 counterproposal（延伸自 Codex round-1 提問）`

若使用者想要「先不決定要不要真的拿掉，但也不想讓使用者看到一顆沒作用
的齒輪」，可以用**三頁一致的統一隱藏**（不分頁面條件判斷）。**必須**
避免 Session 84-85 那種「依頁面是否有對應 modal 決定要不要隱藏」的
per-page 條件式隱藏 - 那正是 Session 97 剛修掉的回歸根因。

## Why

Aside 在 Session 96 重整後，「系統設定」已經是一個有五個真實子項的
父分類；而 topbar/mobile drawer 的 `system` icon 目前零互動
（`components/function-icons.md`: 「後續功能，尚未有對應內容」），且
`specs/icons.md`（icons.md:99, icons.md:176）把這顆 icon 的官方語意
標籤本身寫成「系統設定」/「齒輪設定」- 這不是使用者觀感層面的巧合，是
專案自己的權威 icon 對照表裡的字面重複。雙方一致認為原始方案 C（
「重新定義語意」）在沒有具體產品規格前不成立，屬於「腦補」範疇。

## Agreement

- 語意重疊是查證得到的事實（icons.md 官方標籤），不是主觀印象。
- 四個原始候選方案裡，A（維持現狀不處理）最弱、C（重新定義語意）在
  沒有產品輸入前不成立。
- 候選 1（移除）是產品方向上最乾淨的答案，但涉及改動 Figma
  `Function icons` COMPONENT_SET 的固定結構（4 icon -> 3 icon），council
  不能替使用者做這個授權。
- 若暫不移除，候選 2（文件標記未解決狀態）是必要的最低限度動作 - 不論
  最終選哪個候選，都不應該讓這顆 icon 被後續任何 agent 誤判為有效功能。
- Codex 在 round-1 提出「是否應該隱藏」的疑問，經 Claude round-2 精確化
  為候選 3，並明確標出這個做法必須避免重蹈 Session 84-85 per-page 條件
  隱藏的覆轍；Codex 在 round-2 沒有反對這個精確化。

## Disagreement

**是否可以在使用者裁決「移除 vs 暫不移除」之前，先執行候選 2 的文件
修正動作：**

- **Claude 的立場**（round-1、round-2）：候選 2 的文件修正本身風險低、
  不會被任何最終選項推翻（不管最後選候選 1 或候選 2，這句「目前零互動、
  語意重疊」的敘述都成立），所以現在就可以先做，不需要等移除與否的
  最終裁決。
- **Codex 的立場**（round-2 critique）：`specs/agent-council.md` 明訂
  council 是 draft 決策輔助，`consensus.md` 本身不是權威來源；在使用者
  真正選擇一個分支之前，就把任何敘述寫進 `components/function-icons.md`
  這類權威檔案，即使內容本身低風險，也構成「提前收斂」- 應該嚴格遵守
  「先裁決、後收斂」的順序，council 過程中的判斷只留在 council 檔案裡，
  不要提前落地到權威 spec。

這個分歧沒有在 round-2 中收斂，留給使用者裁決（見下方 Needs User
Decision 第 1 題）。

## Risks

- **Figma 不同步風險**：若採候選 1 但不同步更新 Figma，`Function icons`
  COMPONENT_SET 會跟 code 產生落差；需要在對應權威檔案明確記錄這是
  「使用者確認的 code override」，避免被誤判為疏漏。
- **視覺/RWD 風險**：移除桌機 icon 會改變 topbar function icon 群組的
  間距（原本 44px 等距 4 icon），需要重新驗證桌機與 mobile drawer 的
  排版；候選 1 執行後必須跑視覺驗證，不能只改 markup 就視為完成。
- **重蹈 Session 84-85 覆轍的風險**（候選 3 專屬）：如果「隱藏」被實作
  成依頁面條件判斷（而非三頁統一），會重現 Session 97 剛修掉的那類
  回歸（同一組 icon 在不同頁行為不一致）。
- **文件超前於決策的治理風險**（候選 2 的執行時機爭議）：若在使用者
  裁決前就寫入權威檔案，即使內容正確，也違反 `specs/agent-council.md`
  的 Decision Convergence 原則字面規定，可能開先例讓未來的 council 討論
  也提前寫入權威檔案。

## Action Plan

**若使用者選候選 1（移除，現在同步 Figma）：**
1. 更新 `components/function-icons.md`：目前可見 function icon 為
   bulletin / message / person-md（會員安全管理）三顆；system 標記為
   已移除，並記錄移除理由（settings 已由 aside「系統設定」承接）。
2. 移除 `preview/partials/topbar.html` 桌機 system `<img>`。
3. 移除 `preview/partials/aside.html` mobile drawer system `<img>`。
4. 驗證桌機 topbar 與 mobile drawer 間距/排版（跑
   `node scripts/smoke-test.mjs` + `run-swift` driver 截圖）。
5. 若 Figma 端也要同步：更新 `Function icons` COMPONENT_SET 為 3 icon。
6. 記錄決策與驗證結果到 `specs/progress.md`。

**若使用者選候選 1a（移除，暫不動 Figma）：**
- 同上 1-4、6，但第 5 步改為在 `components/function-icons.md` 明確
  記錄「code 端已移除，Figma COMPONENT_SET 仍是 4 icon，屬已知的
  暫時性落差，待之後同步」。

**若使用者選候選 2（暫不移除，僅文件標記）：**
1. 更新 `components/function-icons.md`：加註 system icon 目前是 Figma
   保留位、零互動、語意與 aside「系統設定」重疊，不可作為有效功能入口
   或未來 modal 實作依據。
2. 記錄到 `specs/progress.md`：移除與否待產品/Figma 裁決，本輪只做
   文件澄清，不動 preview 實作。
3. 不需要跑 smoke test / 截圖（沒有動 preview 檔案）。

**若使用者選候選 3（統一隱藏）：**
1. 在 `preview/partials/topbar.html` 與 `preview/partials/aside.html`
   的 system icon 統一加上不分頁面條件的隱藏（例如固定 class，不透過
   JS 依頁面判斷），三頁行為必須一致。
2. 更新 `components/function-icons.md` 記錄目前為隱藏狀態、原因、以及
   「不可比照 Session 84-85 模式做成 per-page 條件隱藏」的提醒。
3. 驗證三頁桌機/mobile drawer 皆一致隱藏，跑 smoke test。
4. 記錄到 `specs/progress.md`。

## Needs User Decision

1. **候選 2 的文件修正時機**：是否同意在你選定候選 1/1a/2/3 之前，先
   讓文件修正（「system 目前零互動、語意重疊」這句敘述）落地到
   `components/function-icons.md`？還是依 Codex 的立場，嚴格等你選定
   分支之後才寫入權威檔案？
2. **要不要移除 `system` icon**：候選 1（移除+同步 Figma）/ 候選 1a
   （移除+暫不同步 Figma）/ 候選 2（暫不移除，僅文件標記）/ 候選 3
   （統一隱藏，不動 markup 結構）四選一？
3. **如果選候選 1，Figma 同步時機**：立即同步，還是接受暫時性落差、
   之後再補（等同直接跳到候選 1a）？
