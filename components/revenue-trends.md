# Component Specification: `Revenue trends`

**Figma Node ID**: `270:11728`（FRAME）  
**Type**: FRAME（非 component，section 層級容器）  
**最後同步**: 2026-04-13（依 Landing page - 0116）

---

## 概述

`Revenue trends` 是「營業趨勢」區塊，由 `Title` + `Trend details` 組成。  
`Trend details` 內橫排 4 個 `Card` component instance，各自顯示一項 KPI 數值與昨日趨勢比較。

> **注意**：此節點是 FRAME，不是 Component。`Card` 才是可重用的 component。

---

## 容器尺寸與樣式

| 屬性 | 值 | Token |
|---|---|---|
| 寬度 | `1154px` | — |
| 高度 | `200px` | — |
| Padding | `12px` all sides | `Spacing/12` |
| Corner radius | `6px` | `Radius/6` |
| Background | 無（透明） | — |
| Border (stroke) | `#D1D1D1` | `Color/Neutral/200` |

---

## 結構

```
[FRAME] Revenue trends (1154×200px)
├── [INSTANCE] Title
│   ├── [INSTANCE] icons/operation-system (24×24)
│   └── [INSTANCE] Texts → [TEXT] "營業資訊"  20px  SemiBold 600  #454545
└── [FRAME] Trend details (1130×137, x:12 y:51)
    ├── [INSTANCE] Card — 今日營收    (270.5×137px, x:0)
    ├── [INSTANCE] Card — 平均房價    (270.5×134.5px, x:286.5)
    ├── [INSTANCE] Card — 今日住房率  (270.5×134.5px, x:573)
    └── [INSTANCE] Card — 今日超賣   (270.5×132px, x:859.5)  ← Warning 狀態
```

---

## Title 列

| 屬性 | 值 | Token |
|---|---|---|
| Icon | `icons/operation-system` (24×24) | — |
| 文字 | `"營業資訊"` | — |
| Font | Noto Sans **SemiBold 600** | — |
| Font size | `20px`（md） | — |
| Color | `#454545` | `Color/Neutral/800` |

---

## Card Component（完整規格見 card-Specification.md）

> 參見 `components/card-Specification.md`。以下為本節點使用的 variant 對照。

### Card 容器樣式

| 屬性 | 值 | Token |
|---|---|---|
| 寬度 | `270.5px`（4 欄等分 1130px） | — |
| Padding | top/bottom `12px`、left/right `24px` | `Spacing/12`、`Spacing/24` |
| Corner radius | `8px` | `Radius/8` |
| Background | 無（透明） | — |
| Border | `#D1D1D1` | `Color/Neutral/200` |

### Card 內部結構

```
[INSTANCE] Card (270.5×~137px)
├── [FRAME] header row
│   ├── [INSTANCE] Texts — label (md 20px)
│   └── [INSTANCE] Input — link chip（僅部分 Card 有）
├── [INSTANCE] Texts — value (lg 24px SemiBold)
└── [FRAME] trend row
    ├── [FRAME] Frame 41 — icon + percentage
    │   ├── [INSTANCE] icons/trend-up 或 icons/trend-down 或 icons/warning
    │   └── [INSTANCE] Texts — percentage (base 16px)
    └── [INSTANCE] Texts — "較昨日" (sm 12px)
```

---

## 4 個 Card 詳細內容

### Card 1 — 今日營收

| 區域 | 內容 | 樣式 |
|---|---|---|
| 標籤 | `今日營收` | md 20px Regular `#454545` |
| 連結 chip | `日營收` + `icons/attached-link` | Input，白底灰框，sm 12px `#454545` |
| 數值 | `NT$ 350,000` | lg 24px SemiBold `#454545` |
| 趨勢 icon | `icons/trend-up-red` | stroke `#E12129` |
| 趨勢值 | `+16%` | base 16px `#E12129` |
| 比較基準 | `較昨日` | sm 12px `#454545` |

**連結 chip（Input variant 觀測值）**：

| 屬性 | 值 | Token |
|---|---|---|
| 填色 | `#FFFFFF` | `Color/Neutral/0` |
| 邊框 | `#D1D1D1` | `Color/Neutral/200` |
| Corner radius | `6px` | `Radius/6` |
| Padding | top/bottom `4px`、left/right `8px` | `Spacing/4`、`Spacing/8` |
| 文字 | `日營收`，sm 12px，`#454545` | — |
| Icon | `icons/attached-link`（24×24） | — |

> 此為 Input component 的「白底灰框連結」variant，與 System notifications 的彩色 chip 不同。

---

### Card 2 — 平均房價

| 區域 | 內容 | 樣式 |
|---|---|---|
| 標籤 | `平均房價` | md 20px Regular `#454545` |
| 連結 chip | 無 | — |
| 數值 | `NT$ 4,200` | lg 24px SemiBold `#454545` |
| 趨勢 icon | `icons/trend-down-green` | stroke `#2ACA18` |
| 趨勢值 | `+16%` | base 16px `#2ACA18` |
| 比較基準 | `較昨日` | sm 12px `#454545` |

---

### Card 3 — 今日住房率

| 區域 | 內容 | 樣式 |
|---|---|---|
| 標籤 | `今日住房率` | md 20px Regular `#454545` |
| 連結 chip | 無 | — |
| 數值 | `92%` | lg 24px SemiBold `#454545` |
| 趨勢 icon | `icons/trend-down-green` | stroke `#2ACA18` |
| 趨勢值 | `+16%` | base 16px `#2ACA18` |
| 比較基準 | `較昨日` | sm 12px `#454545` |

---

### Card 4 — 今日超賣（Warning 狀態）

> 此 Card 呈現**警告狀態**，標籤色、趨勢色、icon 均使用品牌橙色，與標準 Card 不同。

| 區域 | 內容 | 樣式 |
|---|---|---|
| 標籤 | `今日超賣` | md 20px Regular **`#E05216`** ← 警告色 |
| 連結 chip | 無 | — |
| 數值 | `NT$ -18,500` | lg 24px SemiBold `#454545` |
| 趨勢 icon | `icons/warning-orange` | fill `#E05216` |
| 趨勢值 | `5 間` | base 16px **`#E05216`** |
| 比較基準 | `較昨日` | sm 12px `#454545` |

---

## Card 變體（觀測）

| 變體 | 標籤色 | 趨勢 icon | 趨勢值色 | 連結 chip |
|---|---|---|---|---|
| 標準 - trend up（負向） | `#454545` | `icons/trend-up-red` | `#E12129` | 可選 |
| 標準 - trend down（正向） | `#454545` | `icons/trend-down-green` | `#2ACA18` | 無 |
| Warning（超賣/警告） | `#E05216` | `icons/warning-orange` | `#E05216` | 無 |

---

## 文字樣式一覽

| 樣式名稱 | 大小 | 字重 | 用途 |
|---|---|---|---|
| md | `20px` | Regular 400 | Card 標籤 |
| lg | `24px` | SemiBold 600 | KPI 數值 |
| base | `16px` | Regular 400 | 趨勢百分比 / 數量 |
| sm | `12px` | Regular 400 | 較昨日 / chip 文字 |

---

## Trend details 排版

| 屬性 | 值 |
|---|---|
| Layout | 水平排列（flex row） |
| 寬度 | `1130px`（容器 1154px - padding 24px） |
| Card 間距 | `~16px`（1130 - 270.5×4 ≈ 48px ÷ 3 = 16px，推測） |
| 對齊 | 頂端對齊 |

---

## 未定義狀態

| 項目 | 狀態 |
|---|---|
| Card component set 完整 variants | ✅ 見 `card-Specification.md` |
| Card 連結 chip 的點擊互動（導航目標） | Figma 未定義 |
| Hover 狀態 | Figma 未定義 |
| Trend details Card 間距（精確值） | 推測 16px，待確認 |
| 行動版（mobile）佈局 | Figma 未定義 |
| 數值為 0 或負數時的特殊樣式 | Figma 未定義（Card 4 有金額負值但非空值） |

---

*Generated from Figma display page · Updated 2026-04-13（Landing page - 0116）*
