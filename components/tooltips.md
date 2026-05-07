# Component Specification: `Tooltips`

**Figma Node ID**: `71:396`（COMPONENT_SET）  
**Type**: COMPONENT_SET  
**最後同步**: 2026-04-15

---

## 概述

`Tooltips` 提供 UI 提示泡泡，共 **11 個 variants**（屬性 `state`）。  
分為三種外觀：**深色 sm**（一般 UI）、**黃色 md**（設計稿標注專用，不渲染到 HTML）、**圖表專用**（雙行資料）。  
箭頭方向（上/下/左/右）決定 tooltip 出現的相對位置。

> **⚠️ 重要分類：**
> - **實作用**（會出現在 HTML）：深色 sm 系列（Default / down / right / left / state6）+ 圖表系列（chartjs line / chartjs bar）
> - **設計標注用**（只存在設計稿，**不實作到 HTML**）：黃色 md 系列（md up / md right / md left / md down）

---

## Variants 總覽

### 深色（Dark）sm — bg `Color/Neutral/700`，文字 `Color/Neutral/100`，12px

| Variant 名稱 | Node ID | 箭頭方向 | 箭頭位置 |
|---|---|---|---|
| `state=Default` | `71:395` | 向上（↑） | 上方中央，y:-6 |
| `state=down` | `194:2183` | 向下（↓） | 下方中央，y:27.25 |
| `state=right` | `194:2187` | 向右（→） | 右側，x:72.89 |
| `state=left` | `194:2195` | 向左（←） | 左側，x:-7.36 |
| `state=state6` | `194:2191` | 向下（↓） | 下方中央（同 down） |

### 黃色（Yellow）md — bg `Color/Surface/Secondary`，文字 `Color/Neutral/800`，20px，stroke `Color/Icon/Default` ⚠️ 設計稿標注專用，不渲染到 HTML

| Variant 名稱 | Node ID | 箭頭方向 |
|---|---|---|
| `state=md up` | `194:4360` | 向上（↑） |
| `state=md right` | `194:4365` | 向右（→） |
| `state=md left` | `194:4371` | 向左（←） |
| `state=md down` | `194:4376` | 向下（↓） |

### 圖表專用（Chart）— bg `Color/Neutral/700`，雙行文字，12px

| Variant 名稱 | Node ID | 箭頭方向 | 用途 |
|---|---|---|---|
| `state=chartjs line` | `112:2688` | 向上（↑） | 折線圖資料點 hover |
| `state=chartjs bar` | `114:2804` | 向右（→） | 長條圖 hover |

---

## 深色 sm Tooltips

```
[COMPONENT] Tooltips — Default/down/right/left (66×20px)
├── Texts sm → text  12px  Regular  Color/Neutral/100
└── Polygon 1 (9.53×8.25px)  fills Color/Neutral/700  ← 箭頭
```

| 屬性 | 值 | Token |
|---|---|---|
| 背景 | `Color/Neutral/700` | `Color/Neutral/700` |
| Corner radius | `6px` | `Radius/6` |
| Padding | top/bottom `2px`、left/right `12px` | — |
| 文字色 | `Color/Neutral/100` | `Color/Neutral/100` |
| 文字字號 | `12px`（sm Regular） | — |
| 箭頭尺寸 | 9.53×8.25px | — |
| 箭頭填色 | `Color/Neutral/700` | `Color/Neutral/700` |

---

## 黃色 md Tooltips（設計稿標注專用，不實作到 HTML）

```
[COMPONENT] Tooltips — md up/right/left/down (96×31px)
├── Texts md → text  20px  Regular  Color/Neutral/800
└── Polygon 1 (17×14px)  fills Color/Surface/Secondary  ← 箭頭
```

| 屬性 | 值 | Token |
|---|---|---|
| 背景 | `Color/Surface/Secondary` | `Color/Surface/Secondary` |
| Corner radius | `6px` | `Radius/6` |
| Padding | top/bottom `2px`、left/right `12px` | — |
| Border | stroke `Color/Icon/Default` | — |
| 文字色 | `Color/Neutral/800` | `Color/Neutral/800` |
| 文字字號 | `20px`（md Regular） | — |
| 箭頭尺寸 | 17×14px（較大） | — |
| 箭頭填色 | `Color/Surface/Secondary` | `Color/Surface/Secondary` |

---

## 圖表 Tooltips（雙行）

```
[COMPONENT] Tooltips — chartjs line/bar (93×38px)
├── Frame 28
│   ├── Texts sm → "1/4"          12px  Regular  Color/Neutral/100  (第一行：日期/索引)
│   └── Texts sm → "訂房數據: 56"  12px  Regular  Color/Neutral/100  (第二行：標籤 + 數值)
└── Polygon 1 (9.53×8.25px)  fills Color/Neutral/700
```

| 屬性 | 值 | Token |
|---|---|---|
| 背景 | `Color/Neutral/700` | `Color/Neutral/700` |
| Corner radius | `6px` | `Radius/6` |
| Padding | top/bottom `2px`、left/right `12px` | — |
| 第一行 | 日期或序號（`"1/4"`） | — |
| 第二行 | 標籤 + 值（`"訂房數據: 56"`） | — |
| `chartjs line` 箭頭 | 向上，對應資料點上方顯示 | — |
| `chartjs bar` 箭頭 | 向右，對應長條右側顯示 | — |

---

## 箭頭方向與位置對照

| 方向 | Polygon 座標特徵 | tooltip 出現位置 |
|---|---|---|
| 向上（↑） | y 為負值（在 tooltip 上方） | Tooltip 在目標**下方** |
| 向下（↓） | y > tooltip 高度（在下方） | Tooltip 在目標**上方** |
| 向右（→） | x > tooltip 寬度（在右側） | Tooltip 在目標**左側** |
| 向左（←） | x 為負值（在左側） | Tooltip 在目標**右側** |

---

## 使用情境

| 元件 | Tooltip variant | 說明 |
|---|---|---|
| Account — logout icon | `state=Default`（深色 sm，↑） | 滑鼠移到登出 icon 時顯示 "登出" |
| chartjs - line 資料點 | `state=chartjs line`（↑） | 顯示日期 + 數值 |
| chartjs - bar 長條 | `state=chartjs bar`（→） | 顯示日期 + 數值 |
| 其他 UI icon | 深色 sm 系列 | 依方向選擇 |
| 資料標注（設計稿） | 黃色 md 系列 | **設計稿標注專用，不出現在 HTML** |

---

## 實作注意事項

1. **定位**：`position: absolute`，依箭頭方向決定 `top/bottom/left/right`
2. **箭頭**：CSS `::before` 或 `::after` 偽元素，三角形 border trick
3. **顯示時機**：`hover` / `focus` 觸發，fade-in 動畫
4. **z-index**：高於一般內容（`z-50`）
5. **`state=state6`**：命名不規範，功能同 `state=down`，實作統一使用 down variant

---

*Generated from Figma component set · Updated 2026-04-13*
