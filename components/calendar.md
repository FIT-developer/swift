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
