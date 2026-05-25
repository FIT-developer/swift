# 前台作業 — 房間預訂 (room-booking)

> Figma frame：
> - `Content page - 房間預訂 default 0525-1`（`1730:42797`）— 購物車**空**狀態，頁面 1440×2676
> - `Content page - 房間預訂 default 0525-2`（`1751:43029`）— 購物車**有值**狀態，頁面 1440×3056
>
> 版本：0525
> 讀取日：2026-05-25
> 前版 0428 已合併進此檔，差異段以「↺ 0525 變更」標示。

---

## 整體佈局

```
┌─────────────┬────────────────────────────────────────────────┐
│  aside menu │  main content (1140px)                         │
│  240px      │  [top-bar]  36px                               │
│             │  [A] 空房與庫存查詢 accordion          619px   │
│             │  [B] 客戶類型 + 訂房資料                613px  │ ← ↺ 0525 變更
│             │  [C] 訂單條件 752 + 正式單與候補單 364  425px  │ ← ↺ 0525 變更
│             │  [D] 訂房資料 section                   792px  │ ← ↺ 0525 變更
│             │  [bottom-right] 產生訂單 Y/N           137×39  │
└─────────────┴────────────────────────────────────────────────┘
```

**頁面外框**
- 外層 Section 背景：`Color/Neutral/0`（page fill `#ffffff`）
- 外層 Frame：`1440 × 2676`，padding `12/20/12/20`
- Frame 571：`1400 × 2652`（內容 wrapper）
- Frame 401（aside + main 排列）：`1400 × 2581`
  - Aside menu instance：`240 × 1191.48` @ x:0（state=extend）
  - Main (Frame 400)：`1140 × 2581` @ x:260（aside + 20px gap）
- **Button Y/N「產生訂單」**：`137 × 39` @ x:1263, y:2613（頁面右下，state=yes）
- **floatIcons/ai 客服**：`40 × 70` @ x:1372, y:1058

---

## Aside（menu component）

- **state**：`extend`（展開）
- **尺寸**：`240 × 1191.48`
- 樣式 / 內容同 menu.md，sub-item「房間預訂」選中
- aside 收摺版 → `room-booking-collapsed.md`

---

## Top Bar（Frame 398）

**尺寸**：`1140 × 36` @ y:0

| 元素 | 尺寸 | 位置 | 樣式 |
|---|---|---|---|
| Input「房間預訂」 | 127 × 36 | x:0 | bg `Color/Neutral/75`、border `#86b7fe`（active focus）、radius 6、pad 6/12，trailing icons/close |
| Input「xxoo」 | 96 × 36 | x:139 | bg `Color/Neutral/0`、border `Color/Neutral/200`、radius 6、pad 6/12，trailing icons/close |
| Function icons | 156 × 24 | x:984, y:6 | 4 icons × 24，gap 20px |

**Function icons badge 顏色**：
- bulletin(99)、person-md(99+)、system(99+)：bg `Color/Brand/Brand-500`、文字 `Color/Neutral/50`
- message(0)：bg `Color/Neutral/200`、文字 `Color/Neutral/800`（零值灰）

---

## [A] 空房與庫存查詢 Accordion

**尺寸**：`1140 × 619`，bg `Color/Neutral/75`、border `Color/Neutral/200`、radius 12、padding 20，@ y:60

### Header（Frame 99）
- `1100 × 27` @ x:20, y:20
- Texts「空房與庫存查詢」md（20/SemiBold），`Color/Neutral/800`
- 右側 icons/down 24×24 @ x:1076（**注意：0525 標的此處為 `icons/down`**，與 accordion 反向箭頭規則對照——展開時應為 up）

### 內容（Frame 224）
`1100 × 536` @ x:20, y:63

**左側 Calendar**：`351 × 431`，bg `Color/Neutral/0`、border `Color/Neutral/200`、radius 12、pad 12
- 含已選天數列、月份標題、7×6 月曆 grid（同 0428）

**右側面板（Frame 223）**：`725 × 536` @ x:375

| 子區塊 | 尺寸 | y 位置 | 說明 |
|---|---|---|---|
| Frame 97（操作按鈕） | 176 × 42 | y:0 | 「空房查詢」/「庫存表」兩個 Button |
| Payment method | 541 × 42 | y:58 | 棟別 filter chip 列（全部/A棟/B棟/C棟…） |
| Table（庫存表） | 725 × 263 | y:116 | bg `Color/Neutral/0`、pad 12/16 |
| Frame 119（數量分配） | 725 × 62 | y:395 | bg `Color/Neutral/0`、pad 12/16 |
| Frame 11（底部按鈕） | 725 × 63 | y:473 | 「清除」/「加入訂單」Button Y/N |

Table 欄位、Calendar 細節同 0428（保留段落，需與 0525 重新核對的細項以註記補上）。

---

## [B] 客戶類型 + 訂房資料（Frame 1140）

**↺ 0525 變更**：原 1140×432 擴增為 **1140×613（cart empty）/ 1140×993（cart with items）**，下方新增 加購 Button、購物車總金額（有值才顯）、items 清單 container（有值才顯）、3-欄底列。

**尺寸**：
- 購物車空：`1140 × 613` @ y:703（0525-1 frame 名稱 `1140`）
- 購物車有值：`1140 × 993` @ y:703（0525-2 frame 名稱 `1141`）

外殼樣式相同：bg `Color/Neutral/75`、border `Color/Neutral/200`、radius 12、padding 20

### 客戶類型按鈕（Frame 97）
`176 × 42` @ x:20, y:20，2 顆 88×42 Button、pad 10/12、radius mixed（左右分段）

| 按鈕 | 背景 | 文字色 | 狀態 |
|---|---|---|---|
| 一般客戶 | `Color/Surface/Action-Default` (#005FCC) | `Color/Neutral/0` | active |
| 合約客戶 | `Color/Neutral/0` | `Color/Neutral/800` | inactive |

> ⚠️ 點擊「合約客戶」要同時切換 [D] 訂房資料 section 的 tab → 合約（feedback_customer_toggle_links_order_tab）

### 頂部資料列（Frame 367）
`1100 × 36` @ x:20, y:78

| 子區塊 | 尺寸 | x | 內容 |
|---|---|---|---|
| Frame 321 | 302 × 34 | 0 | Checkbox（active 藍 `#2178cf`）+ Texts「團體名稱」+ Input 200×34 |
| Frame 228 | 266 × 36 | 322 | Select「業務」 |
| Frame 349 | 102 × 22 | 896 | Checkbox（active）+ Texts「使用保留房」|
| Frame 350 | 86 × 22 | 1014 | Checkbox（disabled 灰 `#b0b0b0`）+ Texts「自加庫存」|

### 訂房資料 Grid（Frame 557）

**↺ 0525 變更**：
- 加購欄（59px）已移除 → 改為下方獨立 Button
- label 欄寬 198 → **168**、小計欄寬 111 → **165**
- 內容寬度約 **1365.5px**（含 padding 12/12 → frame 1389.5），超出容器 1100 → **需 overflow-x: scroll**

`1389.5 × 342`，bg `Color/Neutral/0`、padding 12、radius 12 @ x:20, y:130

**欄結構**（共 8 欄，欄寬 / x 起點 / 高度均 318）：

| # | Figma id / 名稱 | 寬 | x 起點 | header 內容 | 列內容（每筆訂房） |
|---|---|---|---|---|---|
| 1 | Frame 188 入住日 | 168 | 12 | 「入住日」 | Calendar simple × 3 列（範例 `2026-02-28`） |
| 2 | Frame 189 退房日 | 199 | 180 | 「退房日」 | Calendar simple + 右側「N 夜」badge（`Color/Brand/Brand-600`） |
| 3 | Frame 191 房型 | 198.5 | 379 | 「房型」 | Select × 3 列；footer「統計」 |
| 4 | Frame 194 專案 | 199 | 577.5 | 「專案」 | Select × 3 列 |
| 5 | Frame 192 間數 | 169 | 776.5 | 「間數」+ sub「團體：8」 | DatePicker「訂房間數」、值 5 × 3 列；footer 總計 15 |
| 6 | Frame 196 單價 | 123 | 945.5 | 「單價」 | Input × 3 列（19999） |
| 7 | Frame 197 小計 | 165 | 1068.5 | 「小計」+ sub「無折扣」 | 19999 × 3；footer「原價 / 8888 / 19999」|
| 8 | Frame 195 操作 | 144 | 1233.5 | 「操作」 | （操作按鈕，待 0525 補圖驗證）|

**列高**：header 56、資料列 52、footer 74；交替背景 `Color/Neutral/0` / `Color/Neutral/75`。

### Frame 558 / 583 — 加購 Button + 購物車（**↺ 0525 新增、有兩態**）

容器位置 `@ x:20, y:488`。**容器高度依購物車狀態切換**：

| 狀態 | 對應 Figma frame | 容器 | 中段總高 | 後續 footer y |
|---|---|---|---|---|
| 購物車**空**（無 items）| 0525-1, Frame 558 | `1100 × 51` | 613 | 555 |
| 購物車**有值** | 0525-2, Frame 583 | `1100 × 431` | 993 | 935 |

**上排（恆顯示，0525-2 中為 Frame 584, 233×51）**

- **加購 Button**（Frame 580 內 Title instance）：`112 × 51`，bg `Color/Neutral/0`、border `Color/Neutral/200`、radius **44**、padding 12/20
  - 左 24×24 `icons/purchase-item`、右 Texts「加購」md `Color/Neutral/800`
  - 點擊 → 開啟原有 add-on modal（沿用既有 JS 行為）
- **購物車總金額**（Frame 566, 105×22 @ x:128, y:14.5）：base 文字 `Color/Neutral/800`、範例 `$ 199,299,399`
  - **僅在購物車有 items 時顯示**；空時隱藏（0525-1 不存在此元件）

**下排（cart items grid，僅在有值時顯示）— Frame 583 (1100×364) @ y:67**

- 容器：bg `Color/Neutral/0`、border `Color/Neutral/200`、radius 8、padding 20/24
- 內框 Frame 548（1052×324）：3 欄 × 3 列 grid
  - 卡片寬 344、高 92；col gap 10、row gap ≈ 19.33
- 右側有 `LINE 'scroll bar'` (`1751:44504`, 119×0 @ x:1087, y:99) — Figma 標示 scroll affordance；實作沿用瀏覽器原生 scrollbar（feedback_no_scroll_affordance）。

**Cart item card 規格（每張 344×92）**

- bg `Color/Neutral/0`、border `Color/Neutral/100`（`#e1e1e0`）、radius 8、padding 16
- Frame 474（312×60）兩行
  - **上行**（312×24）：
    - 左 Frame 530（70×24）：Texts base 品名（如「機票」`Color/Neutral/800`）+ Texts sm 數量（「2 份」`Color/Neutral/800`）
    - 右 Frame 468（24×24）：`icons/trash-can`，vector stroke `#d90000`（紅色刪除）
  - **下行**（312×24 @ y:36）：
    - 左 Frame 470（143×24）：
      - 日期 chip（Frame 448, 79×24）：bg `Color/Brand/Brand-100`（`#fdebd7`）、radius 40、pad 4/8、Texts sm `Color/Neutral/900`（範例 `2026-03-01`）
      - 時間 chip（Frame 450, 56×24 @ x:87）：bg `Color/Neutral/100`（`#e1e1e0`）、radius 40、pad 4/8、Texts sm `Color/Neutral/900`（範例 `14：25`）
    - 右 Frame 463（105×22 @ x:207）：Texts base 金額 `Color/Neutral/800`（範例 `$ 777,333,110`）

**品名範例對照**（Figma 9 張卡片示意）：

| Row | 品名 | 量詞 |
|---|---|---|
| 1（card 1–3） | 機票 | 份 |
| 2（card 4–6） | 會議服務 | 間 |
| 3（card 7–9） | 嬰兒用品 | 個 |

> ⚠️ card 8 / card 9 在 Figma 標的中時間 chip 缺漏（只有日期 + 金額）；本輪不腦補，實作時統一以「日期 + 時間 + 金額」為標準排法，若 backend 沒給時間則只顯示日期 chip。

### Frame 559 / 584 — 預付/總價 footer 列（**↺ 0525 新增**）
`1017 × 38` @ x:20。y 位置依購物車狀態而異（空 555 / 有值 935）。內含 3 個等寬欄（≈ 322.33）+ gap 25：

| Frame | 寬 | 內容（base 文字 `Color/Neutral/800`） |
|---|---|---|
| Frame 209 | 322.33 × 34 | Texts「預付 / 百分比」+ Input(120×36, `1444`) + Select(90.33×36) — Input/Select 拼接 radius mixed |
| Frame 204 | 322.33 × 36 | Texts「預付訂金」+ Input(210.33×34, `1444`) |
| Frame 322 | 322.33 × 38 | 左：Texts「總售價」md + sm「99999」；右：Input(210.33×34, `1444`) |

---

## [C] 訂單條件 + 正式單與候補單 Accordion（Frame 452）

**↺ 0525 變更**：原 1140 全寬 Order condition 收窄至 752；右側 388 區由原本放在 [D] 內的「正式單與候補單」Accordion 移過來，與 Order condition 同列排放。

**尺寸**：`1140 × 425` @ y:1340

### 左 — Order condition（752 × 425）
- bg `Color/Neutral/75`、border `Color/Neutral/200`、radius 12、padding 20、@ x:0
- Header（container2 slot, 712×27）：Texts「訂單條件」md + 右側 icons/down 24×24（@ x:688）
- Content（container slot, 712×342）：bg `Color/Neutral/0`、pad 12、radius 12
  - Frame 370（688×318）：2 欄 layout（gap 32）
    - 欄 1 Frame 412：`328 × 318` — 人數大/小、到店方式、發票、統編、抬頭、繳款期限、訂單備註、需求備註（同 0428）
      - **到店方式仍是 Button 不是 Select**（trailing icons/road，沿用 0428 註記）
    - 欄 2 Frame 412：`328 × 196` — 折扣、總房價、加購項目併單、預付百分比、預付（部分欄位已移至 [B] Frame 559）

> ↺ 0525：欄 3（原 196px）已不存在；訂單條件區欄位精簡為 2 欄。

### 右 — Accordion「正式單與候補單」（364 × 425）
- bg `Color/Neutral/75`、border `Color/Neutral/200`、radius 12、padding 20、@ x:776
- Header（Frame 99, 324×27）：Texts「正式單與候補單」md + icons/down @ x:300
- flexible content slot（324×342）：bg `Color/Neutral/0`、pad 20、radius 12
  - Frame 361（284×319）
    - Frame 295（284×22, y:0）：（payment method radio？）
    - Texts（284×277, y:42）：占位內容

> 0525 狀態：accordion **展開**（content slot 有內容）。0428 時此 accordion 是收摺，且歸屬於 [D] 區右側。

---

## [D] 訂房資料 Section（Frame 453）

**↺ 0525 變更**：原 1140×888 含右側 425 寬 Accordion；新版 1140×792、整段全寬 1100，內部改為 2×2 卡片排列。

**尺寸**：`1140 × 792`，bg `Color/Neutral/75`、border `Color/Neutral/200`、radius 12、padding 20，@ y:1789

### Header 列（Frame 350）
`1100 × 27` @ x:20, y:20

- Frame 246（116×27）：Texts「訂房資料」md + icons/lock 24×24（vector fill `#e05216` → `Color/Brand/Brand-600`，紅 = inputs disabled，feedback_lock_toggle_input_state）
- Frame 353（984×22）：右側 action 列
  - Frame 352（56×22 @ x:636）：icons/eraser 16×16 + Texts「清除」
  - Frame 349（134×22 @ x:712）：Checkbox（disabled 灰）+ Texts「入住人同訂房人」
  - Frame 354（118×22 @ x:866）：Checkbox（disabled 灰）+ Texts「寄送訂房資訊」

### Body（Frame 358，1100 × 709 @ y:63）

**Tab 列（Frame 356）**：`184 × 42`，pad 0/12
- Frame 354（72×42 @ x:12）：bg `Color/Neutral/0`、border `Color/Neutral/100`、radius mixed → **active tab「訂房」**
- Frame 355（72×42 @ x:100）：bg `#d1d1d1`（`Color/Neutral/200`）、border `Color/Neutral/100` → **inactive tab「入住」**

> 0428 時這裡是「訂房／入住」tab；0525 維持，但底色處理略改（active 白、inactive 灰）。實作時需確認 design system 預設規則。

**表單內容（Frame 277）**：`1100 × 667`，bg `Color/Neutral/0`、border `Color/Neutral/100`、radius 12、pad 20/0/20/0

採 2 × 2 卡片排列（每張卡片 540 寬、pad 20）：

| 位置 | Frame | 尺寸 | 內容（依 0525 排列） |
|---|---|---|---|
| 左上 | Frame 275 | 540 × 280 | 名稱、身份證號、護照號碼、生日（Calendar simple）、行動電話、國籍（Radio 臺灣/外籍） |
| 右上 | Frame 272 | 540 × 332 | Nation（國籍補件）+ Location（縣市/行政區/街道地址）|
| 左下 | Frame 276 | 540 × 295 | Frame 249 + Frame 251（性別 Radio、Email…）+ Frame 411（市話、傳真、會員備註）|
| 右下 | Frame 350 | 540 × 108 | Frame 402（會員資訊）+ Frame 399（旅客習慣）|

> ↺ 0525：原 0428 的「右側正式單與候補單 Accordion」已不在此區，搬到 [C] 區（見上）。

---

## 顏色速查（同 tokens.md）

| 用途 | hex | token |
|---|---|---|
| 區塊外殼 bg | `#F6FAFD` | `Color/Neutral/75` |
| 卡片 / 表單 bg | `#FFFFFF` | `Color/Neutral/0` |
| 一般客戶按鈕（選中）| `#005FCC` | `Color/Surface/Action-Default` |
| checkbox 勾選 | `#2178CF` | （待補 token，目前 hardcoded）|
| checkbox 停用 | `#B0B0B0` | `Color/Neutral/300` |
| badge（有值）| `#EF6F25` | `Color/Brand/Brand-500` |
| 警示 icon（lock 紅）| `#E05216` | `Color/Brand/Brand-600` |
| badge（零值）| `#D1D1D1` | `Color/Neutral/200` |
| 主要文字 | `#454545` | `Color/Neutral/800` / `Color/Text/800` |
| 反白文字 | `#F6F6F6` | `Color/Neutral/50` |
| Input focus border | `#86B7FE` | （待補 token）|

---

## 0428 → 0525 變更總覽

1. **頁面長高** 2581 → 2676（cart empty）/ 3056（cart with items）。
2. **[B] 客戶+訂房資料區擴增** 432 → 613/993：grid 下方多了 加購 Button、購物車總金額（有值才顯）、items 清單（有值才顯）、預付/百分比 / 預付訂金 / 總售價 3 欄列。
3. **Grid 結構簡化**：加購欄拿掉（單獨變成 Button + cart 區）、欄寬重整（label 168、小計 165）、列數示意為 3 列重複。
4. **[C] 訂單條件變窄**為 752，右側補上「正式單與候補單」Accordion（364）。
5. **[D] 訂房資料 section** 變全寬 1100；內部由 1 欄左 + Accordion 右 → 改為 2×2 卡片排列，整體高度 888 → 792。
6. **訂房資料 header**：左側加 `icons/lock`（紅，disabled 狀態），右側多「清除」eraser + 兩個 checkbox 動作。
7. **產生訂單 Button Y/N** y 從 2528 → 2613（cart empty）/ 2993（cart with items），隨中段高度浮動。

---

## 注意事項

- **訂房資料 Grid 橫向捲動**：1389.5px > 容器 1100px，必須 `overflow-x: scroll`。
- **加購** 從 inline 欄位 → 獨立 Button（radius 44, pill 形）；點擊**沿用原本 add-on modal + JS**（不要重寫 modal 邏輯，只搬位置）。
- **購物車有值/無值** 切換規則（依使用者明示）：
  - 無 items：只顯示加購 Button，items container 與「總金額」一律 **hidden**（DOM 移除或 `display:none`，避免空容器佔位）。
  - 有 items：在加購 Button 右側顯示**總金額** base 文字；下方渲染 items 清單 container。
  - 區塊高度由內容撐開，**不要寫死 613 / 993**；底部 footer 列、頁面 Y/N Button 隨之下移。
- **訂單條件 → 到店方式：是 Button 不是 Select**（trailing icons/road；模板沿用 Select 但需自訂 modal，0428 已記錄細節，0525 未變）。
- **正式單與候補單 Accordion**：所在區塊改變，內容 slot 改為 padding 20、radius 12 的內框（0428 為 padding 20 直接放 radio）。0525 展開狀態下 slot 內含 Frame 361；需另行讀單筆內容元件確認 radio/option 與「未設定」文字。
- **lock toggle**：紅鎖 = inputs disabled（紅 vector fill `#e05216`）。綠色版本未在 0525 frame 中出現；切換規則沿用 feedback_lock_toggle_input_state。
- **客戶類型按鈕 ↔ 訂房 tab 連動**：合約客戶 ↔ Frame 277 tab 切「合約」，沿用 feedback_customer_toggle_links_order_tab。
- **未補項**（待後續單獨讀取）：
  - Frame 195「操作」欄的具體 icon / button（目前只有 header「操作」文字）
  - Frame 192 間數欄的 DatePicker 與「訂房間數」變體細節
  - Frame 411（會員備註 textarea）、Frame 402 會員資訊 4 欄、Frame 399 旅客習慣 3 段（沿用 0428 寫法即可）
  - 正式單與候補單 Accordion 內容（Frame 361 / 295 / Texts）尚未抓全 sub-node
