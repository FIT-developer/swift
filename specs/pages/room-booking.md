# 訂單管理 - 房間預訂 (room-booking)

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
| Function icons | 68 x 24 | x:1072, y:6 | 2 icons x 24，gap 20px |

**Function icons badge 顏色**：
- message(0)：bg `Color/Neutral/200`、文字 `Color/Neutral/800`（零值灰）
- person-md：無 badge，開啟「會員安全管理」modal

> 2026-07-08 使用者拍板：`system` function icon 與 aside「系統設定」語意重疊，已從 topbar/mobile drawer 移除；當時 Figma 同步保留三個 function icons。
> 2026-07-08 使用者拍板：本次交付不提供 `bulletin` 管理訊息功能，topbar/mobile drawer 整個拔除 `bulletin` icon 與 `modalBulletinBackdrop`；function icons 收斂為 `message` / `person-md` 兩顆。

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
| Frame 11（底部按鈕） | 725 × 63 | y:473 | 「清除」/「加入訂單」Button Y/N — **僅空房查詢 mode 顯示；庫存表 mode 整列隱藏（2026-06-01 使用者要求）** |

Table 欄位、Calendar 細節同 0428（保留段落，需與 0525 重新核對的細項以註記補上）。

### 0527 — 庫存表 mode 月曆改 offcanvas 觸發（↺ 新增）

Figma source：`Content page - 房間預訂 default 0527-a1` (`1775:53143`)

**Toolbar Frame 136**（[A] 右側面板上 toolbar，原為 Frame 97 mode toggle 176 × 42）擴增為 4 元件並排：

| 位置 | 元件 | 尺寸 | 內容 |
|---|---|---|---|
| x:0 | Frame 97 mode toggle | 176 × 42 | `空房查詢` / `庫存表`（庫存表 active = bg `Color/Brand/600` `#005fcc`） |
| x:192 | **Button 月曆**（**↺ 新增**） | 96 × 42 | `icons/calendar` 24 + 文字 `月曆`；只在「庫存表」mode 顯示；空房查詢 mode 隱藏 |
| x:304 | Button Excel | 98 × 36 | `icons/download` + 文字 `Excel`（session 65 已有，只在庫存表 mode 顯示） |

**月曆按鈕樣式**（2026-05-27 對位 `Content page - 房間預訂 default 0527-a2` `1775:54840` 確認）
- 不是 toggle；只有 **hover / focus / active** 變色狀態。
- baseline（0527-a1 `1775:53143`）：透明/白底、border `Color/Neutral/200` `#d1d1d1`、`icons/calendar` vector `#000000`（黑）、文字 `月曆` `Color/Neutral/800` `#454545`。
- hover / focus / active（0527-a2 `1775:54840`）：**bg `Color/Chart/blue` `#86b7fe`（淺藍，與餘房 chip 同色）**、border `#d1d1d1`（不變）、`icons/calendar` vector `#ffffff`（白）、文字 `月曆` `#ffffff`（白）。
- ⚠️ 此藍與庫存表 toggle active 用的 `Color/Brand/600` `#005fcc`（深藍）**不同**。

**月曆顯示邏輯**

| Mode | 左側 Calendar 351 × 431 | toolbar 月曆 button |
|---|---|---|
| 空房查詢 | inline 顯示（同舊版） | **不顯示** |
| 庫存表 | **不顯示** | 顯示；點擊 → 開啟 offcanvas（從 viewport 底部往上展） |

> 庫存表 mode：左側 calendar 區塊整塊「不顯示」（不是 collapse 留空），chip / table 維持；**「數量分配」slider row 與「清除 / 加入訂單」底部按鈕列也隱藏**（2026-06-01 使用者確認，只有空房查詢 mode 才出現這兩列）。

**Offcanvas 內容**
- Container spec → [components/offcanvas.md](../../components/offcanvas.md)
- header title 文字：`月曆`
- header 右上：`icons/close` 24×24，點擊 dismiss
- body slot：嵌入 Calendar `1773:49925`（同既有 calendar-simple 共用 markup，size 351 × 431）
- **行為加碼（↺ 0527 新增）**：calendar 內**任一日期 cell click → 自動 dismiss offcanvas**（除了原本的 close 按鈕外、使用者點日期即關）。詳見 [components/offcanvas.md](../../components/offcanvas.md) 「[A] 庫存表 mode 內 calendar 的特殊規則」段。

**待補/待確認**
- offcanvas 出現/關閉動畫時間 — 走專案既有 250ms ease-in-out 或另定

**0527 使用者確認（offcanvas dismiss 路徑）**
- 共 **2 條**：(1) 右上 `icons/close` 按鈕、(2) calendar 內任一日期 cell click
- **不支援** backdrop click / Esc / 滑動 等其他 dismiss

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
| 6 | Frame 196 單價 | 123 | 945.5 | 「單價」 | Input × 3 列（19999）；footer 空 |
| 7 | Frame 197 小計 | 165 | 1068.5 | 「小計」+ Select 「無折扣」（base 16, border-disabled, radius 6, padding 6/12） | **純文字 sm × 3 列**（範例 `199999`、置中、`Color/Neutral/800`；**↺ 0527 改：原 Input × 3 改唯讀純文字，不讓使用者修改**）；footer 上：「原價」+ strikethrough「8888」(`text-text-muted`)、下：Input「19999」（footer 仍為 Input） |

**th width 規則**：原 `style="width: …"` 改為 `style="min-width: …"`，避免 table 內容增多（如 select）時被 auto-layout 擠壓掉 input 寬度（曾出現 單價 → 56px）。
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
- **行動版（< md）高度限制**：grid 動態長高，最多顯示 3 張卡片（`max-h-[322px]` = 3×94 + 2×20 gap），第 4 張起原生 scrollbar 處理；md+ 解除限制（`md:max-h-none md:overflow-visible`），維持 2/3 欄完整展開。

**Cart item card 規格（每張 344×92）**

- bg `Color/Neutral/0`、border `Color/Neutral/100`（`#e1e1e0`）、radius 8、padding 16
- Frame 474（312×60）兩行
  - **上行**（312×24）：
    - 左 Frame 530：3 個 Texts 並排（all `Color/Neutral/800`）
      - 品名 Texts base 16px（如「機票」/「會議服務」/「嬰兒用品」）
      - **單價 Texts sm 12px**（範例 `$ 999` / `$ 888` / `$ 777`）← **↺ 0527 新增**
      - 數量 Texts sm 12px（範例 `2 份` / `2 間` / `2 個`）
    - 右 Frame 468（24×24）：`icons/trash-can`，vector stroke `#d90000`（紅色刪除）
  - **下行**（312×24 @ y:36）：
    - 左 Frame 470（143×24）：
      - 日期 chip（Frame 448, 79×24）：bg `Color/Brand/Brand-100`（`#fdebd7`）、radius 40、pad 4/8、Texts sm `Color/Neutral/900`（範例 `2026-03-01`）
      - 時間 chip（Frame 450, 56×24 @ x:87）：bg `Color/Neutral/100`（`#e1e1e0`）、radius 40、pad 4/8、Texts sm `Color/Neutral/900`（範例 `14：25`）
    - 右 Frame 463（105×22 @ x:158）：Texts base 金額（line 小計）`Color/Neutral/800`（範例 `$ 777,333,110`）

**品名範例對照**（Figma 0527 modal `1774:65571` 三張卡片示意）：

| 卡 | 品名 | 單價 sm | 量詞 |
|---|---|---|---|
| 1 | 機票 | `$ 999` | 份 |
| 2 | 會議服務 | `$ 888` | 間 |
| 3 | 嬰兒用品 | `$ 777` | 個 |

> 0527 對位：modal `1774:65571` Frame 444 / Frame 522 內 3 張卡片，上行從原本「品名 + 數量」改為「品名 + 單價 + 數量」三欄。
>
> ⚠️ 同樣的卡片 markup 也用在 **[B] 客戶+訂房資料下方的 cart preview grid**（Frame 583 內 cart-items）；該處需**同步**更新上行為三欄。
>
> ⚠️ 0525 Figma 標的中 card 8 / card 9 時間 chip 缺漏（只有日期 + 金額）；本輪不腦補，實作時統一以「日期 + 時間 + 金額」為標準排法，若 backend 沒給時間則只顯示日期 chip。

### Frame 559 / 584 — 預付/總價 footer 列（**↺ 0525 新增**）
`1017 × 38` @ x:20。y 位置依購物車狀態而異（空 555 / 有值 935）。內含 3 個等寬欄（≈ 322.33）+ gap 25：

| Frame | 寬 | 內容（base 文字 `Color/Neutral/800`） |
|---|---|---|
| Frame 209 | 322.33 × 34 | Texts「預付 / 百分比」+ Input(120×36, `1444`) + Select(90.33×36) — Input/Select 拼接 radius mixed |
| Frame 204 | 322.33 × 36 | Texts「預付訂金」+ Input(210.33×34, `1444`) |
| Frame 322 | 322.33 × 38 | 左：Texts「總售價」md + sm「99999」；右：Input(210.33×34, `1444`) |

---

## [C] 訂單條件 + 正式單與候補單 Accordion（Frame 452, `1751:43178`）

**↺ 0525-2 重讀**：上一輪 spec 為摘要；本次直接從 Figma 對位確認。

**尺寸**：`1140 × 425` @ y:1720

### 左 — Order condition（752 × 425, `1751:43179`）
- bg `Color/Neutral/75`、border `Color/Neutral/200`、radius 12、padding 20、@ x:0
- Header (container2, 712×27)：Texts「訂單條件」md 20px `#454545` + 右 icons/down 24×24
- Content (container, 712×342)：bg `Color/Neutral/0`、pad 12、radius 12
  - Frame 370 (688×318)：**2 欄 layout, col gap 32**
    - **欄 1 Frame 412 (328×318)**：6 列（row gap 約 20）
      | 列 | label (固定 100px) | 控制元件 | 備註 |
      |---|---|---|---|
      | 1 | 「人數」 | Select(78×36, `1`) + Texts sm「大」(x=202) + Select(78×36, `0`) + Texts sm「小」(x=316) | 兩個 Select 等寬 78 |
      | 2 | 「到店方式」 | Select(216×36, label「自行到店」, trailing **icons/road**) | **Button 不是真 Select**（trailing icon 是 road，沿用 0428 規格）|
      | 3 | 「發票」 | Select(216×36, 「不開發票」, trailing icons/down) |  |
      | 4 | 「統編」 | Input(216×34, placeholder) | bg/disabled 跟「發票」select 連動：不開發票=disabled、開發票=active（既有規則） |
      | 5 | 「抬頭」 | Input(216×34, placeholder) | 同上 |
      | 6 | 「繳款期限」**stack** label base + 「3 天」sm 12px (y=26) | Calendar simple(216×36, `2026-02-27`, trailing icons/calendar) | label 占 2 行（直排） |
    - **欄 2 Frame 412 (328×196)**：2 列（row gap 20）
      | 列 | label (固定 100px, **label 19h**) | 控制元件 |
      |---|---|---|
      | 1 | 「訂單備註」 | Input/textarea (216×88, value `???`, bg `#ffffff`, 右下 resize handle 兩條 line `#b0b0b0`) |
      | 2 | 「需求備註」 | Input/textarea (216×88, value `需要瓦斯爐`, 同上) |

> ⚠️ 本次重讀**否定**前 spec「欄 1 含訂單備註/需求備註」的記述；備註區是欄 2，且欄 2 已不含折扣/總房價/加購項目併單/預付百分比/預付（前者已移至 [B] Frame 559）。

### 右 — Accordion「正式單與候補單」（364 × 425, `1751:43180`）
- bg `Color/Neutral/75`、border `Color/Neutral/200`、radius 12、padding 20、@ x:776
- Header (Frame 99, 324×27)：Texts「正式單與候補單」md 20px + icons/down @ x:300
- flexible content slot (324×342)：bg `Color/Neutral/0`、pad 20、radius 12
- **height 對齊規則（2026-06-01）**：外框 `.rb-accordion` 設 `flex flex-col`、內白底 `.rb-accordion-content` 加 `flex-1` → 白卡吃滿剩餘高度，與左側 [C] 訂單條件白卡同高，避免下方露灰底
  - Frame 361 (284×319)
    - **Frame 295 (284×22, y:0) — 訂單類型 row**：label「訂單類型」base 16px + 3 pill toggle (Nation-style, slot 寬 208)
      - **無設定** (active, 圓圈 20×20 fill `#ffffff` stroke 內藍 `#2178cf`) + Texts「無設定」base
      - **正式單** (inactive, 圓圈 fill `#ffffff` stroke `#d1d1d1`) + Texts「正式單」base
      - **候補單** (inactive, 同上) + Texts「候補單」base
    - **Texts 占位 (284×277, y:42)**：「未設定」md 20px `#454545` 置中 (x=124, y=125 in container)

> 0525-2 狀態：accordion **展開**、訂單類型 default = **無設定**（不是「正式單」）。Payment method slot 已被三個 pill toggle 取代。

---

## [D] 訂房資料 Section（Frame 453, `1751:43181`）

**↺ 0525-2 重讀**：本次重新對位 4 象限，內容大幅縮減（旅客習慣整段移除）。

**尺寸**：`1140 × 792`，bg `Color/Neutral/75`、border `Color/Neutral/200`、radius 12、padding 20，@ y:2169

### Header 列（Frame 350，1100 × 27 @ x:20, y:20）
- Frame 246（116×27）：Texts「訂房資料」md 20px + icons/lock 24×24（fill `#e05216` → `Color/Brand/Brand-600`，紅 = inputs disabled，[[feedback_lock_toggle_input_state]]）
- Frame 353（1016×22 @ x:84, y:2）：右側 action 列（右對齊）
  - Frame 352（56×22 @ x:668）：icons/eraser 16×16 + Texts「清除」base
  - Frame 349（134×22 @ x:744）：Checkbox 14×14 disabled + Texts「入住人同訂房人」base
  - Frame 354（118×22 @ x:898）：Checkbox 14×14 disabled + Texts「寄送訂房資訊」base

### Body（Frame 358，1100 × 709 @ y:63）

**Tab 列（Frame 356，184 × 42, pad 0/12）**
- Frame 354（72×42 @ x:12）：bg `Color/Neutral/0`、border `Color/Neutral/100`、radius mixed → **active「訂房」**
- Frame 355（72×42 @ x:100）：bg `#d1d1d1`（`Color/Neutral/200`）、border `Color/Neutral/100` → **inactive「入住」**

> tab 只剩 2 個（訂房/入住），無「合約」tab（合約客戶是上層 [B] 的客戶類型切換，feedback_customer_toggle_links_order_tab 已記）。

**表單內容（Frame 277，1100 × 667）**：bg `Color/Neutral/0`、border `Color/Neutral/100`、radius 12、pad 20/0/20/0

採 **2 × 2 卡片排列**（每張卡片 540 寬、pad 20、cell gap 20）：

#### 左上（Frame 275, 540×280, x:0, y:20）— 訂房人基本資料
label 固定 64px、輸入欄寬至右邊界。

> **橘字三件套**：名稱 / 證號 / 行動電話 label `#ef6f25` = **客戶識別必填欄 + 後續客戶搜尋主要欄位**。
> - Figma label 為 `#ef6f25` 橘色的就這 3 欄；其餘（生日 / 性別 / Email / 傳真 / 會員備註等）label 為 `#454545` 黑、非必填
> - 實作時這 3 欄套 `text-brand-active`（對應 `--color-text-brand` `#ef6f25` token），其他套 `text-text-default`
> - **不要外推**到其他 section 同名欄位（例如 [B] 客戶區若也有名稱，不一定也是橘）；只有 Figma 顯式上色的才上色
> - 將來 client filter / search UI 要把這 3 欄當主篩選鍵

| 列 | label | 控制元件 | 備註 |
|---|---|---|---|
| 1 | 「名稱」**`#ef6f25` 橘字** | Input(333×34, `王大頭`) + 右側 Texts honorific (寬 79, @ x:421) | **honorific 是依「性別」radio 動態渲染的 `<span>`，不是固定 Texts 也不是 select**：男 -> 顯示「先生」、女 -> 顯示「小姐」。Figma 視覺稿出現「先生 / 小姐」是並列展示兩個變體，不是斜線串接的字面值。實作：性別 radio 的 change handler 內更新該 span。訂房 / 入住 panel 各自獨立，互不影響。預設性別 = 男 -> 初始「先生」。|
| 2 | 「證號」**`#ef6f25` 橘字** | Input(424×34, `X111333555`) | 是「證號」不是「身份證號」/「護照號碼」|
| 3 | 「行動電話」**`#ef6f25` 橘字** | Input(424×34, `0988777111`) |  |
| 4 | 「生日」 | Calendar simple(424×36, `2026-02-27`) | birthday variant（[[feedback_calendar_use_reference_code]]）|
| 5 | 「性別」(Nation 元件, slot 100寬) | Frame 253「男」(default selected) + Frame 254「女」 | radio 圓圈 20×20；性別會驅動列 1 的 honorific |

> 全部 input/calendar 的 bg 灰底由 [[feedback_lock_toggle_input_state]] 控制；Figma frame 為 lock=紅=disabled 狀態，所以一律灰底，不是欄位 baseline（[[feedback_locked_state_in_figma]]）。

#### 右上（Frame 272, 540×332, x:560, y:20）— 國籍 + 地址
| 列 | label | 控制元件 |
|---|---|---|
| 1 (y:20) | 「國籍」(Nation 元件) | Frame 253 [✱]「臺灣」(selected) + Frame 254 ○「外籍」(unselected) (slot 144寬) |
| 2 (y:62, 250高) | 「地址」(Location 元件，424×250) | 3 stacked sub-rows： |
|  |  | • **縣/市** label + Select(424×36, `台中` value 灰 `#888888`, trailing icons/down) |
|  |  | • **行政區** label 左 + 「406」base 右對齊 / 下接 Select(424×36, `北屯區` value `#888888`) |
|  |  | • **街道** label + Input(424×36, placeholder) |

> 國籍切「外籍」時，地址結構需切「國家 Select」（沿用既有 nation-foreign-only 邏輯，未在這次 Figma 顯示）。

#### 左下（Frame 276, 540×295, x:0, y:352）— Email/傳真/會員備註
label 固定 64px。

| 列 | label | 控制元件 |
|---|---|---|
| 1 (y:20) | 「Email」 | Input(424×34, `xyz@hotmail.com.tw`) |
| 2 (y:74) | 「傳真」 | Input(424×34, `02-33331111`) |
| 3 (y:128, 147高) | 「會員備註」**label 在 input 之上**（不是同列） | Input/textarea(500×113, placeholder, 右下 resize handle 兩條 line `#b0b0b0`) |

> 灰底同 [[feedback_locked_state_in_figma]]，不重覆描述。

#### 右下（Frame 350, 540×108, x:560, y:352）— **僅 2 行 read-only 顯示**
| 列 | 左欄 (238 寬) | 右欄 (238 寬) |
|---|---|---|
| 1 (y:20, 28高) | Texts「訂房次數」base `#6d6d6d` (label 灰) | Texts「XYZ」base `#454545` 右對齊（x:198 in 自欄內） |
| 2 (y:60, 28高) | Texts「累積消費」base `#6d6d6d` | Texts「XYZ」base 右對齊 |

> ⚠️ **大幅縮減**：原 HTML 含「訂金保留 / 累積消費 / 住房次數 / 最新住宿日」4 個 stats 列 + 「旅客習慣」section + 消費方式 / 車位 / 住房安靜 三個 chip 列；新 Figma 只剩**訂房次數 + 累積消費 2 列**，其餘 6+ 元件全部移除。

### 0525-2 區塊布局重組

| 列 | xl 配置 | 元素 |
|---|---|---|
| 第 1 列 | `xl:grid-cols-3` → 752 + 364（≈ 2/3 + 1/3） | **[C] 訂單條件** + **[E] 正式單與候補單** |
| 第 2 列 | 全寬 1100 | **[D] 訂房資料** |

> 變更：原 layout 是 [C] 全寬 → [D](2/3)+[E](1/3)；新版改為 [C](2/3)+[E](1/3) → [D] 全寬。[E] 從 [D] 旁搬到 [C] 旁。

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
- **客戶類型按鈕 ↔ 訂房 tab 連動規則**（完整內容）：
  - 點 **「一般客戶」** -> 隱藏 #contractFields + **隱藏合約 tab 按鈕** + 訂房資料 tab 切回「訂房」
  - 點 **「合約客戶」** -> 顯示 #contractFields + **顯示合約 tab 按鈕** + 訂房資料 tab 切到「合約」
  - 合約 tab **不是常駐 tab**，存在條件 = 目前訂單為合約客戶；預設（一般客戶）狀態下 [D] 訂房資料只有 2 個 tab（訂房 / 入住）
  - 實作：customer-toggle click handler 除了 toggle `#contractFields` 之外要呼叫 `switchOrderTab(key)`（contract -> 'contract', general -> 'booking'）。tab 上的 `.order-tab-active` 樣式跟 panel 的 `hidden` 都要同步切。
  - **Why**：這兩個 UI 元件描述同一個業務概念（「這張訂單是不是合約客戶」），不可獨立操作。
- **未補項**（待後續單獨讀取）：
  - Frame 195「操作」欄的具體 icon / button（目前只有 header「操作」文字）
  - Frame 192 間數欄的 DatePicker 與「訂房間數」變體細節
  - Frame 411（會員備註 textarea）、Frame 402 會員資訊 4 欄、Frame 399 旅客習慣 3 段（沿用 0428 寫法即可）
  - 正式單與候補單 Accordion 內容（Frame 361 / 295 / Texts）尚未抓全 sub-node
