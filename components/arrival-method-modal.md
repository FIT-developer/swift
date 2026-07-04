# Component Specification: `Arrival Method Modal`（到店方式 Modal）

**Figma Node IDs**（同元件多個 state instance，本輪讀到 4 個）:
- State A — 自行到店 selected：`1106:19329`，175 × 507（讀取日 2026-05-08）
- State B — 自駕 selected（5 種車型 stepper）：`1109:19460`，379 × 507（讀取日 2026-05-08）
- State C — 包車或專車 selected（2 種車型 stepper）：`1110:19603`，283 × 507（讀取日 2026-05-08）
- State D — 接送 selected（接 / 送 雙 swiper card stack）：本輪讀到 3 個 instance，皆 **993 × 834**（讀取日 2026-05-08）
  - State D-1：`1121:16398` — 接 / 送 各 1 卡（delete disabled）
  - State D-2：`1124:17174` — 接 2 卡（**第 1 張為 front**，back card 從**右上**peek-out）/ 送 1 卡（add button 灰底，疑點）
  - State D-3：`1135:16863` — 接 2 卡（**第 2 張為 front**，back card 從**左下**peek-out）/ 送 1 卡 — 等同 D-2 swipe 到下一張的狀態

**參考實作**（使用者 2026-05-08 提供，UI layout 仍以 Figma 為主，swiper.js 僅取「堆疊 + cards effect + swipe 切換」行為）：

```
CDN（pin v12）：
- CSS: https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css
- JS:  https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js

初始化：
new Swiper(".mySwiper", {
  effect: "cards",
  grabCursor: true,
});

DOM 結構：
<div class="swiper mySwiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide">…</div>
    <div class="swiper-slide">…</div>
    ...
  </div>
</div>
```

> 使用 swiper@12 的 `effect: "cards"` 內建堆疊+滑動，自動處理 active card 在最上層的 z-index 切換。dot pagination + 箭頭可走 swiper 內建模組（`pagination` + `navigation`）或自訂。樣式（卡片尺寸 393×577、bg、border、圓角）以 Figma 為準，覆寫 swiper 預設 .swiper-slide。

**觸發來源**: `訂單條件 → 到店方式` button（trigger node `I1456:26597;813:28134;1456:26693`，見 `components/order-condition.md` 與 `specs/pages/room-booking.md`）

---

## 概述

點擊「到店方式」button 後開啟，內含 4 個 chip 樣式 button 供使用者切換到店方式，下方有「取消 / 確定」action。**部分 chip 選中後會展開 second-tier 次選項區塊**（目前讀到「自駕 → 5 種車型 stepper」；其餘 chip 對應展開區塊待 Figma 補）。

本輪 Figma 同稿同時提供 trigger 變更為 button + modal，故與 `components/order-condition.md` 舊段「到店方式 = Select」的記錄存在 **規格污染**，待對齊。

---

## 共用 Modal 規格（reference）

> 本 variant 的 modal 外框 / Header / Footer / Backdrop / 共用 interaction 一律走 `components/modal.md`「共用外框 / 共用 Header / 共用 Footer / 全站 Backdrop / 共用 Interaction」段；本檔只記錄 variant 獨有差異。

**Header**：標題「到店方式」（20px SemiBold `Color/Text/800`）、`icons/close`、padding 12、下邊框雙層（`Color/Neutral/300` solid + `--effect-modal-header-shadow`）皆採 modal.md 共用規格。
**Footer**：取消（bg `Color/Neutral/200`）/ 確定（bg `Color/Text/800`、text `Color/Text/100`）皆採 modal.md 共用規格。
**Backdrop / interaction**：同 modal.md（全站 Backdrop 規格 / 共用 Interaction 段）。

## Variant-specific：尺寸 / 寬度

> 寬度與高度隨 chip state 變動，與 modal.md 共用規格的 320 寬不同。

| State | Modal 外框 | content swap | 備註 |
|---|---|---|---|
| A 自行到店 | `175 × 507` | `66 × 507` | 最小 — 只有 chip row |
| B 自駕 | `379 × 507` | `270 × 507` | + 5 種車型 stepper |
| C 包車或專車 | `283 × 507` | `174 × 507` | + 2 種車型 stepper |
| D 接送 | **`993 × 834`** | `884 × 834` | + 雙 swiper card stack（接 393 + gap 24 + 送 393） |

State A/B/C 寬度固定 `507`；State D 因 並排雙 swiper 擴張到 `834`。Header（51px）+ Footer（58px）固定；其餘高度由 content 撐開。

## RWD 行為（使用者 2026-05-08 確認）

- desktop / tablet：A/B/C 寬 507；D 寬 834，接 / 送 並排（橫向 2 column，gap 24）
- mobile（窄寬度）：**State D 改垂直堆疊** — 接（入住日卡片）在上、送（退房日卡片）在下；gap 待確認，建議沿用既有 modal 內 row gap 16 或 24
- 切換斷點 / modal 寬度收縮策略待 Figma 補 mobile 設計稿
- 共用 RWD 行為（modal max-width `100vw - 24px` / body scroll）走 modal.md

---

## Content：chip group + 次選項區塊（Payment method 變體）

### Chip group（共用，State A / B 皆有）

`42 × 483` @ x:12, y:12（content swap 內）

4 個 chip button 並排，gap **16px**（記憶 `chip-button-spec`：gap 16 / padding 10/16 / radius 28）。

| # | text | 尺寸 | x | border | text fill | State A | State B | State C | State D |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 自行到店 | 42 × 96 | 0 | `Color/Neutral/200` / 選中時為 `Color/SubItem/Selected` | `Color/Text/800` | ✅ | ◻ | ◻ | ◻ |
| 2 | 自駕 | 42 × 64 | 112 | 同上 | `Color/Text/800` | ◻ | ✅ | ◻ | ◻ |
| 3 | 包車或專車 | 42 × 112 | 192 | 同上 | `Color/Text/800` | ◻ | ◻ | ✅ | ◻ |
| 4 | 接送 | 42 × 64 | 320 | 同上 | `Color/Text/800` | ◻ | ◻ | ◻ | ✅ |

**每個 chip**：cornerRadius `28`、padding `10/16`，text 16px Regular。寬度依文字長度自適（無固定寬）。預設無 fill（透明），active 時 bg + border 同為 `Color/SubItem/Selected`。

**Selected 顏色**：黃 chip（`Color/SubItem/Selected`）— 對應記憶 `chip_variants_yellow_vs_blue`：黃用於 tag / 付款指示，藍用於 toggle / mode 切換；本 modal 屬「指示性 tag 選擇」，故用黃。

### State B 次選項：自駕車型 stepper grid

> 僅當 chip = `自駕` 時顯示。

`192 × 483` @ x:12, y:66（content swap 內，chip row 下方），padding `12`。

5 個 vehicle stepper item，2 row × 4 col grid：

| Row | y | items（依序） |
|---|---|---|
| Row 1 | 12 | 轎車、電車、重機、機車（item gap 24px） |
| Row 2 | 112 | 腳踏車（左對齊，僅 1 個） |

**Row 間距**：32px（row1 下緣 80 → row2 起點 112）。

**每個 vehicle item**（68×96，含 label 22px + gap 12 + Input 34px）：
- **label**：text 16px Regular `Color/Text/800`（轎車 / 電車 / 重機 / 機車 / 腳踏車）
- **Input (stepper)**：見「Stepper Input 共用結構」段

### State C 次選項：包車或專車車型 stepper grid

> 僅當 chip = `包車或專車` 時顯示。

`96 × 240` @ x:12, y:66（content swap 內，chip row 下方），padding `12`。

2 個 vehicle stepper item，1 row × 2 col：

| Row | y | items |
|---|---|---|
| Row 1 | 12 | 九人座（x:12）、遊覽車（x:132，gap 24） |

**每個 vehicle item**（72×96，含 label 22px + gap 16 + Input 34px）：
- **label**：text 16px Regular `Color/Text/800`（九人座 / 遊覽車）
- **Input (stepper)**：見「Stepper Input 共用結構」段

> **觀察**：State B vehicle item 高 68（label-input gap 12），State C 高 72（label-input gap 16）— 4px 差異。可能是 Figma 設計細節差或不同 instance 不同 gap 設定，**待確認是否為刻意差異或統一**。

### Stepper Input 共用結構

`34 × 96`：bg `Color/Neutral/0`、stroke `Color/Neutral/200`、cornerRadius `6`、padding `6/12`

內 Frame 320（16 × 72）：
- Text「0」16px Regular `Color/Text/800`（左側）
- `icons/up-and-down` 16×16（右側，vector 7×13 內含）

**stepper 樣式**：text + 上下箭頭 icon（不是傳統 `[-] [N] [+]` 兩側按鈕）。`icons/up-and-down` 已存在於 `preview/assets/icons/up-and-down.svg`。

### State D 次選項：接 / 送 雙 swiper card stack

> 僅當 chip = `接送` 時顯示。**結構與 B/C 完全不同**：不是 stepper grid，而是兩個並排 swiper card 容器（接客單 + 送客單，使用者 add/delete 多筆）。

`798 × 810` @ x:12, y:74（content swap 內，chip row 下方）。

並排兩個 swiper card 容器，gap **24px**：

| 容器 | Frame name | 尺寸 | x | header | add button | 序號 label |
|---|---|---|---|---|---|---|
| 接客單 | Frame 344 | 798 × 393 | 0 | 「入住日：2026-12-01」 | 「新增一筆接待單」 | 「接待單 N」 |
| 送客單 | Frame 346 | 798 × 393 | 417 | 「退房日：2026-12-01」 | 「新增一筆送客單」 | 「送客單 N」 |

**Add button bg 兩態**（State D-1 / D-2 觀察）：

| 狀態 | bg | 取自 | 語意 |
|---|---|---|---|
| 強調（peach） | `#fdebd7`（`Color/Brand/Brand-100`） | State D-1 接、D-1 送、D-2 接 | — |
| 弱化（grey） | `#d1d1d1`（`Color/Neutral/200`） | State D-2 送 | — |

> **使用者確認 2026-05-08**：兩態色票差異**沒有功能語意**，只是視覺上做出差異。UI 確實會讓人疑惑，先依 Figma 原樣實作，UX 優化排到下一輪討論。
> 文字 `#454545`、icon 內 vector 黑色，兩態相同；只外框 fill 變動。

**容器外框（共用）**：bg `Color/Neutral/0`、border `Color/Text/100`（`#e1e1e0`）、cornerRadius `12`、padding `20`

#### 容器內結構（接 / 送 完全相同，僅 label 不同）

| y | 區塊 | 尺寸 | 說明 |
|---|---|---|---|
| 20 | 日期 header（Frame 336） | 27 × 353 | text 20px Regular `Color/Text/800`，「入住日：」/「退房日：」+ 日期 |
| 63 | Add button（Frame 303） | 32 × 353 | bg `Color/Brand/Brand-100`（`#fdebd7`）、radius `6`、padding `4`；置中含 `icons/plus-list` 24×24 + label 16px Regular |
| 111 | 當前序號 label | 22 × 353 | text 16px Regular `Color/Text/800`，「接待單 N」/「送客單 N」（隨 swipe 切換 N 值） |
| 149 | **swiper card stack 容器**（Frame 351） | 577 × 353 | bg `Color/Modal/Hover`（`#f6fafd` / 同 `Color/Neutral/75`）、border `Color/Text/100`、radius `12`、padding `20` |
| 742 | Dots / 切換 row（Dots） | 36 × 353 | 含 `icons/arrow-left` 24×24 @ x:0、dot pagination（中心 @ x:166.5）、`icons/arrow-right` 24×24 @ x:329 |

#### swiper card stack 容器內：單張卡片內容（537 × 313 inside 20px padding）

| Row | y | h | 欄位 | 元件 |
|---|---|---|---|---|
| Row 1（Frame 349） | 20 | 70 | 生效日期 \| 客人數 | Calendar simple（無 icon 特規 ↓）\| number stepper |
| Row 2（Frame 350） | 106 | 70 | 客目的地點 \| 客搭乘資訊 | input \| input |
| Row 3（Frame 342） | 192 | 70 | 客到站時間（時 / 分） | hour stepper + 「時」 + minute stepper + 「分」 |
| Row 4（Frame 344） | 278 | 70 | 接待時間（時 / 分） | hour stepper + 「時」 + minute stepper + 「分」 |
| Row 5（Frame 341） | 364 | 141 | 備註 | textarea |
| Row 6（Frame 351） | 521 | 36 | 刪除清單 button（**右對齊** 36×108 @ x:205） | input-style button + `icons/trash-can` |

**Row gap**：16px。每個 70 高 row 內含兩欄（共用 label 22px + Input 34px，row 內欄寬 144.5，gap 24）。

**stepper 樣式**：與 State B / C 共用「Stepper Input 共用結構」（text + `icons/up-and-down`）。

#### 生效日 calendar 特規（使用者確認 2026-05-08）

> **Row 1 左欄不沿用 `components/calendar-simple.md` 的 trailing icon 寫法。**
>
> Reason：Row 1 是兩欄 cell-pair（cell 寬 ~144），扣 padding 後可用內寬 ≈ 120，剛好放 `YYYY-MM-DD`（10 字 × 16px ≈ 96 + cursor / 邊距）。再塞 24×24 calendar icon 文字會被擠掉，顯不下。
>
> How to apply：此處生效日欄位**移除** `<img src="./assets/icons/calendar.svg">`；保留 calendar 點擊互動（整個 cell 仍可點開 dropdown），不為 icon 獨佔一行改變 Row 1 兩欄佈局。
>
> 此特規**僅限本 modal 內生效日**；其他地方仍依 calendar-simple.md 帶 icon。

#### 刪除清單 button（兩態）

> 使用者確認 2026-05-08：以「label `#888888` 灰、寬 36×108、內間距 12px」為 canonical disabled state；Figma 端已統一（D-2 送的「Disabled-B」與 D-1 接的 127 寬皆為舊版偏差，已修正）。

| State | bg | 邊框 | label | icon stroke | 寬 | 語意 |
|---|---|---|---|---|---|---|
| Disabled | `#e1e1e0`（`Color/Text/100`） | `#d1d1d1`（`Color/Neutral/200`） | `#888888`（`Color/Neutral/400`） | `#b0b0b0`（`Color/Text/300`） | 36×108 | 1 張時，整體灰化（label / icon 全灰） |
| Active | `#ffffff`（`Color/Neutral/0`） | `#d1d1d1` | `#454545`（`Color/Text/800`） | **`#d90000`**（`Color/Border/Plugin-Invalid` / 紅） | 36×108 | 2+ 張時，紅 trash icon 強調破壞性操作 |

**共用樣式**：cornerRadius `6`、padding `6/12`、sm 12px Regular label、`icons/trash-can` 24×24、label-icon 內間距 `12px`、**右對齊**（位於 36 高 row 右側）。

#### Dot pagination + 切換箭頭（Dots row 36 × 353）

| 元素 | 尺寸 | x | 樣式 |
|---|---|---|---|
| `icons/arrow-left` | 24 × 24 | 0 | vector fill `Color/Text/300`（`#b0b0b0`） |
| dot 容器（Frame 348） | 24 × 動態寬 | 置中（依 dot 數動態算） | 1 卡 → 寬 20 @ x:166.5；2 卡 → 寬 56 @ x:148.5（dot 寬 20 / gap 16） |
| `icons/arrow-right` | 24 × 24 | 329 | vector fill `Color/Text/300` |

**Dot 樣式（兩態）**：

| State | Figma 結構 | fill | stroke | size |
|---|---|---|---|---|
| **Active** | Frame 320（外殼）內含 Ellipse 15 | inner ellipse fill `#86b7fe`（`Color/Bootstrap/components-focus` / 天藍） | outer Frame 320 stroke `#d3ebfd`（`Color/Bootstrap/focus-background`） | 24×20（外殼）/ 20×20（inner ellipse） |
| **Inactive** | Ellipse 13 | `#d1d1d1`（`Color/Neutral/200`） | — 無 stroke | 20×20 |

> **Inactive fill 已對齊**：使用者 2026-05-08 確認 Figma 已自行更新為 `Color/Neutral/200` `#d1d1d1`（先前 `#d9d9d9` 是舊版設計稿暫存值）。

> **Active dot 結構**：24×20 Frame 320 容器（含 stroke `#d3ebfd`、padding bottom 4）內含 20×20 Ellipse 15（fill `#86b7fe`）。inactive 是純 Ellipse 13。

> dot gap **16px**（active@x:0 / inactive@x:36 或反之，視 swipe 位置）。dot 數 = 該 swiper 內卡片數，active dot 隨當前顯示卡片同步。

#### 互動行為（使用者描述 + State D-2 觀察）

- swiper card 用 swiper.js（參考官網範例）：堆疊式 + 滑動切換 1 / 2 / 3...
- **「currently active card」永遠在最上層**（z-index 最高）；swipe 移動中，新 active card 也維持最上層，避免閃動穿插
- active card index 同步：序號 label「接待單 N」/「送客單 N」、active dot、front-most layer 三者一致
- 接 / 送 為兩個獨立 swiper instance，各自管理自己的卡片數
- mobile 用左右箭頭 click 切換（`icons/arrow-left` / `icons/arrow-right`）
- delete button 三態：Disabled-A（label 灰、1 卡）/ Disabled-B（label 黑、1 卡，疑點）/ Active（紅 trash icon、2+ 卡）
- 「新增一筆接待單」/「新增一筆送客單」按鈕 → push 一張卡片進對應 swiper
- **堆疊視覺**（兩態，由 swipe 位置決定）：back card 樣式與 front card 同（bg `#f6fafd`、border `#e1e1e0`、radius `12`），相對 front card (x:20, y:149) 偏移：
  - **D-2（front = card 1）**：back card @ x:35.47, y:140.09 → 偏移 +15.47x / -8.91y → **右上 peek-out**
  - **D-3（front = card 2）**：back card @ x:5.05, y:158.7 → 偏移 -14.95x / +9.7y → **左下 peek-out**
  - 偏移量約 `±15px (x)` 與 `±9px (y)`，方向隨 active 卡片在 stack 中的位置反向（卡 1 active → 卡 2 從右上看；卡 2 active → 卡 1 從左下看）。
- **「首張永遠在首層」澄清（2026-05-08 使用者確認）**：「首張」= **currently active card**（當前顯示中的那張），不是 index 1。因此 D-3 的視覺正確：使用者已 swipe 到第 2 張卡 → 第 2 張變成 front-most（z-index 最頂）→ 第 1 張變成 back card 從左下 peek-out。**規則**：
  - 任何時刻，currently active card 在 stack 最上層（z-index 最高）
  - 在 swipe 移動過程中，新將成為 active 的 card 也須在最上層（避免穿插閃動）
  - active card index 同步：序號 label「接待單 N」、active dot、front-most layer 三者連動

### 待補次選項

| chip | 次選項 |
|---|---|
| 自行到店 | **無**（使用者 2026-05-08 確認）。State A modal h:175 為最終版，選中即代表「自行到店」無附加資料。**UX 提示文字**（例如「無需填寫」）待下一輪 UX 優化討論。 |

---

## 互動行為（Figma 未定義，**不腦補**）

| 行為 | Figma 是否定義 | 處置 |
|---|---|---|
| chip 點擊 → 切換 active state | ❌ 未定義 | 推測單選；State A / B 為兩個 instance 而非 component variant；待確認是否為純展示稿 |
| chip 切換 → 是否動態展開次選項 | 部分（自駕→vehicle grid、包車或專車→vehicle grid、接送→swiper card stack 已給） | 自行到店 chip 對應次選項待確認（State A 看起來沒有） |
| swiper：滑動切換 / 堆疊 / 第一張頂層 / dot active / 箭頭切換 | 使用者描述 | Figma 視覺只給 1 張卡狀態；多卡 / 滑動 / dot active variant 樣式待補 |
| 新增 / 刪除卡片：add button、delete active state | ❌ 未定義 | active 樣式（背景色 / icon stroke 反差）待補 |
| stepper input 0 / +/- 互動 | ❌ 未定義 | 推測點 `icons/up-and-down` 上半段 +1、下半段 -1，min 應為 0；待確認 |
| 確定 → commit selection 並關閉 modal | ❌ 未定義 | 待確認 |
| 取消 → 不 commit、關閉 modal | ❌ 未定義 | 待確認 |
| close icon → 等同取消 | ❌ 未定義 | 待確認 |
| backdrop click / Esc | 走 `components/modal.md` 全站共用規格 | OK |
| trigger button text/icon 同步 | ❌ 未定義 | 4 個方式對應 trigger trailing icon，目前只有「自行到店 → icons/road」一條，其他 3 條 icon 未提供 |

---

## 未定義項目（待 Figma 補）

1. chip hover / focus state
2. stepper hover / focus / disabled / max value
3. chip default 是否一定有一個 active（首次開啟若 trigger 未選擇任何方式時的初始狀態）
4. 自駕 / 包車或專車 / 接送 對應 trigger trailing icon（State A 已給「自行到店 → icons/road」）
5. 「接送」chip 選中後對應次選項區塊（已給：自駕 → 5 種、包車或專車 → 2 種；自行到店 → 推測無，待確認）
6. modal RWD 行為（507px 在 < 540px viewport 上的處理）
7. header bottom border 雙層 stroke 是否對應 `--effect-modal-header-shadow` token

---

## 規格污染 / 待對齊

- ✅ **`components/order-condition.md:183`** 已對齊（2026-05-08）：原「到店方式 = Select」更新為「到店方式 = Button trigger，點擊開到店方式 Modal」。
- ✅ **共用 modal 結構** 已對齊 `components/modal.md`（2026-05-08）：本檔 Header / Footer / Backdrop / 共用 interaction 移除重複描述、改 reference modal.md。`components/modal.md` Variants 表格也補上 `state=arrival method` 連回本檔。
- `specs/pages/room-booking.md` 注意事項段已有「到店方式 = Button」記錄；本 modal spec 為其完整 component 規格，page-level 不需重複收錄。
- **stepper 樣式不同**：本 modal vehicle grid 用 text + `icons/up-and-down`（縱向上下箭頭）；房間預定共用區塊的訂房明細「間數」欄與訂單條件 column 用 `[-] [N] [+]`（兩側 44px 按鈕，定義在 `app.css .stepper`）。屬兩種獨立 stepper 樣式，是否合併或保留差異待確認。

## 已釐清項目（使用者 2026-05-08 回覆）

1. **送 add button 灰底**：色票差異，**無功能語意**，先實作 UI 一致 Figma；UX 優化排下一輪
2. **delete disabled label color**：以 `#888888` 為 canonical（Figma 已修正）
3. **delete button 寬 / 內間距**：寬 `108`、label-icon 內間距 `12px`（Figma 已修正）
4. **inactive dot fill**：改為 `Color/Neutral/200` `#d1d1d1`（Figma 已自行更新）
5. ✅ **modal header 雙層 stroke**：對齊 `components/modal.md` L87 — `Color/Neutral/300` solid 1px + `--effect-modal-header-shadow`（雙層）為共用規格，本 variant 沿用
6. **mobile RWD**：接（入住日）卡上、送（退房日）卡下，垂直堆疊
7. **自行到店 chip 無次選項**：選中即代表選擇，無需展開；UX 提示文字下一輪討論
8. **swiper.js**：使用 swiper@12 `effect: "cards"`、grabCursor，CDN pin v12（已寫入「參考實作」段）
9. ✅ **規格污染**：`order-condition.md` 已對齊

---

## Color tokens 速查

> 共用 modal token（外框 / header / footer / backdrop）見 `components/modal.md`「顏色對照」段；下方只列 variant 獨有 token。

| 用途 | 值 | Token |
|---|---|---|
| chip / 卡片 / dot text | `#454545` | `Color/Text/800` |
| selected chip bg/border | `#f7d275` | `Color/SubItem/Selected` |
| chip default border | `#d1d1d1` | `Color/Neutral/200` |
| swiper outer card bg（State D 接 / 送 容器） | `#ffffff` | `Color/Neutral/0` |
| swiper outer card border | `#e1e1e0` | `Color/Text/100` |
| swiper inner stack bg（Frame 351） | `#f6fafd` | `Color/Modal/Hover` / `Color/Neutral/75` |
| Add button bg（新增一筆接待單 / 送客單） | `#fdebd7` | `Color/Brand/Brand-100` |
| 刪除清單 button bg（disabled） | `#e1e1e0` | `Color/Text/100` |
| 刪除清單 text（disabled） | `#888888` | `Color/Neutral/400` |
| dot active fill | `#86b7fe` | `Color/Bootstrap/components-focus` |
| dot active stroke | `#d3ebfd` | `Color/Bootstrap/focus-background` |
| dot inactive fill | `#d1d1d1` | `Color/Neutral/200`（已對齊） |
| arrow icon fill / 刪除 icon stroke (disabled / inactive) | `#b0b0b0` | `Color/Text/300` |
| 刪除清單 icon stroke (active 紅) | `#d90000` | `Color/Border/Plugin-Invalid` |
| Add button bg（疑點：弱化態） | `#d1d1d1` | `Color/Neutral/200` |
