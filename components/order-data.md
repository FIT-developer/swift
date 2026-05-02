# 訂房資料 section (Figma Frame 348 — 1437:47107)

Accordion section, 685×888, bg `#f6fafd`, radius 12, padding 20, border `#d1d1d1`.
Sits as `[D] 訂房資料` (between/after the existing [B] 訂房明細 and [C] 訂單條件 accordions).

## Top header row (Frame 350)

Three groups, all same row:

| group | content |
| --- | --- |
| left | title `訂房資料` (16px regular, `#454545`) + 鎖頭 icon (`#e05216`) |
| right1 | 清除 button — eraser icon + `清除` (16px, `#454545`) |
| right2 | checkbox + `入住人同訂房人` |
| right3 | checkbox + `寄送訂房資訊` |

Checkboxes are disabled-grey by default (fill `#b0b0b0`, see `feedback_checkbox_state`).

## Tabs (Frame 356)

Three pill tabs; each `72×42`, padding `10/20`, gap `28`. Border `#e1e1e0`.

- `訂房` — active (bg `#ffffff`)
- `入住` — inactive (bg `#d1d1d1`)
- `合約` — inactive (bg `#d1d1d1`) — *not present in the selection but required per user*

Active tab content sits below in `Frame 277` (white card, radius 12, padding 20, border `#e1e1e0`).

## 訂房 tab content (Frame 277)

2 × 2 grid of sub-cards, each padding 20:

### TL — Frame 275 (312.5×292) — basic identity

5 stacked rows, each `34px` tall, `label (76px) + input (196.5px)`:

1. 名稱 → input `王大頭`
2. 身份證號 → input `X111333555`
3. 護照號碼 → input `X111333555`
4. 生日 → calendar-simple input `2026-02-27` + 📅 icon (Calendar simple component)
5. 行動電話 → input `0988777111`

Inputs: radius 6, fill `#e1e1e0`, stroke `#d1d1d1`, padding `6/12`, placeholder color `#888888`.

### TR — Frame 272 (312.5×332) — nationality + address

- 國籍 (radio group, label 64px wide):
  - 臺灣 (selected — fill `#888888`, stroke double `#d1d1d1`/`#b0b0b0`)
  - 外籍 (unselected — fill `#b0b0b0`)
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

Stats — 4 rows of `label (#6d6d6d) | XYZ (#454545)`, padding-left 12:
- 訂金保留 / 累積消費 / 住房次數 / 最新住宿日

旅客習慣 (centered text), then 3 chip-rows (each `30h`, label + bordered chip):
- 消費方式 → `信用卡`
- 車位 → `必須`
- 住房安靜 → `要求高`

Chips: padding `4`, border `#454545`.

## 入住 tab

Not yet provided. For now mirror 訂房 layout (因「入住人同訂房人」可一鍵 copy 訂房 tab values).

## 合約 tab — Figma `Ordering data` (1404:47296), bounds 1400×465

Only visible when 「合約客戶」 button is active. Lock icon defaults to green `#2aca18` (即 inputs active 可編輯).

3-column layout (Frame 277, 1360 wide):

| 區塊 | 寬 | 欄位（label → input） |
| --- | --- | --- |
| Frame 374 | 351 | 公司名稱 / 品保 / 統編 / 代號 / 公司別 |
| Frame 375 | 351 | 交觀甲 / 聯絡人一 / 連電一 / 聯絡人二 / 聯絡電話二 |
| Frame 376 | 331 | 傳真一 / 傳真二 / 備註 |

每行：label `64px` + input `235px`，input 白底 stroke `#d1d1d1` radius 6 padding 6/12，所有預設值 `王大頭`。

## Behavior

- Tab click → switch active state + show corresponding panel
- 清除 → reset inputs in active tab
- `入住人同訂房人` checkbox → copy 訂房 tab values into 入住 tab and disable 入住 inputs
- All fields default to read-style (greyed inputs `#e1e1e0`) — match Figma
