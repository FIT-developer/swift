# Component Specification: `Statistics`

**Figma Node ID**: `270:11721`（FRAME）  
**Type**: FRAME（非 component，section 層級容器）  
**最後同步**: 2026-04-13（依 Landing page - 0116）

---

## 概述

`Statistics` 是「統計圖表」區塊，由 `Title` + `Statistics details` 組成。  
`Statistics details` 內以 2×2 格局排列 4 個圖表 instance（bar、line、diverging、doughnut）。

---

## 容器尺寸與樣式

| 屬性 | 值 | Token |
|---|---|---|
| 寬度 | `1154px` | — |
| 高度 | `804px` | — |
| Padding | `12px` all sides | `Spacing/12` |
| Corner radius | `6px` | `Radius/6` |
| Background | 無（透明） | — |
| Border (stroke) | `Color/Neutral/200` | `Color/Neutral/200` |

---

## 結構

```
[FRAME] Statistics (1154×804px)
├── [INSTANCE] Title
│   ├── [INSTANCE] icons/operation-system (24×24)
│   └── [INSTANCE] Texts → [TEXT] "統計圖表"  20px  SemiBold 600  Color/Neutral/800
└── [FRAME] Statistics details (1130×741, x:12 y:51)
    ├── [INSTANCE] chartjs - bar       (525×293.5px, x:0   y:0)   ← 左上
    ├── [INSTANCE] chartjs - line      (525×304px,   x:605 y:0)   ← 右上
    ├── [INSTANCE] chartjs - diverging (525×334px,   x:0   y:324) ← 左下
    └── [INSTANCE] chartjs - doughnut  (367×417px,   x:763 y:324) ← 右下
```

---

## Title 列

| 屬性 | 值 | Token |
|---|---|---|
| Icon | `icons/operation-system` (24×24) | — |
| 文字 | `"統計圖表"` | — |
| Font | Noto Sans **SemiBold 600** | — |
| Font size | `20px`（md） | — |
| Color | `Color/Neutral/800` | `Color/Neutral/800` |

---

## Statistics details 格局

| 欄 | 列 | 圖表 | 尺寸 | 位置 |
|---|---|---|---|---|
| 左 | 上 | chartjs - bar | 525×293.5px | x:0, y:0 |
| 右 | 上 | chartjs - line | 525×304px | x:605, y:0 |
| 左 | 下 | chartjs - diverging | 525×334px | x:0, y:324 |
| 右 | 下 | chartjs - doughnut | 367×417px | x:763, y:324 |

> 左右欄間距約 80px（x:605 - 寬525 = 80px），列間距約 20–30px。

---

## 圖表一：chartjs - bar（今日可住房況）

**Node ID**: `270:11724`（INSTANCE）  
**外層容器**：padding 0, 左右各 4px  
**內層 Frame 32**：cornerRadius 6, fills `Color/Neutral/0`, padding 12, stroke `Color/Neutral/200`

### 結構
```
chartjs - bar
└── Frame 32 (白底卡片)
    ├── Y 軸標籤（Frame 29）：0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20  [sm Color/Neutral/800]
    ├── Frame 31（圖表主體）
    │   ├── Frame 27（圖例列）
    │   │   ├── Rectangle 3 — 藍色色塊 Color/Chart/blue（圖例色樣）
    │   │   └── Texts sm — "2026-01-31 今日可住房況"  [Color/Neutral/800]
    │   └── Group 4（圖表區域）
    │       ├── 橫向 grid lines × 11（stroke Color/Neutral/300）
    │       ├── 縱向 grid lines × 6（stroke Color/Neutral/300）
    │       └── 長條 × 5（fills Color/Chart/blue）
    └── Frame 30（X 軸標籤）
        └── sm texts：威尼斯雙人, 夏慕尼四人, 義大利三人, 保留房二人, 保留房四人
```

### 資料

| X 軸（房型） | 長條高度（相對比例） |
|---|---|
| 威尼斯雙人 | 127.79px |
| 夏慕尼四人 | 202.33px（最高） |
| 義大利三人 | 31.95px |
| 保留房二人 | 52.18px |
| 保留房四人 | 21.3px |

### 顏色

| 元素 | 色值 | Token |
|---|---|---|
| 長條 fill | `Color/Chart/blue` | `Color/Chart/blue` |
| 圖例色塊 | `Color/Chart/blue` | `Color/Chart/blue` |
| Grid lines | `Color/Neutral/300` | `Color/Neutral/300` |
| 文字 | `Color/Neutral/800` | `Color/Neutral/800` |

---

## 圖表二：chartjs - line（一週訂房統計）

**Node ID**: `270:11725`（INSTANCE）  
**容器**：cornerRadius 8, fills `Color/Neutral/0`, padding 12, stroke `Color/Neutral/200`

### 結構
```
chartjs - line
├── Frame 26（Y 軸區域）
│   ├── "訂單數" 軸標籤  [sm Color/Neutral/800，y:141]
│   └── Frame 25（Y 值）：0, 10, 20, 30, 40, 50, 60, 70, 80, 90  [sm Color/Neutral/800]
└── Frame 22（圖表主體）
    ├── Frame 27（圖例列）
    │   ├── Rectangle 3 — 白底粉框 Color/Accent/Celebration
    │   └── "一週訂房統計"  [sm Color/Neutral/800]
    ├── Group 3（圖表區域）
    │   ├── 橫向 grid lines × 11（stroke Color/Neutral/300）
    │   ├── 縱向 grid lines × 7（stroke Color/Neutral/300）
    │   ├── Vector 1 — 折線  [stroke Color/Chart/purpleRed]
    │   └── Ellipse 1–7 — 資料點（fills Color/Neutral/0, strokes Color/Chart/purpleRed）
    ├── Frame 21（X 軸日期）：12/31, 1/1, 1/2, 1/3, 1/4, 1/5, 1/6
    └── "日期" 軸標籤  [sm Color/Neutral/800，置中]
```

### 顏色

| 元素 | 色值 | Token |
|---|---|---|
| 折線 stroke | `Color/Chart/purpleRed` | `Color/Chart/purpleRed` |
| 資料點 stroke | `Color/Chart/purpleRed` | `Color/Chart/purpleRed` |
| 圖例框 stroke | `Color/Accent/Celebration` | `Color/Bootstrap/aside/Notification` |
| Grid lines | `Color/Neutral/300` | `Color/Neutral/300` |
| 文字 | `Color/Neutral/800` | `Color/Neutral/800` |

> 注意：圖例框色 `Color/Accent/Celebration`（Notification）與折線色 `Color/Chart/purpleRed`（Chart/purpleRed）為同系色但不同值，各有獨立 token，實作時應分別引用。

---

## 圖表三：chartjs - diverging（今日超賣管理）

**Node ID**: `270:11726`（INSTANCE）  
**容器**：cornerRadius 6, fills `Color/Neutral/0`, padding 12, stroke `Color/Neutral/200`

### 結構
```
chartjs - diverging
├── Frame 31（Y 軸房型標籤）
│   └── sm texts：威尼斯雙人, 夏慕尼四人, 義大利三人, 保留房二人, 保留房四人
└── Frame 40（圖表主體）
    ├── Frame 38（圖表區域）
    │   ├── "2026-01-31 今日超賣管理"  [sm Color/Neutral/800，置中]
    │   └── Group 5（長條群組）
    │       ├── Grid lines（stroke Color/Neutral/300）
    │       ├── 灰色長條 × 5（fills Color/Neutral/400）← 當日庫存
    │       ├── 紅色長條（fills Color/Surface/Negative）← 已超賣
    │       └── 綠色長條 × 3（fills Color/Surface/Positive）← 已賣出
    ├── Frame 33（X 軸刻度）：15, 10, 5, 0, -5, -10（對稱軸）
    └── Frame 37（圖例 + 軸標籤）
        ├── "房間數量"  [sm Color/Neutral/400，軸標籤]
        └── 圖例：
            ├── 已超賣 Color/Surface/Negative + 文字 Color/Neutral/400
            ├── 已賣出 Color/Surface/Positive + 文字 Color/Neutral/400
            └── 當日庫存 Color/Neutral/500 + 文字 Color/Neutral/400
```

### 顏色

| 元素 | 色值 | Token |
|---|---|---|
| 已超賣（紅） | `Color/Surface/Negative` | `Color/Surface/Negative` |
| 已賣出（綠） | `Color/Surface/Positive` | `Color/Surface/Positive` |
| 當日庫存（灰） | `Color/Neutral/400` / `Color/Neutral/500` | `Color/Neutral/400` / `Color/Neutral/500` |
| Grid lines | `Color/Neutral/300` | `Color/Neutral/300` |
| 軸標籤 | `Color/Neutral/400` | `Color/Neutral/400` |
| 標題文字 | `Color/Neutral/800` | `Color/Neutral/800` |

> ⚠️ 長條填色 `Color/Neutral/400`（Neutral/400），圖例色塊 `Color/Neutral/500`（Neutral/500）不一致，疑為設計細節偏差。

---

## 圖表四：chartjs - doughnut（今日訂單來源分佈）

**Node ID**: `270:11727`（INSTANCE）  
**容器**：cornerRadius 6, 無背景色, padding 12, stroke `Color/Neutral/200`

### 結構
```
chartjs - doughnut
├── Frame 43（標題 + 圖例）
│   ├── "今日訂單來源分佈"  [sm Color/Neutral/800，置中]
│   └── Frame 37（圖例列）
│       ├── OTA    Color/Radio/Default 色塊 + 文字 Color/Neutral/400
│       ├── 官網   Color/Surface/Positive 色塊 + 文字 Color/Neutral/400
│       └── 電話/現場 Color/Neutral/500 色塊 + 文字 Color/Neutral/400
└── Mask group（甜甜圈圖）
    ├── Ellipse 12 — 中心圓孔（visual-only center hole; not used as HTML color token）
    └── Group 6（扇形切片）
        ├── Ellipse 9  — fills Color/Neutral/300（灰，推測對應電話/現場）
        ├── Ellipse 10 — fills Color/Radio/Default（藍，OTA）
        └── Ellipse 11 — fills Color/Accent/Green（綠，推測對應官網）
```

### 顏色

| 元素 | 圖例色 | 扇形色 | Token |
|---|---|---|---|
| OTA | `Color/Radio/Default` | `Color/Radio/Default` | `Color/Radio/Default` |
| 官網 | `Color/Surface/Positive` | `Color/Accent/Green` | 圖例 `Color/Surface/Positive` / 扇形 `Color/Chart/green` |
| 電話/現場 | `Color/Neutral/500` | `Color/Neutral/300` | 圖例 `Color/Neutral/500` / 扇形 `Color/Neutral/300` |
| 中心圓孔 | — | visual-only center hole | 不作為 HTML 色彩 token |

---

## 顏色對照備注

| 說明 | 位置 | 狀態 |
|---|---|---|
| `Color/Chart/blue` → `Color/Chart/blue`（圖表語意獨立） | chartjs - bar | ✅ 2026-04-13 確認 |
| `Color/Chart/purpleRed` → `Color/Chart/purpleRed` | chartjs - line | ✅ 2026-04-13 確認 |
| 圖例框 `Color/Accent/Celebration` vs 折線 `Color/Chart/purpleRed` — 兩個不同 token | chartjs - line | ✅ 各有獨立 token，分開引用 |
| doughnut 官網扇形用 `Color/Chart/green`，圖例用 `Color/Surface/Positive` | chartjs - doughnut | ✅ 2026-04-13 確認 |
| Doughnut 中心圓孔為 visual-only，不作為 HTML 色彩 token | chartjs - doughnut | ✅ 2026-04-13 確認 |

---

## 未定義狀態

| 項目 | 狀態 |
|---|---|
| 各圖表的 hover / tooltip | Figma 未定義 |
| 動態資料渲染方式（Chart.js 設定） | 本 spec 僅記錄視覺規格 |
| 行動版（mobile）佈局 | Figma 未定義 |
| 2×2 grid 的 gap 精確值 | 觀測約 80px 水平、20px 垂直，待確認 |

---

*Generated from Figma display page · Updated 2026-04-13（Landing page - 0116）*
