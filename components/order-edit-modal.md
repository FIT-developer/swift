# Component Specification: 訂單修改 Modal（`state=order edit`）

**Figma Node ID**：
- 一般會員版：`2032:81567`，`1192 x 2474`
- 合約會員版：另一 instance（同一 frame 內第二個變體），`1192 x 2512`（比一般會員版高 38px，差異見下方「會員版本差異」）

**觸發來源**：`訂單處理` 頁（`specs/pages/order-processing.md`）表格列狀態 pill 下拉選單「修改」選項
**讀取日期**：2026-07-03
**讀取記錄**：`specs/order-processing-reading-notes.md` 讀取 5（一般會員版）/ 讀取 6（合約會員版，diff 比對）

---

## 概述

這個 modal 把「房間預訂」頁（`specs/pages/room-booking.md`）的 [A]-[E] 全部區塊搬進 modal，預填該筆訂單的既有資料，供編輯使用。**不是全新設計的表單**，body 內容大量沿用既有 spec，本檔只記錄：

1. Modal 外殼（header/footer，跟 `components/modal.md` 共用 header/footer pattern 的差異）
2. Body 內容跟既有 spec 的對照表 + 差異點
3. 會員版本差異（一般會員 vs 合約會員）
4. 本 modal 特有的互動規則

---

## Modal 外殼

沿用 `components/modal.md` 共用 header/footer 結構（見該檔「共用 Header」「共用 Footer」段），差異如下：

### Header

Header（1192 x 66）內容，由左至右：
- Texts「訂單修改」20px SemiBold 600 Color/Text/800
- 「還原」button（icon + 文字，圓角 pill，白底灰框）- 比 `components/modal.md` 共用 header 多這個
- icons/close

| 項目 | 規則 |
|---|---|
| 標題 | `訂單修改`（production 顯示不含 Figma 文件標註的「（一般會員版）」/「（合約會員版）」括號文字，見「會員版本差異」段） |
| 「還原」按鈕範圍 | **整頁還原** - 還原整個 modal 表單的所有資料。跟下方 [D] 訂房資料區塊自己內建的「還原」按鈕**範圍不同**：[D] 內建還原只還原訂房資料這個區塊。兩者不重複，是不同層級的操作（2026-07-03 使用者確認） |

### Footer

沿用 `components/modal.md` 共用 footer：`取消`（淺色）/ `確定`（深色）。兩個按鈕都是 **active 態**，不是 disabled（跟讀取 4 訂單明細 view-only modal 不同，這裡是可編輯表單所以確定按鈕正常可點）。

---

## Body 內容（4 大區塊，由上到下）

| 順序 | 區塊 | 對應既有 spec | 差異 |
|---|---|---|---|
| 1 | Accordion「庫存」 | `specs/pages/room-booking.md` [A] 空房與庫存查詢 | 無差異，逐項沿用（月曆/庫存表 mode toggle、日期格、訂/餘/保 圖例） |
| 2 | 訂房明細 cart 表格（Figma instance 名 `1140`） | `specs/pages/room-booking.md` 「頂部資料列（Frame 367）」+「訂房資料 Grid（Frame 557）」（該檔 line 154-179 一帶） | 無差異，欄位/checkbox 邏輯完全沿用；合約會員版在此區塊頂部多一列（見下方「會員版本差異」） |
| 3 | Order condition + Accordion「正式單與候補單」（左右並排） | 左：`components/order-condition.md`；右：`components/order-status.md`（**注意**：檔名雖是 order-status，內容才是 [E] 正式單與候補單；`components/order.md` 是另一個完全無關的首頁 widget） | 無差異，欄位逐項一致 |
| 4 | 訂房資料（Frame 453） | `components/order-data.md` [D] | Header 多一顆「還原」按鈕（原規格只有「清除」），位置在「清除」右邊；其餘欄位/tab/lock icon/橘字三件套一致 |

### 1. 訂房明細 cart 表格重點欄位

- 頂部：`訂單編號：{編號}`（純文字顯示）
- 三個獨立 checkbox：`團體名稱`（+ input）/ `使用保留房` / `自加庫存`，**三者彼此獨立**，非互斥非連動（2026-07-03 使用者確認，邏輯與 `room-booking.md` 一致）
- 8 欄表格：`入住日 / 退房日（含"N 夜" duration badge）/ 房型 / 專案 / 間數（stepper） / 單價 / 小計 / 原價 / 操作`
- 下方獨立小節「加購」（`Title` component 入口，本次讀取沒有展開內容，未定義）
- 再下方：`預付 / 百分比` / `預付訂金` / `總售價`

### 2. 訂房資料差異（Frame 453）

Header 內容，由左至右：
- Texts「訂房資料」+ icons/lock
- 「清除」button
- 「還原」button - 比 `order-data.md` 原規格多這顆，範圍只限訂房資料區塊
- checkbox「入住人同訂房人」
- checkbox「寄送訂房資訊」

---

## 會員版本差異（一般會員 vs 合約會員）

**重要**：這不是同一個 modal instance 裡可以切換的 toggle/mode。會員類型在**訂單生成當下就決定**：這筆訂單的客戶是「一般會員」，點下拉選單「修改」開出來的就是一般會員版；是「合約會員」，開出來的就是合約會員版。同一個 modal 沒有「切換」路徑（2026-07-03 使用者確認）。

### 唯一差異點：訂房明細 cart 表格頂部多一列（合約會員版限定）

一般會員版：
```
訂單編號：{編號}
[團體名稱 checkbox+input] [業務 select]     [使用保留房 checkbox] [自加庫存 checkbox]
```

合約會員版：
```
訂單編號：{編號}
[{合約編號} input] [合約公司 select] [新的訂房人 select]      <- 新增一列，合約會員專屬
[團體名稱 checkbox+input] [業務 select]     [使用保留房 checkbox] [自加庫存 checkbox]
```

新增列（Frame 590 內 Frame 374，橫向排列）：

| 控制項 | 類型 | 範例值 | 備註 |
|---|---|---|---|
| 合約編號 | Input | `22224332`（8 位數字） | 未定義：是否為公司統編格式 |
| 合約公司 | Select | placeholder「合約公司」 | 未定義：選項來源 |
| 新的訂房人 | Select | placeholder「新的訂房人」 | 未定義：選項來源、是否連動下方 [D] 訂房資料欄位；未驗證是否為橫向合併邊框群組 |

**除此之外，[A]/[C]/[D]/[E]/footer/BR 統計欄位（訂房次數/累積消費）在兩個版本間逐字元相同**（讀取 5 曾誤判「訂房次數/累積消費」為版本差異點，讀取 6 diff 比對後推翻此猜測）。

### 實作範圍（2026-07-03 使用者確認）

- 這階段 **HTML 示意只做「一般會員版」**
- 「合約會員版」的差異內容（上表）**寫進本檔（.md）即可**，讓之後接手的後端工程師看得到；不需要另外做一份可互動的合約會員版 HTML

---

## 未定義 / 待補

- 「合約編號 / 合約公司 / 新的訂房人」三個控制項是否為橫向合併邊框群組（需要之後補截圖驗證）
- 「新的訂房人」select 的選項來源／行為
- Cart 表格「操作」欄內容（只在文字節點看過欄名 `操作`，未看過實際按鈕/icon）
- 「加購」小節展開後的內容（本次讀取沒有展開示範）
- 訂房明細 cart 表格「原價」欄完整規格（讀取時被截斷，只看到灰字數值 + input）
