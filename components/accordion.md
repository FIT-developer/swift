# Accordion（手風琴容器）

> 用於 [A] 空房與庫存查詢、[C] 訂單條件等大節。

---

## 外框

| 屬性 | 值 |
|---|---|
| 尺寸（展開版） | `1140 × 619`（高度依內容） |
| fill | `Color/Neutral/75` |
| stroke | `Color/Neutral/200` |
| cornerRadius | `12` |
| padding | `20` |

## Header（Frame 99）

`1100 × 27`，flex-row，justify-between

| 元素 | 說明 |
|---|---|
| Texts（md） | 標題文字，`Color/Neutral/800`，20px SemiBold |
| icons/up 或 icons/down | 24×24，**展開（內容顯示）用 down、收起（內容隱藏）用 up** |

## Content 區

高度依內容，`@y:63`（header 27 + gap 16）

## 收折行為

- header click → 切換箭頭方向：
  - 內容**展開**（顯示）→ `icons/down`（箭頭朝下）
  - 內容**收起**（隱藏）→ `icons/up`（箭頭朝上）
- content 區 `overflow: hidden; height: 0` ↔ 自然高度

> **箭頭方向來源**（Figma Component Set `Accordion` `418:3834`，2026-05-21 以 `figma-go` 讀取）：
> - `type=accordion none collapsed`（`418:3835`，只有 header、無 content）= 收起態 → `icons/up`
> - `type=accordion collapsed`（`957:16417`，含 `flexible content`）= 展開態 → `icons/down`
> - `type=extend N`（含 content）= 展開態 → `icons/down`
> - ⚠️ Figma variant 命名與實際狀態相反（「none collapsed」其實是收起、「collapsed」其實是展開），以**是否含 content child** 判定狀態，勿被名稱誤導。

---

## Variants（Component Set `418:3834`，2026-05-27 重讀，15 個 variant）

| # | variant 名 | id | w × h | 用途 |
|---|---|---|---|---|
| 0 | `type=calendar collapse table 2` | `418:3833` | 375 × 490 | mobile/窄欄 calendar 收折態 |
| 1 | `type=calendar collapse table 1` | `557:9040` | 375 × 490 | 同上 table 1 變體 |
| 2-7 | `type=extend 1..6` | `557:9851`-`557:11454` | 375 × 490/553 | mobile 展開態（不同 row 數） |
| 8 | `type=table content 1` | `552:7932` | **1026 × 619** | desktop 含 inline calendar 351 + 右側 611（[A] 空房查詢 mode）|
| 9 | **`type=table content 1 none calendar`** | `1773:45971` | **1622 × 619** | desktop **無 inline calendar**；右側面板擴為 1582 滿版（[A] 庫存表 mode）|
| 10 | `type=table 2` | `557:8398` | **1019 × 514** | desktop 含 inline calendar 351 + 右側 1582 |
| 11 | **`type=table 2 none calendar`** | `1773:46324` | **1622 × 502** | desktop **無 inline calendar**；右側面板擴為 1582 滿版 |
| 12 | `type=table 2 + modal` | `1405:48344` | 1019 × 514 | table 2 帶 date detail modal（session 65）|
| 13 | `type=accordion none collapsed` | `418:3835` | 1622 × 67 | 收起態（純 header）|
| 14 | `type=accordion slot collapsed` | `957:16417` | 1622 × 483 | 展開態（含 `flexible content` slot）|

### `none calendar` variants（**↺ 0527 新增**）

`type=table content 1 none calendar`（`1773:45971`）與 `type=table 2 none calendar`（`1773:46324`）差別只在「移除左側 inline Calendar 351×431」：

| 對照項 | 有 calendar | none calendar |
|---|---|---|
| 外層 w | 1026 / 1019 | **1622**（補回左側 calendar 寬 + gap）|
| Frame 224 / 226 children | Calendar 351 @ x:0 + 右側面板 @ x:375 | 只有右側面板 @ x:0，**寬撐到 1582** |
| 右側面板 id | Frame 223 / Frame 225 | 同名 Frame 223 / Frame 225 |

**用途**：[A] 空房與庫存查詢在「庫存表」mode 顯示此 variant —— 對應 [pages/room-booking.md](../specs/pages/room-booking.md) 0527 段所述「庫存表 mode 左側 calendar 不顯示」。

> 庫存表 mode 月曆改由 toolbar `Button 月曆` 觸發 → 開啟 [components/offcanvas.md](offcanvas.md)。inline calendar 在 Figma 標稿中是被整塊移除（不留空欄）。
