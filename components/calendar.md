# Calendar（完整月曆）

> 用於 [A] 空房與庫存查詢左側。與 Calendar simple（單行）不同。

---

## 外框

`351 × 431`，fill `#ffffff`，stroke `#d1d1d1`，r:12，pad 12

---

## Frame 120（控制列）

`327 × 36`，@ y:12

| 元素 | 尺寸 | 說明 |
|---|---|---|
| Frame 94（日期顯示） | 176 × 22 | 顯示「已選 0 天」等文字，多個 Texts 組合 |
| Input（今日） | 56 × 34 | bg `#ffffff`，stroke `#d1d1d1`，r:6，Texts 顯示「今日」/「12」 |
| Input（月份快跳） | 79 × 36 | bg `#e1e1e0`，stroke `#d1d1d1`，r:6，帶 icons/down |

---

## Frame 93（月份標題列）

`327 × 40`，@ y:60

| 元素 | 尺寸 | 說明 |
|---|---|---|
| Frame 91（上個月） | 40 × 40 | stroke `#b0b0b0`，r:4，內含 icons/arrow-left（24×24） |
| Texts（月份） | 125 × 27 | 「2026 年 01 月」，md，`#454545` |
| Frame 92（下個月） | 40 × 40 | stroke `#b0b0b0`，r:4，內含 icons/arrow-right（24×24） |

---

## Calendar content（月曆格）

`327 × 307`，@ y:112，7 × 5 ～ 6 rows grid

### Calendar components（單格）

`42 × 55`，r:12；每格有兩個 Texts：
- 上：星期縮寫（16px，`#454545`），`26 × 16`
- 下：日期數字（md/27px，`#454545`），`26 × 27`

### 格狀態

| 狀態 | fill | stroke |
|---|---|---|
| 預設 | — | `#d1d1d1` |
| 選中範圍 | `#e1e1e0` | `#e1e1e0` |
| 跨月（淡） | — | `#e1e1e0` |
| 特殊日（如假日） | `#ffc0cb` | — |

### Grid 排列

- 7 欄（Mon～Sun），橫向間距 5px（42×7 + 5×6 = 324 ≈ 327）
- 6 列，縱向間距 8px（55×5 + 8×4 ≈ 307）

---

## 實作注意

- 寬度 351px **不因 aside 展開/收折改變**
- 月曆 grid 使用 CSS grid 7 欄，格寬固定 42px
