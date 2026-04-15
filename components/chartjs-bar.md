# Component Specification: `chartjs - bar`

**Figma Node ID**: `114:2834`（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13

---

## 概述

`chartjs - bar` 是長條圖元件，顯示當日各房型可住房況（今日可住房況）。  
共 **5 個 variants**（屬性 `state`）：Default / md / hover / sm / sm hover。

---

## Variants

| Variant 名稱 | Node ID | 尺寸 | 說明 |
|---|---|---|---|
| `state=Default` | `114:2833` | 525×293.5px | 標準尺寸 |
| `state=md` | `118:4454` | 525×438px | 中型（高度延伸） |
| `state=hover` | `114:2835` | 525×293.5px | 標準尺寸＋hover tooltip |
| `state=sm` | `114:3157` | 342×265px | 小尺寸 |
| `state=sm hover` | `114:3560` | 342×265px | 小尺寸＋hover tooltip |

---

## 共用外框（Frame 32）

| 屬性 | 值 | Token |
|---|---|---|
| Background | `#ffffff` | `Color/Neutral/0` |
| Border | `#d1d1d1` | `Color/Neutral/200` |
| Corner radius | `6px` | `Radius/6` |

> Default / hover：Frame 32 為 517×280（内縮 4px，component 寬 525）。  
> sm：Frame 32 填滿整個 component（342×265）。

---

## 結構（state=Default 525×293.5）

```
[COMPONENT] state=Default (525×293.5)
└── Frame 32 — 卡片容器 (517×280, x:4)
    ├── Frame 29 — Y軸數值 (14×216, x:61, y:32)
    │   └── Texts×11: 20/18/16/14/12/10/8/6/4/2/0  (gap: 20px)
    └── Frame 31 — 圖表主體 (377×256, x:79, y:12)
        ├── Frame 27 — 圖例 (198×16, x:89.5, y:0)
        │   ├── Rectangle 3 — 色塊 (52×16, fill:#86b7fe, stroke:#86b7fe)
        │   └── Texts '2026-01-31 今日可住房況' (138×16, x:60)
        ├── Group 4 — 格線 + 長條 (377×208, x:0, y:24)
        │   ├── Lines×11 — 水平格線 (stroke:#b0b0b0)
        │   ├── Lines×6  — 垂直格線 (stroke:#b0b0b0)
        │   └── Rectangles×5 — 長條（各 39px 寬，fill:#86b7fe）
        └── Frame 30 — X軸房型標籤 (377×16, x:0, y:240)
            └── Texts×5: 威尼斯雙人/夏慕尼四人/義大利三人/保留房二人/保留房四人
```

---

## Y 軸

| 元素 | 規格 |
|---|---|
| 數值刻度（Default） | `20` `18` `16` `14` `12` `10` `8` `6` `4` `2` `0`，間距 20px |
| 數值刻度（sm） | `20` `16` `12` `10` `6` `4` `0`（精簡，非等距） |
| 字型 | 12px Regular，`#454545` |
| 軸標題 | 無（bar 圖沒有 Y 軸標題，與 line 圖不同） |

---

## X 軸

| 房型名稱 | 欄位位置 |
|---|---|
| `威尼斯雙人` | x:0 |
| `夏慕尼四人` | x:79.25 |
| `義大利三人` | x:158.5 |
| `保留房二人` | x:237.75 |
| `保留房四人` | x:317 |

- 每個標籤 60×16px，12px Regular，`#454545`

---

## 長條資料（Default 示例）

| 房型 | 寬 | 高（示例） | x | fill |
|---|---|---|---|---|
| 威尼斯雙人 | 39px | 120px | x:17 | `#86b7fe` |
| 夏慕尼四人 | 39px | 190px | x:93 | `#86b7fe` |
| 義大利三人 | 39px | 30px | x:169 | `#86b7fe` |
| 保留房二人 | 39px | 49px | x:244 | `#86b7fe` |
| 保留房四人 | 39px | 20px | x:319 | `#86b7fe` |

---

## 圖例

| 元素 | 值 |
|---|---|
| 色塊 Rectangle 3 | 52×16px，fill `#86b7fe`，stroke `#86b7fe`（實心藍色塊） |
| 圖例文字 | `'2026-01-31 今日可住房況'`，12px Regular，`#454545` |

> 與折線圖（`#f44df4` 空心框）不同：bar 圖圖例為實心藍色塊。

---

## Hover 狀態（state=hover / state=sm hover）

### Tooltip（Tooltips instance）

| 屬性 | 值 | Token |
|---|---|---|
| 尺寸 | `93×38px` | — |
| 背景 | `#4f4f4f` | `Color/Neutral/700` |
| Corner radius | `6px` | `Radius/6` |
| 文字色 | `#e1e1e0` | `Color/Neutral/100` |
| 第一行 | `'1/4'` 12px | — |
| 第二行 | `'訂房數據: 56'` 12px | — |
| 箭頭方向 | Polygon 1 在右側（x:99.89），向右（→）指向資料點 | — |
| 位置 | x:236, y:182 | — |

### Cursor

- `icons/cursor`（24×24），x:252, y:195.31

---

## sm 尺寸差異（342×265）

| 項目 | Default | sm |
|---|---|---|
| 整體尺寸 | 525×293.5px | 342×265px |
| Frame 32 | 517×280（内縮） | 342×265（全寬） |
| 圖表主體 Frame 31 | 377×256px | 300×241px |
| 長條寬度 | 39px | 31.03px |
| Y 軸刻度 | 11 個（每 2 單位） | 7 個（精簡） |

---

## 顏色對照

| 元素 | 色值 | Token |
|---|---|---|
| 卡片背景 | `#ffffff` | `Color/Neutral/0` |
| 卡片邊框 | `#d1d1d1` | `Color/Neutral/200` |
| 文字（全部） | `#454545` | `Color/Neutral/800` |
| 格線 | `#b0b0b0` | `Color/Neutral/300` |
| 長條 fill | `#86b7fe` | `Color/Chart/blue` |
| 圖例色塊 | `#86b7fe` | `Color/Chart/blue` |
| Tooltip 背景 | `#4f4f4f` | `Color/Neutral/700` |
| Tooltip 文字 | `#e1e1e0` | `Color/Neutral/100` |

---

## 使用情境

| 元件 | 位置 |
|---|---|
| Mobile statistics section | 行動版統計頁，第一個圖表（最上方） |
| Desktop statistics section | 桌機版統計區域 |

---

*Generated from Figma component set · Updated 2026-04-13*
