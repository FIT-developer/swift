# 訂單處理作業 > 訂單處理 (order-processing)

> Figma frame（讀取記錄詳見 `specs/order-processing-reading-notes.md`，本檔為 Spec checkpoint 後的正式規格）：
> - Desktop default：`Content page - 訂單處理 desktop default 0701`（`2032:86476`），1440x1542
> - Desktop extend（側欄收合態）：`2032:86481`，1440x1528
> - Mobile ~ tablet：`Content page - 訂單處理 mobile ~ tablet 0701-*`，768 寬設計稿（tablet 寬度示範，實作仍走 fluid width，不寫死 768）
>
> 讀取日：2026-07-03（12 輪 figma-go 讀取 + Spec checkpoint 討論）
> 相關 component spec：`components/order-status-pill.md`（訂單編號欄狀態 pill + 下拉選單）、`components/order-edit-modal.md`（訂單修改 modal）、`components/modal.md`（訂單明細／簡訊 modal，既有實作）

---

## 整體佈局（Desktop）

```
aside menu (240px, 可收合成 240x48 頂部窄條)
main content
  [top toolbar] 36px
    logo/帳號/登出/切換帳號/側欄收合 icon | 分頁 tab chip x N | function icons x4
  [filter panel] shrink/extend-model-1
    3 欄並排：日期區間+快速區間鍵+日期狀態/訂單編號/名稱/行動電話 | 訂金+處理狀態+預付方式+客戶類別+團散類別+訂單來源+使用人 | 房型+國籍+專案+條件查詢
    底部：清除 / 查詢 button
  [tabs + 快篩 button 列]
    全部/正式單/未付款/已過期/取消單/未取消/候補單  |  今日付款/今日催款/今日過期/今日取消/今日住房
  [table]
    9 欄，訂單編號欄 = 狀態 pill（見 order-status-pill.md）
  [footer 統計列]
    統計 timestamp | N 間 N 夜 chip | 加購 $ | 房價 $ | 總計 $
floatIcons/ai（浮動客服，全站共用）
```

側欄收合時，filter panel 從 1140px 寬變成 1400px 寬（3 欄各欄從 340px 變 426.67px），但**表格區寬度不變**（仍 1109px） - 這是刻意設計，右側空出的欄位是給浮動客服 icon 站的位置，不是遺漏。

## 整體佈局（Mobile ~ Tablet，768px 設計稿）

```
[top bar] logo + 側欄收合 icon（搜尋分頁 chip、function icons 整排都不顯示）
[filter panel] extend-model-1，單欄垂直堆疊
  日期區間 + 4 個快速區間鍵（2x2 grid）
  日期狀態 / 訂單編號 / 名稱 / 行動電話（4 行）
  「更多條件」accordion（收合：訂金/處理狀態/預付方式/客戶類別/團散類別/訂單來源/使用人/房型/國籍/專案/條件查詢，11 個欄位）
  清除 / 查詢 button
[tabs 列]（獨立一行）
[快篩 button 列]（獨立一行，橫向 scroll）
[table]（跟 desktop 同一份 9 欄表格，容器寬度不縮，超出視窗寬度時橫向 scroll）
```

**未定義**：頂部工具列的搜尋分頁 chip、function icons 在 mobile/tablet 是否刻意隱藏（例如收進其他入口）；表格橫向 scroll 待截圖/devtools 實測驗證。

---

## 頂部工具列

| 元素 | 規則 |
|---|---|
| 分頁 tab chip（`訂單處理` / 可另開多個） | **已有既有實作**，不是新功能 - `preview/landing.html` 既有 `#pageTabsInline` / `.page-tab` / `.page-tab-close` / `.active`，訂單處理頁沿用既有機制即可 |
| function icons（bulletin/message/person/system，4 個 + badge） | 沿用全站頂部功能列既有元件，需 cross-check `components/function-icons.md` 是否完全一致（未定義，待驗證） |
| 側欄收合 icon | 控制 aside menu 展開/收合兩態；icon 正式命名需對照 `specs/icons.md`（未定義） |
| Mobile/tablet | 只顯示 logo + 側欄收合 icon。**已確認（2026-07-03）**：分頁 chip 與 function icons 在此斷點**本來就不屬於這個斷點的設計**，不是「隱藏」也不是「移除」- 進入 mobile ~ tablet 斷點時這兩組元素本來就不會出現，不需要用 CSS 做顯示/隱藏切換，直接在該斷點的 markup/breakpoint 樣式裡不渲染即可 |

---

## 篩選面板

### Desktop（3 欄並排）

**欄 1**：
- 日期區間（2 個 date input：起 - 迄）
- 4 個快速區間鍵：`< 今日 >` `< 本週 >` `< 本月 >` `< 今年 >`（可左右切換上一/下一區間）
- `日期狀態` select，default `訂單日`；`(i)` icon 開 tooltip（見「Tooltip」段）
- `訂單編號` input
- `名稱` input
- `行動電話` input

**欄 2**：
- `訂金` toggle（iOS-style，沿用既有 `.member-data-switch` pattern，開啟綠色）
- `處理狀態` / `預付方式` / `客戶類別` / `團散類別` / `訂單來源` select，皆 default `全部`
- `使用人` select，default `訂房人`

**欄 3**：
- `房型` select，default `全部`
- `國籍` radio：`臺灣`（default selected）/ `外籍`（沿用 `Nation` 元件）。選 `外籍` 時額外顯示 `國家` select（英國/美國/日本/韓國），沿用既有 `.nation-group` / `.nation-foreign-only` 邏輯（跟會員資料 modal 同一套）。**已確認（2026-07-03）**：原始 Figma 稿漏畫這個「國家」欄位的 label 文字，使用者確認實作補上的 `國家` label 是對的，不是我腦補
- `專案` toggle + input/select 合併群組：關閉時旁邊小字顯示「所有專案」，**開啟時變成「僅有效專案」**（toggle 狀態標籤，2026-07-03 截圖驗證確認，非固定文案）
- `條件查詢` input/select 合併群組

底部：`清除` / `查詢` button（靠右）

### Mobile ~ Tablet（單欄 + accordion）

欄 1 的日期區間/快速區間鍵/日期狀態/訂單編號/名稱/行動電話維持展開顯示；欄 2 + 欄 3 全部（11 個欄位）收進「更多條件」accordion。

**Accordion 圖示慣例澄清**：讀取時發現兩個示範 frame 的**標題文字**跟畫面實際的 icon/內容是反的（一個標題寫「not collapsed」但畫面是收起態，另一個標題寫「collapsed」但畫面是展開態） - 這是 Figma frame **命名寫反**，不是既有的「`icons/up`=收起／`icons/down`=展開」慣例錯誤。寫 spec / 實作時一律以「畫面實際 icon + 內容」為準，不採用 frame 標題字面意思。

**外殼漸層背景（2026-07-03 補讀確認）**：「更多條件」accordion 外殼（含 header 跟白色內容卡外面那圈）不是純色，是**對角線漸層**：`Color/Neutral/75`（`#F6FAFD`）到 `Color/Brand/Brand-50`（`#FEF6EE`），方向左下到右上（CSS `linear-gradient(to top right, ...)`）。這個漸層 `get_selection` 完全沒有序列化出來（`styles` 連 `fills` key 都沒有，不是常見的 `"s1"` 佔位符），是使用者肉眼看穿透截圖才發現，改用 `save_screenshots(SVG)` 讀 `<linearGradient>` defs 才抓到精確色值/方向。CSS 已實作為 `.op-accordion-gradient`（`preview/assets/css/landing.css`），只在 `<1024px`（accordion 收合態）套用，`>=1024px`（桌機三欄展開態）用 `lg:bg-none` 清除。

**待確認（尚未查證）**：desktop 版篩選面板外殼（`shirnk-model-1`）在讀取 1 記錄為純色 `#f6fafd`，鑑於這次「更多條件」的教訓（純色記錄可能其實是被靜默省略的漸層），這個記錄**沒有 100%把握**，需要之後回 Figma 用 `save_screenshots(SVG)` 驗證桌機版外殼是否也是漸層。

### 日期狀態 select 選項（來自讀取 11 tooltip 內容，高可信度推測）

`訂單日` / `入住日` / `入住日（全）` / `到達日` / `退房日` / `取消日` / `付款日` / `到期日` / `最後修改日`（9 個選項，讀取時只確認每項的中文標籤，未確認每項的實際查詢邏輯 - **未定義**）

---

## Tabs + 快篩 Button 列

**Tabs（7 個，篩選訂單狀態）**：`全部` `正式單` `未付款` `已過期` `取消單` `未取消` `候補單`

- Active tab 樣式：單邊 `border-bottom`，顏色 `#f28b45`（`Color/Brand/Brand-400`），非四邊框
- **已確認**：tabs 對應狀態 dot 篩選（例如「正式單」tab = 只顯示 `Color/Dots/validated` 狀態列），但**篩選邏輯是後端處理範圍**。前端這階段只要把表格的每種狀態視覺示意做齊全即可，不需要實作真正的篩選功能

**快篩 Button（5 個）**：`今日付款` `今日催款` `今日過期` `今日取消` `今日住房`（12px sm 文字，行為未定義，推測是快速篩選 shortcut，同樣屬後端邏輯）

Mobile/tablet：tabs 跟快篩 button 分成兩行，各自橫向 scroll 容器（依 `feedback_no_scroll_affordance` 慣例，不加 fade mask / 自訂 scrollbar）。

---

## 表格（9 欄）

| # | 欄名 | 內容 |
|---|---|---|
| 1 | 編號 | 純數字 = 獨立列；`n-1`/`n-2` = 第 n 筆訂單的子訂單，各佔一子列（見 `components/order-status-pill.md` 「表格列編號規則」段） |
| 2 | 訂單編號 | 狀態 pill + 下拉選單，詳見 `components/order-status-pill.md`；pill 下方視情況顯示來源/分類 badge |
| 3 | 訂購日 | 日期 + 時間，2 行 |
| 4 | 訂購人 | 國籍 / 姓名（藍色連結樣式，點擊行為未定義，推測開會員資料 modal）/ 遮罩後電話或完整電話 |
| 5 | 天數 | 純數字 |
| 6 | 入住 / 退房日 | 2 行日期 |
| 7 | 間數 | 純數字 |
| 8 | 訂單內容 | 專案名稱文字 |
| 9 | 入住人 | 跟訂購人同格式 |

表格容器：radius 12、白底、`Color/Neutral/200` 邊框、padding top/bottom 12 / left/right 16。

### Footer / 統計列

| 元素 | 內容 |
|---|---|
| `統計` label | 純文字 16px `Color/Neutral/800` |
| chip 1 | `Color/Brand/Brand-100` 底，`N 間`，radius 40 / padding 4 8 / 12px `Color/Text/900` |
| chip 2 | `Color/Neutral/100` 底，`N 夜`，同 chip 1 規格 |
| `加購 $` / `房價 $` | 純文字金額 16px，彼此間距 16 |
| `總計`（橘字 `Color/Surface/Brand-Default`）+ `$` | 總計金額 |

排列：全部靠左單列，`統計` / chips / 金額三組之間留大間距（約 90-130px），不是平均分佈也不是推到兩端。

**隱藏圖層陷阱（2026-07-03 PNG export 覆核）**：Frame 672 內有一個 timestamp（`2026-07-01\n15：33：41`）的 Texts instance，`get_node`/`get_selection` 會照樣序列化它、無任何 visible 標記，但實際渲染**不顯示**（隱藏圖層）。不要實作。組間大間距即隱藏 timestamp 佔位遺留的空間。

---

## Tooltip（2 個，跨全尺寸適用）

**重要**：這兩個 tooltip 對所有尺寸都適用（desktop 也有，不是 mobile 專屬），Figma 只是選在 mobile ~ tablet frame 示範。

| Tooltip | 觸發位置 | 內容 |
|---|---|---|
| 訂單狀態圖例 | 表格「訂單編號」欄標題旁 `icons/info` | 5 個狀態 dot + 中文標籤（`Color/Dots/*` 圖例），見 `components/order-status-pill.md` |
| 日期狀態說明 | 篩選面板「日期狀態」select 旁 `icons/info` | 9 個日期狀態選項 + 各自說明文字（**說明文字本身是 Figma 佔位文案，尚未寫真實文案**，見 `feedback_figma_placeholder_text_conventions`） |

**已確認（2026-07-03）**：考量手機版沒有 hover，兩個 tooltip **一律用 click 觸發**（不做 hover 版本），點擊 `(i)` icon 展開，**點擊 tooltip 以外的範圍收起**（click-outside dismiss）。

樣式：深灰底（`Color/Neutral/700`）、金黃標題（`Color/SubItem/Selected`）、白字內容、小箭頭指向觸發 icon。

---

## 相關 Modal（點擊表格列狀態 pill 下拉選單開啟）

| 選單項目 | Modal | Spec |
|---|---|---|
| 訂單 | 訂單明細（既有實作） | `components/modal.md` `state=order summary` |
| 修改 | 訂單修改（新內容） | `components/order-edit-modal.md` |
| 簡訊 | 簡訊（既有實作） | `components/modal.md` `state=sms / order summary` |
| 連結 / 複製 / 取消 | 無專屬 UI，後端功能 | 見 `components/order-status-pill.md` 「下拉選單內容」段 |

---

## 未定義 / 待補（不可腦補，實作前需再確認或補 Figma）

1. Function icons 是否與 `components/function-icons.md` 完全一致
2. 側欄收合 icon 的正式命名（對照 `specs/icons.md`）
3. ~~頂部搜尋分頁 chip + function icons 在 mobile/tablet 隱藏的原因~~ -> **已確認（2026-07-03）**：本來就不屬於該斷點設計，非隱藏/移除，見上方「頂部工具列」表格
4. 表格橫向捲動需要截圖/devtools 實測驗證
5. `訂購人`/`入住人` 姓名藍色連結樣式的點擊行為
6. 「日期狀態」9 個選項各自的查詢邏輯
7. 快篩 button（今日付款/今日催款等）的實際行為
8. Tooltip 的兩則說明文案都是佔位文字，需要後續補真實文案
