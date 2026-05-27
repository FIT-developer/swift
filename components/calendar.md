# Calendar（完整月曆）

> 用於 [A] 空房與庫存查詢左側。與 Calendar simple（單行）不同。

---

## 外框

`351 × 431`，fill `Color/Neutral/0`，stroke `Color/Neutral/200`，r:12，pad 12

> **RWD 補充（2026-04-30）**：實作改採 `width: 351px; max-width: 100%`，封頂 351，當外層容器（如 `[A]` accordion 在 375 viewport 下扣掉 `rootWrap p-3` + `accordion p-5` + `accordion-content p-3` = 88px 後僅餘 287px）放不下時等比縮，避免破版。

---

## Frame 120（控制列）

`327 × 36`，@ y:12

| 元素 | 尺寸 | 說明 |
|---|---|---|
| Frame 94（日期顯示） | 176 × 22 | 顯示「已選 0 天」等文字，多個 Texts 組合 |
| Input（今日） | 56 × 34 | bg `Color/Neutral/0`，stroke `Color/Neutral/200`，r:6，Texts 顯示「今日」/「12」 |
| Input（月份快跳） | 79 × 36 | bg `Color/Neutral/100`，stroke `Color/Neutral/200`，r:6，帶 icons/down |

---

## Frame 93（月份標題列）

`327 × 40`，@ y:60

| 元素 | 尺寸 | 說明 |
|---|---|---|
| Frame 91（上個月） | 40 × 40 | stroke `Color/Neutral/300`，r:4，內含 icons/arrow-left（24×24） |
| Texts（月份） | 125 × 27 | 「2026 年 01 月」，md，`Color/Neutral/800` |
| Frame 92（下個月） | 40 × 40 | stroke `Color/Neutral/300`，r:4，內含 icons/arrow-right（24×24） |

---

## Calendar content（月曆格）

`327 × 307`，@ y:112，7 × 5 ～ 6 rows grid

### Calendar components（單格）

`42 × 55`，r:12；每格有兩個 Texts：
- 上：星期縮寫（16px，`Color/Neutral/800`），`26 × 16`
- 下：日期數字（md/27px，`Color/Neutral/800`），`26 × 27`

### 格狀態（從 Calendar components 366:14657 直接讀取）

| variant | Figma 名稱 | fill | stroke | text |
|---|---|---|---|---|
| 預設 | `type=not focus` | `Color/Neutral/0` | `Color/Neutral/200` | `Color/Neutral/800` |
| 首末日（sel-start/end） | `type=focus` | `Color/Chart/blue` | `Color/Neutral/0` | `Color/Neutral/0` |
| 今日 | `type=today` | `Color/Accent/Pink` | none | `Color/Neutral/0` |
| 區間（sel-mid） | `type=selected` | `Color/Accent/Light-Green` | none | `Color/Neutral/800` |
| 過去/禁用 | `type=diasbled`（原文拼字） | `Color/Neutral/100` | `Color/Neutral/100` | `Color/Neutral/400` |
| 跨月 | `type=future` | none | `Color/Neutral/100` | `Color/Neutral/400` |

**優先順序**：點擊今日 → 藍色（`Color/Chart/blue`）取代粉色；區間包含今日 → 綠色取代粉色

### Grid 排列

- 7 欄（Mon～Sun），橫向間距 5px（42×7 + 5×6 = 324 ≈ 327）
- 6 列，縱向間距 8px（55×5 + 8×4 ≈ 307）

---

## 實作注意

- 寬度 **封頂 351px**（`max-width: 351px; width: 100%`）；不因 aside 展開/收折改變，但容器更窄時等比縮
- 月曆 grid 使用 CSS grid 7 欄，格寬 `minmax(0, 1fr)`（原設計 42px，能放下時實渲染仍為 42px；放不下時等比縮）
- 格高度 55px 固定（不隨寬度縮放）

### RWD 行為（2026-04-30）

- **≥900px viewport**：`[A]` 兩欄 row 排版（calendar 左、查詢右）；calendar 維持 351
- **<900px viewport**：`[A]` 切 column，calendar 在上、查詢在下；calendar `mx-auto` 水平置中，最大 351
- **375px viewport（最小邊界）**：calendar 縮到約 287px，cell 寬約 33px（仍可顯示 `MON 15` 等內容），高度仍 55px
- **不採全響應式**：原設計 cell / badge / 字級針對 42px 網格調過，封頂 351 + 向下等比縮可重用全部 typography 與 badge 規格，不需重調

---

## 0527 變更 — select disabled 狀態永久移除（**↺ 重大行為變更**）

Figma source：`COMPONENT_SET Calendar` (`379:15845`)，2026-05-27 重讀 7 個 variant。

### 7 個 variant 全列

| # | name | id | w × h |
|---|---|---|---|
| 0 | `state=month table 1` | `379:15844` | 351 × 431 |
| 1 | `state=month table 2` | `505:8001` | 351 × 431 |
| 2 | `state=month single day / today table 1` | `392:16962` | 351 × 431 |
| 3 | `state=month single day / today table 2` | `505:8255` | 351 × 431 |
| 4 | `state=month single day / today table 2 extend` | `505:8505` | 351 × 561 |
| 5 | `state=month single day table 1` | `386:16099` | 351 × 431 |
| 6 | `state=month multiple day table 1` | `386:16292` | 351 × 431 |

### day-count Input/Select（Frame 120 內、79 × 36 @ x:248）

7 個 variant 的 day-count select **全部為 enabled 態**（白底 `#ffffff` / border `#d1d1d1` / 文字 `#454545` / chevron 灰 `#6d6d6d` 或黑 `#000000`）。**沒有任何 variant 是 disabled 灰態**——0527 對位確認 disabled 狀態**永久移除**。

### Mode 行為差異（**實作時需區分**）

| Mode | day-count select | calendar 格 range 視覺 |
|---|---|---|
| 空房查詢 | **enabled**（0527 新；原本是 disabled）| **不顯示 range 區段**——選取的是「天數」概念，非「區間」 |
| 庫存表 | **enabled**（一直都是） | **顯示 range 區段**（同 `state=month multiple day`）——選取的是日期區間 |

關鍵差異重述：
- 兩 mode 的 select 元件**外觀完全一致**（都 enabled）。
- 區別在於 select 「數字」對 calendar 格的**作用方式**：
  - 空房查詢：「12」= 連續 12 天（純數量），格上**不**做 multi-day highlight；只有起始點亮 single-day。
  - 庫存表：「12」= 從起始日往後 12 天的區間，格上**要**做 multi-day highlight（首末日藍 chip、中間 light-green `type=selected`）。

### 對應 variant 選用

- 空房查詢 mode → 使用 `state=month single day` 系列（`386:16099` / `392:16962`）：起始格 single-day highlight，**不**綁定 range。
- 庫存表 mode → 使用 `state=month multiple day table 1` (`386:16292`)：完整 range（首末 + 中段）。

> 待實作時：select onChange 須依當前 mode 走不同 highlight 邏輯。空房查詢就不能走 multi-day class，否則會誤顯示成「區間」。

### 0527 使用者確認（2026-05-27）

| # | 問題 | 答案 |
|---|---|---|
| 1 | 空房查詢「天數」select 起始日如何決定？ | **後端決定**。preview 端只**顯示**，**不影響**月曆任何操作、**不影響**右邊表單。將來後端會用「選取日期 + 作用天數」查 DB 撈內容渲染右側 table |
| 2 | 「12 天」UI 上還會體現在哪？ | 同 #1，純顯示。下拉值即 UI 唯一呈現處 |

### 0527 preview 實作備忘

- select option 範圍：**1-31 天**（後端實際 1-365，preview 縮到 1-31 即可）
- 預設值依 mode 分流（兩 mode 視覺差異化）：
  - **空房查詢 mode：預設 `1`**
  - **庫存表 mode：預設 `12`**
- click → 改變 select.value，**不**綁任何 calendar 格 highlight、**不**綁右側 table 重渲染
- 純 `<select>` 元件，無 onChange handler（或 onChange 只是更新 state，不觸發其他事）
