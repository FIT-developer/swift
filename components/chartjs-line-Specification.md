# Component Specification: `chartjs - line`

**Figma Node ID**: `112:2607`（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13

---

## 概述

`chartjs - line` 是折線圖元件，用於顯示訂單數量的時序趨勢（一週訂房統計）。  
共 **5 個 variants**（屬性 `state`）：Default / md / hover / sm / sm hover。

---

## Variants

| Variant 名稱 | Node ID | 尺寸 | 說明 |
|---|---|---|---|
| `state=Default` | `112:2606` | 525×304px | 標準尺寸 |
| `state=md` | `118:4586` | 525×438px | 中型（同內容，高度延伸） |
| `state=hover` | `112:2608` | 525×304px | 標準尺寸＋hover tooltip |
| `state=sm` | `114:3221` | 342×181px | 小尺寸（Y軸標籤減半） |
| `state=sm hover` | `114:3430` | 342×181px | 小尺寸＋hover tooltip |

---

## 共用外框

| 屬性 | 值 | Token |
|---|---|---|
| Background | `#ffffff` | `Color/Neutral/0` |
| Border | `#d1d1d1` | `Color/Neutral/200` |
| Corner radius | `8px` | `Radius/8` |
| Padding | `12px` all sides | `Spacing/12` |

> ⚠️ `state=hover` 的 corner radius 為 `6px`（`Radius/6`）— 與其他 variant 不一致，疑為設計稿未統一。

---

## 結構（state=Default 525×304）

```
[COMPONENT] state=Default (525×304)
├── Frame 26 — Y軸區 (46×230, x:12, y:12)
│   ├── Texts '訂單數' — Y軸標題 (36×16, x:0, y:141)
│   └── Frame 25 — Y軸數值 (14×214, x:24, y:16)
│       └── Texts×10: 90 / 80 / 70 / 60 / 50 / 40 / 30 / 20 / 10 / 0  (gap: 22px)
└── Frame 22 — 圖表主體 (451×280, x:62, y:12)
    ├── Frame 27 — 圖例列 (132×16, x:159.5, y:0)
    │   ├── Rectangle 3 — 色塊 (52×16, fill:#ffffff, stroke:#f44df4)
    │   └── Texts '一週訂房統計' (72×16, x:60)
    ├── Group 3 — 格線 + 折線 (463×208, x:-6, y:24)
    │   ├── Lines×11 — 水平格線 (451px wide, stroke:#b0b0b0)
    │   ├── Lines×8  — 垂直格線 (stroke:#b0b0b0)
    │   ├── Vector 1 — 折線本體 (451.5×119.38, stroke:#ff0bd6)
    │   └── Ellipses×7 — 資料點 (12×12, fill:#ffffff, stroke:#ff0bd6)
    ├── Frame 21 — X軸日期 (450×16, x:0.5, y:240)
    │   └── Texts×7: 12/31 / 1/1 / 1/2 / 1/3 / 1/4 / 1/5 / 1/6
    └── Texts '日期' — X軸標題 (451×16, x:0, y:264, text-align:CENTER)
```

---

## Y 軸

| 元素 | 規格 |
|---|---|
| 標題 | `'訂單數'`，12px Regular，`#454545`，垂直置中（y:141） |
| 數值刻度（Default） | `90` `80` `70` `60` `50` `40` `30` `20` `10` `0`，間距 22px |
| 數值刻度（sm） | `90` `70` `50` `30` `10` `0`，間距 20px（每 20 單位一刻） |

---

## X 軸

| 元素 | 規格 |
|---|---|
| 日期標籤 | `12/31` `1/1` `1/2` `1/3` `1/4` `1/5` `1/6`，12px Regular，`#454545` |
| 軸標題 | `'日期'`，12px Regular，`#454545`，水平置中 |

---

## 圖表視覺

| 元素 | 色值 | Token |
|---|---|---|
| 折線 | `#ff0bd6` | `Color/Chart/purpleRed` |
| 資料點（圓） | fill `#ffffff`，stroke `#ff0bd6` | — |
| 水平格線 | `#b0b0b0` | `Color/Neutral/300` |
| 垂直格線 | `#b0b0b0` | `Color/Neutral/300` |
| 圖例色塊邊框 | `#f44df4` | `Color/Bootstrap/aside/Notification` |

> 圖例色塊（Rectangle 3）fill 為 `#ffffff`，border 為 `#f44df4`，呈現為「空白框線」樣式。  
> 注意：圖例 stroke `#f44df4` ≠ 折線顏色 `#ff0bd6`（兩者相近但不同值，各有獨立 token）。

---

## Hover 狀態（state=hover / state=sm hover）

在游標所在資料點（示例為 1/4）上疊加：

### Tooltip（Tooltips instance）

| 屬性 | 值 | Token |
|---|---|---|
| 尺寸 | `93×38px` | — |
| 背景 | `#4f4f4f` | `Color/Neutral/700` |
| 文字色 | `#e1e1e0` | `Color/Neutral/100` |
| 第一行 | `'1/4'`（日期）12px | — |
| 第二行 | `'訂房數據: 56'` 12px | — |
| 箭頭 | Polygon 1（9.53×8.25），fill `#4f4f4f`，y:-7（朝上） | — |
| 位置（Default hover） | x:256, y:127 | — |
| 位置（sm hover） | x:191, y:90 | — |

### Cursor

- `icons/cursor`（24×24），疊加於資料點上方

---

## sm 尺寸差異（342×181）

| 項目 | Default | sm |
|---|---|---|
| 整體尺寸 | 525×304px | 342×181px |
| Y軸區 Frame 26 | 46×230px | 46×132px |
| 圖表主體 Frame 22 | 451×280px | 268×157px |
| Y軸刻度數量 | 10（每10單位） | 6（每20單位） |
| 資料點圓形尺寸 | 12×12px | 6.95×5.77px |

---

## 顏色對照

| 元素 | 色值 | Token |
|---|---|---|
| 卡片背景 | `#ffffff` | `Color/Neutral/0` |
| 卡片邊框 | `#d1d1d1` | `Color/Neutral/200` |
| 文字（全部） | `#454545` | `Color/Neutral/800` |
| 格線 | `#b0b0b0` | `Color/Neutral/300` |
| 折線 | `#ff0bd6` | `Color/Chart/purpleRed` |
| 圖例框線 | `#f44df4` | `Color/Bootstrap/aside/Notification` |
| Tooltip 背景 | `#4f4f4f` | `Color/Neutral/700` |
| Tooltip 文字 | `#e1e1e0` | `Color/Neutral/100` |

---

## 使用情境

| 元件 | 位置 |
|---|---|
| Mobile statistics section | 行動版統計頁，第三個圖表 |
| Desktop statistics section | 桌機版統計區域 |

---

*Generated from Figma component set · Updated 2026-04-13*
