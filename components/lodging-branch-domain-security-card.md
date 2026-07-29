# Component Specification: 網域安全卡

**Figma Node ID**：`2119:78165`（"Frame 427318997"，分館 1／有效態範例），對照組
`2131:97217`~`2131:97222`（分館 2／失效態範例）
**讀取日期**：2026-07-29
**使用位置**：`specs/pages/lodging-info.md`（尚未寫檔）headquarters/分館卡片區的第 3 張卡（跟「基本資訊卡」`components/lodging-branch-basic-card.md`、「須知與聲明卡」`components/lodging-branch-notice-card.md` 並列）。

---

## 概述

這張卡**沒有下一層**（2026-07-29 使用者確認）：不開 modal、不 inline 展開、不需要多語系。內容是憑證到期日資訊 + 有效/失效狀態 + 2 顆按鈕，按鈕點擊後的實際查詢/更新行為由後端實作，前端本輪只需要正確渲染版位與元件外觀。

---

## 結構

```
Frame 427318997 (bg Color/Neutral/75, border Color/Neutral/300, radius 12, padding 16)
- "網域安全" 標題 (20px SemiBold, Color/Neutral/800)
- Frame 630 -> Frame 427318907（資訊列）
  - 左：Frame 606（憑證到期日 label + 日期值，垂直堆疊）
  - 右：Frame 607（狀態 icon + 文字）
- Frame 653（按鈕列，2 顆並排）
  - "查詢網域期限" 按鈕
  - "更新網域期限" 按鈕
```

## 憑證到期日資訊

| 元素 | 內容 | 規格 | Token |
|---|---|---|---|
| Label | `憑證到期日` | 16px Regular | `Color/Neutral/800` |
| 日期值 | 示例 `2028-01-31` / `2022-01-31` | 16px SemiBold | `Color/Neutral/800` |

## 有效 / 失效狀態

| 狀態 | Icon | Icon 顏色 | 文字 |
|---|---|---|---|
| 有效 | `icons/check`（本機檔名 `check-green.svg`） | `Color/Surface/Status-Positive`（`#2aca18`） | `有效` |
| 失效 | `icons/failure`（本機檔名 `failure-red.svg`） | `Color/Surface/Status-Negative`（`#e12129`） | `失效` |

判定規則：憑證到期日是否已過目前日期，由後端計算並回傳「有效/失效」狀態，前端不自行比對日期。

## 按鈕列

| 按鈕 | 文字 | 樣式 |
|---|---|---|
| 查詢網域期限 | `查詢網域期限` | 白底，border `Color/Neutral/200`，radius 6，padding `6px 12px`（標準次要按鈕樣式，跟 modal footer 的「Button Y/N」次要態一致） |
| 更新網域期限 | `更新網域期限` | 同上 |

### 行為（2026-07-29 使用者拍板）

兩顆按鈕**各有各的點擊效果**，但實際行為（查詢網域期限的查詢邏輯、更新網域期限的更新邏輯）**留給後端實作**，前端本輪只需要正確渲染版位與按鈕外觀，做出可點擊的按鈕元件即可，不需要接實際查詢/更新的 API 呼叫或結果顯示邏輯。

---

## Typography / Colors

| 元素 | 規格 | Token |
|---|---|---|
| 卡片標題 | 20px SemiBold 600 | `Color/Neutral/800` |
| 外層卡片背景 | - | `Color/Neutral/75` |
| 外層卡片邊框 | - | `Color/Neutral/300` |
| 憑證到期日 label/值 | 16px Regular / SemiBold | `Color/Neutral/800` |
| 有效狀態 icon | - | `Color/Surface/Status-Positive` |
| 失效狀態 icon | - | `Color/Surface/Status-Negative` |
| 按鈕背景 | 白底 | `Color/Neutral/0` |
| 按鈕邊框 | - | `Color/Neutral/200` |

---

## Token gaps / unresolved

- 無。所有色值（`#f6fafd`、`#b0b0b0`、`#2aca18`、`#e12129`、`#d1d1d1`）皆已對照到 `tokens.md` 既有 token。`icons/check`（`check-green.svg`）、`icons/failure`（`failure-red.svg`）本機皆已存在，不需補匯出。

---

## 未讀取 / 待補項目

- 此卡在 `specs/pages/lodging-info.md` 頁面上的 RWD 斷點行為尚未個別示意，待補
