# Component Specification: 分館資料 Modal（`state=branch-basic-info`）

**Figma Node ID**：見下方「Figma RWD 來源」表（desktop `2129:79343` / 640~767px `2129:80387` / <=639px `2129:80629`）
**觸發來源**：`specs/pages/lodging-info.md`（尚未寫檔）headquarters/分館卡片的「修改 4-1」/「設定」pill 按鈕（`icons/edit` + 文字；「設定」不帶編號，因為代表尚未設定過，無資料可對應編號，見 Session 118 使用者訂正），見 `components/modal.md` `state=photo-gallery` 段落同一批 Session 讀取的相鄰觸發物
**讀取日期**：2026-07-29

## Figma RWD 來源

| 斷點 | Node ID | 尺寸 | 說明 |
|---|---|---|---|
| >=768px (desktop) | `2129:79343` | 800x1534px | 節點名稱「Modal（有分資料設定與資料修改 title）」，header 文字節點顯示雙標題註記「資料設定/資料修改」 |
| 640~767px | `2129:80387` | 767x1534px | 節點名稱單純「Modal」，header 文字節點固定顯示「資料設定」（單一示例文案，跟 desktop 版一樣依觸發按鈕動態切換，不是這個尺寸固定只顯示「資料設定」） |
| <=639px (mobile) | `2129:80629` | 640x2432px | 節點名稱單純「Modal」，header 文字節點同樣固定顯示「資料設定」示例文案；Figma 畫布寬度雖標 640，使用者確認這就是 `<=639px` 這一層（畫布寬度只是方便對齊，不是精確斷點像素邊界） |

640~767px 版本欄位、卡片、chip 列結構跟 desktop 版完全一致，**純粹是內容寬度等比縮窄**（2 欄 grid 各欄從 378px 縮到 361.5px，Input 從 302px 縮到 285.5px），沒有結構性改版。<=639px 版本則是**結構性改版**：原本每列「左欄 label+input / 右欄 label+input」並排的 2 欄 grid，全部改成單欄堆疊，每個欄位（代號/排序/飯店名稱/英文名稱/Email/市話/傳真/地址/企業官網）各自獨佔一整列滿版寬度；4 張文案卡片與飯店設施項目 chip 列本來就是滿版區塊，不受這條規則影響，結構維持一致。整體高度因此從 1534px 暴增到 2432px。

---

## 概述

這顆 modal 是分館（或 headquarters）的基本資料編輯表單。**內容完全相同，只有 header 標題文字依觸發按鈕不同而切換**（2026-07-29 使用者確認）：

| 觸發按鈕 | Modal 標題 |
|---|---|
| 「修改 4-1」（已有資料的分館） | `資料修改` |
| 「設定」（尚未填過資料的分館，不帶編號） | `資料設定` |

Figma 節點名稱與 header 文字節點內容「資料設定/資料修改」直接對應這個切換規則。除標題外，欄位、佈局、互動規則完全一致。

---

## Modal 外殼

沿用 `components/modal.md` 共用 header/footer 結構，差異如下：

| 項目 | 規格 |
|---|---|
| Header 標題 | 依觸發按鈕動態顯示 `資料修改` 或 `資料設定`（見上方對照表），20px SemiBold，`Color/Text/800` |
| Header close | `icons/close` |
| Footer | `取消`（bg `Color/Neutral/200`）/ `儲存`（bg `Color/Neutral/800`）；沒有 upload 型批次送出流程，點「儲存」直接送出本輪表單變更並關閉 modal |

---

## Body 欄位（由上到下，2 欄 grid，每列左右各一個欄位）

| 列 | 左欄 | 右欄 |
|---|---|---|
| 1 | 代號（**唯讀**，灰底，系統配號，示例 `4`） | 飯店名稱（Input） |
| 2 | 英文名稱（Input） | Email（Input） |
| 3 | 市話（Input） | 傳真（Input） |
| 4 | 地址（`Location` 元件：縣/市 select + 行政區 select + 郵遞區號顯示 + 街道 Input，沿用 `components/location.md`） | 企業官網（Input） |
| 5 | 飯店介紹文案（卡片：空狀態文字 + 編輯按鈕，見下方「文案卡片」段） | 飯店設施文案（同上） |
| 6 | 飯店提醒事項文案（同上） | 飯店交通文案（同上） |
| 7（滿版，不分左右欄） | 飯店設施項目（chip 多選，見下方「飯店設施項目」段） | - |

### 代號欄位（唯讀）

| 屬性 | 值 | Token |
|---|---|---|
| 背景 | `Color/Neutral/100` | `Color/Neutral/100` |
| 邊框 | `Color/Neutral/200` | `Color/Neutral/200` |
| 文字 | `Color/Neutral/400` | `Color/Neutral/400` |

固定唯讀，非 lock-toggle 概念的「暫時 disabled」，不套用 `components/html-conventions.md` 的 lock icon 灰底規則；此欄位永遠不可編輯（系統配號）。

### `placeholder` 文字欄位（重要，2026-07-29 使用者拍板）

飯店名稱 / 英文名稱 / Email / 市話 / 傳真 / 街道等欄位，Figma 顯示的字面內容就是文字 `placeholder`。**實作時直接照字面渲染 `placeholder` 這個字串作為欄位內容**，不當作 HTML `placeholder` 屬性、不當空值處理。理由：這批資料要先給後端看欄位長什麼樣子，後端接手後會自行替換成真實內容。

企業官網欄位例外：Figma 顯示具體示例值 `www.google.com.tw`，視為「已填資料」示例，同樣照字面內容渲染。

---

## 文案卡片（飯店介紹文案 / 飯店設施文案 / 飯店提醒事項文案 / 飯店交通文案）

4 張卡片結構一致，完整規格（空狀態/編輯中/已儲存/多語系 tabs/翻譯按鈕/全部儲存-取消暫存規則/SunEditor 工具列/套件研究）已獨立寫在
`components/lodging-branch-suneditor.md`，本節只保留最上層外殼結構：

```
Frame 277 (bg Color/Neutral/75, border Color/Border/Default, radius 12, padding 20)
- 內容依狀態切換：空狀態顯示區 / SunEditor 編輯區 / 已儲存內容顯示區
  （完整 7 個狀態、語言 tabs、翻譯按鈕、儲存邏輯，見 lodging-branch-suneditor.md）
- 編輯 pill 按鈕 (icons/edit + "編輯"，白底，border Color/Neutral/200，radius 28，padding 10px 16px，置中)
```

### 編輯互動（2026-07-29 使用者拍板）

**不是 modal**：點擊「編輯」不會開新的巢狀 modal（跟 `start.md` 的「巢狀 modal 規則」不適用於這裡）。SunEditor 只在各自卡片自己的 container 內 inline 展開/切換，不跳出到其他層。本輪不安裝、不串接真實 SunEditor library，用 `<textarea>` 佔位，但完整套件研究、多語系行為規則已在 `components/lodging-branch-suneditor.md` 定案，減少後續真正串接時的返工。

---

## 飯店設施項目（chip 多選）

滿版卡片（跟文案卡片同樣 bg/border/radius/padding），內含一排 pill chip：

| 屬性 | 值 | Token |
|---|---|---|
| Chip 尺寸/間距 | 沿用 `specs/html-conventions.md` 「Pill chip button」慣例：padding `10px 16px`，radius 28px | - |
| 選中態 bg | `Color/MenuItem/Default`（`#2178cf`） | `Color/MenuItem/Default` |
| 選中態文字 | 白色 | `Color/Neutral/0` |
| 未選中態 bg | 白色，border `Color/Neutral/200` | `Color/Neutral/0`, `Color/Neutral/200` |
| 未選中態文字 | `Color/Neutral/800` | `Color/Neutral/800` |

> 顏色語意備註：這個選中色 `Color/MenuItem/Default` 不是 `specs/html-conventions.md` 既有定義的「黃 tag/付款指示」或「藍 toggle/mode 切換」語意（該藍是 `#005fcc`，跟這裡的 `#2178cf` 不同色值），是第三種語意，「資料標籤多選」。三種 pill 色彩語意不可混用，各自對應各自的使用情境。

### 固定文字內容（Figma demo 示例，佔位性質）

`設施一`、`設施二`、`設施三`（selected 示意）、`設施五六七八九`（**佔位文案**，代表這裡實際會渲染多顆獨立 chip，Figma demo 縮寫成一顆；2026-07-29 使用者確認「照實渲染就好」，不用試圖拆解成真的 5-9 顆）。實際 chip 內容與數量由後端資料決定，前端不假設固定清單。

### 互動

點擊 chip 切換 selected/未選中狀態；多選（非單選），沿用 `specs/html-conventions.md` pill chip 慣例的 click delegation pattern。

---

## Layout / RWD

| 項目 | 規格 |
|---|---|
| Modal width | desktop(>=768px) 800px reference；640~767px 767px reference；<=639px 640px reference；皆 < 1140px 共用上限，不封頂 |
| Modal height | body 內容高於 viewport 時，header/footer 固定，body 垂直 scroll |
| Breakpoint: >=768px | 欄位 2 欄 grid 並排，每欄 378px（Input 寬 302px） |
| Breakpoint: 640~767px | 欄位維持 2 欄並排，每欄縮到 361.5px（Input 寬 285.5px）；純等比縮窄，結構與 desktop 版一致 |
| Breakpoint: <=639px | 欄位改單欄堆疊（不再並排），每個欄位獨佔滿版寬度；4 張文案卡片與飯店設施項目 chip 列維持滿版區塊不受影響 |

---

## Typography / Colors

| 元素 | 規格 | Token |
|---|---|---|
| Header 標題 | 20px SemiBold 600 | `Color/Text/800` |
| Label 文字 | 16px Regular | `Color/Neutral/800` |
| Input 文字 | 16px Regular | `Color/Neutral/800`（示例值/佔位字面文字同色，不特別轉灰） |
| 代號唯讀文字 | 16px Regular | `Color/Neutral/400` |
| 文案卡片背景 | `Color/Neutral/75` | `Color/Neutral/75` |
| 文案卡片邊框 | `Color/Border/Default` | `Color/Border/Default` |
| 空狀態顯示區背景 | `Color/Neutral/75` | `Color/Neutral/75` |
| 一般 Input 邊框 | `Color/Neutral/200` | `Color/Neutral/200` |
| Footer 儲存按鈕 bg | `Color/Neutral/800` | `Color/Neutral/800` |
| Footer 取消按鈕 bg | `Color/Neutral/200` | `Color/Neutral/200` |

---

## Token gaps / unresolved

- 無。所有色值（`#f6fafd`、`#e1e1e0`、`#d1d1d1`、`#2178cf`、`#888888`、`#454545`）皆已對照到 `tokens.md` 既有 token。

---

## 未讀取 / 待補項目

- 4 顆「編輯」對應的 SunEditor 完整規格已讀取並定案，見
  `components/lodging-branch-suneditor.md`；本輪仍是 textarea 佔位，正式
  串接 SunEditor 的時機待該檔「未讀取/待補項目」段列出的項目補齊
- 飯店設施項目 chip 完整清單（後端資料驅動，目前只有 4 個 demo 示例）
