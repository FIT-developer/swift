# Table — 庫存表

> 用於 [A] 空房與庫存查詢右側面板（Table instance）。

---

## 外框

`725 × 263`，fill `Color/Neutral/0`，stroke `Color/Neutral/200`，r:12，pad 12/16

## Header

Texts（md）「2026 / 02 / 15  四」，`Color/Neutral/800`；顯示選取日期 + 星期

## 表格區（Frame 117）

`693 × 188`，flex-row，7 欄並排

### 欄規格

| 欄 | Frame | 寬 | header fill | 說明 |
|---|---|---|---|---|
| 勾選 | Frame 110 | 46 | stroke `Color/Neutral/900` | checkbox 欄，header/footer 用 Rectangle |
| 房型 | Frame 111 | 151 | stroke `Color/Neutral/900` + fill same header | 「義大利麵房」「香蕉船房」「總計」 |
| 代號 | Frame 112 | 62 | stroke `Color/Neutral/900` | XYZ / XYZ / — |
| 庫存總數 | Frame 113 | 88 | stroke `Color/Neutral/900` | 99 / 99 / 200 |
| 可用庫存數 | Frame 114 | 104 | — | 88 / 88 / **200**（footer 值 `Color/Brand/Brand-600`） |
| 保留房數 | Frame 115 | 88 | — | 11 / 11 / 200 |
| 分配數 | Frame 116 | 72 | — | Input(sm) / Input(sm, disabled) / 100 |

### Row 高度

- Header: 38px
- 資料行: 38px（每欄各 2 資料行）
- Footer (總計): 38px，footer 欄高 181px（小 7px）

### Header / Footer 樣式

Header 行：stroke `Color/Neutral/800`（加粗邊框效果）
Footer 行：stroke `Color/Neutral/800`

### 勾選欄

- Frame 100 / 101：各 46×38，內含 `Checkbox original`（14×14，@ x:12,y:12）
- Header 和 footer 為 Rectangle（填滿格）

### 分配數欄（Input 格）

- 可編輯：fill `Color/Neutral/0`，stroke `Color/Neutral/200`，r:6，帶 icons/down（32×32 格內）
- 唯讀：fill `Color/Neutral/100`，stroke `Color/Neutral/200`，r:6

## 數量分配列（Frame 119）

`725 × 62`，fill `Color/Neutral/0`，stroke `Color/Neutral/200`，r:12，緊接在 Table 下方（@ y:395）

| 元素 | 說明 |
|---|---|
| Range（562×35） | 水平滑桿（詳見 range.md），@ x:16 |
| Frame 102（111×38） | 「數量分配」label + icons/submit，@ x:598 |

---

## 訂 / 餘 / 保 metric toggle（2026-04-30 補）

> **僅適用於本表（庫存表 / Variant 2 inventory）。** 不影響 `table.md` 既有 chip 顏色語義表（可用/保留/警示）— 該表保留為歷史紀錄。

### 來源

Figma `Frame 346`（148×36）位於 Frame 348（filter row）右側 x:557，與棟別 chip 同行；僅在「庫存表」mode 顯示，「空房查詢」mode 隱藏。

### 三顆按鈕規格（共用樣式 + 各自顏色）

每顆 `36 × 36`，cornerRadius `4`，padding `4`，stroke `Color/Neutral/200`（未選態 border 改用各自色），按鈕間距 `20px`。

| 按鈕 | 對應顏色 | 語義 | 控制的 cell chip border 色 |
|---|---|---|---|
| 訂 | `Color/Surface/Positive`（綠） | 已訂房數 | `border-[Color/Surface/Positive]` |
| 餘 | `Color/Chart/blue`（藍） | 餘房數 | `border-[Color/Chart/blue]` |
| 保 | `Color/Brand/Brand-400`（橙） | 保留房數 | `border-[Color/Brand/Brand-400]` |

### 兩態樣式

| 狀態 | bg | border | text |
|---|---|---|---|
| 選中（active，預設三顆皆選中） | 該色填滿 | 該色 | `Color/Neutral/800` |
| 未選 | `Color/Neutral/0` | 該色（保留） | `Color/Neutral/800` |

> **與 Figma 示意稿差異**：Figma 內字色為 `Color/Neutral/0`（白），實裝統一為 `Color/Neutral/800`（黑），確保未選態白底時文字可讀，且兩態文字色一致。

### 行為

- 點擊 → toggle 該按鈕選中 / 未選
- 選中 → 對應顏色 chip 在每個 cell 顯示
- 未選 → 對應顏色 chip 在每個 cell 隱藏（`display: none`）
- 三顆獨立可組合，不互斥

### 與 `table.md` 顏色語義表的關係

`table.md` Variant 2 的 chip 色語義原為「可用/保留/警示」，是依 Figma 視覺反推的早期推測。本檔 2026-04-30 從 Figma `Frame 346` 讀到實際按鈕標籤後，**修正為訂/餘/保**，且僅適用於本表上下文。`table.md` 那份保留以追蹤變革歷史。

---

## Current Figma contract（2026-05-11）

> Source：`1405:48344`，component name `type=table 2 + modal`，frame size `1019 × 514`。

### Toolbar

第一列右側 toolbar 由兩組內容構成：

| 元素 | Figma node | 規格 |
|---|---|---|
| Mode toggle | `1405:48352` | `空房查詢` + `庫存表`，庫存表 selected state 為 blue fill (`Color/Radio/Default`) |
| Excel download button | `1405:48355` | `98 × 36`，文字 `Excel` + `icons/download` 24px，fill `Color/Neutral/0`，stroke `Color/Neutral/200`，r:6，padding 6/12；只在「庫存表」mode 顯示，「空房查詢」mode 隱藏 |

### Date details modal

日期欄表頭中的「日期數字」與「星期」皆為同一日期 column 的 trigger。以 Figma 示意中的 `11` / `一` 為例，點擊任一者展開 `state=date details` modal。

| Modal node | Size | Header | Body |
|---|---:|---|---|
| `1405:48924` | `384 × 189` | 完整日期文字（示意：`2026-04-11`）+ `icons/close` | 表格欄位：`房型 / 正式 / 未付款 / 已過期 / 候補` |

Body 示意內容：

| 房型 | 正式 | 未付款 | 已過期 | 候補 |
|---|---:|---:|---:|---:|
| 義大利麵房 | 0 | 0 | 0 | 0 |
| 香蕉船房 | 1 | 1 | 1 | 1 |

### 實作決策

- Modal title 由使用者點擊的 date column 決定，不固定寫死 Figma 示意日期。
- 目前 preview 無後端資料來源；modal body 先依 Figma 示意提供 static demo rows。
- Modal 是庫存表內的 contextual dialog，不使用全頁 backdrop；關閉行為鎖在 modal 自己的 close button，不用 outside click / scroll / resize / Esc 關閉。
- Modal content 若包含 table，body 預設 `overflow-x: auto`；table 採內容寬度與 `min-width: 100%`，小尺寸 viewport 不壓縮欄位、不讓 table 撐爆 modal。
