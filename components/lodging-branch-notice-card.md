# Component Specification: 須知與聲明卡

**Figma Node ID**（5 個示意 frame，同批讀取）：

| # | 狀態 | Node ID |
|---|---|---|
| 001 | 全無資料預設值 | `2118:76180` |
| 002 | 從 001 點擊編輯按鈕後開始編輯，僅繁中語系 | `2119:76541` |
| 003 | 點擊來源按鈕 | `2119:76676` |
| 004 | 多語系時，多 tab button | `2119:76789` |
| 005 | 多語系時，中文內容為空時，切換其他語系時 | `2119:76924` |
| 006 | 完成編輯時畫面（已儲存內容顯示，補讀於 Session 118） | `2132:97812` |

**讀取日期**：2026-07-29（001-005），2026-07-29 Session 118 補讀 006
**使用位置**：`specs/pages/lodging-info.md`（尚未寫檔）headquarters/分館卡片區的第 2 張卡（跟「基本資訊卡」「網域安全卡」並列，非巢狀在 `components/lodging-branch-info-modal.md` 內）。

---

## 概述

這張卡的富文本編輯核心（SunEditor 工具列、Format 下拉、翻譯按鈕、多語系 tabs、textarea 佔位規則）**與 `components/lodging-branch-suneditor.md` 完全相同**，本檔不重複記錄，差異只有以下 2 點（2026-07-29 使用者確認）：

1. 多一層「分類 tab」（訂房 / 成為會員 / 團體訂房 / 不退款聲明），每個分類各自對應一份獨立的 SunEditor 內容（各自的空值/編輯中/已儲存/多語系狀態）
2. 多了「來源」功能：「從系統範本建立」/「從總部範本建立」兩顆按鈕，只在繁體中文語系顯示

---

## Card 外殼（分類 tab，folder-tab 樣式）

```
須知與聲明卡 (bg Color/Neutral/75, border Color/Neutral/300, radius 12, padding 16)
- "須知與聲明" 標題 (20px SemiBold, Color/Neutral/800)
- 分類 tab 列（4 個 pill，folder-tab 樣式）
  - 訂房 / 成為會員 / 團體訂房 / 不退款聲明
- 分類內容區 (bg Color/Neutral/0, border Color/Border/Default, radius 12, padding 20)
  - 內容依狀態切換：空狀態 / SunEditor 編輯區 / 已儲存內容顯示區
    （完整規格見 components/lodging-branch-suneditor.md）
```

### Folder-tab 視覺規則（新 pattern，登記進 `specs/html-conventions.md` 可復用清單）

| 狀態 | 樣式 |
|---|---|
| 選中 | bg `Color/Neutral/0`（白），border `Color/Border/Default`，只有頂部圓角，底部與下方內容區無縫相接（視覺上像資料夾分頁的選中頁籤） |
| 未選中 | bg `Color/Neutral/200`，border `Color/Border/Default`，只有頂部圓角，位置略低於選中 tab（folder-tab 堆疊感） |
| Padding | `10px 20px` |
| Radius | 只有 `top-left`/`top-right`，`bottom-left`/`bottom-right` 為 0（跟現有「Pill chip button」全圓角 28px 樣式不同，不可混用） |

**與既有 pill 樣式的區別**：這是第三種 pill 幾何規則（既有「Pill chip button」是全圓角 28px 用於 chip/tag；分館資料編輯 modal 的翻譯按鈕是 radius 6 方形；這裡是只有頂部圓角的 folder-tab，用於「分類/類別」導覽，不是選中標記或 tag）。

---

## 5 個示意狀態

### 001 - 全無資料預設值

```
分類內容區
- 空狀態顯示區 "尚未填寫"（純文字置中，無邊框；見下方讀取陷阱）
- 編輯 pill 按鈕
```

分類 tab 列一開始就顯示（不因無資料而隱藏），預設選中第 1 個分類「訂房」。

**讀取陷阱（Session 118 使用者截圖比對抓到）**："尚未填寫" 所在的 Input
元件，`get_selection` 回報 `strokes:["#d1d1d1"]`，但 SVG export 覆核
只有白色填色 path，沒有邊框 path - 這個 stroke 實際上是停用/不可見的，
不可照 JSON 直接套用邊框。實作為純文字 + 白底 + 置中，無 border。

### 002 - 點擊編輯後開始編輯，僅繁中語系

```
分類內容區
- 來源按鈕列："從系統範本建立" / "從總部範本建立"（icons/document + 文字，白底灰框膠囊 radius 60）
- "繁體中文" 標籤
- SunEditor instance
- 卡片內建 Footer："取消" / "儲存"
```

### 003 - 點擊來源按鈕（本例點擊「從總部範本建立」）

```
分類內容區
- 來源按鈕列（維持顯示，兩顆都還在）
- "繁體中文" 標籤（粗體，見 lodging-branch-suneditor.md）
- SunEditor instance（內容已替換成範本文字）
- 卡片內建 Footer："取消" / "儲存"，**跟左側色條提示同一列**："內容來自總部範本，儲存後為本館自訂"（單側 Border Info Item 樣式，Color/Neutral/500 文字）在左，取消/儲存按鈕在右（2026-07-30 使用者對照 Figma 訂正：提示不是獨立一行在 Footer 上方，是跟 Footer 按鈕同一列）
```

視覺截圖交叉核對：兩顆來源按鈕點擊前後樣式**沒有變化**（不會有「已選取」的高亮態），JSON 裡曾出現一顆按鈕 `fills` key 消失的差異，經截圖比對確認是 Figma MCP 序列化雜訊，不是真實視覺差異，不採用。

### 004 - 多語系時，tabs 出現

```
分類內容區
- 語言 tabs 列（繁體中文/英文/韓文，此例 active=英文）
- 翻譯按鈕列（因為目前 tab 不是繁中）："從繁中譯為英文" + 翻譯按鈕(enabled)
- SunEditor instance
- 卡片內建 Footer："取消" / "全部儲存"
```

**注意**：此示意稿 active tab 是英文，但 SunEditor 內容顯示的仍是繁體中文範本文字（未實際翻譯），判定為 Figma demo 疏漏（沒有換成英文示例內容），不影響規格判讀，只是這張示意圖本身的內容不夠精確。

### 005 - 多語系、繁中為空值、切換到英文 tab

```
分類內容區
- 語言 tabs 列（active=英文）
- 翻譯按鈕列："從繁中譯為英文" + 翻譯按鈕(disabled，因為繁中為空值)
- Tooltip（hover 觸發）："請先填寫繁體中文"
- SunEditor instance（英文 tab 內容為空）
- 卡片內建 Footer："取消" / "全部儲存"
```

JSON 中另有一段文字「已匯入總部範本，可進行編輯。」，經截圖核對**畫面上完全沒有顯示**，判定為 Figma 端隱藏圖層殘留，不採用，不寫入正式文案。

### 006 - 完成編輯時畫面（已儲存內容顯示，Session 118 補讀）

這是先前遺漏的狀態：卡片**沒有**進入編輯模式、單純顯示已儲存內容時的樣子（對應「基本資訊卡」等其他卡片「有資料」的靜態顯示概念，不是編輯流程的一部分）。截圖交叉核對，JSON 與視覺一致，無陷阱。

```
分類內容區 (bg Color/Neutral/0, border Color/Border/Default, radius 12, padding 20)
- "已儲存內容" 橘字標籤 (16px Regular, Color/Brand/Brand-400 #f28b45)
- 已儲存的內容全文，純文字唯讀顯示 (16px Regular, Color/Neutral/800)，
  不帶 SunEditor 工具列、不帶任何格式化控制項
- "編輯" pill 按鈕（icons/edit + 文字，白底灰框 radius 28，水平置中）
```

- 分類 tab 列跟其他狀態一樣持續顯示、可切換；每個分類各自獨立判斷自己是「空狀態」還是「已儲存內容」狀態，互不影響
- 點擊「編輯」按鈕進入 002 的編輯模式（僅繁中）或多語系情境的 004/005 模式，帶入目前已儲存的內容
- 內容區容器樣式（bg/border/radius/padding）與 001 空狀態、002-005 編輯狀態完全相同，只有內部顯示內容不同（空狀態文案 / SunEditor 編輯區 / 已儲存內容唯讀顯示，三態共用同一個容器）

---

## 來源按鈕規則（2026-07-29 拍板）

| 條件 | 行為 |
|---|---|
| 目前 active tab = 繁體中文 | 顯示「從系統範本建立」/「從總部範本建立」兩顆按鈕 |
| 目前 active tab = 其他語言（英文/韓文/...） | **不顯示來源按鈕**，改顯示翻譯按鈕（沿用 `lodging-branch-suneditor.md` 的翻譯按鈕規則，含繁中 tab 隱藏/其他語言依繁中內容 enabled-disabled 的邏輯） |
| 點擊「從系統範本建立」或「從總部範本建立」 | 立即載入對應範本內容，**直接取代**目前繁體中文編輯區內容，不跳確認（即使已有既存內容也直接覆蓋） | 
| 載入範本後 | 不自動儲存，仍要使用者按「儲存」/「全部儲存」才送出；顯示左側色條提示「內容來自[來源]範本，儲存後為本館自訂」 |

### 本輪實作範圍（2026-07-29 拍板）

**不接真正的範本資料 API**。系統範本與總部範本先用前端固定的示意資料（各自一段固定文字），點擊來源按鈕後直接把對應示意內容載入繁體中文編輯區。

### 資料模型備註（2026-07-29 使用者說明，供後端理解，非本輪實作範圍）

- 系統範本：系統商提供的預設內容
- 總部範本：由總部設定，提供總部與所屬分館使用
- 本館自訂內容：分館載入範本或自行輸入後儲存的內容
- 「來源按鈕」的本質是「複製範本內容到本館編輯區」，儲存後即為本館自己的獨立內容，**不會**持續跟原範本連動（範本之後被總部修改，不會回頭同步更新已儲存的分館內容）

---

## 跨維度本地暫存規則（2026-07-29 使用者補充，重要）

這張卡比 `lodging-branch-suneditor.md` 的純文案卡片多一個維度（分類），暫存規則必須同時涵蓋「語言」與「分類」兩個維度：

| 行為 | 規則 |
|---|---|
| 切換分類 tab（訂房/成為會員/團體訂房/不退款聲明） | 目前分類已編輯但尚未送出的內容，保留在前端本地暫存，不因切換分類而遺失 |
| 切換語言 tab（在同一個分類內） | 同 `lodging-branch-suneditor.md` 既有規則，暫存不遺失 |
| 單一語言情境 | Footer「儲存」只儲存**目前分類**的內容 |
| 多語系情境 | Footer「全部儲存」**一次儲存 4 個分類 x 所有語系**的全部暫存內容 |
| 「取消」 | 放棄本次編輯 session 內**所有分類、所有語系**的修改，全部回復到進入編輯前的內容 |

---

## Typography / Colors

| 元素 | 規格 | Token |
|---|---|---|
| 卡片標題 | 20px SemiBold 600 | `Color/Neutral/800` |
| 外層卡片背景 | - | `Color/Neutral/75` |
| 外層卡片邊框 | - | `Color/Neutral/300` |
| 分類 tab 選中 bg | - | `Color/Neutral/0` |
| 分類 tab 未選中 bg | - | `Color/Neutral/200` |
| 分類 tab border | - | `Color/Border/Default` |
| 分類內容區背景 | - | `Color/Neutral/0` |
| 分類內容區邊框 | - | `Color/Border/Default` |
| "已儲存內容" 標籤文字 | 16px Regular | `Color/Brand/Brand-400` (#f28b45) |
| 來源按鈕 | 白底灰框膠囊 | `Color/Neutral/0` / `Color/Neutral/200` |
| 來源提示文字 | - | `Color/Neutral/500` |
| 其餘（語言 tab / 翻譯按鈕 / SunEditor 工具列） | 同 `lodging-branch-suneditor.md` | 同上 |

---

## Token gaps / unresolved

- 無。所有色值（`#f6fafd`、`#b0b0b0`、`#ffffff`、`#d1d1d1`、`#e1e1e0`、`#6d6d6d`、`#f28b45`）皆已對照到 `tokens.md` 既有 token。`icons/document`、`icons/edit` 本機已存在，不需補匯出。

---

## 未讀取 / 待補項目

- 此卡在 `specs/pages/lodging-info.md` 頁面上的 RWD 斷點行為尚未個別示意，暫定沿用同頁其他卡片（基本資訊卡）已驗證過的斷點模式，待有專屬 RWD 示意稿再核對
- 系統範本 / 總部範本的實際固定示意文字內容，待你提供或由開發階段先寫一段合理的 placeholder 文字（本輪不接真實 API，內容本身只是示意，不影響規格判讀）
- 「已儲存內容」狀態下，4 個分類分別各自獨立顯示自己的空/已儲存狀態這件事本身已確認（Session 118），但沒有取得「部分分類有資料、部分沒有」同時並存的示意圖；本輪判斷這只是每個分類各自套用 001 或 006 兩種容器內容其中之一，不需要額外規格，如果之後發現有例外情況再回來補
