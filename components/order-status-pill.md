# Component Specification: 訂單狀態 Pill + 下拉選單

> 命名注意：本檔是**訂單處理頁表格的狀態 pill + 下拉選單**。房間預定頁 [E] 正式單與候補單 見 order-status.md（檔名易誤導）；首頁 dashboard 訂單 widget 見 order.md。

**使用位置**：`specs/pages/order-processing.md` 表格「訂單編號」欄
**Figma Node ID（讀取樣本）**：
- Pill instance（row1）：`2027:64493`
- 下拉選單（desktop, inline dropdown）：`2032:77575`
- 下拉選單（mobile/tablet, Offcanvas bottom sheet）：`2032:73340`，對應 component `Offcanvas` variant `type=bottom sheet`（`1907:70674`）

**讀取日期**：2026-07-03
**讀取記錄**：`specs/order-processing-reading-notes.md` 讀取 1（表格內容）/ 讀取 2（pill 背景色截圖驗證）/ 讀取 3（下拉選單內容）/ 讀取 10（mobile offcanvas）/ 讀取 11（狀態圖例 tooltip）/ 讀取 12（offcanvas component 本體 cross-check）

---

## 概述

表格「訂單編號」欄每一列是一個**深色 pill 按鈕**：左側狀態色點 + 訂單編號文字 + 右側下拉箭頭。點擊箭頭開啟一個選單（desktop 是 inline dropdown，mobile/tablet 換成 Offcanvas 底部滑出面板），提供 6 個操作入口。

---

## Pill 視覺規格

| 屬性 | 值 | Token |
|---|---|---|
| 背景 | `#4f4f4f`（截圖像素取樣驗證，5 個狀態列皆同色，**不隨狀態變色**） | `Color/Neutral/700` |
| 形狀 | 完全圓角 pill，cornerRadius 44（`get_node` 2026-07-03 確認） | 近似全圓 |
| 邊框 | 1px，`#f6f6f6` | `Color/Neutral/50` |
| Padding | 4px 10px（`get_node` 2026-07-03 確認） | - |
| 文字色 | 近白 | `Color/Text/50`（`#f6f6f6`） |
| Triangle icon 色 | 白 | - |
| 內部順序 | 色點 -> 訂單編號文字 -> `icons/triangle`（dropdown 箭頭） | - |

### 狀態色點（`Color/Dots/*` token，2026-07-03 Figma Variables 同步後確認）

| dot 顏色 | Token | tooltip 圖例中文（讀取 11） | 篩選 tabs 中文 |
|---|---|---|---|
| 綠 `#2aca18` | `Color/Dots/validated` | 正式單 | 正式單 |
| 灰 `#b0b0b0` | `Color/Dots/unpaid` | 未付單 | 未付款 |
| 黃 `#ffcc00` | `Color/Dots/overdues` | 逾期單 | 已過期 |
| 紅 `#e12129` | `Color/Dots/cancel` | 取消單 | 取消單 |
| 藍 `#86b7fe` | `Color/Dots/alternative` | 替代單 | 候補單 |

**已確認（2026-07-03）**：tooltip 圖例用語跟篩選 tabs 用語不完全一致（3 處），這是**不同顯示情境下允許的差異**，不需要統一成同一套字。實作時 tooltip 顯示 tooltip 版用語、tabs 顯示 tabs 版用語，CSS 顏色一律用 `var(--color-dots-*)`，不要用中文標籤或 Figma 圖層命名當 class/變數名。

**篩選 tabs 對應狀態的邏輯**：tabs 確實對應這 5 個狀態做篩選（例如「正式單」tab = 只顯示 `validated` 狀態列），但**篩選邏輯是後端處理範圍**，前端這階段只要把每種狀態的視覺示意（表格範例列）做齊全即可，不需要實作真正的篩選功能。

---

## 下拉選單內容（desktop / mobile 共用同一份內容，容器不同）

| 選項 | 行為 | 備註 |
|---|---|---|
| 訂單 | 開啟「訂單明細」modal（`components/modal.md` `state=order summary`，既有實作 `modalOrderSummaryBackdrop`） | 沿用既有 modal，非新內容 |
| 修改 | 開啟「訂單修改」modal（`components/order-edit-modal.md`，新內容） | - |
| 連結 | 產生「訂房連結」 | 後端功能，無專屬 UI；**條件式顯示**：訂單來源不是「網路訂房」就不會出現這個子項目 |
| 簡訊 | 開啟「簡訊」modal（`components/modal.md` `state=sms / order summary`，既有實作 `modalSmsBackdrop`） | 沿用既有 modal，非新內容 |
| 複製 | 複製這筆訂單資料，帶進「房間預訂」頁（把可用欄位資料帶過去，讓後續可以直接在房間預訂頁操作） | 後端功能 |
| 取消 | 取消這筆訂單（**高強度操作**） | 後端功能。**UI 刻意沒有特殊強化樣式**（沒有紅字/警示色），跟其他選項視覺一致 - 公司核可此版本如此設計，實作時不要自行加上警示樣式 |

**已確認（2026-07-03）**：所有訂單狀態共用同一個下拉選單/modal 版型，不會因狀態不同而有不同版面結構。同一版型內顯示的子項目會依後端資料條件式顯示（例如「連結」子項目）。前端只要把版型/畫面備齊，條件式顯示的邏輯留給後端。

### 選單樣式

- 每項 `136x44`（desktop dropdown）/ 全寬 `x44`（mobile offcanvas），純文字 16px，無 icon
- `修改` 項目 fill `#fad4ae`（`Color/Brand/Brand-200`） - **這是寫死在 component 上的固定樣式**，不是 hover/focus 互動態（讀取 12 對照 component 本體確認，修正了讀取 3 原本「誤判為 hover 態」的判斷）
- 其餘 5 項 fill 白（`Color/Neutral/0`）

### Desktop vs Mobile 容器差異

| | Desktop | Mobile / Tablet |
|---|---|---|
| 容器 | inline dropdown（貼齊 pill 左下角展開，白底陰影圓角卡片） | `Offcanvas` component `type=bottom sheet`（底部 slide-in），跟庫存表月曆選日期用的是同一個既有元件 |
| Header | 無（dropdown 本身就是選單） | 「選單」標題 + `icons/close` |
| Dismiss | 未定義（點外部關閉？未驗證） | 依 `components/offcanvas.md` 既有 2 條 dismiss 路徑，cross-check 待確認是否沿用同一套規則 |

---

## 次要 badge（訂單編號欄下方，pill 底下一列或多列小標籤）

**垂直順序（2026-07-03 使用者確認）**：由上到下固定是 **pill（訂單編號）-> 來源 badge（有值才顯示）-> 分類 badge 群組**，不是同一列並排。

**兩種 badge 樣式不同，`get_node` 2026-07-03 逐項確認過，不是同一套樣式改顏色：**

| 屬性 | 分類 badge（加購/對帳/註/修改/團體/企業/國旅/促銷/網路訂房/開發票...） | 來源 badge（`Booking` / `Agoda`） |
|---|---|---|
| Figma component | `Status buttons`（e.g. `2004:63505`） | `Status buttons`（e.g. `2026:68595`） |
| cornerRadius | `2px` | `6px` |
| Padding | `2px 6px` | `4px 12px` |
| 背景 | `Color/Neutral/0` 純白 | **linear 漸層**：白 -> `Color/Brand/Brand-200`（`#fad4ae`），左下往右上對角線 |
| 邊框 | 四邊 1px，`Color/Neutral/500`（`#6d6d6d`） | **只有左邊** 2px，`Color/Brand/Brand-400`（`#f28b45`）；上/下/右無邊框 |
| 文字色 | `Color/Neutral/500`（`#6d6d6d`，跟邊框同色） | `Color/Neutral/800`（`#454545`） |
| 字級 | **16px（base）** | 12px（sm） |

**來源 badge 讀取陷阱（2026-07-03 SVG export 覆核）**：`get_selection` 對此節點回報 `strokes:["#f28b45"]` 且完全沒有 `fills` key。實際上 stroke 是「僅左邊單邊」（SVG 中上/下/右是零面積退化路徑）、fill 是被靜默省略的漸層。單邊 stroke + 漸層 fill 消失兩個已知陷阱同時出現在同一個節點。

**來源 badge 條件式渲染**：代表訂單「來源」（Booking / Agoda 等 OTA 通路）。訂單有來源值才顯示，沒有就不顯示，不是固定規則（2026-07-03 使用者確認）
**分類 badge 分類歸屬**：不需要現在釐清每個 badge 對應篩選面板哪個欄位分類（2026-07-03 使用者確認）。前端照 Figma UI layout 直出 HTML、視覺示意給足即可，badge 跟資料欄位的對應邏輯留給後端渲染時處理

---

## 表格 rowspan 視覺規則

`n-1`/`n-2` 子訂單群組之間**不畫分隔線**（視覺上合併成一組），只有整個群組結束後（最後一個子列，例如 `n-2`）才畫底線，避免看起來像獨立的兩筆訂單（2026-07-03 使用者確認）。

---

## 表格列編號規則（跟本元件同一欄，一併記錄）

**已確認業務規則（2026-07-03）**：
- 純數字編號（`1` `2` `3` `4`）= 獨立一列，沒有子訂單
- 帶連字號編號（`n-1` `n-2` `n-3`...）= 代表第 `n` 筆訂單底下有**子訂單**，同一個編號群組（`n`）內的子訂單各自佔一個子列，視覺上合併顯示在同一個列區塊內
- 資料結構需要能表達「一個訂單 -> 多個子訂單」的階層，不能只用扁平的列陣列

---

## 未定義 / 待補

- ~~Pill/次要 badge 精確 padding、圓角數值~~ -> **已確認（2026-07-03，`get_node` 覆核）**，見上方表格
- Offcanvas dismiss 行為 cross-check `components/offcanvas.md`
- 下拉選單 hover/pressed 態在 mobile 觸控情境下的視覺回饋（mobile 沒有 hover，需另外定義 active/pressed 態，本次未見 Figma 示範）
