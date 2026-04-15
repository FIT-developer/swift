# Component Specification: `Card`

**Figma Node ID**: `154:6798`（Component Set）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-13（依 Landing page - 0116）

---

## 概述

`Card` 是 KPI 數據卡片元件，顯示一項業務指標的當前數值與昨日趨勢比較。  
共 4 個 variants，以 `type` 屬性區分。`trend up` 帶有可點擊的連結 chip，並有對應的 hover 狀態。

---

## 尺寸與樣式

| 屬性 | 值 | Token |
|---|---|---|
| 寬度 | `fill`（component 內部為 220px，實際隨容器） | — |
| 高度 | `~134.5px`（依內容） | — |
| Padding | top/bottom `12px`、left/right `24px` | `Spacing/12`、`Spacing/24` |
| Corner radius | `8px` | `Radius/8` |
| Background | 無（透明） | — |
| Border (stroke) | `#D1D1D1` | `Color/Neutral/200` |

---

## Variants 一覽

| Variant name | ID | 說明 |
|---|---|---|
| `type=tend up` | `154:6797` | 趨勢上升（預設）；帶連結 chip |
| `type=tend up hover` | `163:7749` | 趨勢上升（hover）；chip 變暗色，cursor 出現 |
| `type=trend down` | `154:6815` | 趨勢下降；無連結 chip |
| `type=over sold` | `154:6941` | 超賣警告；標籤橙色，warning icon |

> ⚠️ `tend up` 疑為 `trend up` 的拼字錯誤（缺 `r`）。Figma 端建議修正，不影響實作。  
> ⚠️ `tend up hover` 名稱前綴有不可見控制字元（`\b`），為 Figma 命名 artifact，可忽略。

---

## 內部結構（共用）

```
[COMPONENT] Card (~220×134.5px)
├── [FRAME] header row（Frame 44）        ← 僅 tend up / tend up hover 有
│   ├── [INSTANCE] Texts — label (md)
│   └── [INSTANCE] Input — link chip
│       ├── [INSTANCE] Texts — chip text (sm)
│       └── [INSTANCE] icons/attached-link 或 icons/attached-link-moved
├── [INSTANCE] Texts — label (md)         ← 僅 trend down / over sold 用（無 Frame 44）
├── [INSTANCE] Texts — value (lg)
└── [FRAME] trend row（Frame 42）
    ├── [FRAME] Frame 41 — icon + percentage
    │   ├── [INSTANCE] trend icon（24×24）
    │   └── [INSTANCE] Texts — percentage (base)
    └── [INSTANCE] Texts — "較昨日" (sm)
```

---

## 各 Variant 詳細規格

### `type=tend up`（趨勢上升，預設）

| 區域 | 元素 | 樣式 |
|---|---|---|
| 標籤 | `Texts` md 20px Regular | `#454545` `Color/Neutral/800` |
| 連結 chip | `Input` 白底灰框 | 見下方 Link Chip 規格 |
| 數值 | `Texts` lg 24px SemiBold | `#454545` `Color/Neutral/800` |
| 趨勢 icon | `icons/trend-up-red` | stroke `#E12129` `Color/Surface/Negative` |
| 趨勢值 | `Texts` base 16px Regular | `#E12129` `Color/Surface/Negative` |
| 比較基準 | `Texts` sm 12px Regular | `#454545` `Color/Neutral/800` |

---

### `type=tend up hover`（趨勢上升，Hover 狀態）

與 `tend up` 相同，差異如下：

| 變化區域 | Default | Hover |
|---|---|---|
| Link chip 背景 | `#FFFFFF` | `#454545` `Color/Neutral/800` |
| Link chip 文字色 | `#454545` | `#E1E1E0` `Color/Neutral/100` |
| Link chip icon | `icons/attached-link`（黑色） | `icons/attached-link-moved`（fill+stroke `#E1E1E0`） |
| cursor icon | 無 | `icons/cursor`（24×24）出現於 chip 右側 |

> `icons/cursor` 定位：x:174, y:40.32，疊加在 card 右上角，模擬游標懸停效果。

---

### `type=trend down`（趨勢下降）

| 區域 | 元素 | 樣式 |
|---|---|---|
| 標籤 | `Texts` md 20px Regular | `#454545` `Color/Neutral/800` |
| 連結 chip | **無** | — |
| 數值 | `Texts` lg 24px SemiBold | `#454545` `Color/Neutral/800` |
| 趨勢 icon | `icons/trend-down-green` | stroke `#2ACA18` `Color/Surface/Positive` |
| 趨勢值 | `Texts` base 16px Regular | `#2ACA18` `Color/Surface/Positive` |
| 比較基準 | `Texts` sm 12px Regular | `#454545` `Color/Neutral/800` |

---

### `type=over sold`（超賣警告）

| 區域 | 元素 | 樣式 |
|---|---|---|
| 標籤 | `Texts` md 20px Regular | **`#E05216`** `Color/Surface/Brand-600-Active` ← 警告橙 |
| 連結 chip | **無** | — |
| 數值 | `Texts` lg 24px SemiBold | `#454545` `Color/Neutral/800` |
| 趨勢 icon | `icons/warning-orange` | fill `#E05216` `Color/Surface/Brand-600-Active` |
| 趨勢值 | `Texts` base 16px Regular | `#E05216` `Color/Surface/Brand-600-Active` |
| 比較基準 | `Texts` sm 12px Regular | `#454545` `Color/Neutral/800` |

---

## Link Chip（Input instance）規格

僅出現於 `tend up` / `tend up hover`。

### Default

| 屬性 | 值 | Token |
|---|---|---|
| 背景 | `#FFFFFF` | `Color/Neutral/0` |
| 邊框 | `#D1D1D1` | `Color/Neutral/200` |
| Corner radius | `6px` | `Radius/6` |
| Padding | top/bottom `4px`、left/right `8px` | `Spacing/4`、`Spacing/8` |
| 高度 | `32px` | — |
| 文字 | sm 12px Regular `#454545` | `Color/Neutral/800` |
| Icon | `icons/attached-link`（24×24）stroke 黑色 | — |

### Hover

| 屬性 | 值 | Token |
|---|---|---|
| 背景 | `#454545` | `Color/Neutral/800` |
| 邊框 | `#D1D1D1` | `Color/Neutral/200` |
| 文字 | sm 12px Regular `#E1E1E0` | `Color/Neutral/100` |
| Icon | `icons/attached-link-moved`（24×24）fill+stroke `#E1E1E0` | — |

---

## 文字樣式

| 樣式 | 大小 | 字重 | 用途 |
|---|---|---|---|
| md | `20px` | Regular 400 | KPI 標籤（各 variant） |
| lg | `24px` | SemiBold 600 | KPI 數值 |
| base | `16px` | Regular 400 | 趨勢百分比 / 數量 |
| sm | `12px` | Regular 400 | 「較昨日」/ chip 文字 |

---

## 趨勢 Icon 對應

| Variant | Icon | 色值 | Token |
|---|---|---|---|
| tend up / tend up hover | `icons/trend-up-red` | stroke `#E12129` | `Color/Surface/Negative` |
| trend down | `icons/trend-down-green` | stroke `#2ACA18` | `Color/Surface/Positive` |
| over sold | `icons/warning-orange` | fill `#E05216` | `Color/Surface/Brand-600-Active` |

---

## 未定義狀態

| 項目 | 狀態 |
|---|---|
| `trend down` 的 hover 狀態 | Figma 未定義 |
| `over sold` 的 hover 狀態 | Figma 未定義 |
| 數值為空或載入中的佔位樣式 | Figma 未定義 |
| 行動版（mobile）佈局 | Figma 未定義 |
| Link chip 點擊後的導航目標 | Figma 未定義（互動未標示） |
| variant 名稱拼字 `tend` → `trend` | ⚠️ 建議 Figma 端修正 |

---

*Generated from Figma components page · Updated 2026-04-13*
