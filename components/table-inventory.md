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

---

## 0527 重新整理（**↺ row/col 轉置，與上方 0428/0511 結構不同**）

Figma source：`COMPONENT_SET Table` (`486:4370`)，2 個 variant：
- `type=allocate`（`486:4369`，611 × 263）— 數量分配表（未在本次範圍內）
- **`type=inventory`**（`486:4371`，**1578 × 303**）— 庫存表，**本次重點**

**最大改動**：上方 0428 spec 的「row=date, col=metric（勾選/房型/代號/庫存總數/可用庫存數/保留房數/分配數）」**整個翻轉**為「row=roomtype, col=date」。同時舊有多個 metric 欄被「合併或移除」。

### 外框

- size `1578 × 303`
- fill `Color/Neutral/0`
- header label `Texts md` 範例 `2026 / 02`（**只有年/月**，不再含日 + 星期；月份是表的時間範圍）@ x:16, y:12（111×43）

### Body（Frame 117，1546 × 228 @ x:16, y:63）

flex-row，第一欄是 label 欄，後面接 N 個 date 欄。

#### 第一欄（label 欄，**Frame 126**，193 × 228）

縱向分兩段：

| 區段 | h | 結構 |
|---|---|---|
| Frame 111（header 區，193 × 76） | 76 | 兩列各 38h：「日期」「星期」（這兩格在 label 欄是空白格、寫死字面 `日期`/`星期` 作 row label） |
| Frame 125（資料區，193 × 152） | 152 | 內含 2 個 sub-col：Frame 122（137w 「代號 / 房型」欄）+ Frame 124（56w 「可用」欄） |

Frame 125 內部 4 列（每列 38h）：

| row | Frame 122（137w）「代號/房型」 | Frame 124（56w）「可用」 |
|---|---|---|
| 0 (header) | `代號 / 房型` | `可用` |
| 1 | `XYZ-義大利麵房` | `99` |
| 2 | `abY-香蕉船房` | `99` |
| 3 (總計) | `總計` | `200` |

> 0428 spec 原本拆成 7 欄（勾選 / 房型 / 代號 / 庫存總數 / 可用庫存數 / 保留房數 / 分配數）；0527 **合併**為這一塊：
> - 「代號」+「房型」合併成單一文字 `XYZ-義大利麵房`
> - 「庫存總數 / 可用庫存數 / 保留房數 / 分配數」**合併簡化**為一個「可用」欄（取代原本 4 個 metric 欄；本欄改為純文字唯讀）
> - 「勾選」欄、「分配數」input、「保留房數」input **屬「空房查詢」mode**，本表（庫存表 mode）本就無；空房查詢這次未動，那些元件仍在那邊

#### 第二欄以後（date 欄）

每個 date 欄寬度依資料動態調整：
- **預設寬 84**（Frame 112, 128-141）
- **寬 93**（Frame 127）—— 0527 對位確認：col 02 因為 `總計` 行內有 3 位數 `999`，欄寬被撐到 93；其他多為 2 位數 stay 84

> 0527 觀察：欄寬隨「該欄最寬 cell content」變化，非固定。實作時建議以 `min-width: 84px` + content-fit 處理，或 grid `auto` 允許不等寬。

每個 date 欄縱向 6 列（總 228h）：

| row | h | 內容（範例 col 01 一） |
|---|---|---|
| 0 (header, 日期) | 38 | 日期數字置中，例 `01` |
| 1 (header, 星期) | 38 | 星期字置中，例 `一` |
| 2 (對齊用 blank) | 38 | **空白格**（用來與 label 欄 Frame 125 內 `代號/房型` header row 視覺對齊）|
| 3 (義大利麵房, Frame 130) | 40 | 3 個 sm chips 並排：`0` 訂綠 / `12` 餘藍 / `12` 保橙 |
| 4 (香蕉船房, Frame 131) | 36 | 同上結構 |
| 5 (總計, Frame 132) | 38 | 3 個 base chips（字較大）：`0` 訂綠 / `12` 餘藍 / `12` 保橙 |

#### chip 樣式（每 cell 內 3 個）

| chip | stroke | text | 對應 |
|---|---|---|---|
| 訂 | `#2aca18`（Surface/Positive 綠） | sm 12px on `#454545` / base on `#2aca18` (總計列) | 已訂房數 |
| 餘 | `#86b7fe`（Chart/blue 藍） | sm 12px on `#454545` / base on `#86b7fe` (總計列) | 餘房數 |
| 保 | `#f28b45`（Brand-400 橙） | sm 12px on `#454545` / base on `#f28b45` (總計列) | 保留房數 |

- 義大利麵房 / 香蕉船房 列：sm 字 12px，chip 22×24（含 stroke ring）
- 總計 列：base 字 16px，chip 22×22 或 27×30（依字數動態），**text color 改為 chip 自身色**（突顯總計加重）

#### 間距變化（**↺ 0527 調整**）

- header 區 76h 由原 single-row 38h **變成兩列**（日期 38h + 星期 38h）
- date 欄內第 3 列（y=76-114, 38h）改為**空白對齊用 row**，原本沒有此格
- chip 列高 38h（總計、義大利麵房）/ 40h（義大利麵房 chip 列） / 36h（香蕉船房 chip 列）—— 不再全部統一 38h

### 與上方 0428/0511 spec 的關係

- **0428 spec**（7 metric 欄、row=date）= 舊版「Table 1」結構，保留以追蹤變革；庫存表（[A] 庫存表 mode）**改用本段 0527 結構**。
- **0511 spec**（type=table 2 + modal）= 日期 details modal 觸發行為，**保留有效**；本 0527 結構的 header `01` / `一` 仍可作 trigger 開 modal。
- **0430 spec**（訂/餘/保 metric toggle）= 仍有效；toggle 控的 chip 對應到 0527 結構的每個 cell 內 3 個 chips（綠/藍/橙）。

### 0527 使用者確認（2026-05-27）

| # | 問題 | 答案 |
|---|---|---|
| 1 | 超寬時 UI 行為？ | **horizontal scroll**（既有行為延續，不改格式） |
| 2 | 「可用」欄 99/200 是否仍為 input？ | **純文字**（非 input，0527 改唯讀）|
| 3 | 「分配數」/「保留房數」input 搬到哪？ | **庫存表沒有**這兩個欄位；只在「空房查詢」mode 才有，空房查詢這次未改 |
| 4 | 勾選欄移除是否定案？ | **是**。勾選欄作用範圍在「**空房查詢**」mode，不在庫存表；庫存表本就不該有，0527 結構移除是正確。空房查詢這次未改，勾選欄仍在那邊 |
