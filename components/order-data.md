# 訂房資料 section (Figma Frame 348 — 1437:47107)

Accordion section, 685×888, bg `Color/Neutral/75`, radius 12, padding 20, border `Color/Neutral/200`.
Sits as `[D] 訂房資料` (between/after the existing [B] 訂房明細 and [C] 訂單條件 accordions).

## Top header row (Frame 350)

Three groups, all same row:

| group | content |
| --- | --- |
| left | title `訂房資料` (16px regular, `Color/Neutral/800`) + 鎖頭 icon (`Color/Brand/Brand-600`) |
| right1 | 清除 button — eraser icon + `清除` (16px, `Color/Neutral/800`) |
| right2 | checkbox + `入住人同訂房人` |
| right3 | checkbox + `寄送訂房資訊` |

Checkboxes are disabled-grey by default (fill `Color/Neutral/300`, see `feedback_checkbox_state`).

## Tabs (Frame 356)

Three pill tabs; each `72×42`, padding `10/20`, gap `28`. Border `Color/Neutral/100`.

- `訂房` — active (bg `Color/Neutral/0`)
- `入住` — inactive (bg `Color/Neutral/200`)
- `合約` — inactive (bg `Color/Neutral/200`) — *not present in the selection but required per user*

Active tab content sits below in `Frame 277` (white card, radius 12, padding 20, border `Color/Neutral/100`).

## 訂房 tab content (Frame 277)

2 × 2 grid of sub-cards, each padding 20:

### TL — Frame 275 (312.5×292) — basic identity

5 stacked rows, each `34px` tall, `label (76px) + input (196.5px)`:

1. 名稱 → input `王大頭`
2. 身份證號 → input `X111333555`
3. 護照號碼 → input `X111333555`
4. 生日 → calendar-simple input `2026-02-27` + 📅 icon (Calendar simple component)
5. 行動電話 → input `0988777111`

Inputs: radius 6, fill `Color/Neutral/100`, stroke `Color/Neutral/200`, padding `6/12`, placeholder color `Color/Neutral/400`.

### TR — Frame 272 (312.5×332) — nationality + address

- 國籍 (radio group, label 64px wide):
  - 臺灣 (selected — fill `Color/Neutral/400`, stroke double `Color/Neutral/200`/`Color/Neutral/300`)
  - 外籍 (unselected — fill `Color/Neutral/300`)
- 地址 (3 stacked sub-fields, each 64h):
  - 縣/市 → select `台中`
  - 行政區 → select `北屯區` + `406` (郵遞區號)
  - 街道 → input `placeholder`

### BL — Frame 276 (312.5×391) — contact + notes

- 性別 (radio): 男 (selected) / 女
- Email → `xyz@hotmail.com.tw`
- 市話 → `0988777111`
- 傳真 → `02-33331111`
- 會員備註 → textarea (113h), placeholder `placeholder`, with resize handle bottom-right

### BR — Frame 350 (312.5×348) — stats + habits

Stats — 4 rows of `label (Color/Neutral/500) | XYZ (Color/Neutral/800)`, padding-left 12:
- 訂金保留 / 累積消費 / 住房次數 / 最新住宿日

旅客習慣 (centered text), then 3 chip-rows (each `30h`, label + bordered chip):
- 消費方式 → `信用卡`
- 車位 → `必須`
- 住房安靜 → `要求高`

Chips: padding `4`, border `Color/Neutral/800`.

## 入住 tab

Not yet provided. For now mirror 訂房 layout (因「入住人同訂房人」可一鍵 copy 訂房 tab values).

## 合約 tab — Figma `Ordering data` (1404:47296), bounds 1400×465

Only visible when 「合約客戶」 button is active. Lock icon defaults to green `Color/Surface/Positive` (即 inputs active 可編輯).

3-column layout (Frame 277, 1360 wide):

| 區塊 | 寬 | 欄位（label → input） |
| --- | --- | --- |
| Frame 374 | 351 | 公司名稱 / 品保 / 統編 / 代號 / 公司別 |
| Frame 375 | 351 | 交觀甲 / 聯絡人一 / 連電一 / 聯絡人二 / 聯絡電話二 |
| Frame 376 | 331 | 傳真一 / 傳真二 / 備註 |

每行：label `64px` + input `235px`，input 白底 stroke `Color/Neutral/200` radius 6 padding 6/12，所有預設值 `王大頭`。

## Behavior

- Tab click → switch active state + show corresponding panel
- 清除 → reset inputs in active tab
- `入住人同訂房人` checkbox → copy 訂房 tab values into 入住 tab and disable 入住 inputs
- All fields default to read-style (greyed inputs `Color/Neutral/100`) — match Figma

---

## 0528 新增：Data exists 按鈕（名稱 row 右側）

Figma source：mobile mockup `1790:68448` (`Has data and show arrow button`) 與 `1790:68608` (`Arrow button hover`)，375 × 1227（[D] 訂房資料整段在 375 寬手機版的兩個狀態截圖）。

### 觸發條件

使用者在「名稱」input 輸入文字 → 後端回傳對應姓名候選的 dropdown → user 從 dropdown **選中一筆正確比對的人**後 → **「Data exists」按鈕才顯示**（=查有此人，可展開該客戶歷史資料 modal）。

未匹配 / 還沒選的狀態下，按鈕**不存在於 DOM**（不是隱藏）。

### 名稱 row 結構（mobile 375，Frame 245 內 295 寬，配 Data exists 按鈕時 4 元件 inline）

| order | 元件 | w × h | 備註 |
|---|---|---|---|
| 1 | Texts 名稱 label | 64 × 22 | `#ef6f25` 橘字（必填+主搜尋鍵）|
| 2 | Input `王大頭` | 119 × 34 | 寬被壓縮以挪位給按鈕（mobile only？desktop 待 spec） |
| 3 | Texts 先生 | 32 × 22 | honorific 是 `<span>`，依性別 radio 動態渲染：男 -> 「先生」、女 -> 「小姐」。**不是**固定 Texts、不是 select、不是 「先生 / 小姐」斜線字面值。實作：在性別 radio 的 change handler 內更新該 span 內容；訂房/入住 panel 各自獨立；預設性別 = 男 -> 初始「先生」 |
| 4 | **Data exists button** | **44 × 44** | 0528 新增；位於 row 末端 |

### Button 規格（兩態）

| 屬性 | Default (`1790:68604`) | Hover (`1790:68635`) |
|---|---|---|
| 尺寸 | 44 × 44 | 44 × 44 |
| `cornerRadius` | 6 | 6 |
| `padding` | 10 / 10 / 10 / 10 | 10 / 10 / 10 / 10 |
| `fill` | 無（透明）| `#6d6d6d`（中灰）|
| `stroke` | `#d1d1d1`（淺灰邊框）| `#d1d1d1`（不變）|
| 內含 icon | `icons/attached-link` 24×24，vector stroke `#000000`（黑）| `icons/attached-link` 24×24，vector stroke `#f6f6f6`（淺白）|

### 行為

- click → 展開「客戶歷史資料」modal（**modal 規格待使用者提供後補上 Modal 段**）
- modal 開啟期間此 button **是否切到 selected/active 黃底**？— 待 modal 給定後再看；目前只有 default + hover 兩態

### Preview 實裝決策（2026-05-28）

> **這是後端套用的條件渲染行為，preview 階段未串 DB，按使用者指示簡化：**
>
> - **永遠渲染 default 態 button** 在名稱 row 末端，**不**綁 input value gating
> - **不**實作 click → modal（modal 規格未到）
> - hover 態靠 CSS `:hover` 自動切（不需 JS）
> - 等後端接通 + dropdown 比對邏輯實作後，再把 button 改為「條件渲染」（input 有值且 dropdown 選中對應人才出現）

### 未確認

- desktop 版（685 寬 [D] section）名稱 row 是否同樣帶 Data exists 按鈕？Input 寬度與按鈕位置會不同，待補 desktop 對位
- 按鈕的 `aria-label`：暫定「客戶資料」，待最終命名確認

關聯：[[input]]（名稱 input dropdown）、[[modal]]（待補 modal）、[[icons]] (`attached-link`)
