# 正式單與候補單 — Figma Frame 1437:47168

> 命名注意：本檔內容是**房間預定頁 [E] 正式單與候補單**（檔名易誤導）。訂單處理頁的「訂單狀態」pill 見 order-status-pill.md；首頁 dashboard 訂單 widget 見 order.md。

Accordion section, 425×888, bg `Color/Neutral/75`, radius 12, padding 20, border `Color/Neutral/200`.

Sits as `[E]` next to `[D] 訂房資料`. Wrapped together in a grid:

```html
<div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
  [D] 訂房資料 (lg:col-span-2)   —— 2/3
  [E] 正式單與候補單 (lg:col-span-1) —— 1/3
</div>
```

- `<xl` (1280 px): stacks vertically (1 col), full width each
- `≥xl`: side-by-side, [D] = 2/3, [E] = 1/3 (matches Figma 685 + 425 ratio)

**Why xl, not lg**: at lg (1024 px), [D]'s internal `lg:grid-cols-2` becomes active, but [D] would only get 2/3 (~640 px) → inner 2-col = 320 px each, too cramped. Pushing the outer split to xl gives [D] one viewport range (1024-1280 px) to display its 2-col internal layout at full width before the side-by-side split kicks in.

合約 panel's 3-col breakpoint also bumped up: `md:grid-cols-2 2xl:grid-cols-3` (was `xl:grid-cols-3`). At 1280 px side-by-side, [D] = ~840 px → 3 cols would be ~280 px each. Waiting until 1536 px (2xl) gives [D] ~1000 px in side-by-side mode → 3 cols ~330 px each.

## Header
`正式單與候補單` (md 20 px `Color/Neutral/800`) + icons/down

## Content (Frame 295, white card, radius 12, pad 20)

### 訂單類型 radio group (1 line)
- Label: `訂單類型` (16 px, w-[76px])
- 3 radios (gap 24 px between groups):
  - `無設定` — default selected (stroke `Color/Neutral/200` + `Color/MenuItem/Default`)
  - `正式單`
  - `候補單`
- All radios use Tailwind `accent-menu`

### 內容區
- Centered text. Default state (`無設定`) → shows `未設定` (md 20 px `Color/Neutral/800`).
- Behavior: clicking a different radio swaps the panel via `[data-order-type-panel]` selector → `hidden` class.

### 正式單 panel — 付款方式 chip + 動態欄位 (Figma 967:11982 ~ 1402:24416, 8 variants)

選 `正式單` 後出現第二列：

**Payment method chips (8 顆，single-select)**：
`轉帳` / `傳真刷卡` / `票券` / `前台自付` / `信用交易` / `支票` / `訂金` / `紅利`

Active chip 顏色：fill `Color/SubItem/Selected`（黃）、text `Color/Neutral/800`、border `Color/SubItem/Selected`。
Inactive：white bg、border `Color/Neutral/200`、text `Color/Neutral/800`。
（**不要**用 `Color/Radio/Default` 藍 — 那是 mode-btn 的色，跟這組 chip 沒關係，請依 Figma `Button` node 的 `styles.fills` 取色。）

**選中 chip → 顯示對應欄位組**（依 Figma `circle-selected-yellow` 變體實際 active accordion 比對）：

| chip | 欄位（label : input type） |
| --- | --- |
| 轉帳 | 支付金額 / 收款帳號 / 客支付帳號 |
| 傳真刷卡 | 支付金額 / **卡號** / 授權碼 |
| 票券 | 支付金額 / 票券號碼 / 備註 textarea + 取消・檢查 buttons（**no 授權碼**） |
| 前台自付 | 支付金額 / 內容 / 備註 |
| 信用交易 | 支付金額 / 內容 / 備註 |
| 支票 | 支付金額 / 內容 / 備註 |
| 訂金 | 訂金餘額（顯示 `可用：11,044`，read-only）+ 支付金額（**no 內容/備註**） |
| 紅利 | 紅利餘額（顯示 `可用：11,044`，read-only）+ 支付金額（**no 內容/備註**） |

**修正歷史**：
1. 把 傳真刷卡 ↔ 信用交易 的欄位組對調了（已修）
2. 票券 加了「票券號碼 兩個 input」與「授權碼」欄位 — 都是錯的；票券 只有 票券號碼 一個 input、沒有 授權碼（已修）
3. 訂金 / 紅利 多加了「內容 / 備註」欄位 — 兩者都只有 餘額（顯示）+ 支付金額（已修）

**修正方法**：對每個 accordion 找 `styles.fills == ["Color/SubItem/Selected"]` 的 chip 鎖定哪個方法 active，再讀同一 accordion 內 chip 列下方的 label/input texts；不要從前後 accordion 推斷或補上「合理常見欄位」。

所有 input 預設 `placeholder` 文字、white bg、stroke `Color/Neutral/200`、radius 6、padding 6/12。
餘額顯示為 read-only label + value（不是 input）。

### 候補單 panel
尚未提供 Figma frame，placeholder 顯示「候補單內容（待 Figma frame 補齊）」。

## DOM contract
- Radios: `name="rb-order-type"`, values `none` | `official` | `substitute`, `data-order-type` attribute too
- Panels: `[data-order-type-panel="..."]` inside `#orderTypeContent`
- JS in `initSubPageBehaviors`: listens to `change`, toggles `.hidden` per matching key
